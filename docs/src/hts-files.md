# SAM and BAM


## Introduction

High-throughput sequencing (HTS) technologies generate a large amount of data in
the form of a large number of nucleotide sequencing reads. One of the most
common tasks in bioinformatics is to align these reads against known reference
genomes, chromosomes, or contigs. BioAlignments provides several data formats
commonly used for this kind of task.

BioAlignments offers high-performance tools for SAM and BAM file formats,
which are the most popular file formats.

If you have questions about the SAM and BAM formats or any of the terminology
used when discussing these formats, see the published
[specification][samtools-spec], which is
maintained by the [samtools group][samtools].

A very very simple SAM file looks like the following:

```
@HD VN:1.6 SO:coordinate
@SQ SN:ref LN:45
r001   99 ref  7 30 8M2I4M1D3M = 37  39 TTAGATAAAGGATACTG *
r002    0 ref  9 30 3S6M1P1I4M *  0   0 AAAAGATAAGGATA    *
r003    0 ref  9 30 5S6M       *  0   0 GCCTAAGCTAA       * SA:Z:ref,29,-,6H5M,17,0;
r004    0 ref 16 30 6M14N5M    *  0   0 ATAGCTTCAGC       *
r003 2064 ref 29 17 6H5M       *  0   0 TAGGC             * SA:Z:ref,9,+,5S6M,30,1;
r001  147 ref 37 30 9M         =  7 -39 CAGCGGCAT         * NM:i:1
```

Where the first two lines are part of the "header", and the following lines are
"records". Each record describes how a read aligns to some reference sequence.
Sometimes one record describes one read, but there are other cases like chimeric
reads and split alignments, where multiple records apply to one read. In the
example above, `r003` is a chimeric read, and `r004` is a split alignment,
and `r001` are mate pair reads. Again, we refer you to the official
[specification][samtools-spec] for more details.

A BAM file stores this same information but in a binary and compressible format
that does not make for pretty printing here!

## Reading SAM and BAM files

A typical script iterating over all records in a file looks like below:

```julia
using BioAlignments

# Open a BAM file.
reader = open(BAM.Reader, "data.bam")

# Iterate over BAM records.
for record in reader
    # `record` is a BAM.Record object.
    if BAM.ismapped(record)
        # Print the mapped position.
        println(BAM.refname(record), ':', BAM.position(record))
    end
end

# Close the BAM file.
close(reader)
```

The size of a BAM file is often extremely large. The iterator interface
demonstrated above allocates an object for each record and that may be a
bottleneck of reading data from a BAM file.
In-place reading reuses a pre-allocated object for every record and less memory
allocation happens in reading:

```julia
reader = open(BAM.Reader, "data.bam")
record = BAM.Record()
while !eof(reader)
    read!(reader, record)
    # do something
end
```

## SAM and BAM Headers

Both `SAM.Reader` and `BAM.Reader` implement the `header` function, which
returns a `SAM.Header` object.
To extract certain information out of the headers, you can use the `find` method
on the header to extract information according to SAM/BAM tag. Again we refer
you to the [specification][samtools-spec] for
full details of all the different tags that can occur in headers, and what they mean.

Below is an example of extracting all the info about the reference sequences from
the BAM header. In SAM/BAM, any description of a reference sequence is stored
in the header, under a tag denoted `SQ` (think `reference SeQuence`!).

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

In the above we can see there were 7 sequences in the reference: 5 chromosomes,
one chloroplast sequence, and one mitochondrial sequence.

## SAM and BAM Records

BioAlignments supports the following accessors for `SAM.Record` types.

```@docs
BioAlignments.SAM.flag
BioAlignments.SAM.ismapped
BioAlignments.SAM.isprimary
BioAlignments.SAM.refname
BioAlignments.SAM.position
BioAlignments.SAM.rightposition
BioAlignments.SAM.isnextmapped
BioAlignments.SAM.nextrefname
BioAlignments.SAM.nextposition
BioAlignments.SAM.mappingquality
BioAlignments.SAM.cigar
BioAlignments.SAM.alignment
BioAlignments.SAM.alignlength
BioAlignments.SAM.tempname
BioAlignments.SAM.templength
BioAlignments.SAM.sequence
BioAlignments.SAM.seqlength
BioAlignments.SAM.quality
BioAlignments.SAM.auxdata
```

BioAlignments supports the following accessors for `BAM.Record` types.

```@docs
BioAlignments.BAM.flag
BioAlignments.BAM.ismapped
BioAlignments.BAM.isprimary
BioAlignments.BAM.refid
BioAlignments.BAM.refname
BioAlignments.BAM.reflen
BioAlignments.BAM.position
BioAlignments.BAM.rightposition
BioAlignments.BAM.isnextmapped
BioAlignments.BAM.nextrefid
BioAlignments.BAM.nextrefname
BioAlignments.BAM.nextposition
BioAlignments.BAM.mappingquality
BioAlignments.BAM.cigar
BioAlignments.BAM.alignment
BioAlignments.BAM.alignlength
BioAlignments.BAM.tempname
BioAlignments.BAM.templength
BioAlignments.BAM.sequence
BioAlignments.BAM.seqlength
BioAlignments.BAM.quality
BioAlignments.BAM.auxdata
```

