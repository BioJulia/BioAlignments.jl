# BioAlignments

[![latest release](https://img.shields.io/github/release/BioJulia/BioAlignments.jl.svg?style=flat-square)](https://github.com/BioJulia/BioAlignments.jl/releases/latest)
[![MIT license](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](https://github.com/BioJulia/BioAlignments.jl/blob/master/LICENSE)
[![stable documentation](https://img.shields.io/badge/docs-stable-blue.svg?style=flat-square)](https://biojulia.github.io/BioAlignments.jl/stable)
[![latest documentation](https://img.shields.io/badge/docs-latest-blue.svg?style=flat-square)](https://biojulia.github.io/BioAlignments.jl/latest/)
![lifecycle](https://img.shields.io/badge/lifecycle-maturing-blue.svg?style=flat-square)
[![Chat on Discord](https://img.shields.io/badge/discord-chat-blue.svg?style=flat-square&logo=discord&colorB=%237289DA)](https://discord.gg/z73YNFz)

## Description

BioAlignments provides alignment algorithms, data structures, and I/O
tools for SAM and BAM file formats.

## Installation

Install BioAlignments from the Julia REPL:

```julia
using Pkg
add("BioAlignments")
#Pkg.add("BioAlignments") for julia prior to v0.7
```

If you are interested in the cutting edge of the development, please
check out the master branch to try new features before release.

## Testing

BioAlignments is tested against julia `0.6` and current `0.7-dev` on
Linux, OS X, and Windows.

| **Latest release** | **Latest build status** |
|:------------------:|:-----------------------:|
| [![julia06](http://pkg.julialang.org/badges/BioAlignments_0.6.svg?style=flat-square)](http://pkg.julialang.org/?pkg=BioAlignments) [![julia07](http://pkg.julialang.org/badges/BioAlignments_0.7.svg?style=flat-square)](http://pkg.julialang.org/?pkg=BioAlignments) | [![travis](https://img.shields.io/travis/BioJulia/BioAlignments.jl/master.svg?label=Linux+/+macOS)](https://travis-ci.org/BioJulia/BioAlignments.jl) [![appveyor](https://ci.appveyor.com/api/projects/status/klkynmkr1tgd30gq/branch/master?svg=true)](https://ci.appveyor.com/project/Ward9250/bioalignments-jl/branch/master) [![coverage](http://codecov.io/github/BioJulia/BioAlignments.jl/coverage.svg?branch=master)](http://codecov.io/github/BioJulia/BioAlignments.jl?branch=master) |

## Contributing and Questions

We appreciate contributions from users including reporting bugs, fixing
issues, improving performance and adding new features.

Take a look at the [CONTRIBUTING](CONTRIBUTING.md) file provided with
this package for detailed contributor and maintainer guidelines.

If you have a question about contributing or using this package, come
on over and chat to us on [Discord][discord-url], or you can try the
[Bio category of the Julia discourse site](https://discourse.julialang.org/c/domain/bio).