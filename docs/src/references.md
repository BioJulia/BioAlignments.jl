References
==========

Operations
----------

```@docs
Operation
OP_MATCH
OP_INSERT
OP_DELETE
OP_SKIP
OP_SOFT_CLIP
OP_HARD_CLIP
OP_PAD
OP_SEQ_MATCH
OP_SEQ_MISMATCH
OP_BACK
OP_START
```

Alignments
----------

```@docs
Alignment
Alignment(::Vector{AlignmentAnchor}, ::Bool)
Alignment(::AbstractString, ::Int, ::Int)
seq2ref
ref2seq
cigar
```
