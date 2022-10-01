# Common Utils
# ============
#
# Common utilities shared among several algorithms (internal use only).
#
# This file is a part of BioJulia.
# License is MIT: https://github.com/BioJulia/BioAlignments.jl/blob/master/LICENSE.md

# k: gap length
function affinegap_score(k, gap_open_penalty, gap_extend_penalty)
    return -(gap_open_penalty + gap_extend_penalty * k)
end


# Trace type
# ----------

# trace type for pairwise alignment
const Trace = UInt8

# trace bitmap
const TRACE_NONE   = 0b00000
const TRACE_MATCH  = 0b00001
const TRACE_DELETE = 0b00010
const TRACE_INSERT = 0b00100
const TRACE_EXTDEL = 0b01000
const TRACE_EXTINS = 0b10000


# Traceback
# ---------

macro start_traceback()
    esc(quote
        __alnpos = 0
        anchor_point = (i, j, __alnpos)
        op = OP_INVALID
    end)
end

# reverses the anchors sequence at the end of the traceback
# and offsets the alignment positions, so that (by default) it starts from 0
function reverse_anchors!(v::AbstractVector{AlignmentAnchor},
                          alignment_offset=!isempty(v) ? -v[end].alnpos : 0)
    r = n = length(v)
    @inbounds for i in 1:fld1(n, 2)
        vr = v[r]
        vi = v[i]
        v[i] = AlignmentAnchor(vr.seqpos, vr.refpos, vr.alnpos + alignment_offset, vr.op)
        (i != r) && (v[r] = AlignmentAnchor(vi.seqpos, vi.refpos, vi.alnpos + alignment_offset, vi.op))
        r -= 1
    end
    return v
end

macro finish_traceback()
    esc(quote
        push!(anchors, AlignmentAnchor(anchor_point..., op))
        push!(anchors, AlignmentAnchor(i, j, __alnpos, OP_START))
        reverse_anchors!(anchors)
        pop!(anchors)  # remove OP_INVALID
    end)
end

macro anchor(ex)
    esc(quote
        if op != $ex
            push!(anchors, AlignmentAnchor(anchor_point..., op))
            op = $ex
            anchor_point = (i, j, __alnpos)
        end
        __alnpos -= 1
        if ismatchop(op)
            i -= 1
            j -= 1
        elseif isinsertop(op)
            i -= 1
        elseif isdeleteop(op)
            j -= 1
        else
            @assert false
        end
    end)
end
