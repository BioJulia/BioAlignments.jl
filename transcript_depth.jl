@everywhere begin
    using BioAlignments
    using GenomicFeatures

    # The main algorithm.
    function compute_depth(reader, interval)
        range = interval.first:interval.last
        depth = zeros(Int, length(range))
        for record in eachoverlap(reader, interval)
            if !BAM.ismapped(record) || !BAM.isprimary(record)
                continue
            end
            aln = BAM.alignment(record)
            for i in 1:BAM.seqlength(record)
                j, op = seq2ref(aln, i)
                if ismatchop(op) && j in range
                    @inbounds depth[j - first(range) + 1] += 1
                end
            end
        end
        return depth
    end
end

# Sequential computation.
function transcript_depth0(bamfile, intervals)
    reader = BAM.Reader(bamfile)
    return map(intervals) do interval
        return compute_depth(reader, interval)
    end
end

# Parallel computation using pmap (open BAM.Reader inside the closure).
function transcript_depth1(bamfile, intervals, batchsize)
    pmap(intervals, batch_size=batchsize) do interval
        reader = BAM.Reader(bamfile)
        return compute_depth(reader, interval)
    end
end

# Parallel computation using pmap (open BAM.Reader outside the closure).
function transcript_depth2(bamfile, intervals, batchsize)
    reader = BAM.Reader(bamfile)
    return pmap(intervals, batch_size=batchsize) do interval
        return compute_depth(reader, interval)
    end
end

bamfile = expanduser("./data/SRR1238088.sort.bam")
gff3file = expanduser("./data/TAIR10_GFF3_genes.gff")
intervals = collect(Interval, Iterators.filter(r->GFF3.seqid(r)=="Chr1" && GFF3.featuretype(r)=="gene", GFF3.Reader(open(gff3file))))

using DocOpt
args = docopt("Usage: main.jl [--batch_size=<n>] <function>")
batch_size = args["--batch_size"]
if batch_size == nothing
    batch_size = 30
else
    batch_size = parse(Int, batch_size)
end
f = eval(parse(args["<function>"]))
func = () -> f == transcript_depth0 ? f(bamfile, intervals) : f(bamfile, intervals, batch_size)

println(STDERR, sum(map(sum, func())))
for i in 1:3
    gc()
    println(@elapsed func())
end
