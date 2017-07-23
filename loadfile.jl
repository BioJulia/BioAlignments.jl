@everywhere begin
    using BioAlignments

    function compute_cov(reader, interval)
        range = interval.first:interval.last
        cov = zeros(Int, length(range))
        for record in eachoverlap(reader, interval)
            if !BAM.ismapped(record) || !BAM.isprimary(record)
                continue
            end
            aln = BAM.alignment(record)
            for i in 1:BAM.seqlength(record)
                j, op = seq2ref(aln, i)
                if ismatchop(op) && j in range
                    cov[j - first(range) + 1] += 1
                end
            end
        end
        return cov
    end

    function transcript_depth0(bamfile, intervals)
        reader = BAM.Reader(bamfile)
        ret = map(intervals) do interval
            return compute_cov(reader, interval)
        end
        close(reader)
        return ret
    end

    function transcript_depth1(bamfile, intervals)
        pmap(intervals) do interval
            reader = BAM.Reader(bamfile)
            cov = compute_cov(reader, interval)
            close(reader)
            return cov
        end
    end

    function transcript_depth2(bamfile, intervals, batchsize=10)
        reader = BAM.Reader(bamfile)
        ret = pmap(intervals, batch_size=batchsize) do interval
            return compute_cov(reader, interval)
        end
        close(reader)
        return ret
    end
end

#=
@everywhere function transcript_depth_dagger(bamfile, intervals)
    function transcript_depth_chunk(bamfile, intervals)
        open(BAM.Reader, bamfile, index=string(bamfile, ".bai")) do reader
            map(intervals) do interval
                range = interval.first:interval.last
                cov = zeros(Int, length(range))
                for record in eachoverlap(reader, interval)
                    if !BAM.ismapped(record) || !BAM.isprimary(record)
                        continue
                    end
                    aln = BAM.alignment(record)
                    for i in 1:BAM.seqlength(record)
                        j, op = seq2ref(aln, i)
                        if ismatchop(op) && j in range
                            cov[j - first(range) + 1] += 1
                        end
                    end
                end
                return cov
            end
        end
    end
    chunks = map(r->intervals[r], Dagger.split_range(1:endof(intervals), 4))
    vcat(pmap(chunks) do chunk
        transcript_depth_chunk(bamfile, chunk)
    end...)
end
=#
