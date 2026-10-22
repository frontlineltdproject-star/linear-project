package com.frontline.forwarding.domain.purchaseorders;

public enum PurchaseOrderStatus {
	PENDING,
	EXPECTED_READINESS,
	READY,
	IN_STOCK,
	PREPARED_FOR_SHIPMENT,
	SHIPPED,
	AWAITING_IMPORT,
	ARRIVED_AT_DESTINATION,
	LOCATION_UNKNOWN,
	CANCELLED
}

