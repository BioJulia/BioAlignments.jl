using Pkg
Pkg.develop(PackageSpec(path=pwd())); Pkg.instantiate()

using Documenter, BioAlignments

makedocs(
    format = :html,
    sitename = "BioAlignments.jl",
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
    julia = "1.0",
    osname = "linux",
    target = "build",
    deps = nothing,
    make = nothing
)
