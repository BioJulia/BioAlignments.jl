# Alignment Anchor
# ================
#
# Sequence alignment anchor type.
#
# This file is a part of BioJulia.
# License is MIT: https://github.com/BioJulia/Bio.jl/blob/master/LICENSE.md

"""
Alignment operation with anchoring positions.
"""
struct AlignmentAnchor
    seqpos::Int
    refpos::Int
    op::Operation
end

function AlignmentAnchor(pos::Tuple{Int,Int}, op)
    return AlignmentAnchor(pos[1], pos[2], op)
end

function Base.show(io::IO, anc::AlignmentAnchor)
    print(io, "AlignmentAnchor(", anc.seqpos, ", ", anc.refpos, ", '", anc.op, "')")
end
