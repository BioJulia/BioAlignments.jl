# API Reference

## Operations

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
ismatchop
isinsertop
isdeleteop
```

## Alignments

```@docs
AlignmentAnchor
Alignment
Alignment(::Vector{AlignmentAnchor}, ::Bool)
Alignment(::AbstractString, ::Int, ::Int)
seq2ref(::Alignment, ::Integer)
ref2seq(::Alignment, ::Integer)
cigar(::Alignment)
```

## Substitution matrices

```@docs
AbstractSubstitutionMatrix
SubstitutionMatrix
DichotomousSubstitutionMatrix
EDNAFULL
PAM30
PAM70
PAM250
BLOSUM45
BLOSUM50
BLOSUM62
BLOSUM80
BLOSUM90
```

## Pairwise alignments

```@docs
PairwiseAlignment
Base.count(::PairwiseAlignment, ::Operation)
count_matches
count_mismatches
count_insertions
count_deletions
count_aligned
GlobalAlignment
SemiGlobalAlignment
OverlapAlignment
LocalAlignment
EditDistance
HammingDistance
LevenshteinDistance
AbstractScoreModel
AffineGapScoreModel
AbstractCostModel
CostModel
PairwiseAlignmentResult
pairalign
score
distance
alignment
hasalignment
seq2ref(::PairwiseAlignment, ::Integer)
ref2seq(::PairwiseAlignment, ::Integer)
```
