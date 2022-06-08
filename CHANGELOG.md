# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Alignment position support (#44)
- Compact printing of alignments (#53)
- Downstream tests (#70)
- SSH secret to TagBot.yml (#71)
- Zenodo badge (#c49bb0a3)
- Doctests as part of the unit tests (#78)

### Changed
- Updated CI to use GitHub actions (#47, #77)
- *master* set as the main development branch (#49, #50)
- Updated chat links (#ebea200c)
- Expanded test matrix, adding julia v1.6 (#77)
- Incremented BioSequences compatibility to v3 (#72)
- Incremented BioSymbols compatibility to v5 (#72)
- Adjusted test matrix for minimum compatibility (#72)
- Updated doctests (#72)

### Removed
- :exclamation: Reverted the use of *BioJulia* registry,
  the package switched to [General Julia Registry](https://github.com/JuliaRegistries/General) (#48)
- :exclamation: Removed Gitter chat links (#ebea200c)
- :exclamation: Dropped support for julia less than v1.6 (#72)

### Fixed
- Doctests (#78)

## [2.0.0]

### Added
- BioJulia registry.

### Changed
- Migrated from BioCore to [BioGenerics](https://github.com/BioJulia/BioGenerics.jl/tree/v0.1.0).
- Updated to use [BioSequences](https://github.com/BioJulia/BioSequences.jl/tree/v2.0.0) v2.
- Updated CI.

### Removed
- :exclamation: BAM and SAM submodules were moved to [XAM.jl](https://github.com/BioJulia/XAM.jl).
- :exclamation: Support for julia v0.7 and v1.0 was dropped.

## [1.0.1] - 2020-01-24
### Added
- Support for julia v1.1, v1.2, and v1.3.

### Changed
- Updated CI.

### Fixed
- Function convert(BAM.Record, x::Vector{UInt8} updated to Julia v. 1.0. (#23)
- haskey(x::BAM.Record, y::String). (#24)
- Reading BAM files from processes. (#29)
- Use @info instead of info. (#36)

## [1.0.0] - 2018-09-18
### Added
- Support for julia v0.7 / v1.0.

### Removed
- :exclamation: Support for julia v0.6 has been dropped.

## [0.3.0] - 2018-06-15
### Added
- Contributing files were added to this project.
- A method called `BAM.ispositivestrand` is added to test for the relevant flag in BAM records. Thanks @phaverty :smile:
- Support for records with CIGAR strings with >65535 op-codes has been added.

### Changed
- Documentation has been updated and uses the Documenter.jl native html generator.

## [0.2.0] - 2017-08-01
### Dependencies
- :exclamation: Support for julia v0.5 has been dropped.
- :exclamation: Some dependency lower bound requirements were adjusted for Automa, BGZFStreams, BioSequences, and IntervalTrees.

## [0.1.0] - 2017-06-30
- This initial release extracted the alignment utilities out from Bio.jl into this dedicated package.

[Unreleased]: https://github.com/BioJulia/BioAlignments.jl/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/BioJulia/BioAlignments.jl/compare/v1.0.1...v2.0.0
[1.0.1]: https://github.com/BioJulia/BioAlignments.jl/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/BioJulia/BioAlignments.jl/compare/v0.3.0...v1.0.0
[0.3.0]: https://github.com/BioJulia/BioAlignments.jl/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/BioJulia/BioAlignments.jl/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/BioJulia/BioAlignments.jl/tree/v0.1.0
