# Pairwise-Alignment Result
# =========================
#
# Result of pairwise alignment.
#
# This file is a part of BioJulia.
# License is MIT: https://github.com/BioJulia/BioAlignments.jl/blob/master/LICENSE.md

"""
Result of pairwise alignment
"""
mutable struct PairwiseAlignmentResult{T,S1,S2}
    # alignment score/distance
    value::T
    isscore::Bool
    aln::Union{Nothing, PairwiseAlignment{S1,S2}}
end

function PairwiseAlignmentResult(value, isscore, seq, ref)
    return PairwiseAlignmentResult(value, isscore, PairwiseAlignment(seq, ref))
end

function PairwiseAlignmentResult{S1,S2}(value::T, isscore) where {T,S1,S2}
    return PairwiseAlignmentResult{T,S1,S2}(value, isscore, nothing)
end


# Accessors
# ---------

"""
    score(alignment_result)

Return score of alignment.
"""
score(aln::PairwiseAlignmentResult) = aln.value

"""
    distance(alignment_result)

Retrun distance of alignment.
"""
BioCore.distance(aln::PairwiseAlignmentResult) = aln.value


"""
    hasalignment(alignment_result)

Check if alignment is stored or not.
"""
hasalignment(aln::PairwiseAlignmentResult) = aln.aln !== nothing

"""
    alignment(alignment_result)

Return alignment if any.

See also: `hasalignment`
"""
function alignment(aln::PairwiseAlignmentResult)
    if !hasalignment(aln)
        throw(ArgumentError("alignment is not stored"))
    end
    return aln.aln
end


# Printer
# -------

function Base.show(io::IO, aln::PairwiseAlignmentResult{T,S1,S2}) where {T,S1,S2}
    println(io, summary(aln), ':')
    if aln.isscore
        print(io, "  score: ", aln.value)
    else
        print(io, "  distance: ", aln.value)
    end
    if hasalignment(aln)
        println(io)
        print(io, alignment(aln))
    end
end
