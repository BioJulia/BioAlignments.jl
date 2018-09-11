# SAM Header
# ==========

struct Header
    metainfo::Vector{MetaInfo}
end

"""
    SAM.Header()

Create an empty header.
"""
function Header()
    return Header(MetaInfo[])
end

function Base.copy(header::Header)
    return Header(header.metainfo)
end

function Base.eltype(::Type{Header})
    return MetaInfo
end

function Base.length(header::Header)
    return length(header.metainfo)
end

function Base.iterate(header::Header, i=1)
    if i > length(header.metainfo)
        return nothing
    end
    return header.metainfo[i], i + 1
end

"""
    find(header::Header, key::AbstractString)::Vector{MetaInfo}

Find metainfo objects satisfying `SAM.tag(metainfo) == key`.
"""
function Base.findall(header::Header, key::AbstractString)::Vector{MetaInfo}
    return filter(m -> isequalkey(m, key), header.metainfo)
end

function Base.pushfirst!(header::Header, metainfo::MetaInfo)
    pushfirst!(header.metainfo, metainfo)
    return header
end

function Base.push!(header::Header, metainfo::MetaInfo)
    push!(header.metainfo, metainfo)
    return header
end
