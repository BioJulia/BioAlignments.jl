# BioAlignments

[![latest release][release-img]][release-url]
[![MIT license][license-img]][license-url]
[![stable documentation][docs-stable-img]][docs-stable-url]
[![latest documentation][docs-latest-img]][docs-latest-url]
![lifecycle][lifecycle-maturing]
[![Chat on Discord][discord-img]][discord-url]

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
| [![julia06][juliapkg06-img]][juliapkg-url] [![julia07][juliapkg07-img]][juliapkg-url] | [![travis][travis-img]][travis-url] [![appveyor][appveyor-img]][appveyor-url] [![coverage][codecov-img]][codecov-url] |

## Contributing and Questions

We appreciate contributions from users including reporting bugs, fixing
issues, improving performance and adding new features.

Take a look at the [CONTRIBUTING](CONTRIBUTING.md) file provided with
this package for detailed contributor and maintainer guidelines.

If you have a question about contributing or using this package, come
on over and chat to us on [Discord][discord-url], or you can try the
[Bio category of the Julia discourse site](https://discourse.julialang.org/c/domain/bio).

[release-img]:            https://img.shields.io/github/release/BioJulia/BioAlignments.jl.svg?style=flat-square
[release-url]:            https://github.com/BioJulia/BioAlignments.jl/releases/latest
[license-img]:            https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]:            https://github.com/BioJulia/BioAlignments.jl/blob/master/LICENSE
[docs-stable-img]:        https://img.shields.io/badge/docs-stable-blue.svg?style=flat-square
[docs-stable-url]:        https://biojulia.github.io/BioAlignments.jl/stable
[docs-latest-img]:        https://img.shields.io/badge/docs-latest-blue.svg?style=flat-square
[docs-latest-url]:        https://biojulia.github.io/BioAlignments.jl/latest/
[lifecycle-experimental]: https://img.shields.io/badge/lifecycle-experimental-orange.svg?style=flat-square
[lifecycle-maturing]:     https://img.shields.io/badge/lifecycle-maturing-blue.svg?style=flat-square
[lifecycle-stable]:       https://img.shields.io/badge/lifecycle-stable-brightgreen.svg?style=flat-square
[lifecycle-retired]:      https://img.shields.io/badge/lifecycle-retired-orange.svg?style=flat-square
[lifecycle-archived]:     https://img.shields.io/badge/lifecycle-archived-red.svg?style=flat-square
[lifecycle-dormant]:      https://img.shields.io/badge/lifecycle-dormant-blue.svg?style=flat-square
[lifecycle-questioning]:  https://img.shields.io/badge/lifecycle-questioning-blue.svg?style=flat-square
[discord-img]:            https://img.shields.io/badge/discord-chat-blue.svg?style=flat-square&logo=discord&colorB=%237289DA
[discord-url]:            https://discord.gg/z73YNFz
[juliapkg06-img]:         http://pkg.julialang.org/badges/BioAlignments_0.6.svg?style=flat-square
[juliapkg07-img]:         http://pkg.julialang.org/badges/BioAlignments_0.7.svg?style=flat-square
[juliapkg-url]:           http://pkg.julialang.org/?pkg=BioAlignments
[travis-img]:             https://img.shields.io/travis/BioJulia/BioAlignments.jl/master.svg?label=Linux+/+macOS
[travis-url]:             https://travis-ci.org/BioJulia/BioAlignments.jl
[appveyor-img]:           https://ci.appveyor.com/api/projects/status/klkynmkr1tgd30gq/branch/master?svg=true
[appveyor-url]:           https://ci.appveyor.com/project/Ward9250/bioalignments-jl/branch/master
[codecov-img]:            http://codecov.io/github/BioJulia/BioAlignments.jl/coverage.svg?branch=master
[codecov-url]:            http://codecov.io/github/BioJulia/BioAlignments.jl?branch=master