using Documenter, BioAlignments

makedocs()
deploydocs(
    deps=Deps.pip("mkdocs", "pygments", "mkdocs-material"),
    repo="github.com/BioJulia/BioAlignments.jl.git",
    julia="0.6",
    osname="linux")
