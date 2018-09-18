# Pairwise alignment

```@meta
CurrentModule = BioAlignments
DocTestSetup = quote
    using BioSequences
    using BioAlignments
end
```

## Overview

Pairwise alignment is a sequence alignment between two sequences.
BioAlignments.jl implements several pairwise alignment algorithms that maximize
alignment score or minimize alignment cost. If you are interested in handling
the results of pairwise alignments, it is highly recommended to read the
[Alignment representation](@ref) chapter in advance to get used to the alignment
representation.

## Alignment types and scoring models

A pairwise alignment problem has two factors: an alignment type and a score/cost
model. The alignment type specifies the alignment range (e.g. global, local,
etc.) and the score/cost model specifies parameters of the alignment operations.

`pairalign` is a function to run alignment, which is exported from the
`BioAlignments` module.  It takes an alignment type as its first argument, then
two sequences to align, and finally a score model. Currently, the following four
types of alignments are supported:

* `GlobalAlignment`: global-to-global alignment
* `SemiGlobalAlignment`: local-to-global alignment
* `LocalAlignment`: local-to-local alignment
* `OverlapAlignment`: end-free alignment

For scoring model, `AffineGapScoreModel` is currently supported. It imposes an
**affine gap penalty** for insertions and deletions: `gap_open + k * gap_extend`
for a consecutive insertion/deletion of length `k`. The affine gap penalty is
flexible enough to create a constant and linear scoring model. Setting
`gap_extend = 0` or `gap_open = 0`, they are equivalent to the constant or
linear gap penalty, respectively.
The first argument of `AffineGapScoreModel` can be a substitution matrix like
`AffineGapScoreModel(BLOSUM62, gap_open=-10, gap_extend=-1)`. For details on
substitution matrices, see the [Substitution matrix types](@ref) section.

Alignment type can also be a distance of two sequences:

* `EditDistance`
* `LevenshteinDistance`
* `HammingDistance`

In this alignment, `CostModel` is used instead of `AffineGapScoreModel` to define
cost of substitution, insertion, and deletion:
```jldoctest
julia> costmodel = CostModel(match=0, mismatch=1, insertion=1, deletion=1);

julia> pairalign(EditDistance(), "abcd", "adcde", costmodel)
PairwiseAlignmentResult{Int64,String,String}:
  distance: 2
  seq: 1 abcd- 4
         | ||
  ref: 1 adcde 5

```

## Operations on pairwise alignment

The example below shows a use case of some operations:
```jldoctest
julia> s1 = dna"CCTAGGAGGG";

julia> s2 = dna"ACCTGGTATGATAGCG";

julia> scoremodel = AffineGapScoreModel(EDNAFULL, gap_open=-5, gap_extend=-1);

julia> res = pairalign(GlobalAlignment(), s1, s2, scoremodel)  # run pairwise alignment
PairwiseAlignmentResult{Int64,BioSequences.BioSequence{BioSequences.DNAAlphabet{4}},BioSequences.BioSequence{BioSequences.DNAAlphabet{4}}}:
  score: 13
  seq:  0 -CCTAGG------AGGG 10
           ||| ||      || |
  ref:  1 ACCT-GGTATGATAGCG 16


julia> score(res)  # get the achieved score of this alignment
13

julia> aln = alignment(res)
PairwiseAlignment{BioSequences.BioSequence{BioSequences.DNAAlphabet{4}},BioSequences.BioSequence{BioSequences.DNAAlphabet{4}}}:
  seq:  0 -CCTAGG------AGGG 10
           ||| ||      || |
  ref:  1 ACCT-GGTATGATAGCG 16


julia> count_matches(aln)
8

julia> count_mismatches(aln)
1

julia> count_insertions(aln)
1

julia> count_deletions(aln)
7

julia> count_aligned(aln)
17

julia> collect(aln)  # pairwise alignment is iterable
17-element Array{Tuple{BioSymbols.DNA,BioSymbols.DNA},1}:
 (DNA_Gap, DNA_A)
 (DNA_C, DNA_C)
 (DNA_C, DNA_C)
 (DNA_T, DNA_T)
 (DNA_A, DNA_Gap)
 (DNA_G, DNA_G)
 (DNA_G, DNA_G)
 (DNA_Gap, DNA_T)
 (DNA_Gap, DNA_A)
 (DNA_Gap, DNA_T)
 (DNA_Gap, DNA_G)
 (DNA_Gap, DNA_A)
 (DNA_Gap, DNA_T)
 (DNA_A, DNA_A)
 (DNA_G, DNA_G)
 (DNA_G, DNA_C)
 (DNA_G, DNA_G)

julia> DNASequence([x for (x, _) in aln])  # create aligned `s1` with gaps
17nt DNA Sequence:
-CCTAGG------AGGG

julia> DNASequence([y for (_, y) in aln])  # create aligned `s2` with gaps
17nt DNA Sequence:
ACCT-GGTATGATAGCG

```

