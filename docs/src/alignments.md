Sequence Alignments
===================

```@meta
CurrentModule = BioAlignments
DocTestSetup = quote
    using BioSequences
    using BioAlignments
end
```

The `BioAlignments` module contains tools for computing and working with
sequence alignments.


## Representing alignments

The `Alignment` type can represent a wide variety of global or local sequence
alignments while facilitating efficient coordinate transformation.  Alignment
are always relative to a possibly unspecified reference sequence and represent a
series of [edit operations](https://en.wikipedia.org/wiki/Edit_distance)
performed on that reference to transform it to the query sequence.

To represent an alignment we use a series of "anchors" stored in the
`AlignmentAnchor` type. Anchors are form of run-length encoding alignment
operations, but rather than store an operation along with a length, we store the
end-point of that operation in both reference and query coordinates.

```julia
immutable AlignmentAnchor
    seqpos::Int
    refpos::Int
    op::Operation
end
```

Every alignment starts with a special `OP_START` operation which is used to give
the position in the reference and query prior to the start of the alignment, or
0, if the alignment starts at position 1.

For example, consider the following alignment:

                  0   4        9  12 15     19
                  |   |        |  |  |      |
        query:     TGGC----ATCATTTAACG---CAAG
    reference: AGGGTGGCATTTATCAG---ACGTTTCGAGAC
                  |   |   |    |     |  |   |
                  4   8   12   17    20 23  27

Using anchors we would represent this as the following series of anchors:
```julia
[
    AlignmentAnchor( 0,  4, OP_START),
    AlignmentAnchor( 4,  8, OP_MATCH),
    AlignmentAnchor( 4, 12, OP_DELETE),
    AlignmentAnchor( 9, 17, OP_MATCH),
    AlignmentAnchor(12, 17, OP_INSERT),
    AlignmentAnchor(15, 20, OP_MATCH),
    AlignmentAnchor(15, 23, OP_DELETE),
    AlignmentAnchor(19, 27, OP_MATCH)
]
```

An `Alignment` object can be created from a series of anchors:
```jldoctest
julia> Alignment([
           AlignmentAnchor(0,  4, OP_START),
           AlignmentAnchor(4,  8, OP_MATCH),
           AlignmentAnchor(4, 12, OP_DELETE)
       ])
BioAlignments.Alignment:
  aligned range:
    seq: 0-4
    ref: 4-12
  CIGAR string: 4M4D
```


### Operations

Alignment operations follow closely from those used in the [SAM/BAM
format](https://samtools.github.io/hts-specs/SAMv1.pdf) and are stored in the
`Operation` bitstype.

| Operation            | Operation Type     | Description                                                                     |
| :------------------- | :----------------- | :------------------------------------------------------------------------------ |
| `OP_MATCH`           | match              | non-specific match                                                              |
| `OP_INSERT`          | insert             | insertion into reference sequence                                               |
| `OP_DELETE`          | delete             | deletion from reference sequence                                                |
| `OP_SKIP`            | delete             | (typically long) deletion from the reference, e.g. due to RNA splicing          |
| `OP_SOFT_CLIP`       | insert             | sequence removed from the beginning or end of the query sequence but stored     |
| `OP_HARD_CLIP`       | insert             | sequence removed from the beginning or end of the query sequence and not stored |
| `OP_PAD`             | special            | not currently supported, but present for SAM/BAM compatibility                  |
| `OP_SEQ_MATCH`       | match              | match operation with matching sequence positions                                |
| `OP_SEQ_MISMATCH`    | match              | match operation with mismatching sequence positions                             |
| `OP_BACK`            | special            | not currently supported, but present for SAM/BAM compatibility                  |
| `OP_START`           | special            | indicate the start of an alignment within the reference and query sequence      |


## Aligned sequence

A sequence aligned to another sequence is represented by the `AlignedSequence`
type, which is a pair of the aligned sequence and an `Alignment` object.

The following example creates an aligned sequence object from a sequence and an
alignment:
```jldoctest
julia> AlignedSequence(  # pass an Alignment object
           dna"ACGTAT",
           Alignment([
               AlignmentAnchor(0, 0, OP_START),
               AlignmentAnchor(3, 3, OP_MATCH),
               AlignmentAnchor(6, 3, OP_INSERT)
           ])
       )
···---
ACGTAT

julia> AlignedSequence(  # or pass a vector of anchors
           dna"ACGTAT",
           [
               AlignmentAnchor(0, 0, OP_START),
               AlignmentAnchor(3, 3, OP_MATCH),
               AlignmentAnchor(6, 3, OP_INSERT)
           ]
       )
···---
ACGTAT

```

If you already have an aligned sequence with gap symbols, it can be converted to
an `AlignedSequence` object by passing a reference sequence with it:
```jlcon
julia> seq = dna"ACGT--AAT--"
11nt DNA Sequence:
ACGT--AAT--

julia> ref = dna"ACGTTTAT-GG"
11nt DNA Sequence:
ACGTTTAT-GG

julia> AlignedSequence(seq, ref)
········-··
ACGT--AAT--

```
