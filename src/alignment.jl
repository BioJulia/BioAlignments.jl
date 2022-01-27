# Alignment
# =========
#
# Sequence alignment type.
#
# This file is a part of BioJulia.
# License is MIT: https://github.com/BioJulia/Bio.jl/blob/master/LICENSE.md

"""
Defines how to align a given sequence onto a reference sequence.
The alignment is represented as a sequence of elementary operations (match, insertion, deletion etc)
anchored to specific positions of the input and reference sequence.
"""
struct Alignment
    anchors::Vector{AlignmentAnchor}
    firstref::Int
    lastref::Int

    # https://github.com/JuliaLang/julia/issues/16730
    @doc """
        Alignment(anchors::Vector{AlignmentAnchor}, check=true)

    Create an alignment object from a sequence of alignment anchors.
    """ ->
    function Alignment(anchors::Vector{AlignmentAnchor}, check::Bool=true)
        # optionally check coherence of the anchors
        if check
            check_alignment_anchors(anchors)
        end

        # compute first and last aligned reference positions
        firstref = 0
        for i in 1:length(anchors)
            if ismatchop(anchors[i].op)
                firstref = anchors[i-1].refpos + 1
                break
            end
        end

        lastref = 0
        for i in length(anchors):-1:1
            if ismatchop(anchors[i].op)
                lastref = anchors[i].refpos
                break
            end
        end

        return new(anchors, firstref, lastref)
    end
end

"""
    Alignment(cigar::AbstractString, seqpos=1, refpos=1)

Make an alignment object from a CIGAR string.

`seqpos` and `refpos` specify the starting positions of two sequences.
"""
function Alignment(cigar::AbstractString, seqpos::Int=1, refpos::Int=1)
    # path starts prior to the first aligned position pair
    seqpos -= 1
    refpos -= 1
    alnpos = 0

    n = 0
    anchors = AlignmentAnchor[AlignmentAnchor(seqpos, refpos, alnpos, OP_START)]
    for c in cigar
        if isdigit(c)
            n = n * 10 + convert(Int, c - '0')
        else
            if n == 0
                error("CIGAR operations must be prefixed by a positive integer.")
            end
            op = Operation(c)
            if ismatchop(op)
                seqpos += n
                refpos += n
            elseif isinsertop(op)
                seqpos += n
            elseif isdeleteop(op)
                refpos += n
            elseif ismetaop(op)
                # Meta operations consume alignment positions, but not sequence or reference
                # positions, so there is nothing to do here but prevent the "not supported"
                # error
            else
                error("The $(op) CIGAR operation is not yet supported.")
            end
            alnpos += n

            push!(anchors, AlignmentAnchor(seqpos, refpos, alnpos, op))
            n = 0
        end
    end

    return Alignment(anchors)
end

function Base.:(==)(a::Alignment, b::Alignment)
    return a.anchors == b.anchors && a.firstref == b.firstref && a.lastref == b.lastref
end

function Base.show(io::IO, aln::Alignment)
    println(io, summary(aln), ':')
    println(io, "  aligned range:")
    println(io, "    seq: ", first(aln.anchors).seqpos, '-', last(aln.anchors).seqpos)
    println(io, "    ref: ", first(aln.anchors).refpos, '-', last(aln.anchors).refpos)
      print(io, "  CIGAR string: ", cigar(aln))
end

# generic function for mapping between sequence, reference and alignment positions
# getsrc specifies anchor source position getter
# getdest specifies anchor destination position getter
function pos2pos(aln::Alignment, i::Integer,
                 srcpos::Function, destpos::Function)::Tuple{Int,Operation}
    idx = findanchor(aln, i, srcpos)
    if idx == 0
        if srcpos === seqpos
            throw(ArgumentError("invalid sequence position: $i"))
        elseif srcpos === refpos
            throw(ArgumentError("invalid reference position: $i"))
        elseif srcpos === alnpos
            throw(ArgumentError("invalid alignment position: $i"))
        else
            throw(ArgumentError("Unknown position getter: $srcpos"))
        end
    end
    anchor = aln.anchors[idx]
    pos = destpos(anchor)
    if ismatchop(anchor.op) ||
        ((srcpos === alnpos) && ((destpos === seqpos) && isinsertop(anchor.op) || (destpos === refpos) && isdeleteop(anchor.op))) ||
        ((destpos === alnpos) && ((srcpos === seqpos) && isinsertop(anchor.op) || (srcpos === refpos) && isdeleteop(anchor.op)))
        pos += i - srcpos(anchor)
    end
    return pos, anchor.op
end

"""
    seq2ref(aln::Union{Alignment, AlignedSequence, PairwiseAlignment}, i::Integer)::Tuple{Int,Operation}

Map a position `i` from sequence to reference.
"""
seq2ref(aln::Alignment, i::Integer) = pos2pos(aln, i, seqpos, refpos)

"""
    ref2seq(aln::Union{Alignment, AlignedSequence, PairwiseAlignment}, i::Integer)::Tuple{Int,Operation}

Map a position `i` from reference to sequence.
"""
ref2seq(aln::Alignment, i::Integer) = pos2pos(aln, i, refpos, seqpos)

"""
    seq2aln(aln::Union{Alignment, AlignedSequence, PairwiseAlignment}, i::Integer)::Tuple{Int,Operation}

Map a position `i` from the input sequence to the alignment sequence.
"""
seq2aln(aln::Alignment, i::Integer) = pos2pos(aln, i, seqpos, alnpos)

