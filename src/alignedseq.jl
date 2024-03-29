# AlignedSequence
# ===============
#
# An aligned sequence.
#
# This file is a part of BioJulia.
# License is MIT: https://github.com/BioJulia/BioAlignments.jl/blob/master/LICENSE.md

struct AlignedSequence{S}
    seq::S
    aln::Alignment
end

function AlignedSequence(seq, anchors::Vector{AlignmentAnchor},
                         check::Bool=true)
    return AlignedSequence(seq, Alignment(anchors, check))
end

function AlignedSequence(seq::BioSequences.BioSequence, ref::BioSequences.BioSequence)
    return AlignedSequence(seq, 1, ref, 1)
end

function AlignedSequence(seq::BioSequences.BioSequence, seqpos::Integer,
                         ref::BioSequences.BioSequence, refpos::Integer)
    if length(seq) != length(ref)
        throw(ArgumentError("two sequences must be the same length"))
    end
    seqpos -= 1
    refpos -= 1
    alnpos = 0
    op = OP_START
    newseq = similar(seq, 0)  # sequence without gap symbols
    anchors = AlignmentAnchor[]
    for (x, y) in zip(seq, ref)
        if x == BioSequences.gap(eltype(seq)) && y == BioSequences.gap(eltype(ref))
            throw(ArgumentError("two sequences must not have gaps at the same position"))
        elseif x == BioSequences.gap(eltype(seq))
            op′ = OP_DELETE
        elseif y == BioSequences.gap(eltype(ref))
            op′ = OP_INSERT
        elseif x == y
            op′ = OP_SEQ_MATCH
        else
            op′ = OP_SEQ_MISMATCH
        end

        if op′ != op
            push!(anchors, AlignmentAnchor(seqpos, refpos, alnpos, op))
            op = op′
        end

        if x != BioSequences.gap(eltype(seq))
            seqpos += 1
            push!(newseq, x)
        end
        if y != BioSequences.gap(eltype(ref))
            refpos += 1
        end
        alnpos += 1 # one or another don't have gap
    end
    push!(anchors, AlignmentAnchor(seqpos, refpos, alnpos, op))
    return AlignedSequence(newseq, anchors)
end

# Getter functions
"""
    alignment(aligned_sequence)

Gets the [`Alignment`](@ref) of `aligned_sequence`.
"""
alignment(alnseq::AlignedSequence) = alnseq.aln

"""
    sequence(aligned_sequence)

Return the sequence of `aligned_sequence`.
"""
sequence(alnseq::AlignedSequence) = alnseq.seq

# First position in the reference sequence.
function IntervalTrees.first(alnseq::AlignedSequence)
    return alnseq.aln.firstref
end

# Last position in the reference sequence.
function IntervalTrees.last(alnseq::AlignedSequence)
    return alnseq.aln.lastref
end

seq2ref(alnseq::AlignedSequence, i) = seq2ref(alnseq.aln, i)
ref2seq(alnseq::AlignedSequence, i) = ref2seq(alnseq.aln, i)
seq2aln(alnseq::AlignedSequence, i) = seq2aln(alnseq.aln, i)
ref2aln(alnseq::AlignedSequence, i) = ref2aln(alnseq.aln, i)
aln2seq(alnseq::AlignedSequence, i) = aln2seq(alnseq.aln, i)
aln2ref(alnseq::AlignedSequence, i) = aln2ref(alnseq.aln, i)

# simple letters and dashes representation of an alignment
function Base.show(io::IO, alnseq::AlignedSequence)
    # print a representation of the reference sequence
    anchors = alnseq.aln.anchors
    for i in 2:length(anchors)
        if ismatchop(anchors[i].op)
            for _ in anchors[i-1].refpos+1:anchors[i].refpos
                write(io, '·')
            end
        elseif isinsertop(anchors[i].op)
            for _ in anchors[i-1].seqpos+1:anchors[i].seqpos
                write(io, '-')
            end
        elseif isdeleteop(anchors[i].op)
            for _ in anchors[i-1].refpos+1:anchors[i].refpos
                write(io, '·')
            end
        end
    end
    write(io, '\n')

    for i in 2:length(anchors)
        if ismatchop(anchors[i].op)
            for i in anchors[i-1].seqpos+1:anchors[i].seqpos
                print(io, alnseq.seq[i])
            end
        elseif isinsertop(anchors[i].op)
            for i in anchors[i-1].seqpos+1:anchors[i].seqpos
                print(io, alnseq.seq[i])
            end
        elseif isdeleteop(anchors[i].op)
            for _ in anchors[i-1].refpos+1:anchors[i].refpos
                write(io, '-')
            end
        end
    end
end
