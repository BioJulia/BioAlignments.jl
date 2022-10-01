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
    alnpos::Int
    op::Operation
end

seqpos(anc::AlignmentAnchor) = anc.seqpos
refpos(anc::AlignmentAnchor) = anc.refpos
alnpos(anc::AlignmentAnchor) = anc.alnpos

function Base.show(io::IO, anc::AlignmentAnchor)
    print(io, "AlignmentAnchor(", anc.seqpos, ", ", anc.refpos,
                               ", ", anc.alnpos, ", '", anc.op, "')")
end
