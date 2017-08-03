# SAM Flags
# =========
#
# Bitwise flags (or FLAG).

for (name, bits, doc) in [
        (:PAIRED,        UInt16(0x001), "the read is paired in sequencing, no matter whether it is mapped in a pair"),
        (:PROPER_PAIR,   UInt16(0x002), "the read is mapped in a proper pair"                                       ),
        (:UNMAP,         UInt16(0x004), "the read itself is unmapped; conflictive with SAM.FLAG_PROPER_PAIR"        ),
        (:MUNMAP,        UInt16(0x008), "the mate is unmapped"                                                      ),
        (:REVERSE,       UInt16(0x010), "the read is mapped to the reverse strand"                                  ),
        (:MREVERSE,      UInt16(0x020), "the mate is mapped to the reverse strand"                                  ),
        (:READ1,         UInt16(0x040), "this is read1"                                                             ),
        (:READ2,         UInt16(0x080), "this is read2"                                                             ),
        (:SECONDARY,     UInt16(0x100), "not primary alignment"                                                     ),
        (:QCFAIL,        UInt16(0x200), "QC failure"                                                                ),
        (:DUP,           UInt16(0x400), "optical or PCR duplicate"                                                  ),
        (:SUPPLEMENTARY, UInt16(0x800), "supplementary alignment"                                                   ),]
    @assert bits isa UInt16
    sym = Symbol("FLAG_", name)
    doc = string(@sprintf("0x%04x: ", bits), doc)
    @eval begin
        @doc $(doc) const $(sym) = $(bits)
    end
end

