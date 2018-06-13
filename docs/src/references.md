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

## I/O

### SAM

```@docs
SAM.Reader
SAM.header

SAM.Header
Base.find(header::SAM.Header, key::AbstractString)

SAM.Writer

SAM.MetaInfo
SAM.iscomment
SAM.tag
SAM.value
SAM.keyvalues

SAM.Record
SAM.flag
SAM.ismapped
SAM.isprimary
SAM.refname
SAM.position
SAM.rightposition
SAM.isnextmapped
SAM.nextrefname
SAM.nextposition
SAM.mappingquality
SAM.cigar
SAM.alignment
SAM.alignlength
SAM.tempname
SAM.templength
SAM.sequence
SAM.seqlength
SAM.quality
SAM.auxdata

SAM.FLAG_PAIRED
SAM.FLAG_PROPER_PAIR
SAM.FLAG_UNMAP
SAM.FLAG_MUNMAP
SAM.FLAG_REVERSE
SAM.FLAG_MREVERSE
SAM.FLAG_READ1
SAM.FLAG_READ2
SAM.FLAG_SECONDARY
SAM.FLAG_QCFAIL
SAM.FLAG_DUP
SAM.FLAG_SUPPLEMENTARY
```

### BAM

```@docs
BAM.Reader
BAM.header

BAM.Writer

BAM.Record
BAM.flag
BAM.ismapped
BAM.isprimary
BAM.ispositivestrand
BAM.refid
BAM.refname
BAM.position
BAM.rightposition
BAM.isnextmapped
BAM.nextrefid
BAM.nextrefname
BAM.nextposition
BAM.mappingquality
BAM.cigar
BAM.cigar_rle
BAM.alignment
BAM.alignlength
BAM.tempname
BAM.templength
BAM.sequence
BAM.seqlength
BAM.quality
BAM.auxdata

BAM.BAI
```