## Accessing auxiliary data

SAM and BAM records support the storing of optional data fields associated with
tags.

Tagged auxiliary data follows a format of `TAG:TYPE:VALUE`.
`TAG` is a two-letter string, and each tag can only appear once per record.
`TYPE` is a single case-sensetive letter which defined the format of `VALUE`.

| Type | Description                       |
|------|-----------------------------------|
| 'A'  | Printable character               |
| 'i'  | Signed integer                    |
| 'f'  | Single-precision floating number  |
| 'Z'  | Printable string, including space |
| 'H'  | Byte array in Hex format          |
| 'B'  | Integer of numeric array          |

For more information about these tags and their types we refer you to the
[SAM/BAM specification][samtools-spec] and the additional
[optional fields specification][samtags] document.

There are some tags that are reserved, predefined standard tags, for
specific uses.

To access optional fields stored in tags, you use `getindex` indexing syntax on
the record object.
Note that accessing optional tag fields will result in type instability in Julia.
This is because the type of the optional data is not known until run-time, as
the tag is being read. This can have a significant impact on performance.
To limit this, if the user knows the type of a
value in advance, specifying it as a type annotation will alleviate the problem:

Below is an example of looping over records in a bam file and using indexing
syntax to get the data stored in the "NM" tag. Note the `UInt8` type assertion to
alleviate type instability.

```julia
for record in open(BAM.Reader, "data.bam")
    nm = record["NM"]::UInt8
    # do something
end
```

## Getting records in a range

BioAlignments supports the BAI index to fetch records in a specific range
from a BAM file.  [Samtools][samtools] provides `index` subcommand to create an
index file (.bai) from a sorted BAM file.

```console
$ samtools index -b SRR1238088.sort.bam
$ ls SRR1238088.sort.bam*
SRR1238088.sort.bam     SRR1238088.sort.bam.bai
```

`eachoverlap(reader, chrom, range)` returns an iterator of BAM records
overlapping the query interval:

```julia
reader = open(BAM.Reader, "SRR1238088.sort.bam", index="SRR1238088.sort.bam.bai")
for record in eachoverlap(reader, "Chr2", 10000:11000)
    # `record` is a BAM.Record object
    # ...
end
close(reader)
```

## Getting records overlapping genomic features

`eachoverlap` also accepts the `Interval` type defined in
[GenomicFeatures.jl](https://github.com/BioJulia/GenomicFeatures.jl).

This allows you to do things like first read in the genomic features from a GFF3
file, and then for each feature, iterate over all the BAM records that overlap
with that feature.

```julia
# Load GFF3 module.
using GenomicFeatures
using BioAlignments

# Load genomic features from a GFF3 file.
features = open(collect, GFF3.Reader, "TAIR10_GFF3_genes.gff")

# Keep mRNA features.
filter!(x -> GFF3.featuretype(x) == "mRNA", features)

# Open a BAM file and iterate over records overlapping mRNA transcripts.
reader = open(BAM.Reader, "SRR1238088.sort.bam", index = "SRR1238088.sort.bam.bai")
for feature in features
    for record in eachoverlap(reader, feature)
        # `record` overlaps `feature`.
        # ...
    end
end
close(reader)
```

## Writing files

In order to write a BAM or SAM file, you must first create a `SAM.Header`.

A `SAM.Header` is constructed from a vector of `SAM.MetaInfo` objects.

For example, to create the following simple header:

```
@HD VN:1.6 SO:coordinate
@SQ SN:ref LN:45
```

```julia
julia> a = SAM.MetaInfo("HD", ["VN" => 1.6, "SO" => "coordinate"])
SAM.MetaInfo:
    tag: HD
  value: VN=1.6 SO=coordinate

julia> b = SAM.MetaInfo("SQ", ["SN" => "ref", "LN" => 45])
SAM.MetaInfo:
    tag: SQ
  value: SN=ref LN=45

julia> h = SAM.Header([a, b])
SAM.Header(SAM.MetaInfo[SAM.MetaInfo:
    tag: HD
  value: VN=1.6 SO=coordinate, SAM.MetaInfo:
    tag: SQ
  value: SN=ref LN=45])

```

Then to create the writer for a SAM file, construct a `SAM.Writer` using the
header and an `IO` type:

```julia
julia> samw = SAM.Writer(open("my-data.sam", "w"), h)
SAM.Writer(IOStream(<file my-data.sam>))

```

To make a BAM Writer is slightly different, as you need to use a specific
stream type from the [BGZFStreams][bgzfstreams] package:

```julia
julia> using BGZFStreams

julia> bamw = BAM.Writer(BGZFStream(open("my-data.bam", "w"), "w"))
BAM.Writer(BGZFStreams.BGZFStream{IOStream}(<mode=write>))

```

Once you have a BAM or SAM writer, you can use the `write` method to write
`BAM.Record`s or `SAM.Record`s to file:

```julia
julia> write(bamw, rec) # Here rec is a `BAM.Record`
330780
```

[samtools]:      https://samtools.github.io/
[samtools-spec]: https://samtools.github.io/hts-specs/SAMv1.pdf
[samtags]:       https://samtools.github.io/hts-specs/SAMtags.pdf
[bgzfstreams]:   https://github.com/BioJulia/BGZFStreams.jl
