# BAM Reader
# ==========

"""
    BAM.Reader(input::IO; index=nothing)

Create a data reader of the BAM file format.

# Arguments
* `input`: data source
* `index=nothing`: filepath to a random access index (currently *bai* is supported)
"""
mutable struct Reader{T} <: BioCore.IO.AbstractReader
    stream::BGZFStreams.BGZFStream{T}
    header::SAM.Header
    start_offset::BGZFStreams.VirtualOffset
    refseqnames::Vector{String}
    refseqlens::Vector{Int}
    index::Union{Nothing, BAI}
end

function Base.eltype(::Type{Reader{T}}) where T
    return Record
end

function BioCore.IO.stream(reader::Reader)
    return reader.stream
end

function Reader(input::IO; index=nothing)
    if isa(index, AbstractString)
        index = BAI(index)
    else
        if index != nothing
            error("unrecognizable index argument")
        end
    end
    reader = init_bam_reader(input)
    reader.index = index
    return reader
end

function Base.show(io::IO, reader::Reader)
    println(io, summary(reader), ":")
      print(io, "  number of contigs: ", length(reader.refseqnames))
end

"""
    header(reader::Reader; fillSQ::Bool=false)::SAM.Header

Get the header of `reader`.

If `fillSQ` is `true`, this function fills missing "SQ" metainfo in the header.
"""
function header(reader::Reader; fillSQ::Bool=false)::SAM.Header
    header = reader.header
    if fillSQ
        if !isempty(findall(reader.header, "SQ"))
            throw(ArgumentError("SAM header already has SQ records"))
        end
        header = copy(header)
        for (name, len) in zip(reader.refseqnames, reader.refseqlens)
            push!(header, SAM.MetaInfo("SQ", ["SN" => name, "LN" => len]))
        end
    end
    return header
end

function BioCore.header(reader::Reader)
    return header(reader)
end

function Base.seek(reader::Reader, voffset::BGZFStreams.VirtualOffset)
    seek(reader.stream, voffset)
end

function Base.seekstart(reader::Reader)
    seek(reader.stream, reader.start_offset)
end

function Base.iterate(reader::Reader, rec=Record())
    if eof(reader)
        return nothing
    end
    read!(reader, rec)
    return copy(rec), rec
end

# Initialize a BAM reader by reading the header section.
function init_bam_reader(input::BGZFStreams.BGZFStream)
    # magic bytes
    B = read(input, UInt8)
    A = read(input, UInt8)
    M = read(input, UInt8)
    x = read(input, UInt8)
    if B != UInt8('B') || A != UInt8('A') || M != UInt8('M') || x != 0x01
        error("input was not a valid BAM file")
    end

    # SAM header
    textlen = read(input, Int32)
    samreader = SAM.Reader(IOBuffer(read(input, textlen)))

    # reference sequences
    refseqnames = String[]
    refseqlens = Int[]
    n_refs = read(input, Int32)
    for _ in 1:n_refs
        namelen = read(input, Int32)
        data = read(input, namelen)
        seqname = unsafe_string(pointer(data))
        seqlen = read(input, Int32)
        push!(refseqnames, seqname)
        push!(refseqlens, seqlen)
    end

    voffset = isa(input.io, Base.AbstractPipe) ?
        BGZFStreams.VirtualOffset(0, 0) :
        BGZFStreams.virtualoffset(input)
    return Reader(
        input,
        samreader.header,
        voffset,
        refseqnames,
        refseqlens,
        nothing)
end

function init_bam_reader(input::IO)
    return init_bam_reader(BGZFStreams.BGZFStream(input))
end

function _read!(reader::Reader, record)
    unsafe_read(
        reader.stream,
        pointer_from_objref(record),
        FIXED_FIELDS_BYTES)
    dsize = data_size(record)
    if length(record.data) < dsize
        resize!(record.data, dsize)
    end
    unsafe_read(reader.stream, pointer(record.data), dsize)
    record.reader = reader
    return record
end
