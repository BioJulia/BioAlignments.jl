using Pkg
Pkg.develop(PackageSpec(path=pwd())); Pkg.instantiate()

using Documenter, BioAlignments

makedocs(
    format = Documenter.HTML(),
    modules = [BioAlignments, BioAlignments.SAM, BioAlignments.BAM],
    sitename = "BioAlignments.jl",
    doctest = false,
    strict = false,
    pages = [
        "Home" => "index.md",
        "Alignment representation" => "alignments.md",
        "Pairwise alignment" => "pairalign.md",
        "IO" => [
            "SAM and BAM" => "hts-files.md"
        ],
        "API Reference" => "references.md"
    ],
    authors = "Kenta Sato, Ben J. Ward, The BioJulia Organisation and other contributors."
)

deploydocs(
    repo = "github.com/BioJulia/BioAlignments.jl.git",
    deps = nothing,
    make = nothing
)
