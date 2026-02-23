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
    authors = "Kenta Sato, Sabrina J. Ward, The BioJulia Organisation, and other contributors."
)

deploydocs(
    repo = "github.com/BioJulia/BioAlignments.jl.git",
    devbranch = "master",
    push_preview = true
)
