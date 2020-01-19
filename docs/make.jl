using Pkg

Pkg.develop(PackageSpec(path=pwd()))
Pkg.instantiate()

using Documenter, BioAlignments

makedocs(
    format = Documenter.HTML(
        edit_branch = "develop"
    ),
    modules = [BioAlignments],
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
    authors = replace(join(Pkg.TOML.parsefile("Project.toml")["authors"], ", "), r" <.*?>" => "" ) * ", The BioJulia Organisation, and other contributors."
)

deploydocs(
    repo = "github.com/BioJulia/BioAlignments.jl.git",
    devbranch = "develop"
)
