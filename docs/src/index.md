BioAlignments.jl
================

Description
-----------

BioAlignments.jl provides alignment algorithms, data structures, and
I/O tools for SAM and BAM file formats.


Installation
------------

Install BioAlignments from the Julia REPL:

```julia
julia> Pkg.add("BioAlignments")
```

If you are interested in the cutting edge of the development, please check out
the master branch to try new features before release.


Usage
-----

BioAlignments.jl implements pairwise alignment algorithms. This is an example of
globally aligning two amino acid sequences under an affine-gap scoding model:
```julia
using BioSequences
using BioAlignments
seq1 = aa"EPVTSHPKAVSPTETKPTEKGQHLPVSAPPKITQSLKAEASKDIAKLTCAVESSALCA"
seq2 = aa"EPSHPKAVSPTETKPTPTEKVQHLPVSAPPKITQFLKAEASKEIAKLTCVVESSVLRA"
model = AffineGapScoreModel(BLOSUM62, gap_open=-10, gap_extend=-1)
align = pairalign(GlobalAlignment(), seq1, seq2, model)
println(align)
```

    BioAlignments.PairwiseAlignmentResult{Int64,BioSequences.BioSequence{BioSequences.AminoAcidAlphabet},BioSequences.BioSequence{BioSequences.AminoAcidAlphabet}}:
      score: 223
      seq:  1 EPVTSHPKAVSPTETKPT--EKGQHLPVSAPPKITQSLKAEASKDIAKLTCAVESSALCA 58
              ||  ||||||||||||||  || ||||||||||||| ||||||| |||||| |||| | |
      ref:  1 EP--SHPKAVSPTETKPTPTEKVQHLPVSAPPKITQFLKAEASKEIAKLTCVVESSVLRA 58

BioAlignments.jl also supports data formats for high-throughput sequencing
technologies. The BAM file, one of the most commonly used file format to store
aligned fragments, can be scanned as follows:
```julia
using BioAlignments
open(BAM.Reader, "data.bam") do reader
    for record in reader
        @show BAM.refname(record)
        @show BAM.position(record)
    end
end
```

    BAM.refname(record) = "CHROMOSOME_I"
    BAM.position(record) = 2