## Substitution matrix types

A substitution matrix is a function of substitution score (or cost) from one
symbol to other. Substitution value of `submat` from `x` to `y` can be obtained
by writing `submat[x,y]`.
In BioAlignments.jl, `SubstitutionMatrix` and `DichotomousSubstitutionMatrix` are two
distinct types representing substitution matrices.

`SubstitutionMatrix` is a general substitution matrix type that is a thin
wrapper of regular matrix.

Some common substitution matrices are provided. For DNA and RNA, `EDNAFULL` is
defined:

```jldoctest
julia> EDNAFULL
SubstitutionMatrix{BioSymbols.DNA,Int64}:
     A  C  M  G  R  S  V  T  W  Y  H  K  D  B  N
  A  5 -4  1 -4  1 -4 -1 -4  1 -4 -1 -4 -1 -4 -2
  C -4  5  1 -4 -4  1 -1 -4 -4  1 -1 -4 -4 -1 -2
  M  1  1 -1 -4 -2 -2 -1 -4 -2 -2 -1 -4 -3 -3 -1
  G -4 -4 -4  5  1  1 -1 -4 -4 -4 -4  1 -1 -1 -2
  R  1 -4 -2  1 -1 -2 -1 -4 -2 -4 -3 -2 -1 -3 -1
  S -4  1 -2  1 -2 -1 -1 -4 -4 -2 -3 -2 -3 -1 -1
  V -1 -1 -1 -1 -1 -1 -1 -4 -3 -3 -2 -3 -2 -2 -1
  T -4 -4 -4 -4 -4 -4 -4  5  1  1 -1  1 -1 -1 -2
  W  1 -4 -2 -4 -2 -4 -3  1 -1 -2 -1 -2 -1 -3 -1
  Y -4  1 -2 -4 -4 -2 -3  1 -2 -1 -1 -2 -3 -1 -1
  H -1 -1 -1 -4 -3 -3 -2 -1 -1 -1 -1 -3 -2 -2 -1
  K -4 -4 -4  1 -2 -2 -3  1 -2 -2 -3 -1 -1 -1 -1
  D -1 -4 -3 -1 -1 -3 -2 -1 -1 -3 -2 -1 -1 -2 -1
  B -4 -1 -3 -1 -3 -1 -2 -1 -3 -1 -2 -1 -2 -1 -1
  N -2 -2 -1 -2 -1 -1 -1 -2 -1 -1 -1 -1 -1 -1 -1
(underlined values are default ones)

```

For amino acids, PAM (Point Accepted Mutation) and BLOSUM (BLOcks SUbstitution Matrix) matrices are defined:

