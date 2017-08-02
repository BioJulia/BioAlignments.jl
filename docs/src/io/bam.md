BAM formatted files
===================

Description
-----------

BAM is a binary counterpart of [SAM formatted files](@ref).

* Reader type: `BAM.Reader`
* Writer type: `BAM.Writer`
* Element type: `BAM.Record`

When writing data in the BAM file format, the underlying output stream needs to
be wrapped with a `BGZFStream` object provided from
[BGZFStreams.jl](https://github.com/BioJulia/BGZFStreams.jl).


Examples
--------

**TODO**
