# Alignment Operations
# ====================
#
# Alignment operation type.
#
# This file is a part of BioJulia.
# License is MIT: https://github.com/BioJulia/BioAlignments.jl/blob/master/LICENSE.md

"""
Alignment operation.
"""
primitive type Operation 8 end


# Conversion to and from integers
# -------------------------------

Base.convert(::Type{Operation}, op::UInt8) = reinterpret(Operation, op)
Base.convert(::Type{UInt8}, op::Operation) = reinterpret(UInt8, op)
Operation(c::UInt8) = convert(Operation, c)

Base.convert(::Type{Operation}, op::Integer) = Operation(convert(UInt8, op))
Base.convert(::Type{T}, op::Operation) where T<:Integer = T(convert(UInt8, op))
Operation(c::Integer) = convert(Operation, UInt8(c))


# Operation encoding definitions
# ------------------------------

# Invalid operation.
const OP_INVALID = convert(Operation, 0xff)

# Lookup table for conversion from Char to Operation.
const char_to_op = fill(OP_INVALID, 128)

# Lookup table for conversion from Operation to Char.
const op_to_char = fill('\0', 11)

# Lookup table for showing operations as constants.
const op_to_symbol = fill(Symbol(""), 11)

# Define operations.
for (name, char, doc, code) in [
        ("MATCH"       , 'M', "non-specific match"                                                             , 0x00),
        ("INSERT"      , 'I', "insertion into reference sequence"                                              , 0x01),
        ("DELETE"      , 'D', "deletion from reference sequence"                                               , 0x02),
        ("SKIP"        , 'N', "(typically long) deletion from the reference, e.g. due to RNA splicing"         , 0x03),
        ("SOFT_CLIP"   , 'S', "sequence removed from the beginning or end of the query sequence but stored"    , 0x04),
        ("HARD_CLIP"   , 'H', "sequence removed from the beginning or end of the query sequence and not stored", 0x05),
        ("PAD"         , 'P', "not currently supported, but present for SAM/BAM compatibility"                 , 0x06),
        ("SEQ_MATCH"   , '=', "match operation with matching sequence positions"                               , 0x07),
        ("SEQ_MISMATCH", 'X', "match operation with mismatching sequence positions"                            , 0x08),
        ("BACK"        , 'B', "not currently supported, but present for SAM/BAM compatibility"                 , 0x09),
        ("START"       , '0', "indicate the start of an alignment within the reference and query sequence"     , 0x0a),]
    sym = Symbol("OP_", name)
    @eval begin
        @doc $(string("`'", char, "'`: ", doc)) const $(sym) = convert(Operation, $(code))
        char_to_op[$(Int(char)+1)] = $(sym)
        op_to_char[$(code+1)] = $(char)
        op_to_symbol[$(code+1)] = $(Expr(:quote, sym))
    end
end

const OP_MAX_VALID = OP_START

function Base.isvalid(op::Operation)
    return reinterpret(UInt8, op) ≤ reinterpret(UInt8, OP_START)
end

"""
    ismatchop(op::Operation)

Test if `op` is a match operation (i.e. `op ∈ (OP_MATCH, OP_SEQ_MATCH, OP_SEQ_MISMATCH)`).
"""
function ismatchop(op::Operation)
    return op == OP_MATCH || op == OP_SEQ_MATCH || op == OP_SEQ_MISMATCH
end

"""
    isinsertop(op::Operation)

Test if `op` is a insertion operation (i.e. `op ∈ (OP_INSERT, OP_SOFT_CLIP, OP_HARD_CLIP)`).
"""
function isinsertop(op::Operation)
    return op == OP_INSERT || op == OP_SOFT_CLIP || op == OP_HARD_CLIP
end

"""
    isdeleteop(op::Operation)

Test if `op` is a deletion operation (i.e. `op ∈ (OP_DELETE, OP_SKIP)`).
"""
function isdeleteop(op::Operation)
    return op == OP_DELETE || op == OP_SKIP
end

function Base.convert(::Type{Operation}, c::Char)
    i = convert(Int, c)
    @inbounds op = i < 128 ? char_to_op[i+1] : OP_INVALID
    if op == OP_INVALID
        throw(ArgumentError("invalid alignment operation character '$(c)'"))
    end
    return op
end

Operation(c::Char) = convert(Operation, c)

function Base.convert(::Type{Char}, op::Operation)
    if !isvalid(op)
        throw(ArgumentError("invalid alignment operation"))
    end
    return op_to_char[convert(UInt8, op) + 1]
end

function Base.print(io::IO, op::Operation)
    write(io, convert(Char, op))
    return
end

function Base.show(io::IO, op::Operation)
    if isvalid(op)
        print(io, op_to_symbol[convert(Int, op)+1])
    else
        print(io, "Invalid Operation")
    end
end
