# BAM Overlap
# ===========

struct OverlapIterator{T}
    reader::Reader{T}
    refname::String
    interval::UnitRange{Int}
end

function Base.iteratorsize{T}(::Type{OverlapIterator{T}})
    return Base.SizeUnknown()
end

function Base.eltype{T}(::Type{OverlapIterator{T}})
    return Record
end

function GenomicFeatures.eachoverlap(reader::Reader, interval::Interval)
    return GenomicFeatures.eachoverlap(reader, interval.seqname, interval.first:interval.last)
end

function GenomicFeatures.eachoverlap(reader::Reader, interval)
    return GenomicFeatures.eachoverlap(reader, convert(Interval, interval))
end

function GenomicFeatures.eachoverlap(reader::Reader, refname::AbstractString, interval::UnitRange)
    return OverlapIterator(reader, String(refname), interval)
end


# Iterator
# --------

mutable struct OverlapIteratorState{S}
    # reader's state
    readerstate::ReaderState{S,Record}

    # reference index
    refindex::Int

    # possibly overlapping chunks
    chunks::Vector{GenomicFeatures.Indexes.Chunk}

    # current chunk index
    chunkid::Int
end

function Base.start(iter::OverlapIterator)
    readerstate = ReaderState(iter.reader)
    reader = readerstate.reader
    refindex = findfirst(reader.refseqnames, iter.refname)
    if refindex == 0
        throw(ArgumentError("sequence name $(iter.refname) is not found in the header"))
    end
    @assert !isnull(reader.index)
    chunks = GenomicFeatures.Indexes.overlapchunks(get(reader.index).index, refindex, iter.interval)
    if !isempty(chunks)
        seek(reader.input, first(chunks).start)
    end
    return OverlapIteratorState(readerstate, refindex, chunks, 1)
end

function Base.done(iter::OverlapIterator, state)
    reader = state.readerstate.reader
    record = state.readerstate.record
    while state.chunkid ≤ endof(state.chunks)
        chunk = state.chunks[state.chunkid]
        while BGZFStreams.virtualoffset(reader.input) < chunk.stop
            read!(reader, record)
            c = compare_intervals(record, (state.refindex, iter.interval))
            if c == 0
                # overlapping
                return false
            elseif c > 0
                # no more overlapping records in this chunk since records are sorted
                break
            end
        end
        state.chunkid += 1
        if state.chunkid ≤ endof(state.chunks)
            seek(reader.input, state.chunks[state.chunkid].start)
        end
    end
    return true
end

function Base.next(::OverlapIterator, state)
    return copy(state.readerstate.record), state
end

function compare_intervals(record::Record, interval::Tuple{Int,UnitRange{Int}})
    rid = refid(record)
    if rid < interval[1] || (rid == interval[1] && rightposition(record) < first(interval[2]))
        # strictly left
        return -1
    elseif rid > interval[1] || (rid == interval[1] && position(record) > last(interval[2]))
        # strictly right
        return +1
    else
        # overlapping
        return 0
    end
end