```jldoctest
julia> BLOSUM62
SubstitutionMatrix{BioSymbols.AminoAcid,Int64}:
     A  R  N  D  C  Q  E  G  H  I  L  K  M  F  P  S  T  W  Y  V  O  U  B  J  Z  X  *
  A  4 -1 -2 -2  0 -1 -1  0 -2 -1 -1 -1 -1 -2 -1  1  0 -3 -2  0  0̲  0̲ -2  0̲ -1  0 -4
  R -1  5  0 -2 -3  1  0 -2  0 -3 -2  2 -1 -3 -2 -1 -1 -3 -2 -3  0̲  0̲ -1  0̲  0 -1 -4
  N -2  0  6  1 -3  0  0  0  1 -3 -3  0 -2 -3 -2  1  0 -4 -2 -3  0̲  0̲  3  0̲  0 -1 -4
  D -2 -2  1  6 -3  0  2 -1 -1 -3 -4 -1 -3 -3 -1  0 -1 -4 -3 -3  0̲  0̲  4  0̲  1 -1 -4
  C  0 -3 -3 -3  9 -3 -4 -3 -3 -1 -1 -3 -1 -2 -3 -1 -1 -2 -2 -1  0̲  0̲ -3  0̲ -3 -2 -4
  Q -1  1  0  0 -3  5  2 -2  0 -3 -2  1  0 -3 -1  0 -1 -2 -1 -2  0̲  0̲  0  0̲  3 -1 -4
  E -1  0  0  2 -4  2  5 -2  0 -3 -3  1 -2 -3 -1  0 -1 -3 -2 -2  0̲  0̲  1  0̲  4 -1 -4
  G  0 -2  0 -1 -3 -2 -2  6 -2 -4 -4 -2 -3 -3 -2  0 -2 -2 -3 -3  0̲  0̲ -1  0̲ -2 -1 -4
  H -2  0  1 -1 -3  0  0 -2  8 -3 -3 -1 -2 -1 -2 -1 -2 -2  2 -3  0̲  0̲  0  0̲  0 -1 -4
  I -1 -3 -3 -3 -1 -3 -3 -4 -3  4  2 -3  1  0 -3 -2 -1 -3 -1  3  0̲  0̲ -3  0̲ -3 -1 -4
  L -1 -2 -3 -4 -1 -2 -3 -4 -3  2  4 -2  2  0 -3 -2 -1 -2 -1  1  0̲  0̲ -4  0̲ -3 -1 -4
  K -1  2  0 -1 -3  1  1 -2 -1 -3 -2  5 -1 -3 -1  0 -1 -3 -2 -2  0̲  0̲  0  0̲  1 -1 -4
  M -1 -1 -2 -3 -1  0 -2 -3 -2  1  2 -1  5  0 -2 -1 -1 -1 -1  1  0̲  0̲ -3  0̲ -1 -1 -4
  F -2 -3 -3 -3 -2 -3 -3 -3 -1  0  0 -3  0  6 -4 -2 -2  1  3 -1  0̲  0̲ -3  0̲ -3 -1 -4
  P -1 -2 -2 -1 -3 -1 -1 -2 -2 -3 -3 -1 -2 -4  7 -1 -1 -4 -3 -2  0̲  0̲ -2  0̲ -1 -2 -4
  S  1 -1  1  0 -1  0  0  0 -1 -2 -2  0 -1 -2 -1  4  1 -3 -2 -2  0̲  0̲  0  0̲  0  0 -4
  T  0 -1  0 -1 -1 -1 -1 -2 -2 -1 -1 -1 -1 -2 -1  1  5 -2 -2  0  0̲  0̲ -1  0̲ -1  0 -4
  W -3 -3 -4 -4 -2 -2 -3 -2 -2 -3 -2 -3 -1  1 -4 -3 -2 11  2 -3  0̲  0̲ -4  0̲ -3 -2 -4
  Y -2 -2 -2 -3 -2 -1 -2 -3  2 -1 -1 -2 -1  3 -3 -2 -2  2  7 -1  0̲  0̲ -3  0̲ -2 -1 -4
  V  0 -3 -3 -3 -1 -2 -2 -3 -3  3  1 -2  1 -1 -2 -2  0 -3 -1  4  0̲  0̲ -3  0̲ -2 -1 -4
  O  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲
  U  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲
  B -2 -1  3  4 -3  0  1 -1  0 -3 -4  0 -3 -3 -2  0 -1 -4 -3 -3  0̲  0̲  4  0̲  1 -1 -4
  J  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲
  Z -1  0  0  1 -3  3  4 -2  0 -3 -3  1 -1 -3 -1  0 -1 -3 -2 -2  0̲  0̲  1  0̲  4 -1 -4
  X  0 -1 -1 -1 -2 -1 -1 -1 -1 -1 -1 -1 -1 -1 -2  0  0 -2 -1 -1  0̲  0̲ -1  0̲ -1 -1 -4
  * -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4  0̲  0̲ -4  0̲ -4 -4  1
(underlined values are default ones)

```

| Matrix   | Constants                                                  |
| :------- | :----------                                                |
| PAM      | `PAM30`, `PAM70`, `PAM250`                                 |
| BLOSUM   | `BLOSUM45`, `BLOSUM50`, `BLOSUM62`, `BLOSUM80`, `BLOSUM90` |

These matrices are downloaded from: <ftp://ftp.ncbi.nih.gov/blast/matrices/>.

`SubstitutionMatrix` can be modified like a regular matrix:

```jldoctest
julia> mysubmat = copy(BLOSUM62);  # create a copy

julia> mysubmat[AA_A,AA_R]  # score of AA_A => AA_R substitution is -1
-1

julia> mysubmat[AA_A,AA_R] = -3  # set the score to -3
-3

julia> mysubmat[AA_A,AA_R]  # the score is modified
-3

```

Make sure to create a copy of the original matrix when you create a matrix from
a predefined matrix. In the above case, `BLOSUM62` is shared in the whole
program and modification on it will affect any result that uses `BLOSUM62`.

`DichotomousSubstitutionMatrix` is a specialized matrix for matching or
mismatching substitution.  This is a preferable choice when performance is more
important than flexibility because looking up score is faster than
`SubstitutionMatrix`.

```jldoctest
julia> submat = DichotomousSubstitutionMatrix(1, -1)
DichotomousSubstitutionMatrix{Int64}:
     match =  1
  mismatch = -1

julia> submat['A','A']  # match
1

julia> submat['A','B']  # mismatch
-1

```
