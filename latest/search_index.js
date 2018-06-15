var documenterSearchIndex = {"docs": [

{
    "location": "index.html#",
    "page": "Home",
    "title": "Home",
    "category": "page",
    "text": ""
},

{
    "location": "index.html#BioAlignments-1",
    "page": "Home",
    "title": "BioAlignments",
    "category": "section",
    "text": "(Image: Latest release) (Image: MIT license) (Image: Stable documentation) (Image: Latest documentation) (Image: Lifecycle) (Image: Chat on Discord)"
},

{
    "location": "index.html#Description-1",
    "page": "Home",
    "title": "Description",
    "category": "section",
    "text": "BioAlignments provides alignment algorithms, data structures, and I/O tools for SAM and BAM file formats."
},

{
    "location": "index.html#Installation-1",
    "page": "Home",
    "title": "Installation",
    "category": "section",
    "text": "Install BioAlignments from the Julia REPL:using Pkg\nadd(\"BioAlignments\")\n#Pkg.add(\"BioAlignments\") for julia prior to v0.7If you are interested in the cutting edge of the development, please check out the master branch to try new features before release."
},

{
    "location": "index.html#Testing-1",
    "page": "Home",
    "title": "Testing",
    "category": "section",
    "text": "BioAlignments is tested against julia 0.6 and current 0.7-dev on Linux, OS X, and Windows.Latest release Latest build status\n(Image: julia06) (Image: julia07) (Image: travis) (Image: appveyor) (Image: coverage)"
},

{
    "location": "index.html#Contributing-1",
    "page": "Home",
    "title": "Contributing",
    "category": "section",
    "text": "We appreciate contributions from users including reporting bugs, fixing issues, improving performance and adding new features.Take a look at the CONTRIBUTING file provided with every BioJulia package package for detailed contributor and maintainer guidelines."
},

{
    "location": "index.html#Financial-contributions-1",
    "page": "Home",
    "title": "Financial contributions",
    "category": "section",
    "text": "We also welcome financial contributions in full transparency on our open collective. Anyone can file an expense. If the expense makes sense for the development of the community, it will be \"merged\" in the ledger of our open collective by the core contributors and the person who filed the expense will be reimbursed."
},

{
    "location": "index.html#Backers-and-Sponsors-1",
    "page": "Home",
    "title": "Backers & Sponsors",
    "category": "section",
    "text": "Thank you to all our backers and sponsors!Love our work and community? Become a backer.(Image: backers)Does your company use BioJulia? Help keep BioJulia feature rich and healthy by sponsoring the project Your logo will show up here with a link to your website.(Image: ) (Image: ) (Image: ) (Image: ) (Image: ) (Image: ) (Image: ) (Image: ) (Image: ) (Image: )"
},

{
    "location": "index.html#Questions?-1",
    "page": "Home",
    "title": "Questions?",
    "category": "section",
    "text": "If you have a question about contributing or using BioJulia software, come on over and chat to us on Discord, or you can try the Bio category of the Julia discourse site."
},

{
    "location": "alignments.html#",
    "page": "Alignment representation",
    "title": "Alignment representation",
    "category": "page",
    "text": ""
},

{
    "location": "alignments.html#Alignment-representation-1",
    "page": "Alignment representation",
    "title": "Alignment representation",
    "category": "section",
    "text": "CurrentModule = BioAlignments\nDocTestSetup = quote\n    using BioSequences\n    using BioAlignments\nend"
},

{
    "location": "alignments.html#Overview-1",
    "page": "Alignment representation",
    "title": "Overview",
    "category": "section",
    "text": "Types related to alignment representation introduced in this chapter are indispensable concepts to use this package. Specifically, Alignment, AlignmentAnchor and Operation are the most fundamental types of this package to represent an alignment of two sequences."
},

{
    "location": "alignments.html#Representing-alignments-1",
    "page": "Alignment representation",
    "title": "Representing alignments",
    "category": "section",
    "text": "The Alignment type can represent a wide variety of global or local sequence alignments while facilitating efficient coordinate transformation.  Alignments are always relative to a possibly unspecified reference sequence and represent a series of edit operations performed on that reference to transform it to the query sequence. An edit operation is, for example, matching, insertion, or deletion.  All operations defined in BioAlignments.jl are described in the Alignment operations section.To represent an alignment we use a series of \"anchors\" stored in the AlignmentAnchor type. Anchors are form of run-length encoding alignment operations, but rather than store an operation along with a length, we store the end-point of that operation in both reference and query coordinates.struct AlignmentAnchor\n    seqpos::Int\n    refpos::Int\n    op::Operation\nendThe next figure shows a schematic representation of an alignment object.(Image: Alignment representation)Every alignment starts with a special OP_START operation which is used to give the position in the reference and query prior to the start of the alignment, or 0, if the alignment starts at position 1.For example, consider the following alignment:              0   4        9  12 15     19\n              |   |        |  |  |      |\n    query:     TGGC----ATCATTTAACG---CAAG\nreference: AGGGTGGCATTTATCAG---ACGTTTCGAGAC\n              |   |   |    |     |  |   |\n              4   8   12   17    20 23  27Using anchors we would represent this as the following series of anchors:[\n    AlignmentAnchor( 0,  4, OP_START),\n    AlignmentAnchor( 4,  8, OP_MATCH),\n    AlignmentAnchor( 4, 12, OP_DELETE),\n    AlignmentAnchor( 9, 17, OP_MATCH),\n    AlignmentAnchor(12, 17, OP_INSERT),\n    AlignmentAnchor(15, 20, OP_MATCH),\n    AlignmentAnchor(15, 23, OP_DELETE),\n    AlignmentAnchor(19, 27, OP_MATCH),\n]An Alignment object can be created from a series of anchors:julia> Alignment([\n           AlignmentAnchor(0,  4, OP_START),\n           AlignmentAnchor(4,  8, OP_MATCH),\n           AlignmentAnchor(4, 12, OP_DELETE)\n       ])\nBioAlignments.Alignment:\n  aligned range:\n    seq: 0-4\n    ref: 4-12\n  CIGAR string: 4M4D"
},

{
    "location": "alignments.html#Alignment-operations-1",
    "page": "Alignment representation",
    "title": "Alignment operations",
    "category": "section",
    "text": "Alignment operations follow closely from those used in the SAM/BAM format and are stored in the Operation bitstype.Operation Operation Type Description\nOP_MATCH match non-specific match\nOP_INSERT insert insertion into reference sequence\nOP_DELETE delete deletion from reference sequence\nOP_SKIP delete (typically long) deletion from the reference, e.g. due to RNA splicing\nOP_SOFT_CLIP insert sequence removed from the beginning or end of the query sequence but stored\nOP_HARD_CLIP insert sequence removed from the beginning or end of the query sequence and not stored\nOP_PAD special not currently supported, but present for SAM/BAM compatibility\nOP_SEQ_MATCH match match operation with matching sequence positions\nOP_SEQ_MISMATCH match match operation with mismatching sequence positions\nOP_BACK special not currently supported, but present for SAM/BAM compatibility\nOP_START special indicate the start of an alignment within the reference and query sequenceEach operation has its own one-letter representation, which is the same as those defined in the SAM file format.julia> convert(Operation, \'M\')  # Char => Operation\nOP_MATCH\n\njulia> convert(Char, OP_MATCH)  # Operation => Char\n\'M\': ASCII/Unicode U+004d (category Lu: Letter, uppercase)\n\njulia> ismatchop(OP_MATCH)\ntrue\nSee the Operations section in the references for more details."
},

{
    "location": "alignments.html#Aligned-sequences-1",
    "page": "Alignment representation",
    "title": "Aligned sequences",
    "category": "section",
    "text": "A sequence aligned to another sequence is represented by the AlignedSequence type, which is a pair of the aligned sequence and an Alignment object.The following example creates an aligned sequence object from a sequence and an alignment:julia> AlignedSequence(  # pass an Alignment object\n           dna\"ACGTAT\",\n           Alignment([\n               AlignmentAnchor(0, 0, OP_START),\n               AlignmentAnchor(3, 3, OP_MATCH),\n               AlignmentAnchor(6, 3, OP_INSERT)\n           ])\n       )\n···---\nACGTAT\n\njulia> AlignedSequence(  # or pass a vector of anchors\n           dna\"ACGTAT\",\n           [\n               AlignmentAnchor(0, 0, OP_START),\n               AlignmentAnchor(3, 3, OP_MATCH),\n               AlignmentAnchor(6, 3, OP_INSERT)\n           ]\n       )\n···---\nACGTAT\nIf you already have an aligned sequence with gap symbols, it can be converted to an AlignedSequence object by passing a reference sequence with it:julia> seq = dna\"ACGT--AAT--\"\n11nt DNA Sequence:\nACGT--AAT--\n\njulia> ref = dna\"ACGTTTAT-GG\"\n11nt DNA Sequence:\nACGTTTAT-GG\n\njulia> AlignedSequence(seq, ref)\n········-··\nACGT--AAT--\n"
},

{
    "location": "pairalign.html#",
    "page": "Pairwise alignment",
    "title": "Pairwise alignment",
    "category": "page",
    "text": ""
},

{
    "location": "pairalign.html#Pairwise-alignment-1",
    "page": "Pairwise alignment",
    "title": "Pairwise alignment",
    "category": "section",
    "text": "CurrentModule = BioAlignments\nDocTestSetup = quote\n    using BioSequences\n    using BioAlignments\nend"
},

{
    "location": "pairalign.html#Overview-1",
    "page": "Pairwise alignment",
    "title": "Overview",
    "category": "section",
    "text": "Pairwise alignment is a sequence alignment between two sequences. BioAlignments.jl implements several pairwise alignment algorithms that maximize alignment score or minimize alignment cost. If you are interested in handling the results of pairwise alignments, it is highly recommended to read the Alignment representation chapter in advance to get used to the alignment representation."
},

{
    "location": "pairalign.html#Alignment-types-and-scoring-models-1",
    "page": "Pairwise alignment",
    "title": "Alignment types and scoring models",
    "category": "section",
    "text": "A pairwise alignment problem has two factors: an alignment type and a score/cost model. The alignment type specifies the alignment range (e.g. global, local, etc.) and the score/cost model specifies parameters of the alignment operations.pairalign is a function to run alignment, which is exported from the BioAlignments module.  It takes an alignment type as its first argument, then two sequences to align, and finally a score model. Currently, the following four types of alignments are supported:GlobalAlignment: global-to-global alignment\nSemiGlobalAlignment: local-to-global alignment\nLocalAlignment: local-to-local alignment\nOverlapAlignment: end-free alignmentFor scoring model, AffineGapScoreModel is currently supported. It imposes an affine gap penalty for insertions and deletions: gap_open + k * gap_extend for a consecutive insertion/deletion of length k. The affine gap penalty is flexible enough to create a constant and linear scoring model. Setting gap_extend = 0 or gap_open = 0, they are equivalent to the constant or linear gap penalty, respectively. The first argument of AffineGapScoreModel can be a substitution matrix like AffineGapScoreModel(BLOSUM62, gap_open=-10, gap_extend=-1). For details on substitution matrices, see the Substitution matrix types section.Alignment type can also be a distance of two sequences:EditDistance\nLevenshteinDistance\nHammingDistanceIn this alignment, CostModel is used instead of AffineGapScoreModel to define cost of substitution, insertion, and deletion:julia> costmodel = CostModel(match=0, mismatch=1, insertion=1, deletion=1);\n\njulia> pairalign(EditDistance(), \"abcd\", \"adcde\", costmodel)\nBioAlignments.PairwiseAlignmentResult{Int64,String,String}:\n  distance: 2\n  seq: 1 abcd- 4\n         | ||\n  ref: 1 adcde 5\n"
},

{
    "location": "pairalign.html#Operations-on-pairwise-alignment-1",
    "page": "Pairwise alignment",
    "title": "Operations on pairwise alignment",
    "category": "section",
    "text": "The example below shows a use case of some operations:julia> s1 = dna\"CCTAGGAGGG\";\n\njulia> s2 = dna\"ACCTGGTATGATAGCG\";\n\njulia> scoremodel = AffineGapScoreModel(EDNAFULL, gap_open=-5, gap_extend=-1);\n\njulia> res = pairalign(GlobalAlignment(), s1, s2, scoremodel)  # run pairwise alignment\nBioAlignments.PairwiseAlignmentResult{Int64,BioSequences.BioSequence{BioSequences.DNAAlphabet{4}},BioSequences.BioSequence{BioSequences.DNAAlphabet{4}}}:\n  score: 13\n  seq:  0 -CCTAGG------AGGG 10\n           ||| ||      || |\n  ref:  1 ACCT-GGTATGATAGCG 16\n\n\njulia> score(res)  # get the achieved score of this alignment\n13\n\njulia> aln = alignment(res)\nBioAlignments.PairwiseAlignment{BioSequences.BioSequence{BioSequences.DNAAlphabet{4}},BioSequences.BioSequence{BioSequences.DNAAlphabet{4}}}:\n  seq:  0 -CCTAGG------AGGG 10\n           ||| ||      || |\n  ref:  1 ACCT-GGTATGATAGCG 16\n\n\njulia> count_matches(aln)\n8\n\njulia> count_mismatches(aln)\n1\n\njulia> count_insertions(aln)\n1\n\njulia> count_deletions(aln)\n7\n\njulia> count_aligned(aln)\n17\n\njulia> collect(aln)  # pairwise alignment is iterable\n17-element Array{Tuple{BioSymbols.DNA,BioSymbols.DNA},1}:\n (DNA_Gap, DNA_A)\n (DNA_C, DNA_C)\n (DNA_C, DNA_C)\n (DNA_T, DNA_T)\n (DNA_A, DNA_Gap)\n (DNA_G, DNA_G)\n (DNA_G, DNA_G)\n (DNA_Gap, DNA_T)\n (DNA_Gap, DNA_A)\n (DNA_Gap, DNA_T)\n (DNA_Gap, DNA_G)\n (DNA_Gap, DNA_A)\n (DNA_Gap, DNA_T)\n (DNA_A, DNA_A)\n (DNA_G, DNA_G)\n (DNA_G, DNA_C)\n (DNA_G, DNA_G)\n\njulia> DNASequence([x for (x, _) in aln])  # create aligned `s1` with gaps\n17nt DNA Sequence:\n-CCTAGG------AGGG\n\njulia> DNASequence([y for (_, y) in aln])  # create aligned `s2` with gaps\n17nt DNA Sequence:\nACCT-GGTATGATAGCG\n"
},

{
    "location": "pairalign.html#Substitution-matrix-types-1",
    "page": "Pairwise alignment",
    "title": "Substitution matrix types",
    "category": "section",
    "text": "A substitution matrix is a function of substitution score (or cost) from one symbol to other. Substitution value of submat from x to y can be obtained by writing submat[x,y]. In BioAlignments.jl, SubstitutionMatrix and DichotomousSubstitutionMatrix are two distinct types representing substitution matrices.SubstitutionMatrix is a general substitution matrix type that is a thin wrapper of regular matrix.Some common substitution matrices are provided. For DNA and RNA, EDNAFULL is defined:julia> EDNAFULL\nBioAlignments.SubstitutionMatrix{BioSymbols.DNA,Int64}:\n     A  C  M  G  R  S  V  T  W  Y  H  K  D  B  N\n  A  5 -4  1 -4  1 -4 -1 -4  1 -4 -1 -4 -1 -4 -2\n  C -4  5  1 -4 -4  1 -1 -4 -4  1 -1 -4 -4 -1 -2\n  M  1  1 -1 -4 -2 -2 -1 -4 -2 -2 -1 -4 -3 -3 -1\n  G -4 -4 -4  5  1  1 -1 -4 -4 -4 -4  1 -1 -1 -2\n  R  1 -4 -2  1 -1 -2 -1 -4 -2 -4 -3 -2 -1 -3 -1\n  S -4  1 -2  1 -2 -1 -1 -4 -4 -2 -3 -2 -3 -1 -1\n  V -1 -1 -1 -1 -1 -1 -1 -4 -3 -3 -2 -3 -2 -2 -1\n  T -4 -4 -4 -4 -4 -4 -4  5  1  1 -1  1 -1 -1 -2\n  W  1 -4 -2 -4 -2 -4 -3  1 -1 -2 -1 -2 -1 -3 -1\n  Y -4  1 -2 -4 -4 -2 -3  1 -2 -1 -1 -2 -3 -1 -1\n  H -1 -1 -1 -4 -3 -3 -2 -1 -1 -1 -1 -3 -2 -2 -1\n  K -4 -4 -4  1 -2 -2 -3  1 -2 -2 -3 -1 -1 -1 -1\n  D -1 -4 -3 -1 -1 -3 -2 -1 -1 -3 -2 -1 -1 -2 -1\n  B -4 -1 -3 -1 -3 -1 -2 -1 -3 -1 -2 -1 -2 -1 -1\n  N -2 -2 -1 -2 -1 -1 -1 -2 -1 -1 -1 -1 -1 -1 -1\n(underlined values are default ones)\nFor amino acids, PAM (Point Accepted Mutation) and BLOSUM (BLOcks SUbstitution Matrix) matrices are defined:julia> BLOSUM62\nBioAlignments.SubstitutionMatrix{BioSymbols.AminoAcid,Int64}:\n     A  R  N  D  C  Q  E  G  H  I  L  K  M  F  P  S  T  W  Y  V  O  U  B  J  Z  X  *\n  A  4 -1 -2 -2  0 -1 -1  0 -2 -1 -1 -1 -1 -2 -1  1  0 -3 -2  0  0̲  0̲ -2  0̲ -1  0 -4\n  R -1  5  0 -2 -3  1  0 -2  0 -3 -2  2 -1 -3 -2 -1 -1 -3 -2 -3  0̲  0̲ -1  0̲  0 -1 -4\n  N -2  0  6  1 -3  0  0  0  1 -3 -3  0 -2 -3 -2  1  0 -4 -2 -3  0̲  0̲  3  0̲  0 -1 -4\n  D -2 -2  1  6 -3  0  2 -1 -1 -3 -4 -1 -3 -3 -1  0 -1 -4 -3 -3  0̲  0̲  4  0̲  1 -1 -4\n  C  0 -3 -3 -3  9 -3 -4 -3 -3 -1 -1 -3 -1 -2 -3 -1 -1 -2 -2 -1  0̲  0̲ -3  0̲ -3 -2 -4\n  Q -1  1  0  0 -3  5  2 -2  0 -3 -2  1  0 -3 -1  0 -1 -2 -1 -2  0̲  0̲  0  0̲  3 -1 -4\n  E -1  0  0  2 -4  2  5 -2  0 -3 -3  1 -2 -3 -1  0 -1 -3 -2 -2  0̲  0̲  1  0̲  4 -1 -4\n  G  0 -2  0 -1 -3 -2 -2  6 -2 -4 -4 -2 -3 -3 -2  0 -2 -2 -3 -3  0̲  0̲ -1  0̲ -2 -1 -4\n  H -2  0  1 -1 -3  0  0 -2  8 -3 -3 -1 -2 -1 -2 -1 -2 -2  2 -3  0̲  0̲  0  0̲  0 -1 -4\n  I -1 -3 -3 -3 -1 -3 -3 -4 -3  4  2 -3  1  0 -3 -2 -1 -3 -1  3  0̲  0̲ -3  0̲ -3 -1 -4\n  L -1 -2 -3 -4 -1 -2 -3 -4 -3  2  4 -2  2  0 -3 -2 -1 -2 -1  1  0̲  0̲ -4  0̲ -3 -1 -4\n  K -1  2  0 -1 -3  1  1 -2 -1 -3 -2  5 -1 -3 -1  0 -1 -3 -2 -2  0̲  0̲  0  0̲  1 -1 -4\n  M -1 -1 -2 -3 -1  0 -2 -3 -2  1  2 -1  5  0 -2 -1 -1 -1 -1  1  0̲  0̲ -3  0̲ -1 -1 -4\n  F -2 -3 -3 -3 -2 -3 -3 -3 -1  0  0 -3  0  6 -4 -2 -2  1  3 -1  0̲  0̲ -3  0̲ -3 -1 -4\n  P -1 -2 -2 -1 -3 -1 -1 -2 -2 -3 -3 -1 -2 -4  7 -1 -1 -4 -3 -2  0̲  0̲ -2  0̲ -1 -2 -4\n  S  1 -1  1  0 -1  0  0  0 -1 -2 -2  0 -1 -2 -1  4  1 -3 -2 -2  0̲  0̲  0  0̲  0  0 -4\n  T  0 -1  0 -1 -1 -1 -1 -2 -2 -1 -1 -1 -1 -2 -1  1  5 -2 -2  0  0̲  0̲ -1  0̲ -1  0 -4\n  W -3 -3 -4 -4 -2 -2 -3 -2 -2 -3 -2 -3 -1  1 -4 -3 -2 11  2 -3  0̲  0̲ -4  0̲ -3 -2 -4\n  Y -2 -2 -2 -3 -2 -1 -2 -3  2 -1 -1 -2 -1  3 -3 -2 -2  2  7 -1  0̲  0̲ -3  0̲ -2 -1 -4\n  V  0 -3 -3 -3 -1 -2 -2 -3 -3  3  1 -2  1 -1 -2 -2  0 -3 -1  4  0̲  0̲ -3  0̲ -2 -1 -4\n  O  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲\n  U  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲\n  B -2 -1  3  4 -3  0  1 -1  0 -3 -4  0 -3 -3 -2  0 -1 -4 -3 -3  0̲  0̲  4  0̲  1 -1 -4\n  J  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲  0̲\n  Z -1  0  0  1 -3  3  4 -2  0 -3 -3  1 -1 -3 -1  0 -1 -3 -2 -2  0̲  0̲  1  0̲  4 -1 -4\n  X  0 -1 -1 -1 -2 -1 -1 -1 -1 -1 -1 -1 -1 -1 -2  0  0 -2 -1 -1  0̲  0̲ -1  0̲ -1 -1 -4\n  * -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4 -4  0̲  0̲ -4  0̲ -4 -4  1\n(underlined values are default ones)\nMatrix Constants\nPAM PAM30, PAM70, PAM250\nBLOSUM BLOSUM45, BLOSUM50, BLOSUM62, BLOSUM80, BLOSUM90These matrices are downloaded from: ftp://ftp.ncbi.nih.gov/blast/matrices/.SubstitutionMatrix can be modified like a regular matrix:julia> mysubmat = copy(BLOSUM62);  # create a copy\n\njulia> mysubmat[AA_A,AA_R]  # score of AA_A => AA_R substitution is -1\n-1\n\njulia> mysubmat[AA_A,AA_R] = -3  # set the score to -3\n-3\n\njulia> mysubmat[AA_A,AA_R]  # the score is modified\n-3\nMake sure to create a copy of the original matrix when you create a matrix from a predefined matrix. In the above case, BLOSUM62 is shared in the whole program and modification on it will affect any result that uses BLOSUM62.DichotomousSubstitutionMatrix is a specialized matrix for matching or mismatching substitution.  This is a preferable choice when performance is more important than flexibility because looking up score is faster than SubstitutionMatrix.julia> submat = DichotomousSubstitutionMatrix(1, -1)\nBioAlignments.DichotomousSubstitutionMatrix{Int64}:\n     match =  1\n  mismatch = -1\n\njulia> submat[\'A\',\'A\']  # match\n1\n\njulia> submat[\'A\',\'B\']  # mismatch\n-1\n"
},

{
    "location": "hts-files.html#",
    "page": "SAM and BAM",
    "title": "SAM and BAM",
    "category": "page",
    "text": ""
},

{
    "location": "hts-files.html#SAM-and-BAM-1",
    "page": "SAM and BAM",
    "title": "SAM and BAM",
    "category": "section",
    "text": ""
},

{
    "location": "hts-files.html#Introduction-1",
    "page": "SAM and BAM",
    "title": "Introduction",
    "category": "section",
    "text": "High-throughput sequencing (HTS) technologies generate a large amount of data in the form of a large number of nucleotide sequencing reads. One of the most common tasks in bioinformatics is to align these reads against known reference genomes, chromosomes, or contigs. BioAlignments provides several data formats commonly used for this kind of task.BioAlignments offers high-performance tools for SAM and BAM file formats, which are the most popular file formats.If you have questions about the SAM and BAM formats or any of the terminology used when discussing these formats, see the published [specification][samtools-spec], which is maintained by the [samtools group][samtools].A very very simple SAM file looks like the following:@HD VN:1.6 SO:coordinate\n@SQ SN:ref LN:45\nr001   99 ref  7 30 8M2I4M1D3M = 37  39 TTAGATAAAGGATACTG *\nr002    0 ref  9 30 3S6M1P1I4M *  0   0 AAAAGATAAGGATA    *\nr003    0 ref  9 30 5S6M       *  0   0 GCCTAAGCTAA       * SA:Z:ref,29,-,6H5M,17,0;\nr004    0 ref 16 30 6M14N5M    *  0   0 ATAGCTTCAGC       *\nr003 2064 ref 29 17 6H5M       *  0   0 TAGGC             * SA:Z:ref,9,+,5S6M,30,1;\nr001  147 ref 37 30 9M         =  7 -39 CAGCGGCAT         * NM:i:1Where the first two lines are part of the \"header\", and the following lines are \"records\". Each record describes how a read aligns to some reference sequence. Sometimes one record describes one read, but there are other cases like chimeric reads and split alignments, where multiple records apply to one read. In the example above, r003 is a chimeric read, and r004 is a split alignment, and r001 are mate pair reads. Again, we refer you to the official [specification][samtools-spec] for more details.A BAM file stores this same information but in a binary and compressible format that does not make for pretty printing here!"
},

{
    "location": "hts-files.html#Reading-SAM-and-BAM-files-1",
    "page": "SAM and BAM",
    "title": "Reading SAM and BAM files",
    "category": "section",
    "text": "A typical script iterating over all records in a file looks like below:using BioAlignments\n\n# Open a BAM file.\nreader = open(BAM.Reader, \"data.bam\")\n\n# Iterate over BAM records.\nfor record in reader\n    # `record` is a BAM.Record object.\n    if BAM.ismapped(record)\n        # Print the mapped position.\n        println(BAM.refname(record), \':\', BAM.position(record))\n    end\nend\n\n# Close the BAM file.\nclose(reader)The size of a BAM file is often extremely large. The iterator interface demonstrated above allocates an object for each record and that may be a bottleneck of reading data from a BAM file. In-place reading reuses a pre-allocated object for every record and less memory allocation happens in reading:reader = open(BAM.Reader, \"data.bam\")\nrecord = BAM.Record()\nwhile !eof(reader)\n    read!(reader, record)\n    # do something\nend"
},

{
    "location": "hts-files.html#SAM-and-BAM-Headers-1",
    "page": "SAM and BAM",
    "title": "SAM and BAM Headers",
    "category": "section",
    "text": "Both SAM.Reader and BAM.Reader implement the header function, which returns a SAM.Header object. To extract certain information out of the headers, you can use the find method on the header to extract information according to SAM/BAM tag. Again we refer you to the [specification][samtools-spec] for full details of all the different tags that can occur in headers, and what they mean.Below is an example of extracting all the info about the reference sequences from the BAM header. In SAM/BAM, any description of a reference sequence is stored in the header, under a tag denoted SQ (think reference SeQuence!).julia> reader = open(SAM.Reader, \"data.sam\");\n\njulia> find(header(reader), \"SQ\")\n7-element Array{Bio.Align.SAM.MetaInfo,1}:\n Bio.Align.SAM.MetaInfo:\n    tag: SQ\n  value: SN=Chr1 LN=30427671\n Bio.Align.SAM.MetaInfo:\n    tag: SQ\n  value: SN=Chr2 LN=19698289\n Bio.Align.SAM.MetaInfo:\n    tag: SQ\n  value: SN=Chr3 LN=23459830\n Bio.Align.SAM.MetaInfo:\n    tag: SQ\n  value: SN=Chr4 LN=18585056\n Bio.Align.SAM.MetaInfo:\n    tag: SQ\n  value: SN=Chr5 LN=26975502\n Bio.Align.SAM.MetaInfo:\n    tag: SQ\n  value: SN=chloroplast LN=154478\n Bio.Align.SAM.MetaInfo:\n    tag: SQ\n  value: SN=mitochondria LN=366924\nIn the above we can see there were 7 sequences in the reference: 5 chromosomes, one chloroplast sequence, and one mitochondrial sequence."
},

{
    "location": "hts-files.html#SAM-and-BAM-Records-1",
    "page": "SAM and BAM",
    "title": "SAM and BAM Records",
    "category": "section",
    "text": "BioAlignments supports the following accessors for SAM.Record types.BioAlignments.SAM.flag\nBioAlignments.SAM.ismapped\nBioAlignments.SAM.isprimary\nBioAlignments.SAM.refname\nBioAlignments.SAM.position\nBioAlignments.SAM.rightposition\nBioAlignments.SAM.isnextmapped\nBioAlignments.SAM.nextrefname\nBioAlignments.SAM.nextposition\nBioAlignments.SAM.mappingquality\nBioAlignments.SAM.cigar\nBioAlignments.SAM.alignment\nBioAlignments.SAM.alignlength\nBioAlignments.SAM.tempname\nBioAlignments.SAM.templength\nBioAlignments.SAM.sequence\nBioAlignments.SAM.seqlength\nBioAlignments.SAM.quality\nBioAlignments.SAM.auxdataBioAlignments supports the following accessors for BAM.Record types.BioAlignments.BAM.flag\nBioAlignments.BAM.ismapped\nBioAlignments.BAM.isprimary\nBioAlignments.BAM.refid\nBioAlignments.BAM.refname\nBioAlignments.BAM.reflen\nBioAlignments.BAM.position\nBioAlignments.BAM.rightposition\nBioAlignments.BAM.isnextmapped\nBioAlignments.BAM.nextrefid\nBioAlignments.BAM.nextrefname\nBioAlignments.BAM.nextposition\nBioAlignments.BAM.mappingquality\nBioAlignments.BAM.cigar\nBioAlignments.BAM.alignment\nBioAlignments.BAM.alignlength\nBioAlignments.BAM.tempname\nBioAlignments.BAM.templength\nBioAlignments.BAM.sequence\nBioAlignments.BAM.seqlength\nBioAlignments.BAM.quality\nBioAlignments.BAM.auxdata"
},

{
    "location": "hts-files.html#Accessing-auxiliary-data-1",
    "page": "SAM and BAM",
    "title": "Accessing auxiliary data",
    "category": "section",
    "text": "SAM and BAM records support the storing of optional data fields associated with tags.Tagged auxiliary data follows a format of TAG:TYPE:VALUE. TAG is a two-letter string, and each tag can only appear once per record. TYPE is a single case-sensetive letter which defined the format of VALUE.Type Description\n\'A\' Printable character\n\'i\' Signed integer\n\'f\' Single-precision floating number\n\'Z\' Printable string, including space\n\'H\' Byte array in Hex format\n\'B\' Integer of numeric arrayFor more information about these tags and their types we refer you to the [SAM/BAM specification][samtools-spec] and the additional [optional fields specification][samtags] document.There are some tags that are reserved, predefined standard tags, for specific uses.To access optional fields stored in tags, you use getindex indexing syntax on the record object. Note that accessing optional tag fields will result in type instability in Julia. This is because the type of the optional data is not known until run-time, as the tag is being read. This can have a significant impact on performance. To limit this, if the user knows the type of a value in advance, specifying it as a type annotation will alleviate the problem:Below is an example of looping over records in a bam file and using indexing syntax to get the data stored in the \"NM\" tag. Note the UInt8 type assertion to alleviate type instability.for record in open(BAM.Reader, \"data.bam\")\n    nm = record[\"NM\"]::UInt8\n    # do something\nend"
},

{
    "location": "hts-files.html#Getting-records-in-a-range-1",
    "page": "SAM and BAM",
    "title": "Getting records in a range",
    "category": "section",
    "text": "BioAlignments supports the BAI index to fetch records in a specific range from a BAM file.  [Samtools][samtools] provides index subcommand to create an index file (.bai) from a sorted BAM file.$ samtools index -b SRR1238088.sort.bam\n$ ls SRR1238088.sort.bam*\nSRR1238088.sort.bam     SRR1238088.sort.bam.baieachoverlap(reader, chrom, range) returns an iterator of BAM records overlapping the query interval:reader = open(BAM.Reader, \"SRR1238088.sort.bam\", index=\"SRR1238088.sort.bam.bai\")\nfor record in eachoverlap(reader, \"Chr2\", 10000:11000)\n    # `record` is a BAM.Record object\n    # ...\nend\nclose(reader)"
},

{
    "location": "hts-files.html#Getting-records-overlapping-genomic-features-1",
    "page": "SAM and BAM",
    "title": "Getting records overlapping genomic features",
    "category": "section",
    "text": "eachoverlap also accepts the Interval type defined in GenomicFeatures.jl.This allows you to do things like first read in the genomic features from a GFF3 file, and then for each feature, iterate over all the BAM records that overlap with that feature.# Load GFF3 module.\nusing GenomicFeatures\nusing BioAlignments\n\n# Load genomic features from a GFF3 file.\nfeatures = open(collect, GFF3.Reader, \"TAIR10_GFF3_genes.gff\")\n\n# Keep mRNA features.\nfilter!(x -> GFF3.featuretype(x) == \"mRNA\", features)\n\n# Open a BAM file and iterate over records overlapping mRNA transcripts.\nreader = open(BAM.Reader, \"SRR1238088.sort.bam\", index = \"SRR1238088.sort.bam.bai\")\nfor feature in features\n    for record in eachoverlap(reader, feature)\n        # `record` overlaps `feature`.\n        # ...\n    end\nend\nclose(reader)"
},

{
    "location": "hts-files.html#Writing-files-1",
    "page": "SAM and BAM",
    "title": "Writing files",
    "category": "section",
    "text": "In order to write a BAM or SAM file, you must first create a SAM.Header.A SAM.Header is constructed from a vector of SAM.MetaInfo objects.For example, to create the following simple header:@HD VN:1.6 SO:coordinate\n@SQ SN:ref LN:45julia> a = SAM.MetaInfo(\"HD\", [\"VN\" => 1.6, \"SO\" => \"coordinate\"])\nBioAlignments.SAM.MetaInfo:\n    tag: HD\n  value: VN=1.6 SO=coordinate\n\njulia> b = SAM.MetaInfo(\"SQ\", [\"SN\" => \"ref\", \"LN\" => 45])\nBioAlignments.SAM.MetaInfo:\n    tag: SQ\n  value: SN=ref LN=45\n\njulia> h = SAM.Header([a, b])\nBioAlignments.SAM.Header(BioAlignments.SAM.MetaInfo[BioAlignments.SAM.MetaInfo:\n    tag: HD\n  value: VN=1.6 SO=coordinate, BioAlignments.SAM.MetaInfo:\n    tag: SQ\n  value: SN=ref LN=45])\nThen to create the writer for a SAM file, construct a SAM.Writer using the header and an IO type:julia> samw = SAM.Writer(open(\"my-data.sam\", \"w\"), h)\nBioAlignments.SAM.Writer(IOStream(<file my-data.sam>))\nTo make a BAM Writer is slightly different, as you need to use a specific stream type from the BGZFStreams package:julia> using BGZFStreams\n\njulia> bamw = BAM.Writer(BGZFStream(open(\"my-data.bam\", \"w\"), \"w\"))\nBioAlignments.BAM.Writer(BGZFStreams.BGZFStream{IOStream}(<mode=write>))\nOnce you have a BAM or SAM writer, you can use the write method to write BAM.Records or SAM.Records to file:julia> write(bamw, rec) # Here rec is a `BAM.Record`\n330780[samtools]:      https://samtools.github.io/ [samtools-spec]: https://samtools.github.io/hts-specs/SAMv1.pdf [samtags]:       https://samtools.github.io/hts-specs/SAMtags.pdf [bgzfstreams]:   https://github.com/BioJulia/BGZFStreams.jl"
},

{
    "location": "references.html#",
    "page": "API Reference",
    "title": "API Reference",
    "category": "page",
    "text": ""
},

{
    "location": "references.html#API-Reference-1",
    "page": "API Reference",
    "title": "API Reference",
    "category": "section",
    "text": ""
},

{
    "location": "references.html#BioAlignments.Operation",
    "page": "API Reference",
    "title": "BioAlignments.Operation",
    "category": "type",
    "text": "Alignment operation.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.OP_MATCH",
    "page": "API Reference",
    "title": "BioAlignments.OP_MATCH",
    "category": "constant",
    "text": "\'M\': non-specific match\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.OP_INSERT",
    "page": "API Reference",
    "title": "BioAlignments.OP_INSERT",
    "category": "constant",
    "text": "\'I\': insertion into reference sequence\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.OP_DELETE",
    "page": "API Reference",
    "title": "BioAlignments.OP_DELETE",
    "category": "constant",
    "text": "\'D\': deletion from reference sequence\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.OP_SKIP",
    "page": "API Reference",
    "title": "BioAlignments.OP_SKIP",
    "category": "constant",
    "text": "\'N\': (typically long) deletion from the reference, e.g. due to RNA splicing\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.OP_SOFT_CLIP",
    "page": "API Reference",
    "title": "BioAlignments.OP_SOFT_CLIP",
    "category": "constant",
    "text": "\'S\': sequence removed from the beginning or end of the query sequence but stored\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.OP_HARD_CLIP",
    "page": "API Reference",
    "title": "BioAlignments.OP_HARD_CLIP",
    "category": "constant",
    "text": "\'H\': sequence removed from the beginning or end of the query sequence and not stored\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.OP_PAD",
    "page": "API Reference",
    "title": "BioAlignments.OP_PAD",
    "category": "constant",
    "text": "\'P\': not currently supported, but present for SAM/BAM compatibility\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.OP_SEQ_MATCH",
    "page": "API Reference",
    "title": "BioAlignments.OP_SEQ_MATCH",
    "category": "constant",
    "text": "\'=\': match operation with matching sequence positions\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.OP_SEQ_MISMATCH",
    "page": "API Reference",
    "title": "BioAlignments.OP_SEQ_MISMATCH",
    "category": "constant",
    "text": "\'X\': match operation with mismatching sequence positions\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.OP_BACK",
    "page": "API Reference",
    "title": "BioAlignments.OP_BACK",
    "category": "constant",
    "text": "\'B\': not currently supported, but present for SAM/BAM compatibility\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.OP_START",
    "page": "API Reference",
    "title": "BioAlignments.OP_START",
    "category": "constant",
    "text": "\'0\': indicate the start of an alignment within the reference and query sequence\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.ismatchop",
    "page": "API Reference",
    "title": "BioAlignments.ismatchop",
    "category": "function",
    "text": "ismatchop(op::Operation)\n\nTest if op is a match operation (i.e. op ∈ (OP_MATCH, OP_SEQ_MATCH, OP_SEQ_MISMATCH)).\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.isinsertop",
    "page": "API Reference",
    "title": "BioAlignments.isinsertop",
    "category": "function",
    "text": "isinsertop(op::Operation)\n\nTest if op is a insertion operation (i.e. op ∈ (OP_INSERT, OP_SOFT_CLIP, OP_HARD_CLIP)).\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.isdeleteop",
    "page": "API Reference",
    "title": "BioAlignments.isdeleteop",
    "category": "function",
    "text": "isdeleteop(op::Operation)\n\nTest if op is a deletion operation (i.e. op ∈ (OP_DELETE, OP_SKIP)).\n\n\n\n"
},

{
    "location": "references.html#Operations-1",
    "page": "API Reference",
    "title": "Operations",
    "category": "section",
    "text": "Operation\nOP_MATCH\nOP_INSERT\nOP_DELETE\nOP_SKIP\nOP_SOFT_CLIP\nOP_HARD_CLIP\nOP_PAD\nOP_SEQ_MATCH\nOP_SEQ_MISMATCH\nOP_BACK\nOP_START\nismatchop\nisinsertop\nisdeleteop"
},

{
    "location": "references.html#BioAlignments.AlignmentAnchor",
    "page": "API Reference",
    "title": "BioAlignments.AlignmentAnchor",
    "category": "type",
    "text": "Alignment operation with anchoring positions.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.Alignment",
    "page": "API Reference",
    "title": "BioAlignments.Alignment",
    "category": "type",
    "text": "Alignment of two sequences.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.Alignment-Tuple{Array{BioAlignments.AlignmentAnchor,1},Bool}",
    "page": "API Reference",
    "title": "BioAlignments.Alignment",
    "category": "method",
    "text": "Alignment(anchors::Vector{AlignmentAnchor}, check=true)\n\nCreate an alignment object from a sequence of alignment anchors.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.Alignment-Tuple{AbstractString,Int64,Int64}",
    "page": "API Reference",
    "title": "BioAlignments.Alignment",
    "category": "method",
    "text": "Alignment(cigar::AbstractString, seqpos=1, refpos=1)\n\nMake an alignment object from a CIGAR string.\n\nseqpos and refpos specify the starting positions of two sequences.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.seq2ref-Tuple{BioAlignments.Alignment,Integer}",
    "page": "API Reference",
    "title": "BioAlignments.seq2ref",
    "category": "method",
    "text": "seq2ref(aln::Alignment, i::Integer)::Tuple{Int,Operation}\n\nMap a position i from sequence to reference.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.ref2seq-Tuple{BioAlignments.Alignment,Integer}",
    "page": "API Reference",
    "title": "BioAlignments.ref2seq",
    "category": "method",
    "text": "ref2seq(aln::Alignment, i::Integer)::Tuple{Int,Operation}\n\nMap a position i from reference to sequence.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.cigar-Tuple{BioAlignments.Alignment}",
    "page": "API Reference",
    "title": "BioAlignments.cigar",
    "category": "method",
    "text": "cigar(aln::Alignment)\n\nMake a CIGAR string encoding of aln.\n\nThis is not entirely lossless as it discards the alignments start positions.\n\n\n\n"
},

{
    "location": "references.html#Alignments-1",
    "page": "API Reference",
    "title": "Alignments",
    "category": "section",
    "text": "AlignmentAnchor\nAlignment\nAlignment(::Vector{AlignmentAnchor}, ::Bool)\nAlignment(::AbstractString, ::Int, ::Int)\nseq2ref(::Alignment, ::Integer)\nref2seq(::Alignment, ::Integer)\ncigar(::Alignment)"
},

{
    "location": "references.html#BioAlignments.AbstractSubstitutionMatrix",
    "page": "API Reference",
    "title": "BioAlignments.AbstractSubstitutionMatrix",
    "category": "type",
    "text": "Supertype of substitution matrix.\n\nThe required method:\n\nBase.getindex(submat, x, y): substitution score/cost from x to y\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SubstitutionMatrix",
    "page": "API Reference",
    "title": "BioAlignments.SubstitutionMatrix",
    "category": "type",
    "text": "Substitution matrix.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.DichotomousSubstitutionMatrix",
    "page": "API Reference",
    "title": "BioAlignments.DichotomousSubstitutionMatrix",
    "category": "type",
    "text": "Dichotomous substitution matrix.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.EDNAFULL",
    "page": "API Reference",
    "title": "BioAlignments.EDNAFULL",
    "category": "constant",
    "text": "EDNAFULL (or NUC4.4) substitution matrix\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.PAM30",
    "page": "API Reference",
    "title": "BioAlignments.PAM30",
    "category": "constant",
    "text": "PAM30 substitution matrix\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.PAM70",
    "page": "API Reference",
    "title": "BioAlignments.PAM70",
    "category": "constant",
    "text": "PAM70 substitution matrix\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.PAM250",
    "page": "API Reference",
    "title": "BioAlignments.PAM250",
    "category": "constant",
    "text": "PAM250 substitution matrix\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BLOSUM45",
    "page": "API Reference",
    "title": "BioAlignments.BLOSUM45",
    "category": "constant",
    "text": "BLOSUM45 substitution matrix\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BLOSUM50",
    "page": "API Reference",
    "title": "BioAlignments.BLOSUM50",
    "category": "constant",
    "text": "BLOSUM50 substitution matrix\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BLOSUM62",
    "page": "API Reference",
    "title": "BioAlignments.BLOSUM62",
    "category": "constant",
    "text": "BLOSUM62 substitution matrix\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BLOSUM80",
    "page": "API Reference",
    "title": "BioAlignments.BLOSUM80",
    "category": "constant",
    "text": "BLOSUM80 substitution matrix\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BLOSUM90",
    "page": "API Reference",
    "title": "BioAlignments.BLOSUM90",
    "category": "constant",
    "text": "BLOSUM90 substitution matrix\n\n\n\n"
},

{
    "location": "references.html#Substitution-matrices-1",
    "page": "API Reference",
    "title": "Substitution matrices",
    "category": "section",
    "text": "AbstractSubstitutionMatrix\nSubstitutionMatrix\nDichotomousSubstitutionMatrix\nEDNAFULL\nPAM30\nPAM70\nPAM250\nBLOSUM45\nBLOSUM50\nBLOSUM62\nBLOSUM80\nBLOSUM90"
},

{
    "location": "references.html#BioAlignments.PairwiseAlignment",
    "page": "API Reference",
    "title": "BioAlignments.PairwiseAlignment",
    "category": "type",
    "text": "Pairwise alignment\n\n\n\n"
},

{
    "location": "references.html#Base.count-Tuple{BioAlignments.PairwiseAlignment,BioAlignments.Operation}",
    "page": "API Reference",
    "title": "Base.count",
    "category": "method",
    "text": "count(aln::PairwiseAlignment, target::Operation)\n\nCount the number of positions where the target operation is applied.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.count_matches",
    "page": "API Reference",
    "title": "BioAlignments.count_matches",
    "category": "function",
    "text": "count_matches(aln)\n\nCount the number of matching positions.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.count_mismatches",
    "page": "API Reference",
    "title": "BioAlignments.count_mismatches",
    "category": "function",
    "text": "count_mismatches(aln)\n\nCount the number of mismatching positions.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.count_insertions",
    "page": "API Reference",
    "title": "BioAlignments.count_insertions",
    "category": "function",
    "text": "count_insertions(aln)\n\nCount the number of inserting positions.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.count_deletions",
    "page": "API Reference",
    "title": "BioAlignments.count_deletions",
    "category": "function",
    "text": "count_deletions(aln)\n\nCount the number of deleting positions.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.count_aligned",
    "page": "API Reference",
    "title": "BioAlignments.count_aligned",
    "category": "function",
    "text": "count_aligned(aln)\n\nCount the number of aligned positions.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.GlobalAlignment",
    "page": "API Reference",
    "title": "BioAlignments.GlobalAlignment",
    "category": "type",
    "text": "Global-global alignment with end gap penalties.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SemiGlobalAlignment",
    "page": "API Reference",
    "title": "BioAlignments.SemiGlobalAlignment",
    "category": "type",
    "text": "Global-local alignment.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.OverlapAlignment",
    "page": "API Reference",
    "title": "BioAlignments.OverlapAlignment",
    "category": "type",
    "text": "Global-global alignment without end gap penalties.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.LocalAlignment",
    "page": "API Reference",
    "title": "BioAlignments.LocalAlignment",
    "category": "type",
    "text": "Local-local alignment.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.EditDistance",
    "page": "API Reference",
    "title": "BioAlignments.EditDistance",
    "category": "type",
    "text": "Edit distance.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.HammingDistance",
    "page": "API Reference",
    "title": "BioAlignments.HammingDistance",
    "category": "type",
    "text": "Hamming distance.\n\nA special case of EditDistance with the costs of insertion and deletion are infinitely large.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.LevenshteinDistance",
    "page": "API Reference",
    "title": "BioAlignments.LevenshteinDistance",
    "category": "type",
    "text": "Levenshtein distance.\n\nA special case of EditDistance with the costs of mismatch, insertion, and deletion are 1.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.AbstractScoreModel",
    "page": "API Reference",
    "title": "BioAlignments.AbstractScoreModel",
    "category": "type",
    "text": "Supertype of score model.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.AffineGapScoreModel",
    "page": "API Reference",
    "title": "BioAlignments.AffineGapScoreModel",
    "category": "type",
    "text": "AffineGapScoreModel(submat, gap_open, gap_extend)\nAffineGapScoreModel(submat, gap_open=, gap_extend=)\nAffineGapScoreModel(match=, mismatch=, gap_open=, gap_extend=)\n\nAffine gap scoring model.\n\nThis creates an affine gap scroing model object for alignment from a substitution matrix (submat), a gap opening score (gap_open), and a gap extending score (gap_extend). A consecutive gap of length k has a score of gap_open + gap_extend * k. Note that both of the gap scores should be non-positive.  As a shorthand of creating a dichotomous substitution matrix, you can write as, for example, AffineGapScoreModel(match=5, mismatch=-3, gap_open=-2, gap_extend=-1).\n\nExample\n\nusing BioSequences\nusing BioAlignments\n\n# create an affine gap scoring model from a predefined substitution\n# matrix and gap opening/extending scores.\naffinegap = AffineGapScoreModel(BLOSUM62, gap_open=-10, gap_extend=-1)\n\n# run global alignment between two amino acid sequenecs\npairalign(GlobalAlignment(), aa\"IDGAAGQQL\", aa\"IDGATGQL\", affinegap)\n\nSee also: SubstitutionMatrix, pairalign, CostModel\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.AbstractCostModel",
    "page": "API Reference",
    "title": "BioAlignments.AbstractCostModel",
    "category": "type",
    "text": "Supertype of cost model.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.CostModel",
    "page": "API Reference",
    "title": "BioAlignments.CostModel",
    "category": "type",
    "text": "CostModel(submat, insertion, deletion)\nCostModel(submat, insertion=, deletion=)\nCostModel(match=, mismatch=, insertion=, deletion=)\n\nCost model.\n\nThis creates a cost model object for alignment from substitution matrix (submat), an insertion cost (insertion), and a deletion cost (deletion). Note that both of the insertion and deletion costs should be non-negative.  As a shorthand of creating a dichotomous substitution matrix, you can write as, for example, CostModel(match=0, mismatch=1, insertion=2, deletion=2).\n\nExample\n\nusing BioAlignments\n\n# create a cost model from a substitution matrix and indel costs\ncost = CostModel(ones(128, 128) - eye(128), insertion=.5, deletion=.5)\n\n# run global alignment to minimize edit distance\npairalign(EditDistance(), \"intension\", \"execution\", cost)\n\nSee also: SubstitutionMatrix, pairalign, AffineGapScoreModel\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.PairwiseAlignmentResult",
    "page": "API Reference",
    "title": "BioAlignments.PairwiseAlignmentResult",
    "category": "type",
    "text": "Result of pairwise alignment\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.pairalign",
    "page": "API Reference",
    "title": "BioAlignments.pairalign",
    "category": "function",
    "text": "pairalign(type, seq, ref, model, [options...])\n\nRun pairwise alignment between two sequences: seq and ref.\n\nAvailable types are:\n\nGlobalAlignment()\nLocalAlignment()\nSemiGlobalAlignment()\nOverlapAlignment()\nEditDistance()\nLevenshteinDistance()\nHammingDistance()\n\nGlobalAlignment, LocalAlignment, SemiGlobalAlignment, and OverlapAlignment are problem that maximizes alignment score between two sequences.  Therefore, model should be an instance of AbstractScoreModel (e.g. AffineGapScoreModel).\n\nEditDistance, LevenshteinDistance, and HammingDistance are problem that minimizes alignment cost between two sequences.  As for EditDistance, model should be an instance of AbstractCostModel (e.g. CostModel). LevenshteinDistance and HammingDistance have predefined a cost model, so users cannot specify a cost model for these alignment types.\n\nWhen you pass the score_only=true or distance_only=true option to pairalign, the result of pairwise alignment holds alignment score/distance only.  This may enable some algorithms to run faster than calculating full alignment result.  Other available options are documented for each alignemnt type.\n\nExample\n\nusing BioSequences\nusing BioAlignments\n\n# create affine gap scoring model\naffinegap = AffineGapScoreModel(\n    match=5,\n    mismatch=-4,\n    gap_open=-5,\n    gap_extend=-3\n)\n\n# run global alignment between two DNA sequences\npairalign(GlobalAlignment(), dna\"AGGTAG\", dna\"ATTG\", affinegap)\n\n# run local alignment between two DNA sequences\npairalign(LocalAlignment(), dna\"AGGTAG\", dna\"ATTG\", affinegap)\n\n# you cannot specify a cost model in LevenshteinDistance\npairalign(LevenshteinDistance(), dna\"AGGTAG\", dna\"ATTG\")\n\nSee also: AffineGapScoreModel, CostModel\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.score",
    "page": "API Reference",
    "title": "BioAlignments.score",
    "category": "function",
    "text": "score(alignment_result)\n\nReturn score of alignment.\n\n\n\n"
},

{
    "location": "references.html#BioCore.distance",
    "page": "API Reference",
    "title": "BioCore.distance",
    "category": "function",
    "text": "distance(alignment_result)\n\nRetrun distance of alignment.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.alignment",
    "page": "API Reference",
    "title": "BioAlignments.alignment",
    "category": "function",
    "text": "alignment(alignment_result)\n\nReturn alignment if any.\n\nSee also: hasalignment\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.hasalignment",
    "page": "API Reference",
    "title": "BioAlignments.hasalignment",
    "category": "function",
    "text": "hasalignment(alignment_result)\n\nCheck if alignment is stored or not.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.seq2ref-Tuple{BioAlignments.PairwiseAlignment,Integer}",
    "page": "API Reference",
    "title": "BioAlignments.seq2ref",
    "category": "method",
    "text": "seq2ref(aln::PairwiseAlignment, i::Integer)::Tuple{Int,Operation}\n\nMap a position i from the first sequence to the second.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.ref2seq-Tuple{BioAlignments.PairwiseAlignment,Integer}",
    "page": "API Reference",
    "title": "BioAlignments.ref2seq",
    "category": "method",
    "text": "ref2seq(aln::PairwiseAlignment, i::Integer)::Tuple{Int,Operation}\n\nMap a position i from the second sequence to the first.\n\n\n\n"
},

{
    "location": "references.html#Pairwise-alignments-1",
    "page": "API Reference",
    "title": "Pairwise alignments",
    "category": "section",
    "text": "PairwiseAlignment\nBase.count(::PairwiseAlignment, ::Operation)\ncount_matches\ncount_mismatches\ncount_insertions\ncount_deletions\ncount_aligned\nGlobalAlignment\nSemiGlobalAlignment\nOverlapAlignment\nLocalAlignment\nEditDistance\nHammingDistance\nLevenshteinDistance\nAbstractScoreModel\nAffineGapScoreModel\nAbstractCostModel\nCostModel\nPairwiseAlignmentResult\npairalign\nscore\ndistance\nalignment\nhasalignment\nseq2ref(::PairwiseAlignment, ::Integer)\nref2seq(::PairwiseAlignment, ::Integer)"
},

{
    "location": "references.html#I/O-1",
    "page": "API Reference",
    "title": "I/O",
    "category": "section",
    "text": ""
},

{
    "location": "references.html#BioAlignments.SAM.Reader",
    "page": "API Reference",
    "title": "BioAlignments.SAM.Reader",
    "category": "type",
    "text": "SAM.Reader(input::IO)\n\nCreate a data reader of the SAM file format.\n\nArguments\n\ninput: data source\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.header",
    "page": "API Reference",
    "title": "BioAlignments.SAM.header",
    "category": "function",
    "text": "header(reader::Reader)::Header\n\nGet the header of reader.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.Header",
    "page": "API Reference",
    "title": "BioAlignments.SAM.Header",
    "category": "type",
    "text": "SAM.Header()\n\nCreate an empty header.\n\n\n\n"
},

{
    "location": "references.html#Base.find-Tuple{BioAlignments.SAM.Header,AbstractString}",
    "page": "API Reference",
    "title": "Base.find",
    "category": "method",
    "text": "find(header::Header, key::AbstractString)::Vector{MetaInfo}\n\nFind metainfo objects satisfying SAM.tag(metainfo) == key.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.Writer",
    "page": "API Reference",
    "title": "BioAlignments.SAM.Writer",
    "category": "type",
    "text": "Writer(output::IO, header::Header=Header())\n\nCreate a data writer of the SAM file format.\n\nArguments\n\noutput: data sink\nheader=Header(): SAM header object\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.MetaInfo",
    "page": "API Reference",
    "title": "BioAlignments.SAM.MetaInfo",
    "category": "type",
    "text": "MetaInfo(str::AbstractString)\n\nCreate a SAM metainfo from str.\n\nExamples\n\njulia> SAM.MetaInfo(\"@CO	some comment\")\nBioAlignments.SAM.MetaInfo:\n    tag: CO\n  value: some comment\n\njulia> SAM.MetaInfo(\"@SQ	SN:chr1	LN:12345\")\nBioAlignments.SAM.MetaInfo:\n    tag: SQ\n  value: SN=chr1 LN=12345\n\n\n\nMetaInfo(tag::AbstractString, value)\n\nCreate a SAM metainfo with tag and value.\n\ntag is a two-byte ASCII string. If tag is \"CO\", value must be a string; otherwise, value is an iterable object with key and value pairs.\n\nExamples\n\njulia> SAM.MetaInfo(\"CO\", \"some comment\")\nBioAlignments.SAM.MetaInfo:\n    tag: CO\n  value: some comment\n\njulia> string(ans)\n\"@CO	some comment\"\n\njulia> SAM.MetaInfo(\"SQ\", [\"SN\" => \"chr1\", \"LN\" => 12345])\nBioAlignments.SAM.MetaInfo:\n    tag: SQ\n  value: SN=chr1 LN=12345\n\njulia> string(ans)\n\"@SQ	SN:chr1	LN:12345\"\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.iscomment",
    "page": "API Reference",
    "title": "BioAlignments.SAM.iscomment",
    "category": "function",
    "text": "iscomment(metainfo::MetaInfo)::Bool\n\nTest if metainfo is a comment (i.e. its tag is \"CO\").\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.tag",
    "page": "API Reference",
    "title": "BioAlignments.SAM.tag",
    "category": "function",
    "text": "tag(metainfo::MetaInfo)::String\n\nGet the tag of metainfo.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.value",
    "page": "API Reference",
    "title": "BioAlignments.SAM.value",
    "category": "function",
    "text": "value(metainfo::MetaInfo)::String\n\nGet the value of metainfo as a string.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.keyvalues",
    "page": "API Reference",
    "title": "BioAlignments.SAM.keyvalues",
    "category": "function",
    "text": "keyvalues(metainfo::MetaInfo)::Vector{Pair{String,String}}\n\nGet the values of metainfo as string pairs.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.Record",
    "page": "API Reference",
    "title": "BioAlignments.SAM.Record",
    "category": "type",
    "text": "SAM.Record()\n\nCreate an unfilled SAM record.\n\n\n\nSAM.Record(data::Vector{UInt8})\n\nCreate a SAM record from data. This function verifies the format and indexes fields for accessors. Note that the ownership of data is transferred to a new record object.\n\n\n\nSAM.Record(str::AbstractString)\n\nCreate a SAM record from str. This function verifies the format and indexes fields for accessors.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.flag",
    "page": "API Reference",
    "title": "BioAlignments.SAM.flag",
    "category": "function",
    "text": "flag(record::Record)::UInt16\n\nGet the bitwise flag of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.ismapped",
    "page": "API Reference",
    "title": "BioAlignments.SAM.ismapped",
    "category": "function",
    "text": "ismapped(record::Record)::Bool\n\nTest if record is mapped.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.isprimary",
    "page": "API Reference",
    "title": "BioAlignments.SAM.isprimary",
    "category": "function",
    "text": "isprimary(record::Record)::Bool\n\nTest if record is a primary line of the read.\n\nThis is equivalent to flag(record) & 0x900 == 0.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.refname",
    "page": "API Reference",
    "title": "BioAlignments.SAM.refname",
    "category": "function",
    "text": "refname(record::Record)::String\n\nGet the reference sequence name of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.position",
    "page": "API Reference",
    "title": "BioAlignments.SAM.position",
    "category": "function",
    "text": "position(record::Record)::Int\n\nGet the 1-based leftmost mapping position of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.rightposition",
    "page": "API Reference",
    "title": "BioAlignments.SAM.rightposition",
    "category": "function",
    "text": "rightposition(record::Record)::Int\n\nGet the 1-based rightmost mapping position of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.isnextmapped",
    "page": "API Reference",
    "title": "BioAlignments.SAM.isnextmapped",
    "category": "function",
    "text": "isnextmapped(record::Record)::Bool\n\nTest if the mate/next read of record is mapped.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.nextrefname",
    "page": "API Reference",
    "title": "BioAlignments.SAM.nextrefname",
    "category": "function",
    "text": "nextrefname(record::Record)::String\n\nGet the reference name of the mate/next read of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.nextposition",
    "page": "API Reference",
    "title": "BioAlignments.SAM.nextposition",
    "category": "function",
    "text": "nextposition(record::Record)::Int\n\nGet the position of the mate/next read of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.mappingquality",
    "page": "API Reference",
    "title": "BioAlignments.SAM.mappingquality",
    "category": "function",
    "text": "mappingquality(record::Record)::UInt8\n\nGet the mapping quality of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.cigar",
    "page": "API Reference",
    "title": "BioAlignments.SAM.cigar",
    "category": "function",
    "text": "cigar(record::Record)::String\n\nGet the CIGAR string of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.alignment",
    "page": "API Reference",
    "title": "BioAlignments.SAM.alignment",
    "category": "function",
    "text": "alignment(record::Record)::BioAlignments.Alignment\n\nGet the alignment of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.alignlength",
    "page": "API Reference",
    "title": "BioAlignments.SAM.alignlength",
    "category": "function",
    "text": "alignlength(record::Record)::Int\n\nGet the alignment length of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.tempname",
    "page": "API Reference",
    "title": "BioAlignments.SAM.tempname",
    "category": "function",
    "text": "tempname(record::Record)::String\n\nGet the query template name of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.templength",
    "page": "API Reference",
    "title": "BioAlignments.SAM.templength",
    "category": "function",
    "text": "templength(record::Record)::Int\n\nGet the template length of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.sequence",
    "page": "API Reference",
    "title": "BioAlignments.SAM.sequence",
    "category": "function",
    "text": "sequence(record::Record)::BioSequences.DNASequence\n\nGet the segment sequence of record.\n\n\n\nsequence(::Type{String}, record::Record)::String\n\nGet the segment sequence of record as String.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.seqlength",
    "page": "API Reference",
    "title": "BioAlignments.SAM.seqlength",
    "category": "function",
    "text": "seqlength(record::Record)::Int\n\nGet the sequence length of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.quality",
    "page": "API Reference",
    "title": "BioAlignments.SAM.quality",
    "category": "function",
    "text": "quality(record::Record)::Vector{UInt8}\n\nGet the Phred-scaled base quality of record.\n\n\n\nquality(::Type{String}, record::Record)::String\n\nGet the ASCII-encoded base quality of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.auxdata",
    "page": "API Reference",
    "title": "BioAlignments.SAM.auxdata",
    "category": "function",
    "text": "auxdata(record::Record)::Dict{String,Any}\n\nGet the auxiliary data (optional fields) of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.FLAG_PAIRED",
    "page": "API Reference",
    "title": "BioAlignments.SAM.FLAG_PAIRED",
    "category": "constant",
    "text": "0x0001: the read is paired in sequencing, no matter whether it is mapped in a pair\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.FLAG_PROPER_PAIR",
    "page": "API Reference",
    "title": "BioAlignments.SAM.FLAG_PROPER_PAIR",
    "category": "constant",
    "text": "0x0002: the read is mapped in a proper pair\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.FLAG_UNMAP",
    "page": "API Reference",
    "title": "BioAlignments.SAM.FLAG_UNMAP",
    "category": "constant",
    "text": "0x0004: the read itself is unmapped; conflictive with SAM.FLAG_PROPER_PAIR\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.FLAG_MUNMAP",
    "page": "API Reference",
    "title": "BioAlignments.SAM.FLAG_MUNMAP",
    "category": "constant",
    "text": "0x0008: the mate is unmapped\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.FLAG_REVERSE",
    "page": "API Reference",
    "title": "BioAlignments.SAM.FLAG_REVERSE",
    "category": "constant",
    "text": "0x0010: the read is mapped to the reverse strand\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.FLAG_MREVERSE",
    "page": "API Reference",
    "title": "BioAlignments.SAM.FLAG_MREVERSE",
    "category": "constant",
    "text": "0x0020: the mate is mapped to the reverse strand\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.FLAG_READ1",
    "page": "API Reference",
    "title": "BioAlignments.SAM.FLAG_READ1",
    "category": "constant",
    "text": "0x0040: this is read1\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.FLAG_READ2",
    "page": "API Reference",
    "title": "BioAlignments.SAM.FLAG_READ2",
    "category": "constant",
    "text": "0x0080: this is read2\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.FLAG_SECONDARY",
    "page": "API Reference",
    "title": "BioAlignments.SAM.FLAG_SECONDARY",
    "category": "constant",
    "text": "0x0100: not primary alignment\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.FLAG_QCFAIL",
    "page": "API Reference",
    "title": "BioAlignments.SAM.FLAG_QCFAIL",
    "category": "constant",
    "text": "0x0200: QC failure\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.FLAG_DUP",
    "page": "API Reference",
    "title": "BioAlignments.SAM.FLAG_DUP",
    "category": "constant",
    "text": "0x0400: optical or PCR duplicate\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.SAM.FLAG_SUPPLEMENTARY",
    "page": "API Reference",
    "title": "BioAlignments.SAM.FLAG_SUPPLEMENTARY",
    "category": "constant",
    "text": "0x0800: supplementary alignment\n\n\n\n"
},

{
    "location": "references.html#SAM-1",
    "page": "API Reference",
    "title": "SAM",
    "category": "section",
    "text": "SAM.Reader\nSAM.header\n\nSAM.Header\nBase.find(header::SAM.Header, key::AbstractString)\n\nSAM.Writer\n\nSAM.MetaInfo\nSAM.iscomment\nSAM.tag\nSAM.value\nSAM.keyvalues\n\nSAM.Record\nSAM.flag\nSAM.ismapped\nSAM.isprimary\nSAM.refname\nSAM.position\nSAM.rightposition\nSAM.isnextmapped\nSAM.nextrefname\nSAM.nextposition\nSAM.mappingquality\nSAM.cigar\nSAM.alignment\nSAM.alignlength\nSAM.tempname\nSAM.templength\nSAM.sequence\nSAM.seqlength\nSAM.quality\nSAM.auxdata\n\nSAM.FLAG_PAIRED\nSAM.FLAG_PROPER_PAIR\nSAM.FLAG_UNMAP\nSAM.FLAG_MUNMAP\nSAM.FLAG_REVERSE\nSAM.FLAG_MREVERSE\nSAM.FLAG_READ1\nSAM.FLAG_READ2\nSAM.FLAG_SECONDARY\nSAM.FLAG_QCFAIL\nSAM.FLAG_DUP\nSAM.FLAG_SUPPLEMENTARY"
},

{
    "location": "references.html#BioAlignments.BAM.Reader",
    "page": "API Reference",
    "title": "BioAlignments.BAM.Reader",
    "category": "type",
    "text": "BAM.Reader(input::IO; index=nothing)\n\nCreate a data reader of the BAM file format.\n\nArguments\n\ninput: data source\nindex=nothing: filepath to a random access index (currently bai is supported)\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.header",
    "page": "API Reference",
    "title": "BioAlignments.BAM.header",
    "category": "function",
    "text": "header(reader::Reader; fillSQ::Bool=false)::SAM.Header\n\nGet the header of reader.\n\nIf fillSQ is true, this function fills missing \"SQ\" metainfo in the header.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.Writer",
    "page": "API Reference",
    "title": "BioAlignments.BAM.Writer",
    "category": "type",
    "text": "BAM.Writer(output::BGZFStream, header::SAM.Header)\n\nCreate a data writer of the BAM file format.\n\nArguments\n\noutput: data sink\nheader: SAM header object\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.Record",
    "page": "API Reference",
    "title": "BioAlignments.BAM.Record",
    "category": "type",
    "text": "BAM.Record()\n\nCreate an unfilled BAM record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.flag",
    "page": "API Reference",
    "title": "BioAlignments.BAM.flag",
    "category": "function",
    "text": "flag(record::Record)::UInt16\n\nGet the bitwise flag of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.ismapped",
    "page": "API Reference",
    "title": "BioAlignments.BAM.ismapped",
    "category": "function",
    "text": "ismapped(record::Record)::Bool\n\nTest if record is mapped.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.isprimary",
    "page": "API Reference",
    "title": "BioAlignments.BAM.isprimary",
    "category": "function",
    "text": "isprimary(record::Record)::Bool\n\nTest if record is a primary line of the read.\n\nThis is equivalent to flag(record) & 0x900 == 0.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.ispositivestrand",
    "page": "API Reference",
    "title": "BioAlignments.BAM.ispositivestrand",
    "category": "function",
    "text": "ispositivestrand(record::Record)::Bool\n\nTest if record is aligned to the positive strand.\n\nThis is equivalent to flag(record) & 0x10 == 0.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.refid",
    "page": "API Reference",
    "title": "BioAlignments.BAM.refid",
    "category": "function",
    "text": "refid(record::Record)::Int\n\nGet the reference sequence ID of record.\n\nThe ID is 1-based (i.e. the first sequence is 1) and is 0 for a record without a mapping position.\n\nSee also: BAM.rname\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.refname",
    "page": "API Reference",
    "title": "BioAlignments.BAM.refname",
    "category": "function",
    "text": "refname(record::Record)::String\n\nGet the reference sequence name of record.\n\nSee also: BAM.refid\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.position",
    "page": "API Reference",
    "title": "BioAlignments.BAM.position",
    "category": "function",
    "text": "position(record::Record)::Int\n\nGet the 1-based leftmost mapping position of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.rightposition",
    "page": "API Reference",
    "title": "BioAlignments.BAM.rightposition",
    "category": "function",
    "text": "rightposition(record::Record)::Int\n\nGet the 1-based rightmost mapping position of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.isnextmapped",
    "page": "API Reference",
    "title": "BioAlignments.BAM.isnextmapped",
    "category": "function",
    "text": "isnextmapped(record::Record)::Bool\n\nTest if the mate/next read of record is mapped.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.nextrefid",
    "page": "API Reference",
    "title": "BioAlignments.BAM.nextrefid",
    "category": "function",
    "text": "nextrefid(record::Record)::Int\n\nGet the next/mate reference sequence ID of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.nextrefname",
    "page": "API Reference",
    "title": "BioAlignments.BAM.nextrefname",
    "category": "function",
    "text": "nextrefname(record::Record)::String\n\nGet the reference name of the mate/next read of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.nextposition",
    "page": "API Reference",
    "title": "BioAlignments.BAM.nextposition",
    "category": "function",
    "text": "nextposition(record::Record)::Int\n\nGet the 1-based leftmost mapping position of the next/mate read of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.mappingquality",
    "page": "API Reference",
    "title": "BioAlignments.BAM.mappingquality",
    "category": "function",
    "text": "mappingquality(record::Record)::UInt8\n\nGet the mapping quality of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.cigar",
    "page": "API Reference",
    "title": "BioAlignments.BAM.cigar",
    "category": "function",
    "text": "cigar(record::Record)::String\n\nGet the CIGAR string of record.\n\nNote that in the BAM specification, the field called cigar typically stores the cigar string of the record. However, this is not always true, sometimes the true cigar is very long, and due to  some constraints of the BAM format, the actual cigar string is stored in an extra tag: CG:B,I, and the cigar field stores a pseudo-cigar string.\n\nCalling this method with checkCG set to true (default) this method will always yield the true cigar string, because this is probably what you want the vast majority of the time.\n\nIf you have a record that stores the true cigar in a CG:B,I tag, but you still want to access the pseudo-cigar that is stored in the cigar field of the BAM record, then you can set checkCG to false.\n\nSee also BAM.cigar_rle.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.cigar_rle",
    "page": "API Reference",
    "title": "BioAlignments.BAM.cigar_rle",
    "category": "function",
    "text": "cigar_rle(record::Record, checkCG::Bool = true)::Tuple{Vector{BioAlignments.Operation},Vector{Int}}\n\nGet a run-length encoded tuple (ops, lens) of the CIGAR string in record.\n\nNote that in the BAM specification, the field called cigar typically stores the cigar string of the record. However, this is not always true, sometimes the true cigar is very long, and due to  some constraints of the BAM format, the actual cigar string is stored in an extra tag: CG:B,I, and the cigar field stores a pseudo-cigar string.\n\nCalling this method with checkCG set to true (default) this method will always yield the true cigar string, because this is probably what you want the vast majority of the time.\n\nIf you have a record that stores the true cigar in a CG:B,I tag, but you still want to access the pseudo-cigar that is stored in the cigar field of the BAM record, then you can set checkCG to false.\n\nSee also BAM.cigar.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.alignment",
    "page": "API Reference",
    "title": "BioAlignments.BAM.alignment",
    "category": "function",
    "text": "alignment(record::Record)::BioAlignments.Alignment\n\nGet the alignment of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.alignlength",
    "page": "API Reference",
    "title": "BioAlignments.BAM.alignlength",
    "category": "function",
    "text": "alignlength(record::Record)::Int\n\nGet the alignment length of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.tempname",
    "page": "API Reference",
    "title": "BioAlignments.BAM.tempname",
    "category": "function",
    "text": "tempname(record::Record)::String\n\nGet the query template name of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.templength",
    "page": "API Reference",
    "title": "BioAlignments.BAM.templength",
    "category": "function",
    "text": "templength(record::Record)::Int\n\nGet the template length of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.sequence",
    "page": "API Reference",
    "title": "BioAlignments.BAM.sequence",
    "category": "function",
    "text": "sequence(record::Record)::BioSequences.DNASequence\n\nGet the segment sequence of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.seqlength",
    "page": "API Reference",
    "title": "BioAlignments.BAM.seqlength",
    "category": "function",
    "text": "seqlength(record::Record)::Int\n\nGet the sequence length of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.quality",
    "page": "API Reference",
    "title": "BioAlignments.BAM.quality",
    "category": "function",
    "text": "quality(record::Record)::Vector{UInt8}\n\nGet the base quality of  record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.auxdata",
    "page": "API Reference",
    "title": "BioAlignments.BAM.auxdata",
    "category": "function",
    "text": "auxdata(record::Record)::BAM.AuxData\n\nGet the auxiliary data of record.\n\n\n\n"
},

{
    "location": "references.html#BioAlignments.BAM.BAI",
    "page": "API Reference",
    "title": "BioAlignments.BAM.BAI",
    "category": "type",
    "text": "BAI(filename::AbstractString)\n\nLoad a BAI index from filename.\n\n\n\nBAI(input::IO)\n\nLoad a BAI index from input.\n\n\n\n"
},

{
    "location": "references.html#BAM-1",
    "page": "API Reference",
    "title": "BAM",
    "category": "section",
    "text": "BAM.Reader\nBAM.header\n\nBAM.Writer\n\nBAM.Record\nBAM.flag\nBAM.ismapped\nBAM.isprimary\nBAM.ispositivestrand\nBAM.refid\nBAM.refname\nBAM.position\nBAM.rightposition\nBAM.isnextmapped\nBAM.nextrefid\nBAM.nextrefname\nBAM.nextposition\nBAM.mappingquality\nBAM.cigar\nBAM.cigar_rle\nBAM.alignment\nBAM.alignlength\nBAM.tempname\nBAM.templength\nBAM.sequence\nBAM.seqlength\nBAM.quality\nBAM.auxdata\n\nBAM.BAI"
},

]}
