# Alignment Types
# ===============
#
# Types for sequence alignments.
#
# This file is a part of BioJulia.
# License is MIT: https://github.com/BioJulia/BioAlignments.jl/blob/master/LICENSE.md

abstract type AbstractAlignment end


# Alignments
# ----------

"""Global-global alignment with end gap penalties."""
struct GlobalAlignment <: AbstractAlignment end

"""Global-local alignment."""
struct SemiGlobalAlignment <: AbstractAlignment end

"""Global-global alignment without end gap penalties."""
struct OverlapAlignment <: AbstractAlignment end

"""Local-local alignment."""
struct LocalAlignment <: AbstractAlignment end


# Distances
# ---------

"""Edit distance."""
struct EditDistance <: AbstractAlignment end

"""
Levenshtein distance.

A special case of `EditDistance` with the costs of mismatch, insertion, and
deletion are 1.
"""
struct LevenshteinDistance <: AbstractAlignment end

"""
Hamming distance.

A special case of `EditDistance` with the costs of insertion and deletion are
infinitely large.
"""
struct HammingDistance <: AbstractAlignment end
