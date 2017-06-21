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


## Operating on alignments

```@docs
first
last
seq2ref
ref2seq
cigar
```


## Alignment file formats for high-throughput sequencing

High-throughput sequencing (HTS) technologies generate a large amount of data in
the form of a large number of nucleotide sequencing reads. One of the most
common tasks in bioinformatics is to align these reads against known reference
genomes, chromosomes, or contigs. The `Bio.Align` module provides several data
formats commonly used for this kind of task.


### SAM and BAM file formats

SAM and BAM are the most popular file formats and have the same reading and
writing interface as all other formats in Bio.jl (see [Reading and writing
data](@ref) section). A typical code iterating over all records in a file looks
like below:
```julia
# import the SAM and BAM module
using Bio.Align

# open a BAM file
reader = open(BAM.Reader, "data.bam")

# iterate over BAM records
for record in reader
    # `record` is a BAM.Record object
    if BAM.ismapped(record)
        # print mapped position
        println(BAM.refname(record), ':', BAM.position(record))
    end
end

# close the BAM file
close(reader)
```

Accessor functions are defined in `SAM` and `BAM` modules.  Lists of these
functions to `SAM.Record` and `BAM.Record` are described in [SAM](@ref) and
[BAM](@ref) sections, respectively.

`SAM.Reader` and `BAM.Reader` implement the `header` function, which returns a
`SAM.Header` object. This is conceptually a sequence of `SAM.MetaInfo` objects
corresponding to header lines that start with '@' markers. To select
`SAM.MetaInfo` records with a specific tag, you can use the `find` function:
```jlcon
julia> reader = open(SAM.Reader, "data.sam");

julia> find(header(reader), "SQ")
7-element Array{Bio.Align.SAM.MetaInfo,1}:
 Bio.Align.SAM.MetaInfo:
    tag: SQ
  value: SN=Chr1 LN=30427671
 Bio.Align.SAM.MetaInfo:
    tag: SQ
  value: SN=Chr2 LN=19698289
 Bio.Align.SAM.MetaInfo:
    tag: SQ
  value: SN=Chr3 LN=23459830
 Bio.Align.SAM.MetaInfo:
    tag: SQ
  value: SN=Chr4 LN=18585056
 Bio.Align.SAM.MetaInfo:
    tag: SQ
  value: SN=Chr5 LN=26975502
 Bio.Align.SAM.MetaInfo:
    tag: SQ
  value: SN=chloroplast LN=154478
 Bio.Align.SAM.MetaInfo:
    tag: SQ
  value: SN=mitochondria LN=366924

```

A `SAM.MetaInfo` object can be created as follows:
```jlcon
julia> SAM.MetaInfo("SQ", ["SN" => "chr1", "LN" => 1234])
Bio.Align.SAM.MetaInfo:
    tag: SQ
  value: SN=chr1 LN=1234

julia> SAM.MetaInfo("CO", "comment")
Bio.Align.SAM.MetaInfo:
    tag: CO
  value: comment

```


### Performance tips

The size of a BAM file is often extremely large. The iterator interface
mentioned above allocates an object for each record and that may be a bottleneck
of reading data from a BAM file. In-place reading reuses a preallocated object
for every record and less memory allocation happens in reading:
```julia
reader = open(BAM.Reader, "data.bam")
record = BAM.Record()
while !eof(reader)
    read!(reader, record)
    # do something
end
```

Accessing optional fields will results in type instability in Julia, which has a
significant negative impact on performance. If the user knows the type of a
value in advance, specifying it as a type annotation will alleviate the problem:
```julia
for record in open(BAM.Reader, "data.bam")
    nm = record["NM"]::UInt8
    # do something
end
```

