using Pkg

Pkg.develop(PackageSpec(path=pwd()))
Pkg.instantiate()

using Documenter, BioAlignments

makedocs(
    format = Documenter.HTML(
        edit_link = :commit
    ),
    modules = [BioAlignments],
    sitename = "BioAlignments.jl",
    pages = [
        "Home" => "index.md",
        "Alignment representation" => "alignments.md",
        "Pairwise alignment" => "pairalign.md",
        "API Reference" => "references.md"
    ],
    authors = replace(join(Pkg.TOML.parsefile("Project.toml")["authors"], ", "), r" <.*?>" => "" ) * ", The BioJulia Organisation, and other contributors."
)

deploydocs(
    repo = "github.com/BioJulia/BioAlignments.jl.git",
    devbranch = "develop",
    push_preview = true
)
