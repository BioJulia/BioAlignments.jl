BAM
===

Description
-----------

BAM is a binary counterpart of the [SAM](@ref) file format.

* Reader type: `BAM.Reader`
* Writer type: `BAM.Writer`
* Element type: `BAM.Record`

When writing data in the BAM file format, the underlying output stream needs to
be wrapped with a `BGZFStream` object provided from
[BGZFStreams.jl](https://github.com/BioJulia/BGZFStreams.jl).


Examples
--------

**TODO**


Accessors
---------

```@docs
BioAlignments.BAM.Reader
BioAlignments.BAM.header

BioAlignments.BAM.Writer

BioAlignments.BAM.Record
BioAlignments.BAM.flag
BioAlignments.BAM.ismapped
BioAlignments.BAM.isprimary
BioAlignments.BAM.refid
BioAlignments.BAM.refname
BioAlignments.BAM.position
BioAlignments.BAM.rightposition
BioAlignments.BAM.isnextmapped
BioAlignments.BAM.nextrefid
BioAlignments.BAM.nextrefname
BioAlignments.BAM.nextposition
BioAlignments.BAM.mappingquality
BioAlignments.BAM.cigar
BioAlignments.BAM.cigar_rle
BioAlignments.BAM.alignment
BioAlignments.BAM.alignlength
BioAlignments.BAM.tempname
BioAlignments.BAM.templength
BioAlignments.BAM.sequence
BioAlignments.BAM.seqlength
BioAlignments.BAM.quality
BioAlignments.BAM.auxdata
```
