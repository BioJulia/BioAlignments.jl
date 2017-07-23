# BAM Reader
# ==========

"""
    BAM.Reader(input; index=nothing)

Create a data reader of the BAM file format.

# Arguments
* `input`: data source (filepath or readable `IO` object)
* `index=nothing`: filepath to a random access index (currently *bai* is supported)
"""
mutable struct Reader{T<:Union{String,BGZFStreams.BGZFStream}} <: Bio.IO.AbstractReader
    # data source
    input::T

    # BAM index
    index::Nullable{BAI}

    # header data
    header::SAM.Header
    refseqnames::Vector{String}
    refseqlens::Vector{Int}
end

function Reader(input::BGZFStreams.BGZFStream; index=nothing)
    if index == nothing
        index = Nullable{BAI}()
    elseif index isa BAI
        index = Nullable(index)
    elseif index isa AbstractString
        index = Nullable(BAI(index))
    elseif index isa Nullable{BAI}
        # ok
    else
        error("unrecognizable index argument: $(typeof(index))")
    end

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
    samreader = SAM.Reader(IOBuffer(read(input, UInt8, textlen)))

    # reference sequences
    refseqnames = String[]
    refseqlens = Int[]
    n_refs = read(input, Int32)
    for _ in 1:n_refs
        namelen = read(input, Int32)
        data = read(input, UInt8, namelen)
        seqname = unsafe_string(pointer(data))
        seqlen = read(input, Int32)
        push!(refseqnames, seqname)
        push!(refseqlens, seqlen)
    end

    return Reader(input, index, samreader.header, refseqnames, refseqlens)
end

function Reader(input::IO; index=nothing)
    return Reader(BGZFStreams.BGZFStream(input), index=index)
end

function Reader(filepath::AbstractString; index=:auto)
    if index isa Symbol
        if index == :auto
            index = findbai(filepath)
        else
            throw(ArgumentError("invalid index: ':$(index)'"))
        end
    elseif index isa AbstractString
        index = BAI(index)
    end
    return Reader(filepath, index, SAM.Header(), String[], Int[])
end

function Base.open(reader::Reader{String})
    return Reader(open(reader.input), index=reader.index)
end

function Base.eltype{T}(::Type{Reader{T}})
    return Record
end

function Bio.IO.stream(reader::Reader)
    return reader.stream
end

function Base.show(io::IO, reader::Reader)
    print(io, summary(reader), "(<input=", repr(reader.input), ">)")
end

"""
    header(reader::Reader; fillSQ::Bool=false)::SAM.Header

Get the header of `reader`.

If `fillSQ` is `true`, this function fills missing "SQ" metainfo in the header.
"""
function header(reader::Reader; fillSQ::Bool=false)::SAM.Header
    header = reader.header
    if fillSQ
        if !isempty(find(reader.header, "SQ"))
            throw(ArgumentError("SAM header already has SQ records"))
        end
        header = copy(header)
        for (name, len) in zip(reader.refseqnames, reader.refseqlens)
            push!(header, SAM.MetaInfo("SQ", ["SN" => name, "LN" => len]))
        end
    end
    return header
end

function Bio.header(reader::Reader)
    return header(reader)
end

#function Base.seek(reader::Reader, voffset::BGZFStreams.VirtualOffset)
#    seek(reader.stream, voffset)
#end
#
#function Base.seekstart(reader::Reader)
#    seek(reader.stream, reader.start_offset)
#end

struct ReaderState{S,T}
    reader::S
    record::T
end

function ReaderState(reader::Reader{<:BGZFStreams.BGZFStream})
    return ReaderState(reader, Record())
end

function ReaderState(reader::Reader{String})
    return ReaderState(open(reader), Record())
end

function Base.start(reader::Reader)
    return ReaderState(reader)
end

function Base.done(::Reader, state)
    return eof(state.reader.input)
end

function Base.next(::Reader, state)
    read!(state.reader, state.record)
    return copy(state.record), state
end
