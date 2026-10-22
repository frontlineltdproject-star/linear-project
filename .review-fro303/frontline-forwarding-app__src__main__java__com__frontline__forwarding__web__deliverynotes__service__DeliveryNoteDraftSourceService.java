package com.frontline.forwarding.web.deliverynotes.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.frontline.forwarding.domain.access.AuthorizationService;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNoteAuthorizationService;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNoteDraftPlan;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNoteDraftPlanner;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnit;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitMembershipRepository;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitRepository;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitTerminalDisposition;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitTerminalDispositionRepository;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrder;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderRepository;
import com.frontline.forwarding.domain.shipments.ShipmentPurchaseOrderParticipationRepository;
import com.frontline.forwarding.domain.shipments.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DeliveryNoteDraftSourceService {

	private final AuthorizationService authorizationService;
	private final DeliveryNoteAuthorizationService deliveryNoteAuthorizationService;
	private final ShipmentRepository shipmentRepository;
	private final ShipmentPurchaseOrderParticipationRepository participationRepository;
	private final PurchaseOrderRepository purchaseOrderRepository;
	private final HandlingUnitMembershipRepository membershipRepository;
	private final HandlingUnitRepository handlingUnitRepository;
	private final HandlingUnitTerminalDispositionRepository terminalDispositionRepository;
	private final DeliveryNoteDraftPlanner planner;

	@Transactional(readOnly = true)
	public List<DeliveryNoteDraftPlan> planForShipment(Long shipmentId) {
		var actor = authorizationService.currentUser();
		deliveryNoteAuthorizationService.requireCreate(actor);
		if (shipmentId == null || shipmentRepository.findById(shipmentId).isEmpty()) {
			throw new IllegalArgumentException("Shipment does not exist");
		}
		var purchaseOrders = participationRepository.findByShipmentId(shipmentId).stream()
				.map(participation -> purchaseOrderRepository.findById(participation.purchaseOrderId())
						.orElseThrow(() -> new IllegalStateException("Participating PO does not exist")))
				.map(this::source)
				.toList();
		return planner.plan(shipmentId, purchaseOrders);
	}

	private DeliveryNoteDraftPlanner.ParticipatingPurchaseOrder source(PurchaseOrder purchaseOrder) {
		List<Long> handlingUnitIds = membershipRepository.findActiveByPurchaseOrderId(purchaseOrder.id()).stream()
				.map(membership -> membership.handlingUnitId())
				.toList();
		Set<Long> terminalHandlingUnitIds = terminalDispositionRepository
				.findByPurchaseOrderIdAtDisposition(purchaseOrder.id()).stream()
				.map(HandlingUnitTerminalDisposition::handlingUnitId)
				.collect(Collectors.toSet());
		List<BigDecimal> weights = handlingUnitRepository.findByIds(handlingUnitIds).stream()
				.filter(unit -> !terminalHandlingUnitIds.contains(unit.id()))
				.map(this::grossWeight)
				.toList();
		return new DeliveryNoteDraftPlanner.ParticipatingPurchaseOrder(
				purchaseOrder.id(),
				purchaseOrder.parties().invoiceCompanyId(),
				purchaseOrder.parties().vesselId(),
				weights
		);
	}

	private BigDecimal grossWeight(HandlingUnit handlingUnit) {
		return handlingUnit.declaredWeight() == null
				? null
				: handlingUnit.declaredWeight().gross();
	}
}

