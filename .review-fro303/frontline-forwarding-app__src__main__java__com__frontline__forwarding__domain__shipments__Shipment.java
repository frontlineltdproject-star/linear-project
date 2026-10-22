package com.frontline.forwarding.domain.shipments;

import java.time.OffsetDateTime;

public record Shipment(
		Long id,
		String shipmentNumber,
		ShipmentMode mode,
		ShipmentPurpose purpose,
		Long originWarehouseId,
		ShipmentDestination destination,
		ShipmentStatus status,
		ShipmentTransportDocument transportDocument,
		String cancellationReason,
		String locationUnknownReason,
		Long createdById,
		OffsetDateTime createdAt,
		OffsetDateTime dispatchedAt,
		OffsetDateTime arrivedAt,
		OffsetDateTime cancelledAt,
		OffsetDateTime locationUnknownAt,
		long version
) {
}

