SAM formatted files
===================

Description
-----------

SAM is a text-based file format for representing sequence alignments.

* Reader type: `SAM.Reader`
* Writer type: `SAM.Writer`
* Element type: `SAM.Record`

This module provides 16-bit flags defined in the SAM specs:

| Flag                      | Bit       | Description                                                        |
| :------------------------ | :-------- | :----------------------------------------------------------------- |
| `SAM.FLAG_PAIRED`         | `0x0001`  | template having multiple segments in sequencing                    |
| `SAM.FLAG_PROPER_PAIR`    | `0x0002`  | each segment properly aligned according to the aligner             |
| `SAM.FLAG_UNMAP`          | `0x0004`  | segment unmapped                                                   |
| `SAM.FLAG_MUNMAP`         | `0x0008`  | next segment in the template unmapped                              |
| `SAM.FLAG_REVERSE`        | `0x0010`  | SEQ being reverse complemented                                     |
| `SAM.FLAG_MREVERSE`       | `0x0020`  | SEQ of the next segment in the template being reverse complemented |
| `SAM.FLAG_READ1`          | `0x0040`  | the first segment in the template                                  |
| `SAM.FLAG_READ2`          | `0x0080`  | the last segment in the template                                   |
| `SAM.FLAG_SECONDARY`      | `0x0100`  | secondary alignment                                                |
| `SAM.FLAG_QCFAIL`         | `0x0200`  | not passing filters, such as platform/vendor quality controls      |
| `SAM.FLAG_DUP`            | `0x0400`  | PCR or optical duplicate                                           |
| `SAM.FLAG_SUPPLEMENTARY`  | `0x0800`  | supplementary alignment                                            |

Examples
--------

**TODO**
