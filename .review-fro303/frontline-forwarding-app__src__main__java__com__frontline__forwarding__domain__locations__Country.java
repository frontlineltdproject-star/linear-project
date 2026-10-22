package com.frontline.forwarding.domain.locations;

public record Country(
		Long id,
		String name,
		String currencyCode,
		String currencyName,
		String currencySymbol
) {
}

