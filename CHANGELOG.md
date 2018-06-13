# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Contributing files were added to this project.
- A method called `BAM.ispositivestrand` is added to test for the relevant flag
  in BAM records. Thanks @phaverty :smile:
- Support for records with CIGAR strings with >65535 op-codes has been added.

### Changed
- Documentation has been updated and uses the Documenter.jl native html
  generator.

## [0.2.0] - 2017-08-01
### Dependencies
- :exclamation: Support for julia v0.5 has been dropped.
- :exclamation: Some dependency lower bound requirements were adjusted for
  Automa, BGZFStreams, BioSequences, and IntervalTrees.

## [0.1.0] - 2017-06-30
- This initial release extracted the alignment utilities out from Bio.jl into
  this dedicated package.

[Unreleased]: https://github.com/BioJulia/BioAlignments.jl/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/BioJulia/BioAlignments.jl/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/BioJulia/BioAlignments.jl/tree/v0.1.0
