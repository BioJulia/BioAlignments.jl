using Documenter, BioAlignments

makedocs(
    modules=[BioAlignments])
deploydocs(
    deps=Deps.pip("mkdocs", "pygments", "mkdocs-material"),
    repo="github.com/BioJulia/BioAlignments.jl.git",
    julia="0.6",
    osname="linux")
