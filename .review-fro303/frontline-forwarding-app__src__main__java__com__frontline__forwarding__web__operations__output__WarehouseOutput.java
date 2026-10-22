package com.frontline.forwarding.web.operations.output;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.jspecify.annotations.Nullable;

public record WarehouseOutput(
		Long id,
		String code,
		String name,
		String kind,
		CompanyReferenceOutput operatorCompany,
		@JsonInclude(JsonInclude.Include.NON_NULL) @Nullable LocationReferenceOutput country,
		@JsonInclude(JsonInclude.Include.NON_NULL) @Nullable LocationReferenceOutput city,
		@JsonInclude(JsonInclude.Include.NON_NULL) @Nullable String address,
		@JsonInclude(JsonInclude.Include.NON_NULL) @Nullable String street,
		@JsonInclude(JsonInclude.Include.NON_NULL) @Nullable String number,
		@JsonInclude(JsonInclude.Include.NON_NULL) @Nullable String postalCode,
		boolean active
) {
}

