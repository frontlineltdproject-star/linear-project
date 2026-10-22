package com.frontline.forwarding.domain.purchaseorders;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public record PurchaseOrder(
		Long id,
		String internalNumber,
		PurchaseOrderLineage lineage,
		PurchaseOrderParties parties,
		Long openingWarehouseId,
		PurchaseOrderStatus status,
		PurchaseOrderCompletionOutcome completionOutcome,
		PurchaseOrderReferences references,
		boolean urgent,
		LocalDate readinessDate,
		String readinessRemark,
		PurchaseOrderRoute route,
		PurchaseOrderDocuments documents,
		PurchaseOrderCustomsValue customsValue,
		String urgentInformation,
		String notes,
		Long createdById,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt,
		OffsetDateTime statusChangedAt,
		long version
) {
	public PurchaseOrder(
			Long id,
			String internalNumber,
			PurchaseOrderParties parties,
			Long openingWarehouseId,
			PurchaseOrderStatus status,
			PurchaseOrderCompletionOutcome completionOutcome,
			PurchaseOrderReferences references,
			boolean urgent,
			LocalDate readinessDate,
			String readinessRemark,
			PurchaseOrderRoute route,
			PurchaseOrderDocuments documents,
			PurchaseOrderCustomsValue customsValue,
			String urgentInformation,
			String notes,
			Long createdById,
			OffsetDateTime createdAt,
			OffsetDateTime updatedAt,
			OffsetDateTime statusChangedAt,
			long version
	) {
		this(
				id,
				internalNumber,
				PurchaseOrderLineage.root(references.ownerReference()),
				parties,
				openingWarehouseId,
				status,
				completionOutcome,
				references,
				urgent,
				readinessDate,
				readinessRemark,
				route,
				documents,
				customsValue,
				urgentInformation,
				notes,
				createdById,
				createdAt,
				updatedAt,
				statusChangedAt,
				version
		);
	}
}

