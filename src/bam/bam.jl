# BAM File Format
# ===============

module BAM

import BGZFStreams
import BioAlignments: BioAlignments, SAM
import GenomicFeatures: GenomicFeatures, Interval
import BioSequences
import BioCore: BioCore, isfilled

include("bai.jl")
include("auxdata.jl")
include("reader.jl")
include("record.jl")
include("writer.jl")
include("overlap.jl")

end
