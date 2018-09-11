# SAM File Format
# ===============

module SAM

import Automa
import Automa.RegExp: @re_str
import BioAlignments
import BioCore.Exceptions: missingerror
import BioCore.RecordHelper: unsafe_parse_decimal
import BioCore: BioCore, isfilled
import BioSequences
import BufferedStreams
using Printf: @sprintf

include("flags.jl")
include("metainfo.jl")
include("record.jl")
include("header.jl")
include("reader.jl")
include("writer.jl")

end
