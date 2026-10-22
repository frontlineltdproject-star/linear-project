package com.frontline.forwarding.domain.warehouses;

import java.time.OffsetDateTime;

import com.frontline.forwarding.domain.addresses.StreetAddress;

public record FreightWarehouse(
		Long id,
		String code,
		String name,
		Long operatorCompanyId,
		FreightWarehouseKind kind,
		Long cityId,
		String street,
		String number,
		String postalCode,
		boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt,
		long version
) {
	public String addressLine() {
		return new StreetAddress(street, number).addressLine();
	}
}

