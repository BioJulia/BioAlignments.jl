using GenomicFeatures

include("loadfile.jl")

bamfile = expanduser("./data/SRR1238088.sort.bam")
gff3file = expanduser("./data/TAIR10_GFF3_genes.gff")
chrom = "Chr1"
intervals = open(GFF3.Reader, gff3file) do reader
    intervals = Interval{GFF3.Record}[]
    for record in reader
        if GFF3.seqid(record) == chrom && GFF3.featuretype(record) == "mRNA"
            push!(intervals, Interval(record))
        end
    end
    return intervals
end
intervals = intervals[1:1000]
f = transcript_depth2
println(sum(map(sum, f(bamfile, intervals))))
out = STDOUT
println(out, "--- start benchmarking ---")
for batchsize in [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
    @show batchsize
    for i in 1:3
        gc()
        println(out, @elapsed f(bamfile, intervals, batchsize))
    end
end
println(out, "--- finish benchmarking ---")