"""
    ref2aln(aln::Union{Alignment, AlignedSequence, PairwiseAlignment}, i::Integer)::Tuple{Int,Operation}

Map a position `i` from the reference sequence to the alignment sequence.
"""
ref2aln(aln::Alignment, i::Integer) = pos2pos(aln, i, refpos, alnpos)

"""
    aln2seq(aln::Union{Alignment, AlignedSequence, PairwiseAlignment}, i::Integer)::Tuple{Int,Operation}

Map a position `i` from the alignment sequence to the input sequence.
"""
aln2seq(aln::Alignment, i::Integer) = pos2pos(aln, i, alnpos, seqpos)

"""
    aln2ref(aln::Union{Alignment, AlignedSequence, PairwiseAlignment}, i::Integer)::Tuple{Int,Operation}

Map a position `i` from the alignment sequence to the reference sequence.
"""
aln2ref(aln::Alignment, i::Integer) = pos2pos(aln, i, alnpos, refpos)

"""
    cigar(aln::Alignment)

Make a CIGAR string encoding of `aln`.

This is not entirely lossless as it discards the alignments start positions.
"""
function cigar(aln::Alignment)
    anchors = aln.anchors
    if isempty(anchors)
        return ""
    end
    @assert anchors[1].op == OP_START
    out = IOBuffer()
    for i in 2:length(anchors)
        n = anchors[i].alnpos - anchors[i-1].alnpos
        if n > 0
            print(out, n, convert(Char, anchors[i].op))
        end
    end
    return String(take!(out))
end

# Check validity of a sequence of anchors.
function check_alignment_anchors(anchors)
    if isempty(anchors)
        # empty alignments are valid, representing an unaligned sequence
        return
    end

    if anchors[1].op != OP_START
        error("Alignments must begin with on OP_START anchor.")
    end

    # Check if a hard clip occurs in the middle of the alignment
    for i in 3:lastindex(anchors)-1
        if anchors[i].op == OP_HARD_CLIP
            error("OP_HARD_CLIP can only be present as the first (after OP_START) and/or last operation")
        end
    end

    # Check if a soft clip has anything but hard clips and start anchors between them and
    # the end of the alignment
    for i in 3:lastindex(anchors)
        if anchors[i].op == OP_SOFT_CLIP
            # Check if this is the last operation, which is valid
            if i == lastindex(anchors)
                continue
            end

            # Walk forward
            next_anchors = anchors[i+1:lastindex(anchors)]
            next_valid = true
            for anchor in next_anchors
                next_valid = next_valid && anchor.op == OP_HARD_CLIP
            end

            # Walk backward
            prev_anchors = anchors[1:i-1]
            prev_valid = true
            for anchor in prev_anchors
                prev_valid = prev_valid && (anchor.op == OP_START || anchor.op == OP_HARD_CLIP)
            end

            # Check for invalid operations
            if !(next_valid || prev_valid)
                error("OP_SOFT_CLIP may only have OP_HARD_CLIP operations between it and the ends of the alignment")
            end
        end
    end

    for i in 2:lastindex(anchors)
        @inbounds acur, aprev = anchors[i], anchors[i-1]
        if acur.refpos < aprev.refpos || acur.seqpos < aprev.seqpos || acur.alnpos < aprev.alnpos
            error("Alignment anchors must be sorted.")
        end

        op = acur.op
        if !isvalid(op)
            error("Anchor at index $(i) has an invalid operation.")
        end

        # reference skip/delete operations
        if isdeleteop(op)
            if acur.seqpos != aprev.seqpos
                error("Invalid anchor sequence positions for reference deletion.")
            end
            if acur.alnpos - aprev.alnpos != acur.refpos - aprev.refpos
                error("Invalid anchor reference positions for reference deletion.")
            end
        # reference insertion operations
        elseif isinsertop(op)
            if acur.refpos != aprev.refpos
                error("Invalid anchor reference positions for reference insertion.")
            end
            if acur.alnpos - aprev.alnpos != acur.seqpos - aprev.seqpos
                error("Invalid anchor sequence positions for reference deletion.")
            end
        # match operations
        elseif ismatchop(op)
            if (acur.refpos - aprev.refpos != acur.seqpos - aprev.seqpos) ||
               (acur.alnpos - aprev.alnpos != acur.seqpos - aprev.seqpos)
               error("Invalid anchor positions for match operation.")
            end
        end
    end
end

# find the index of the first anchor that satisfies `i ≤ pos(anchor)`
function findanchor(aln::Alignment, i::Integer, pos::Function)
    anchors = aln.anchors
    lo = 1
    hi = lastindex(anchors)
    @inbounds if !(pos(anchors[lo]) < i ≤ pos(anchors[hi]))
        return 0
    end
    # binary search
    @inbounds while hi - lo > 2
        m = (lo + hi) >> 1
        if pos(anchors[m]) < i
            lo = m
        else  # i ≤ pos(anchors[m])
            hi = m
        end
        # invariant (activate this for debugging)
        #@assert pos(anchors[lo]) < i ≤ pos(anchors[hi])
    end
    # linear search
    @inbounds for j in lo+1:hi
        if i ≤ pos(aln.anchors[j])
            return j
        end
    end
    # do not reach here
    @assert false
    return 0
end
