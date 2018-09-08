__precompile__()

module BioAlignments

export
    # alignment operations
    Operation,
    OP_MATCH,
    OP_INSERT,
    OP_DELETE,
    OP_SKIP,
    OP_SOFT_CLIP,
    OP_HARD_CLIP,
    OP_PAD,
    OP_SEQ_MATCH,
    OP_SEQ_MISMATCH,
    OP_BACK,
    OP_START,

    # alignment type
    AlignmentAnchor,
    Alignment,
    AlignedSequence,
    seq2ref,
    ref2seq,
    ismatchop,
    isinsertop,
    isdeleteop,
    cigar,

    # substitution matrices
    AbstractSubstitutionMatrix,
    SubstitutionMatrix,
    DichotomousSubstitutionMatrix,
    EDNAFULL,
    PAM30,
    PAM70,
    PAM250,
    BLOSUM45,
    BLOSUM50,
    BLOSUM62,
    BLOSUM80,
    BLOSUM90,

    # alignment types
    GlobalAlignment,
    SemiGlobalAlignment,
    OverlapAlignment,
    LocalAlignment,
    EditDistance,
    HammingDistance,
    LevenshteinDistance,

    # alignment models
    AbstractScoreModel,
    AffineGapScoreModel,
    AbstractCostModel,
    CostModel,

    # pairwise alignment
    PairwiseAlignment,
    count_matches,
    count_mismatches,
    count_insertions,
    count_deletions,
    count_aligned,
    PairwiseAlignmentResult,
    pairalign,
    score,
    distance,
    alignment,
    hasalignment,

    SAM,
    BAM,
    header,
    eachoverlap,
    isfilled,
    seqname,
    hasseqname,
    leftposition,
    hasleftposition,
    rightposition,
    hasrightposition,
    sequence,
    hassequence

import BioCore: BioCore, distance, header, isfilled, seqname, hasseqname, sequence, hassequence, leftposition, rightposition, hasleftposition, hasrightposition
import BioSequences
import BioSymbols
import GenomicFeatures: eachoverlap
import IntervalTrees
using LinearAlgebra: diagind

include("operations.jl")
include("anchors.jl")
include("alignment.jl")
include("alignedseq.jl")

include("types.jl")
include("submat.jl")
include("models.jl")
include("pairwise/pairalign.jl")

include("sam/sam.jl")
include("bam/bam.jl")

end # module
