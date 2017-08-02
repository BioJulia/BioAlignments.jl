High-throughput Sequencing
==========================

Overview
--------

High-throughput sequencing (HTS) technologies generate a large amount of data in
the form of a large number of nucleotide sequencing reads. One of the most
common tasks in bioinformatics is to align these reads against known reference
genomes, chromosomes, or contigs. The `BioAlignments` module provides several
data formats commonly used for this kind of task.


SAM and BAM file formats
------------------------

SAM and BAM are the most popular file formats and have the same reading and
writing interface as all other formats in Bio.jl. A typical code iterating over
all records in a file looks like below:
```julia
# import the SAM and BAM module
using BioAlignments

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
functions to `SAM.Record` and `BAM.Record` are described in [SAM formatted
files](@ref) and [BAM formatted files](@ref) sections, respectively.

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


Getting records in a range
--------------------------

BioAlignments.jl supports the BAI index to fetch records in a specific range
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

`eachoverlap` also supports `Interval` type definded in
[BioAlignments.jl](https://github.com/BioJulia/BioAlignments.jl).

```julia
# Load GFF3 module.
using GenomicFeatures

# Load genomic features from a GFF3 file.
features = open(collect, GFF3.Reader, "TAIR10_GFF3_genes.gff")

# Keep mRNA features.
filter!(x -> GFF3.featuretype(x) == "mRNA", features)

# Load BAM module.
using BioAlignments

# Open a BAM file and iterate over records overlapping mRNA transcripts.
reader = open(BAM.Reader, "SRR1238088.sort.bam", index="SRR1238088.sort.bam.bai")
for feature in features
    for record in eachoverlap(reader, feature)
        # `record` overlaps `feature`.
        # ...
    end
end
close(reader)
```


Performance tips
----------------

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

[samtools]: https://samtools.github.io/
