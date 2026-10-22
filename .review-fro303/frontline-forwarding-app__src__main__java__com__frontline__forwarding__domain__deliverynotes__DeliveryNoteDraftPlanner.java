package com.frontline.forwarding.domain.deliverynotes;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DeliveryNoteDraftPlanner {

	private final DeliveryNoteLineFactory lineFactory;

	public List<DeliveryNoteDraftPlan> plan(
			Long shipmentId,
			List<ParticipatingPurchaseOrder> purchaseOrders
	) {
		if (shipmentId == null) {
			throw new IllegalArgumentException("Shipment id is required");
		}
		if (purchaseOrders == null || purchaseOrders.isEmpty()) {
			throw new IllegalArgumentException("Shipment must contain participating POs");
		}
		if (purchaseOrders.stream().anyMatch(po -> po.invoiceCompanyId() == null)) {
			throw new IllegalArgumentException("Every participating PO must have an invoice company");
		}

		Map<Long, List<ParticipatingPurchaseOrder>> byInvoiceCompany = purchaseOrders.stream()
				.sorted(Comparator.comparing(ParticipatingPurchaseOrder::purchaseOrderId))
				.collect(java.util.stream.Collectors.groupingBy(
						ParticipatingPurchaseOrder::invoiceCompanyId,
						LinkedHashMap::new,
						java.util.stream.Collectors.toList()
				));

		return byInvoiceCompany.entrySet().stream()
				.map(entry -> toPlan(shipmentId, entry.getKey(), entry.getValue()))
				.toList();
	}

	private DeliveryNoteDraftPlan toPlan(
			Long shipmentId,
			Long invoiceCompanyId,
			List<ParticipatingPurchaseOrder> purchaseOrders
	) {
		List<Long> vesselIds = purchaseOrders.stream()
				.map(ParticipatingPurchaseOrder::vesselId)
				.filter(Objects::nonNull)
				.distinct()
				.toList();
		if (vesselIds.size() > 1) {
			throw new IllegalArgumentException("A delivery note cannot contain POs for different vessels");
		}
		List<DeliveryNoteLine> lines = lineFactory.create(purchaseOrders.stream()
				.map(po -> new DeliveryNoteLineFactory.PurchaseOrderCollis(
						po.purchaseOrderId(),
						po.grossWeightsKg()
				))
				.toList());
		return new DeliveryNoteDraftPlan(
				shipmentId,
				invoiceCompanyId,
				vesselIds.isEmpty() ? null : vesselIds.getFirst(),
				lines,
				lines.stream().mapToInt(DeliveryNoteLine::colliQuantity).sum(),
				lines.stream()
						.map(DeliveryNoteLine::grossWeightKg)
						.reduce(BigDecimal.ZERO, BigDecimal::add)
		);
	}

	public record ParticipatingPurchaseOrder(
			Long purchaseOrderId,
			Long invoiceCompanyId,
			Long vesselId,
			List<BigDecimal> grossWeightsKg
	) {
		public ParticipatingPurchaseOrder {
			if (purchaseOrderId == null) {
				throw new IllegalArgumentException("Participating PO id is required");
			}
			grossWeightsKg = grossWeightsKg == null
					? List.of()
					: Collections.unmodifiableList(new ArrayList<>(grossWeightsKg));
		}
	}
}

