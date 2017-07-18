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

mutable struct OverlapIteratorState
    # reference index
    refindex::Int

    # possibly overlapping chunks
    chunks::Vector{GenomicFeatures.Indexes.Chunk}

    # current chunk index
    chunkid::Int

    # pre-allocated record
    record::Record
end

function Base.start(iter::OverlapIterator)
    refindex = findfirst(iter.reader.refseqnames, iter.refname)
    if refindex == 0
        throw(ArgumentError("sequence name $(iter.refname) is not found in the header"))
    end
    @assert !isnull(iter.reader.index)
    chunks = GenomicFeatures.Indexes.overlapchunks(get(iter.reader.index).index, refindex, iter.interval)
    if !isempty(chunks)
        seek(iter.reader, first(chunks).start)
    end
    return OverlapIteratorState(refindex, chunks, 1, Record())
end

function Base.done(iter::OverlapIterator, state)
    while state.chunkid ≤ endof(state.chunks)
        chunk = state.chunks[state.chunkid]
        while BGZFStreams.virtualoffset(iter.reader.stream) < chunk.stop
            read!(iter.reader, state.record)
            c = compare_intervals(state.record, (state.refindex, iter.interval))
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
            seek(iter.reader, state.chunks[state.chunkid].start)
        end
    end
    return true
end

function Base.next(::OverlapIterator, state)
    return copy(state.record), state
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
