# FRO-325 consumer-driven review (FRO-316 follow-up)

Date: 2026-10-26. Baseline: updatedAt 2026-10-26T08:07:42.252Z; Todo; Shipment/Pending_Review/Backend/Epic; 0.0.7; blocks 316/341; related 322/324/323/299/345/344/300/343/342/329; 2 attachments (fro-316-fbc664); no comments. Production main 5c51030.

## Findings
1. Participation read lacks Order display data (owner ref, client, vessel, supplier) and the root Order number (`ShipmentParticipation` has only id/number; `PurchaseOrder.rootPurchaseOrderId` is an id).
2. No read of current readiness/dispatch blockers; FRO-316 lists them before the user acts.
3. Load-unit net weight/notes are stored but no UI edits them; omission semantics undefined.
4. DB enforces label varchar(100) unique per Shipment, gross > 0, 0 ≤ net ≤ gross, notes varchar(1000); not stated in FRO-325. FRO-316's editor validation lacks label rules.
5. Context cited main 38edae8; now 5c51030.

## Decisions (accepted 2026-10-26)
Q1 targeted edit; Q2 live Order display data + root Order (id, number) on the read; Q3 readiness/dispatch blocker lists with stable codes, same checks as commands; Q4 omitted net weight/notes kept, cleared only explicitly; Q5 state label/weight rules in FRO-325 and add label validation to FRO-316 (stays Ready).

## Consumer trace
| Consumer | Current | Required | Owner |
| -- | -- | -- | -- |
| FRO-316 Purchase orders table | No data source | Display data on read | FRO-325 |
| FRO-316 status card blockers | Errors only on command | Blocker lists on read | FRO-325 |
| FRO-316 packing editor | Gross only | Net/notes preserved on omission; label rules validated | FRO-325 / FRO-316 |
| FRO-341 composer | Sends empty net/notes on create | Unchanged (create has no prior values) | — |
| MCP/REST Shipment reads | Same gaps | Same additions | FRO-325 |

Drafts: drafts/fro325-consumer-additions.md (full FRO-325 description); FRO-316 one-sentence patch in the Packing editor Validation bullet.
