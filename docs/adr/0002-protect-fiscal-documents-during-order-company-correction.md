# Protect fiscal documents during Order invoicing-company correction

An Order's invoicing company can be corrected after Shipment inclusion, but issued and in-flight delivery notes retain independent fiscal snapshots. Require explicit cancellation/reconciliation before changing an Order covered by those notes; regroup only unsubmitted drafts, atomically with the selected Order's company change. This preserves fiscal evidence and split-Order independence while avoiding the dead end caused by blocking every draft, including replacements automatically prepared after cancellation.
