package com.frontline.forwarding.web.shipments.service;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.frontline.forwarding.domain.access.AuthorizationService;
import com.frontline.forwarding.domain.attachments.AttachmentRepository;
import com.frontline.forwarding.domain.companies.Company;
import com.frontline.forwarding.domain.companies.CompanyRepository;
import com.frontline.forwarding.domain.companies.CompanyType;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnit;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitJourneyEventRepository;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitJourneyEventRepository.HandlingUnitJourneyEventDraft;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitJourneyEventType;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitMembershipRepository;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitMembershipRepository.HandlingUnitMembershipDraft;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitMembershipReason;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitPurchaseOrderMembership;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitRepository;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitTerminalDisposition;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitTerminalDispositionRepository;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrder;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderActivityRepository;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderActivityRepository.PurchaseOrderActivityDraft;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderActivityType;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderCompletionOutcome;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderFilter;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderInvoiceRowRepository;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderReferences;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderRepository;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderRepository.PurchaseOrderChildIdentity;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderRepository.PurchaseOrderDraft;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderSplit;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderSplitItem;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderSplitRepository;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderSplitRepository.PurchaseOrderSplitDraft;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderSort;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderSortField;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderStatus;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderStatusTransitionRepository;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderStatusTransitionRepository.PurchaseOrderStatusTransitionDraft;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderWarehouseStay;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderWarehouseStayRepository;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderWarehouseStayRepository.PurchaseOrderWarehouseStayDraft;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderWarehouseStayRepository.PurchaseOrderWarehouseStayUpdate;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderWarehouseStayState;
import com.frontline.forwarding.domain.shipments.Shipment;
import com.frontline.forwarding.domain.shipments.ShipmentAuthorizationService;
import com.frontline.forwarding.domain.shipments.ShipmentDestinationKind;
import com.frontline.forwarding.domain.shipments.ShipmentFilter;
import com.frontline.forwarding.domain.shipments.ShipmentHandoverRecipientKind;
import com.frontline.forwarding.domain.shipments.ShipmentHandoverRepository;
import com.frontline.forwarding.domain.shipments.ShipmentHandoverRepository.ShipmentHandoverDraft;
import com.frontline.forwarding.domain.shipments.ShipmentLoadUnit;
import com.frontline.forwarding.domain.shipments.ShipmentLoadUnitContent;
import com.frontline.forwarding.domain.shipments.ShipmentLoadUnitContentRepository;
import com.frontline.forwarding.domain.shipments.ShipmentLoadUnitContentRepository.ShipmentLoadUnitContentDraft;
import com.frontline.forwarding.domain.shipments.ShipmentLoadUnitRepository;
import com.frontline.forwarding.domain.shipments.ShipmentLoadUnitRepository.ShipmentLoadUnitDraft;
import com.frontline.forwarding.domain.shipments.ShipmentMovementCloseReason;
import com.frontline.forwarding.domain.shipments.ShipmentPurchaseOrderParticipation;
import com.frontline.forwarding.domain.shipments.ShipmentPurchaseOrderParticipationRepository;
import com.frontline.forwarding.domain.shipments.ShipmentPurpose;
import com.frontline.forwarding.domain.shipments.ShipmentRepository;
import com.frontline.forwarding.domain.shipments.ShipmentRepository.ShipmentDraft;
import com.frontline.forwarding.domain.shipments.ShipmentSort;
import com.frontline.forwarding.domain.shipments.ShipmentSortField;
import com.frontline.forwarding.domain.shipments.ShipmentStatus;
import com.frontline.forwarding.domain.users.User;
import com.frontline.forwarding.domain.vessels.Vessel;
import com.frontline.forwarding.domain.vessels.VesselRepository;
import com.frontline.forwarding.domain.warehouses.FreightWarehouse;
import com.frontline.forwarding.domain.warehouses.FreightWarehouseKind;
import com.frontline.forwarding.domain.warehouses.FreightWarehouseRepository;
import com.frontline.forwarding.web.shipments.input.ShipmentArrivalInput;
import com.frontline.forwarding.web.shipments.input.ShipmentCancelInput;
import com.frontline.forwarding.web.shipments.input.ShipmentCreateInput;
import com.frontline.forwarding.web.shipments.input.ShipmentDispatchInput;
import com.frontline.forwarding.web.shipments.input.ShipmentFilterInput;
import com.frontline.forwarding.web.shipments.input.ShipmentLocationUnknownInput;
import com.frontline.forwarding.web.shipments.input.ShipmentSortInput;
import com.frontline.forwarding.web.purchaseorders.input.PurchaseOrderSortInput;
import com.frontline.forwarding.web.purchaseorders.service.PurchaseOrderOutputAssembler;
import com.frontline.forwarding.web.shipments.output.PurchaseOrderShipmentCandidateOutput;
import com.frontline.forwarding.web.shipments.output.PurchaseOrderShipmentCandidatePageOutput;
import com.frontline.forwarding.web.shipments.output.ShipmentEligibleHandlingUnitOutput;
import com.frontline.forwarding.web.shipments.output.ShipmentOutput;
import com.frontline.forwarding.web.shipments.output.ShipmentPageOutput;
import com.frontline.forwarding.web.shipments.service.ShipmentInputValidator.ValidatedCreate;
import com.frontline.forwarding.web.shipments.service.ShipmentInputValidator.ValidatedHandover;
import com.frontline.forwarding.web.shipments.service.ShipmentInputValidator.ValidatedLoadUnit;
import com.frontline.forwarding.web.shipments.service.ShipmentInputValidator.ValidatedPartialSelection;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class ShipmentsApiService {

	private static final int DEFAULT_PAGE_SIZE = 20;
	private static final int MAX_PAGE_SIZE = 100;
	private static final String DUPLICATE_TRANSPORT_DOCUMENT_MESSAGE =
			"Transport document is already assigned to another shipment";

	private final AuthorizationService authorizationService;
	private final ShipmentAuthorizationService shipmentAuthorizationService;
	private final ShipmentRepository shipmentRepository;
	private final ShipmentPurchaseOrderParticipationRepository participationRepository;
	private final ShipmentLoadUnitRepository loadUnitRepository;
	private final ShipmentLoadUnitContentRepository contentRepository;
	private final ShipmentHandoverRepository handoverRepository;
	private final PurchaseOrderRepository purchaseOrderRepository;
	private final PurchaseOrderInvoiceRowRepository invoiceRowRepository;
	private final PurchaseOrderSplitRepository splitRepository;
	private final AttachmentRepository attachmentRepository;
	private final PurchaseOrderStatusTransitionRepository transitionRepository;
	private final PurchaseOrderActivityRepository activityRepository;
	private final PurchaseOrderWarehouseStayRepository warehouseStayRepository;
	private final HandlingUnitRepository handlingUnitRepository;
	private final HandlingUnitMembershipRepository membershipRepository;
	private final HandlingUnitTerminalDispositionRepository terminalDispositionRepository;
	private final HandlingUnitJourneyEventRepository journeyEventRepository;
	private final FreightWarehouseRepository warehouseRepository;
	private final CompanyRepository companyRepository;
	private final VesselRepository vesselRepository;
	private final ShipmentOutputAssembler outputAssembler;
	private final PurchaseOrderOutputAssembler purchaseOrderOutputAssembler;

	public ShipmentPageOutput list(Integer page, Integer size) {
		return list(null, page, size, null);
	}

	public ShipmentPageOutput list(
			ShipmentFilterInput filter,
			Integer page,
			Integer size,
			ShipmentSortInput sort
	) {
		User actor = authorizationService.currentUser();
		shipmentAuthorizationService.requireView(actor);
		int safePage = page == null || page < 0 ? 0 : page;
		int safeSize = normalizeSize(size);
		ShipmentFilter shipmentFilter = toFilter(filter);
		long totalElements = shipmentRepository.count(shipmentFilter);
		List<Shipment> shipments = shipmentRepository.findPage(
				shipmentFilter,
				(long) safePage * safeSize,
				safeSize,
				toSort(sort)
		);
		return new ShipmentPageOutput(
				outputAssembler.assembleSummaries(shipments),
				safePage,
				safeSize,
				totalElements,
				(int) Math.ceil((double) totalElements / safeSize)
		);
	}

	public PurchaseOrderShipmentCandidatePageOutput eligiblePurchaseOrders(
			Long originWarehouseId,
			String search,
			Integer page,
			Integer size,
			PurchaseOrderSortInput sort
	) {
		User actor = authorizationService.currentUser();
		shipmentAuthorizationService.requireCreate(actor);
		if (originWarehouseId == null || warehouseRepository.findById(originWarehouseId).isEmpty()) {
			throw new IllegalArgumentException("Valid origin warehouse is required");
		}
		int safePage = page == null || page < 0 ? 0 : page;
		int safeSize = normalizeSize(size);
		PurchaseOrderFilter filter = new PurchaseOrderFilter(
				search,
				Set.of(
						PurchaseOrderStatus.IN_STOCK,
						PurchaseOrderStatus.READY,
						PurchaseOrderStatus.EXPECTED_READINESS
				),
				null,
				null,
				null,
				originWarehouseId,
				null,
				null,
				null,
				null,
				null,
				null,
				true,
				true
		);
		long totalElements = purchaseOrderRepository.count(filter, null);
		List<PurchaseOrder> purchaseOrders = purchaseOrderRepository.findPage(
				filter,
				(long) safePage * safeSize,
				safeSize,
				toPurchaseOrderSort(sort),
				null
		);
		List<PurchaseOrderShipmentCandidateOutput> candidates = purchaseOrders.stream().map(purchaseOrder -> {
			List<Long> handlingUnitIds = membershipRepository.findActiveByPurchaseOrderId(purchaseOrder.id()).stream()
					.map(HandlingUnitPurchaseOrderMembership::handlingUnitId)
					.toList();
			Set<Long> terminalIds = handlingUnitIds.stream()
					.filter(id -> terminalDispositionRepository.findByHandlingUnitId(id).isPresent())
					.collect(Collectors.toSet());
			List<ShipmentEligibleHandlingUnitOutput> handlingUnits = handlingUnitRepository.findByIds(handlingUnitIds).stream()
					.filter(unit -> !terminalIds.contains(unit.id()))
					.map(this::eligibleHandlingUnit)
					.toList();
			return new PurchaseOrderShipmentCandidateOutput(
					purchaseOrderOutputAssembler.toSummary(purchaseOrder),
					handlingUnits
			);
		}).toList();
		return new PurchaseOrderShipmentCandidatePageOutput(
				candidates,
				safePage,
				safeSize,
				totalElements,
				(int) Math.ceil((double) totalElements / safeSize)
		);
	}

	private ShipmentEligibleHandlingUnitOutput eligibleHandlingUnit(HandlingUnit handlingUnit) {
		var dimensions = handlingUnit.declaredDimensions();
		var weight = handlingUnit.declaredWeight();
		return new ShipmentEligibleHandlingUnitOutput(
				handlingUnit.id(),
				handlingUnit.trackingCode(),
				handlingUnit.pcs(),
				handlingUnit.setDescription(),
				dimensions == null ? null : dimensions.length(),
				dimensions == null ? null : dimensions.width(),
				dimensions == null ? null : dimensions.height(),
				weight == null ? null : weight.gross(),
				weight == null ? null : weight.net(),
				handlingUnit.packageType() == null ? null : handlingUnit.packageType().name(),
				handlingUnit.dangerousClass() == null ? null : handlingUnit.dangerousClass().name(),
				false
		);
	}

	public ShipmentOutput findById(Long id) {
		User actor = authorizationService.currentUser();
		shipmentAuthorizationService.requireView(actor);
		if (id == null) {
			return null;
		}
		return shipmentRepository.findById(id).map(outputAssembler::assemble).orElse(null);
	}

	@Transactional
	public ShipmentOutput create(ShipmentCreateInput input) {
		User actor = authorizationService.currentUser();
		shipmentAuthorizationService.requireCreate(actor);
		ValidatedCreate request = ShipmentInputValidator.validateCreate(input);
		validateAndLockRoute(request);

		List<Long> selectedIds = request.selectedHandlingUnitIds().stream().sorted().toList();
		Map<Long, HandlingUnitPurchaseOrderMembership> initialMemberships = selectedIds.stream()
				.map(id -> membershipRepository.findActiveByHandlingUnitId(id)
						.orElseThrow(() -> new IllegalArgumentException("Every selected handling unit needs a current purchase order")))
				.collect(Collectors.toMap(
						HandlingUnitPurchaseOrderMembership::handlingUnitId,
						Function.identity()
				));
		List<Long> purchaseOrderIds = initialMemberships.values().stream()
				.map(HandlingUnitPurchaseOrderMembership::purchaseOrderId)
				.distinct()
				.sorted()
				.toList();
		List<PurchaseOrder> observedOrders = purchaseOrderRepository.findByIds(purchaseOrderIds);
		if (observedOrders.size() != purchaseOrderIds.size()) {
			throw new IllegalArgumentException("Every selected handling unit must belong to an existing purchase order");
		}
		Set<Long> purchaseOrderLockIds = observedOrders.stream()
				.flatMap(order -> java.util.stream.Stream.of(
						order.id(),
						order.lineage().effectiveRootPurchaseOrderId(order.id())
				))
				.collect(Collectors.toCollection(LinkedHashSet::new));
		List<PurchaseOrder> allLockedOrders = purchaseOrderRepository.findByIdsForUpdate(purchaseOrderLockIds);
		Map<Long, PurchaseOrder> lockedOrderById = allLockedOrders.stream()
				.collect(Collectors.toMap(PurchaseOrder::id, Function.identity()));
		List<PurchaseOrder> lockedOrders = purchaseOrderIds.stream()
				.map(lockedOrderById::get)
				.filter(Objects::nonNull)
				.toList();
		if (lockedOrders.size() != purchaseOrderIds.size()) {
			throw new IllegalArgumentException("Every selected handling unit must belong to an existing purchase order");
		}
		List<Long> allCurrentHandlingUnitIds = lockedOrders.stream()
				.flatMap(order -> membershipRepository.findActiveByPurchaseOrderId(order.id()).stream())
				.map(HandlingUnitPurchaseOrderMembership::handlingUnitId)
				.distinct()
				.sorted()
				.toList();
		List<HandlingUnit> lockedHandlingUnits = handlingUnitRepository.findByIdsForUpdate(allCurrentHandlingUnitIds);
		if (lockedHandlingUnits.size() != allCurrentHandlingUnitIds.size()) {
			throw new IllegalArgumentException("Every purchase order membership must reference an existing handling unit");
		}
		List<HandlingUnitPurchaseOrderMembership> allLockedMemberships =
				membershipRepository.findActiveByHandlingUnitIdsForUpdate(allCurrentHandlingUnitIds);
		Map<Long, HandlingUnitPurchaseOrderMembership> allMembershipsByHandlingUnitId = allLockedMemberships.stream()
				.collect(Collectors.toMap(
						HandlingUnitPurchaseOrderMembership::handlingUnitId,
						Function.identity()
				));
		if (allMembershipsByHandlingUnitId.size() != allCurrentHandlingUnitIds.size()
				|| selectedIds.stream().anyMatch(id -> !sameMembership(
						initialMemberships.get(id),
						allMembershipsByHandlingUnitId.get(id)
				))) {
			throw new IllegalArgumentException("A selected handling unit changed purchase order during shipment creation");
		}
		Map<Long, HandlingUnitPurchaseOrderMembership> membershipByHandlingUnitId = selectedIds.stream()
				.collect(Collectors.toMap(Function.identity(), allMembershipsByHandlingUnitId::get));

		Set<Long> terminalIds = new LinkedHashSet<>();
		for (Long handlingUnitId : allCurrentHandlingUnitIds) {
			if (terminalDispositionRepository.findByHandlingUnitIdForUpdate(handlingUnitId).isPresent()) {
				terminalIds.add(handlingUnitId);
			}
			if (selectedIds.contains(handlingUnitId) && terminalIds.contains(handlingUnitId)) {
				throw new IllegalArgumentException("Terminal handling units cannot be shipped");
			}
		}
		if (!contentRepository.findActiveAllocationsByHandlingUnitIds(allCurrentHandlingUnitIds).isEmpty()) {
			throw new IllegalArgumentException("A participating purchase order contains a colli already allocated to a shipment");
		}

		Map<Long, PurchaseOrderWarehouseStay> sourceStayByOrderId = new LinkedHashMap<>();
		Map<Long, Set<Long>> selectedByOrderId = allLockedMemberships.stream()
				.filter(membership -> selectedIds.contains(membership.handlingUnitId()))
				.collect(Collectors.groupingBy(
						HandlingUnitPurchaseOrderMembership::purchaseOrderId,
						LinkedHashMap::new,
						Collectors.mapping(
								HandlingUnitPurchaseOrderMembership::handlingUnitId,
								Collectors.toCollection(LinkedHashSet::new)
						)
				));
		Map<Long, ValidatedPartialSelection> partialDecisionByOrderId = request.partialSelections().stream()
				.collect(Collectors.toMap(ValidatedPartialSelection::purchaseOrderId, Function.identity()));
		List<PartialShipmentSplitOperation> partialSplits = new ArrayList<>();
		for (PurchaseOrder order : lockedOrders) {
			PurchaseOrderWarehouseStay sourceStay = warehouseStayRepository
					.findActiveByPurchaseOrderIdForUpdate(order.id())
					.orElseThrow(() -> new IllegalArgumentException("Purchase order has no active warehouse stay"));
			if (!request.originWarehouseId().equals(sourceStay.warehouseId())
					|| !shipmentPlanningEligible(order, sourceStay)) {
				throw new IllegalArgumentException(
						"Every purchase order must be in stock, ready at supplier, or expected ready within two days"
				);
			}
			sourceStayByOrderId.put(order.id(), sourceStay);

			List<HandlingUnitPurchaseOrderMembership> orderMemberships = allLockedMemberships.stream()
					.filter(membership -> membership.purchaseOrderId().equals(order.id()))
					.toList();
			Set<Long> allEligibleIds = orderMemberships.stream()
					.map(HandlingUnitPurchaseOrderMembership::handlingUnitId)
					.filter(id -> !terminalIds.contains(id))
					.collect(Collectors.toCollection(LinkedHashSet::new));
			Set<Long> selectedOrderIds = selectedByOrderId.getOrDefault(order.id(), Set.of());
			Set<Long> remainingIds = allEligibleIds.stream()
					.filter(id -> !selectedOrderIds.contains(id))
					.collect(Collectors.toCollection(LinkedHashSet::new));
			ValidatedPartialSelection decision = partialDecisionByOrderId.get(order.id());
			if (!remainingIds.isEmpty() && decision == null) {
				throw new IllegalArgumentException("Shipment selection must include every current nonterminal colli of each purchase order");
			}
			if (!remainingIds.isEmpty() && order.status() != PurchaseOrderStatus.IN_STOCK) {
				throw new IllegalArgumentException(
						"An upcoming purchase order must include every current nonterminal colli"
				);
			}
			if (remainingIds.isEmpty() && decision != null) {
				throw new IllegalArgumentException("A partial-selection decision is valid only for a partial PO selection");
			}
			if (!remainingIds.isEmpty()) {
				partialSplits.add(new PartialShipmentSplitOperation(
						order,
						sourceStay,
						orderMemberships,
						selectedOrderIds,
						decision
				));
			}
		}
		if (!purchaseOrderIds.containsAll(partialDecisionByOrderId.keySet())) {
			throw new IllegalArgumentException("Every partial selection must belong to a participating purchase order");
		}
		validateDeliveryVessel(request, lockedOrders);

		OffsetDateTime occurredAt = OffsetDateTime.now();
		requireWorkflowChronology(
				occurredAt,
				lockedOrders,
				selectedIds,
				"Shipment reservation"
		);
		UUID commandId = UUID.randomUUID();
		Shipment shipment = shipmentRepository.create(new ShipmentDraft(
				null,
				request.mode(),
				request.purpose(),
				request.originWarehouseId(),
				request.destination(),
				null,
				actor.id()
		));
		Map<Long, PurchaseOrder> shipmentOrderByParentId = lockedOrders.stream()
				.collect(Collectors.toMap(PurchaseOrder::id, Function.identity(), (left, right) -> left, LinkedHashMap::new));
		Map<Long, PurchaseOrderWarehouseStay> shipmentStayByOrderId = new LinkedHashMap<>(sourceStayByOrderId);
		for (PartialShipmentSplitOperation split : partialSplits) {
			ShippingChild child = createInStockShippingChild(split, shipment, actor.id(), occurredAt);
			shipmentOrderByParentId.put(split.parent().id(), child.purchaseOrder());
			shipmentStayByOrderId.put(child.purchaseOrder().id(), child.warehouseStay());
			child.memberships().forEach(membership ->
					membershipByHandlingUnitId.put(membership.handlingUnitId(), membership));
		}
		Map<Long, ShipmentPurchaseOrderParticipation> participationByOrderId = new LinkedHashMap<>();
		List<PurchaseOrder> shipmentOrders = shipmentOrderByParentId.values().stream().toList();
		for (PurchaseOrder order : shipmentOrders) {
			participationByOrderId.put(
					order.id(),
					participationRepository.create(
							shipment.id(),
							order.id(),
							shipmentStayByOrderId.get(order.id()).id()
					)
			);
		}

		Map<Long, Long> loadUnitIdByHandlingUnitId = new LinkedHashMap<>();
		Set<String> usedLabels = new LinkedHashSet<>();
		for (int index = 0; index < request.loadUnits().size(); index++) {
			ValidatedLoadUnit requestedLoadUnit = request.loadUnits().get(index);
			int sequenceNumber = index + 1;
			String label = requestedLoadUnit.label() == null
					? shipment.shipmentNumber() + "-LU-" + sequenceNumber
					: requestedLoadUnit.label();
			if (!usedLabels.add(label)) {
				throw new IllegalArgumentException("Shipment load-unit labels must be unique");
			}
			ShipmentLoadUnit loadUnit = loadUnitRepository.create(
					shipment.id(),
					new ShipmentLoadUnitDraft(
							sequenceNumber,
							requestedLoadUnit.type(),
							label,
							requestedLoadUnit.dimensions(),
							requestedLoadUnit.weight(),
							requestedLoadUnit.notes()
					)
			);
			for (Long handlingUnitId : requestedLoadUnit.handlingUnitIds()) {
				HandlingUnitPurchaseOrderMembership membership = membershipByHandlingUnitId.get(handlingUnitId);
				ShipmentPurchaseOrderParticipation participation =
						participationByOrderId.get(membership.purchaseOrderId());
				contentRepository.create(new ShipmentLoadUnitContentDraft(
						shipment.id(),
						loadUnit.id(),
						participation.id(),
						membership.purchaseOrderId(),
						handlingUnitId
				));
				loadUnitIdByHandlingUnitId.put(handlingUnitId, loadUnit.id());
			}
		}
		for (Long handlingUnitId : selectedIds) {
			if (loadUnitIdByHandlingUnitId.containsKey(handlingUnitId)) {
				continue;
			}
			HandlingUnitPurchaseOrderMembership membership = membershipByHandlingUnitId.get(handlingUnitId);
			ShipmentPurchaseOrderParticipation participation =
					participationByOrderId.get(membership.purchaseOrderId());
			contentRepository.create(new ShipmentLoadUnitContentDraft(
					shipment.id(),
					null,
					participation.id(),
					membership.purchaseOrderId(),
					handlingUnitId
			));
		}

		for (PurchaseOrder order : shipmentOrders) {
			if (order.status() == PurchaseOrderStatus.IN_STOCK) {
				updatePurchaseOrderStatus(
						order,
						PurchaseOrderStatus.PREPARED_FOR_SHIPMENT,
						null,
						"Reserved for shipment " + shipment.shipmentNumber(),
						commandId,
						actor.id(),
						occurredAt,
						PurchaseOrderActivityType.SHIPMENT_RESERVED
				);
			} else {
				String reason = "Planned for shipment " + shipment.shipmentNumber();
				activityRepository.create(new PurchaseOrderActivityDraft(
						order.id(),
						PurchaseOrderActivityType.SHIPMENT_RESERVED,
						reason,
						shipmentMetadata(reason, order.id()),
						actor.id(),
						occurredAt
				));
			}
		}
		for (Long handlingUnitId : selectedIds) {
			Long purchaseOrderId = membershipByHandlingUnitId.get(handlingUnitId).purchaseOrderId();
			appendJourneyEvent(
					commandId,
					handlingUnitId,
					purchaseOrderId,
					HandlingUnitJourneyEventType.RESERVED_FOR_SHIPMENT,
					null,
					shipment.id(),
					null,
					occurredAt,
					actor.id()
			);
			Long loadUnitId = loadUnitIdByHandlingUnitId.get(handlingUnitId);
			if (loadUnitId != null) {
				appendJourneyEvent(
						commandId,
						handlingUnitId,
						purchaseOrderId,
						HandlingUnitJourneyEventType.LOADED,
						null,
						shipment.id(),
						loadUnitId,
						occurredAt,
						actor.id()
				);
			}
		}
		return outputAssembler.assemble(shipmentRepository.findById(shipment.id()).orElseThrow());
	}

	private boolean shipmentPlanningEligible(
			PurchaseOrder order,
			PurchaseOrderWarehouseStay sourceStay
	) {
		if (order.status() == PurchaseOrderStatus.IN_STOCK) {
			return sourceStay.state() == PurchaseOrderWarehouseStayState.IN_STOCK;
		}
		if (sourceStay.state() != PurchaseOrderWarehouseStayState.EXPECTED) {
			return false;
		}
		if (order.status() == PurchaseOrderStatus.READY) {
			return true;
		}
		LocalDate readinessDate = order.readinessDate();
		LocalDate today = LocalDate.now();
		return order.status() == PurchaseOrderStatus.EXPECTED_READINESS
				&& readinessDate != null
				&& !readinessDate.isBefore(today);
	}

	@Transactional
	public ShipmentOutput dispatch(Long id, ShipmentDispatchInput input) {
		User actor = authorizationService.currentUser();
		shipmentAuthorizationService.requireEdit(actor);
		Shipment shipment = requireShipmentForUpdate(id);
		if (shipment.status() != ShipmentStatus.PREPARING) {
			throw new IllegalArgumentException("Only a preparing shipment can be dispatched");
		}
		var transportDocument = ShipmentInputValidator.validateDispatch(shipment.mode(), input);
		if (shipmentRepository.transportDocumentExistsForAnotherShipment(shipment.id(), transportDocument)) {
			throw new IllegalArgumentException(DUPLICATE_TRANSPORT_DOCUMENT_MESSAGE);
		}
		OffsetDateTime dispatchedAt = eventTime(input == null ? null : input.dispatchedAt());
		requireNotBefore(dispatchedAt, shipment.createdAt(), "Shipment dispatch cannot precede creation");

		WorkflowLocks locks = lockShipmentContents(shipment.id());
		requireOrderStatuses(
				locks.orders(),
				PurchaseOrderStatus.PREPARED_FOR_SHIPMENT,
				"Shipment dispatch"
		);
		requireWorkflowChronology(
				dispatchedAt,
				locks.orders(),
				locks.contents().stream().map(ShipmentLoadUnitContent::handlingUnitId).toList(),
				"Shipment dispatch"
		);
		Shipment dispatched;
		try {
			dispatched = shipmentRepository.dispatch(
					shipment.id(),
					shipment.version(),
					transportDocument,
					dispatchedAt
			).orElseThrow(() -> new IllegalStateException("Shipment changed during dispatch"));
		} catch (DuplicateKeyException exception) {
			throw new IllegalArgumentException(DUPLICATE_TRANSPORT_DOCUMENT_MESSAGE, exception);
		}

		UUID commandId = UUID.randomUUID();
		for (PurchaseOrder order : locks.orders()) {
			ShipmentPurchaseOrderParticipation participation = locks.participationByOrderId().get(order.id());
			PurchaseOrderWarehouseStay sourceStay = warehouseStayRepository
					.findByIdForUpdate(participation.sourceWarehouseStayId())
					.orElseThrow(() -> new IllegalStateException("Shipment source warehouse stay is missing"));
			if (sourceStay.state() != PurchaseOrderWarehouseStayState.IN_STOCK
					|| !sourceStay.warehouseId().equals(shipment.originWarehouseId())) {
				throw new IllegalArgumentException("Shipment source warehouse stay is no longer in stock");
			}
			warehouseStayRepository.updateState(sourceStay.id(), new PurchaseOrderWarehouseStayUpdate(
					PurchaseOrderWarehouseStayState.DEPARTED,
					sourceStay.expectedAt(),
					sourceStay.arrivedAt(),
					sourceStay.stockedAt(),
					dispatchedAt,
					sourceStay.storagePosition(),
					dispatchedAt
			)).orElseThrow(() -> new IllegalStateException("Shipment source stay changed during dispatch"));

			if (shipment.destination().kind() == ShipmentDestinationKind.WAREHOUSE) {
				warehouseStayRepository.create(new PurchaseOrderWarehouseStayDraft(
						order.id(),
						shipment.destination().warehouseId(),
						PurchaseOrderWarehouseStayState.AWAITING_IMPORT,
						shipment.id(),
						null,
						null,
						null,
						null,
						null,
						actor.id()
				));
			}
			PurchaseOrderStatus nextStatus = dispatchStatus(shipment);
			updatePurchaseOrderStatus(
					order,
					nextStatus,
					null,
					"Dispatched on shipment " + shipment.shipmentNumber(),
					commandId,
					actor.id(),
					dispatchedAt,
					PurchaseOrderActivityType.STATUS_CHANGED
			);
		}
		for (ShipmentLoadUnitContent content : locks.contents()) {
			appendJourneyEvent(
					commandId,
					content.handlingUnitId(),
					content.purchaseOrderIdAtLoading(),
					HandlingUnitJourneyEventType.DISPATCHED,
					null,
					shipment.id(),
					content.loadUnitId(),
					dispatchedAt,
					actor.id()
			);
		}
		return outputAssembler.assemble(dispatched);
	}

	@Transactional
	public ShipmentOutput cancel(Long id, ShipmentCancelInput input) {
		User actor = authorizationService.currentUser();
		shipmentAuthorizationService.requireEdit(actor);
		Shipment shipment = requireShipmentForUpdate(id);
		if (shipment.status() != ShipmentStatus.PREPARING) {
			throw new IllegalArgumentException("Only a preparing shipment can be cancelled");
		}
		if (input == null) {
			throw new IllegalArgumentException("Shipment cancellation input is required");
		}
		String reason = ShipmentInputValidator.requireCancellationReason(input.reason());
		OffsetDateTime cancelledAt = eventTime(input.cancelledAt());
		requireNotBefore(cancelledAt, shipment.createdAt(), "Shipment cancellation cannot precede creation");

		WorkflowLocks locks = lockShipmentContents(shipment.id());
		if (locks.orders().stream().anyMatch(order ->
				order.status() != PurchaseOrderStatus.PREPARED_FOR_SHIPMENT
						&& order.status() != PurchaseOrderStatus.READY
						&& order.status() != PurchaseOrderStatus.EXPECTED_READINESS)) {
			throw new IllegalArgumentException(
					"Shipment cancellation requires reserved or planned purchase orders"
			);
		}
		requireWorkflowChronology(
				cancelledAt,
				locks.orders(),
				locks.contents().stream().map(ShipmentLoadUnitContent::handlingUnitId).toList(),
				"Shipment cancellation"
		);
		Shipment cancelled = shipmentRepository.cancel(
				shipment.id(),
				shipment.version(),
				reason,
				cancelledAt
		).orElseThrow(() -> new IllegalStateException("Shipment changed during cancellation"));
		contentRepository.closeOpenMovements(shipment.id(), cancelledAt);
		participationRepository.closeOpenMovements(
				shipment.id(),
				ShipmentMovementCloseReason.CANCELLED,
				cancelledAt
		);

		UUID commandId = UUID.randomUUID();
		for (PurchaseOrder order : locks.orders()) {
			if (order.status() == PurchaseOrderStatus.PREPARED_FOR_SHIPMENT) {
				updatePurchaseOrderStatus(
						order,
						PurchaseOrderStatus.IN_STOCK,
						null,
						"Released from cancelled shipment " + shipment.shipmentNumber() + ": " + reason,
						commandId,
						actor.id(),
						cancelledAt,
						PurchaseOrderActivityType.SHIPMENT_RELEASED
				);
			} else {
				String releaseReason =
						"Released from cancelled shipment " + shipment.shipmentNumber() + ": " + reason;
				activityRepository.create(new PurchaseOrderActivityDraft(
						order.id(),
						PurchaseOrderActivityType.SHIPMENT_RELEASED,
						releaseReason,
						shipmentMetadata(releaseReason, order.id()),
						actor.id(),
						cancelledAt
				));
			}
		}
		for (ShipmentLoadUnitContent content : locks.contents()) {
			appendJourneyEvent(
					commandId,
					content.handlingUnitId(),
					content.purchaseOrderIdAtLoading(),
					HandlingUnitJourneyEventType.SHIPMENT_RESERVATION_RELEASED,
					null,
					shipment.id(),
					content.loadUnitId(),
					cancelledAt,
					actor.id()
			);
		}
		return outputAssembler.assemble(cancelled);
	}

	@Transactional
	public ShipmentOutput markShipmentLocationUnknown(Long id, ShipmentLocationUnknownInput input) {
		User actor = authorizationService.currentUser();
		shipmentAuthorizationService.requireEdit(actor);
		Shipment shipment = requireShipmentForUpdate(id);
		if (shipment.status() != ShipmentStatus.DISPATCHED) {
			throw new IllegalArgumentException("Only a dispatched shipment can be marked location unknown");
		}
		String reason = ShipmentInputValidator.requireLocationUnknownReason(input);
		OffsetDateTime occurredAt = eventTime(input.occurredAt());
		requireNotBefore(
				occurredAt,
				shipment.dispatchedAt(),
				"Shipment location-unknown time cannot precede dispatch"
		);

		WorkflowLocks locks = lockShipmentContents(shipment.id());
		requireOrderStatuses(
				locks.orders(),
				dispatchStatus(shipment),
				"Shipment location-unknown operation"
		);
		requireWorkflowChronology(
				occurredAt,
				locks.orders(),
				locks.contents().stream().map(ShipmentLoadUnitContent::handlingUnitId).toList(),
				"Shipment location-unknown operation"
		);
		Shipment unknown = shipmentRepository.markLocationUnknown(
				shipment.id(),
				shipment.version(),
				reason,
				occurredAt
		).orElseThrow(() -> new IllegalStateException("Shipment changed while marking location unknown"));

		UUID commandId = UUID.randomUUID();
		for (PurchaseOrder order : locks.orders()) {
			if (shipment.destination().kind() == ShipmentDestinationKind.WAREHOUSE) {
				PurchaseOrderWarehouseStay destinationStay = findDestinationStayForUpdate(shipment, order.id());
				warehouseStayRepository.updateState(
						destinationStay.id(),
						new PurchaseOrderWarehouseStayUpdate(
								PurchaseOrderWarehouseStayState.LOCATION_UNKNOWN,
								destinationStay.expectedAt(),
								destinationStay.arrivedAt(),
								destinationStay.stockedAt(),
								destinationStay.departedAt(),
								occurredAt,
								destinationStay.storagePosition(),
								occurredAt
						)
				).orElseThrow(() -> new IllegalStateException(
						"Destination warehouse stay changed while marking shipment location unknown"
				));
			}
			updatePurchaseOrderStatus(
					order,
					PurchaseOrderStatus.LOCATION_UNKNOWN,
					null,
					reason,
					commandId,
					actor.id(),
					occurredAt,
					PurchaseOrderActivityType.STATUS_CHANGED
			);
		}
		for (ShipmentLoadUnitContent content : locks.contents()) {
			appendJourneyEvent(
					commandId,
					content.handlingUnitId(),
					content.purchaseOrderIdAtLoading(),
					HandlingUnitJourneyEventType.LOCATION_UNKNOWN,
					null,
					shipment.id(),
					content.loadUnitId(),
					occurredAt,
					actor.id()
			);
		}
		return outputAssembler.assemble(unknown);
	}

	@Transactional
	public ShipmentOutput arrive(Long id, ShipmentArrivalInput input) {
		User actor = authorizationService.currentUser();
		shipmentAuthorizationService.requireEdit(actor);
		Shipment shipment = requireShipmentForUpdate(id);
		if (shipment.status() != ShipmentStatus.DISPATCHED) {
			throw new IllegalArgumentException("Only a dispatched shipment can arrive");
		}
		if (input == null) {
			throw new IllegalArgumentException("Shipment arrival input is required");
		}
		OffsetDateTime arrivedAt = eventTime(input.arrivedAt());
		requireNotBefore(arrivedAt, shipment.dispatchedAt(), "Shipment arrival cannot precede dispatch");

		WorkflowLocks locks = lockShipmentContents(shipment.id());
		requireOrderStatuses(locks.orders(), dispatchStatus(shipment), "Shipment arrival");
		requireWorkflowChronology(
				arrivedAt,
				locks.orders(),
				locks.contents().stream().map(ShipmentLoadUnitContent::handlingUnitId).toList(),
				"Shipment arrival"
		);
		ValidatedHandover handover = ShipmentInputValidator.validateHandover(shipment.purpose(), input.handover());
		validateHandoverReferences(shipment, handover, locks.orders());
		Shipment arrived = shipmentRepository.arrive(shipment.id(), shipment.version(), arrivedAt)
				.orElseThrow(() -> new IllegalStateException("Shipment changed during arrival"));
		if (handover != null) {
			handoverRepository.create(shipment.id(), new ShipmentHandoverDraft(
					handover.recipient(),
					handover.receivedBy(),
					handover.proofReference(),
					actor.id(),
					arrivedAt
			));
		}
		contentRepository.closeOpenMovements(shipment.id(), arrivedAt);

		UUID commandId = UUID.randomUUID();
		Map<Long, Long> destinationStayIdByOrderId = new LinkedHashMap<>();
		for (PurchaseOrder order : locks.orders()) {
			ShipmentPurchaseOrderParticipation participation = locks.participationByOrderId().get(order.id());
			if (shipment.destination().kind() == ShipmentDestinationKind.WAREHOUSE) {
				PurchaseOrderWarehouseStay destinationStay = findDestinationStayForUpdate(shipment, order.id());
				PurchaseOrderWarehouseStay arrivedStay = warehouseStayRepository.updateState(
						destinationStay.id(),
						new PurchaseOrderWarehouseStayUpdate(
								PurchaseOrderWarehouseStayState.AT_WAREHOUSE,
								destinationStay.expectedAt(),
								arrivedAt,
								null,
								null,
								null,
								arrivedAt
						)
				).orElseThrow(() -> new IllegalStateException("Destination warehouse stay changed during arrival"));
				destinationStayIdByOrderId.put(order.id(), arrivedStay.id());
				participationRepository.closeMovement(
						participation.id(),
						arrivedStay.id(),
						ShipmentMovementCloseReason.ARRIVED,
						arrivedAt
				).orElseThrow(() -> new IllegalStateException("Shipment participation changed during arrival"));
				updatePurchaseOrderStatus(
						order,
						PurchaseOrderStatus.AWAITING_IMPORT,
						null,
						"Arrived at warehouse on shipment " + shipment.shipmentNumber(),
						commandId,
						actor.id(),
						arrivedAt,
						PurchaseOrderActivityType.STATUS_CHANGED
				);
			} else {
				participationRepository.closeMovement(
						participation.id(),
						null,
						ShipmentMovementCloseReason.ARRIVED,
						arrivedAt
				).orElseThrow(() -> new IllegalStateException("Shipment participation changed during arrival"));
				PurchaseOrderCompletionOutcome outcome = hasTerminalMembers(order.id())
						? PurchaseOrderCompletionOutcome.DELIVERED_WITH_EXCEPTIONS
						: PurchaseOrderCompletionOutcome.DELIVERED;
				updatePurchaseOrderStatus(
						order,
						PurchaseOrderStatus.ARRIVED_AT_DESTINATION,
						outcome,
						"Delivered on shipment " + shipment.shipmentNumber(),
						commandId,
						actor.id(),
						arrivedAt,
						PurchaseOrderActivityType.STATUS_CHANGED
				);
			}
		}

		for (ShipmentLoadUnitContent content : locks.contents()) {
			boolean warehouseArrival = shipment.destination().kind() == ShipmentDestinationKind.WAREHOUSE;
			appendJourneyEvent(
					commandId,
					content.handlingUnitId(),
					content.purchaseOrderIdAtLoading(),
					warehouseArrival
							? HandlingUnitJourneyEventType.ARRIVED_AT_HUB
							: HandlingUnitJourneyEventType.ARRIVED_AT_DESTINATION,
					warehouseArrival ? destinationStayIdByOrderId.get(content.purchaseOrderIdAtLoading()) : null,
					shipment.id(),
					content.loadUnitId(),
					arrivedAt,
					actor.id()
			);
		}
		return outputAssembler.assemble(arrived);
	}

	private void validateAndLockRoute(ValidatedCreate request) {
		List<Long> warehouseIds = request.destination().kind() == ShipmentDestinationKind.WAREHOUSE
				? List.of(request.originWarehouseId(), request.destination().warehouseId()).stream().distinct().sorted().toList()
				: List.of(request.originWarehouseId());
		Map<Long, FreightWarehouse> warehouses = warehouseRepository.findByIdsForUpdate(warehouseIds).stream()
				.collect(Collectors.toMap(FreightWarehouse::id, Function.identity()));
		FreightWarehouse origin = warehouses.get(request.originWarehouseId());
		if (origin == null || !origin.active()) {
			throw new IllegalArgumentException("Shipment origin must be an active warehouse");
		}
		if (request.destination().kind() == ShipmentDestinationKind.WAREHOUSE) {
			FreightWarehouse destination = warehouses.get(request.destination().warehouseId());
			if (destination == null || !destination.active()) {
				throw new IllegalArgumentException("Shipment destination must be an active warehouse");
			}
			if (destination.id().equals(origin.id())) {
				throw new IllegalArgumentException("Shipment destination warehouse must differ from the origin");
			}
			Company operator = companyRepository.findById(destination.operatorCompanyId())
					.orElseThrow(() -> new IllegalArgumentException("Shipment destination warehouse operator is missing"));
			boolean validFrontlineHub = destination.kind() == FreightWarehouseKind.FRONTLINE_HUB
					&& operator.type() == CompanyType.FRONTLINE
					&& operator.active();
			boolean validAssociatedAgentHub = destination.kind() == FreightWarehouseKind.ASSOCIATED_AGENT_HUB
					&& operator.type() == CompanyType.ASSOCIATED_AGENT
					&& operator.active();
			if (request.purpose() != ShipmentPurpose.NETWORK_TRANSFER
					|| (!validFrontlineHub && !validAssociatedAgentHub)) {
				throw new IllegalArgumentException(
						"Frontline network transfers require a Frontline or associated-agent hub destination"
				);
			}
		} else if (request.destination().kind() == ShipmentDestinationKind.AGENT) {
			Company agent = companyRepository.findById(request.destination().agentCompanyId())
					.orElseThrow(() -> new IllegalArgumentException("Shipment destination agent does not exist"));
			if (agent.type() != CompanyType.AGENT || !agent.active()) {
				throw new IllegalArgumentException("Shipment destination must be an active third-party agent company");
			}
		}
	}

	private WorkflowLocks lockShipmentContents(Long shipmentId) {
		List<ShipmentPurchaseOrderParticipation> participations =
				participationRepository.findOpenByShipmentIdForUpdate(shipmentId);
		if (participations.isEmpty()) {
			throw new IllegalStateException("Shipment has no open purchase-order participation");
		}
		List<Long> purchaseOrderIds = participations.stream()
				.map(ShipmentPurchaseOrderParticipation::purchaseOrderId)
				.sorted()
				.toList();
		List<PurchaseOrder> orders = purchaseOrderRepository.findByIdsForUpdate(purchaseOrderIds);
		if (orders.size() != purchaseOrderIds.size()) {
			throw new IllegalStateException("Shipment purchase order is missing");
		}
		List<ShipmentLoadUnitContent> contents = contentRepository.findOpenByShipmentIdForUpdate(shipmentId);
		if (contents.isEmpty()) {
			throw new IllegalStateException("Shipment has no open handling-unit content");
		}
		List<Long> handlingUnitIds = contents.stream()
				.map(ShipmentLoadUnitContent::handlingUnitId)
				.distinct()
				.sorted()
				.toList();
		if (handlingUnitRepository.findByIdsForUpdate(handlingUnitIds).size() != handlingUnitIds.size()) {
			throw new IllegalStateException("Shipment handling unit is missing");
		}
		Map<Long, ShipmentPurchaseOrderParticipation> participationByOrderId = participations.stream()
				.collect(Collectors.toMap(
						ShipmentPurchaseOrderParticipation::purchaseOrderId,
						Function.identity()
				));
		return new WorkflowLocks(
				orders.stream().sorted(Comparator.comparing(PurchaseOrder::id)).toList(),
				participations,
				participationByOrderId,
				contents.stream().sorted(Comparator.comparing(ShipmentLoadUnitContent::handlingUnitId)).toList()
		);
	}

	private PurchaseOrderWarehouseStay findDestinationStayForUpdate(Shipment shipment, Long purchaseOrderId) {
		PurchaseOrderWarehouseStay stay = warehouseStayRepository.findByPurchaseOrderId(purchaseOrderId).stream()
				.filter(candidate -> shipment.id().equals(candidate.inboundShipmentId()))
				.filter(candidate -> shipment.destination().warehouseId().equals(candidate.warehouseId()))
				.findFirst()
				.orElseThrow(() -> new IllegalStateException("Shipment destination warehouse stay is missing"));
		PurchaseOrderWarehouseStay locked = warehouseStayRepository.findByIdForUpdate(stay.id())
				.orElseThrow(() -> new IllegalStateException("Shipment destination warehouse stay is missing"));
		if (locked.state() != PurchaseOrderWarehouseStayState.AWAITING_IMPORT) {
			throw new IllegalArgumentException("Shipment destination warehouse stay is not awaiting import");
		}
		return locked;
	}

	private void validateHandoverReferences(
			Shipment shipment,
			ValidatedHandover handover,
			List<PurchaseOrder> orders
	) {
		if (handover == null) {
			return;
		}
		var recipient = handover.recipient();
		if (recipient.kind() == ShipmentHandoverRecipientKind.AGENT) {
			Company agent = companyRepository.findById(recipient.agentCompanyId())
					.orElseThrow(() -> new IllegalArgumentException("Handover agent does not exist"));
			if (agent.type() != CompanyType.AGENT || !agent.active()) {
				throw new IllegalArgumentException("Handover agent must be an active agent company");
			}
			if (shipment.destination().kind() == ShipmentDestinationKind.AGENT
					&& !Objects.equals(agent.id(), shipment.destination().agentCompanyId())) {
				throw new IllegalArgumentException("Handover agent must match the shipment destination agent");
			}
		}
		if (recipient.kind() == ShipmentHandoverRecipientKind.COMPANY) {
			Company company = companyRepository.findById(recipient.companyId())
					.orElseThrow(() -> new IllegalArgumentException("Handover company does not exist"));
			if (!company.active()) {
				throw new IllegalArgumentException("Handover company must be active");
			}
		}
		if (recipient.kind() == ShipmentHandoverRecipientKind.VESSEL) {
			Vessel vessel = vesselRepository.findById(recipient.vesselId())
					.orElseThrow(() -> new IllegalArgumentException("Handover vessel does not exist"));
			if (shipment.purpose() == ShipmentPurpose.DELIVERY_TO_VESSEL
					&& orders.stream().anyMatch(order -> !vessel.id().equals(order.parties().vesselId()))) {
				throw new IllegalArgumentException("Handover vessel must match every participating purchase order");
			}
		}
	}

	private void validateDeliveryVessel(ValidatedCreate request, List<PurchaseOrder> orders) {
		if (request.purpose() != ShipmentPurpose.DELIVERY_TO_VESSEL) {
			return;
		}
		Set<Long> vesselIds = orders.stream()
				.map(order -> order.parties().vesselId())
				.collect(Collectors.toSet());
		if (vesselIds.size() != 1 || vesselIds.contains(null)) {
			throw new IllegalArgumentException(
					"Vessel-delivery shipment purchase orders must reference the same vessel"
			);
		}
	}

	private void requireOrderStatuses(
			List<PurchaseOrder> orders,
			PurchaseOrderStatus expectedStatus,
			String operation
	) {
		if (orders.stream().anyMatch(order -> order.status() != expectedStatus)) {
			throw new IllegalArgumentException(
					operation + " requires every purchase order to be " + expectedStatus.name()
			);
		}
	}

	private void requireWorkflowChronology(
			OffsetDateTime occurredAt,
			List<PurchaseOrder> orders,
			Collection<Long> handlingUnitIds,
			String operation
	) {
		for (PurchaseOrder order : orders) {
			requireNotBefore(
					occurredAt,
					order.statusChangedAt(),
					operation + " cannot precede a purchase-order status change"
			);
		}
		for (Long handlingUnitId : new LinkedHashSet<>(handlingUnitIds)) {
			journeyEventRepository.findLatestByHandlingUnitId(handlingUnitId).ifPresent(latest -> requireNotBefore(
					occurredAt,
					latest.occurredAt(),
					operation + " cannot precede a handling-unit journey event"
			));
		}
	}

	private PurchaseOrderStatus dispatchStatus(Shipment shipment) {
		return PurchaseOrderStatus.SHIPPED;
	}

	private boolean hasTerminalMembers(Long purchaseOrderId) {
		Set<Long> currentHandlingUnitIds = membershipRepository.findActiveByPurchaseOrderId(purchaseOrderId).stream()
				.map(HandlingUnitPurchaseOrderMembership::handlingUnitId)
				.collect(Collectors.toSet());
		return terminalDispositionRepository.findByPurchaseOrderIdAtDisposition(purchaseOrderId).stream()
				.map(HandlingUnitTerminalDisposition::handlingUnitId)
				.anyMatch(currentHandlingUnitIds::contains);
	}

	private ShippingChild createInStockShippingChild(
			PartialShipmentSplitOperation operation,
			Shipment shipment,
			Long actorId,
			OffsetDateTime occurredAt
	) {
		UUID splitCommandId = UUID.randomUUID();
		PurchaseOrder parent = operation.parent();
		PurchaseOrderWarehouseStay parentStay = operation.parentWarehouseStay();
		PurchaseOrderChildIdentity childIdentity = purchaseOrderRepository.nextChildIdentity(parent);
		PurchaseOrder child = purchaseOrderRepository.create(
				copyAsInStockDraft(parent, childIdentity, actorId, occurredAt)
		);
		invoiceRowRepository.copyTo(parent.id(), child.id(), actorId, occurredAt);
		PurchaseOrderWarehouseStay childStay = warehouseStayRepository.create(new PurchaseOrderWarehouseStayDraft(
				child.id(),
				parentStay.warehouseId(),
				PurchaseOrderWarehouseStayState.IN_STOCK,
				null,
				parentStay.expectedAt(),
				parentStay.arrivedAt(),
				parentStay.stockedAt(),
				null,
				null,
				parentStay.storagePosition(),
				actorId
		));
		ValidatedPartialSelection decision = operation.decision();
		PurchaseOrderSplit split = splitRepository.create(new PurchaseOrderSplitDraft(
				parent.id(),
				child.id(),
				decision.reason(),
				decision.remark(),
				actorId,
				occurredAt
		));
		attachmentRepository.inheritPurchaseOrderAttachments(
				parent.id(),
				child.id(),
				split.id(),
				occurredAt
		);
		Map<Long, HandlingUnitPurchaseOrderMembership> parentMemberships = operation.memberships().stream()
				.collect(Collectors.toMap(HandlingUnitPurchaseOrderMembership::handlingUnitId, Function.identity()));
		List<PurchaseOrderSplitItem> items = new ArrayList<>();
		List<HandlingUnitPurchaseOrderMembership> childMemberships = new ArrayList<>();
		for (Long handlingUnitId : operation.selectedHandlingUnitIds().stream().sorted().toList()) {
			HandlingUnitPurchaseOrderMembership parentMembership = parentMemberships.get(handlingUnitId);
			if (!membershipRepository.close(parentMembership.id(), occurredAt)) {
				throw new IllegalStateException("Handling unit membership changed during shipment preparation");
			}
			HandlingUnitPurchaseOrderMembership childMembership = membershipRepository.create(
					new HandlingUnitMembershipDraft(
							handlingUnitId,
							child.id(),
							HandlingUnitMembershipReason.SPLIT_TO_CHILD,
							split.id(),
							occurredAt,
							null,
							actorId
					)
			);
			childMemberships.add(childMembership);
			items.add(new PurchaseOrderSplitItem(
					split.id(),
					handlingUnitId,
					parentMembership.id(),
					childMembership.id()
			));
		}
		splitRepository.createItems(items);
		for (Long handlingUnitId : operation.selectedHandlingUnitIds().stream().sorted().toList()) {
			journeyEventRepository.create(new HandlingUnitJourneyEventDraft(
					splitCommandId,
					handlingUnitId,
					child.id(),
					journeyEventRepository.nextSequenceNumberAfterHandlingUnitLock(handlingUnitId),
					HandlingUnitJourneyEventType.REASSIGNED_TO_CHILD_PO,
					childStay.id(),
					null,
					null,
					split.id(),
					null,
					occurredAt,
					actorId,
					"{\"parentPurchaseOrderId\":" + parent.id()
							+ ",\"childPurchaseOrderId\":" + child.id()
							+ ",\"shipmentId\":" + shipment.id() + "}"
			));
		}
		transitionRepository.create(new PurchaseOrderStatusTransitionDraft(
				child.id(),
				null,
				PurchaseOrderStatus.IN_STOCK,
				"Child purchase order created for collis selected for shipment",
				splitCommandId,
				actorId,
				occurredAt
		));
		String metadata = "{\"splitId\":" + split.id()
				+ ",\"parentPurchaseOrderId\":" + parent.id()
				+ ",\"childPurchaseOrderId\":" + child.id()
				+ ",\"shipmentId\":" + shipment.id() + "}";
		activityRepository.create(new PurchaseOrderActivityDraft(
				child.id(),
				PurchaseOrderActivityType.PURCHASE_ORDER_CREATED,
				"Child purchase order created for shipment " + shipment.shipmentNumber(),
				metadata,
				actorId,
				occurredAt
		));
		for (Long purchaseOrderId : List.of(parent.id(), child.id())) {
			activityRepository.create(new PurchaseOrderActivityDraft(
					purchaseOrderId,
					PurchaseOrderActivityType.PURCHASE_ORDER_SPLIT,
					"Selected collis moved to child purchase order for shipment " + shipment.shipmentNumber(),
					metadata,
					actorId,
					occurredAt
			));
		}
		return new ShippingChild(child, childStay, List.copyOf(childMemberships));
	}

	private PurchaseOrderDraft copyAsInStockDraft(
			PurchaseOrder parent,
			PurchaseOrderChildIdentity childIdentity,
			Long actorId,
			OffsetDateTime occurredAt
	) {
		return new PurchaseOrderDraft(
				childIdentity.internalNumber(),
				parent.parties(),
				parent.openingWarehouseId(),
				PurchaseOrderStatus.IN_STOCK,
				null,
				new PurchaseOrderReferences(
						parent.references().messageNumber(),
						childIdentity.ownerReference(),
						parent.references().supplierReference()
				),
				parent.urgent(),
				parent.readinessDate(),
				parent.readinessRemark(),
				parent.route(),
				parent.documents(),
				parent.customsValue(),
				parent.urgentInformation(),
				parent.notes(),
				actorId,
				occurredAt,
				childIdentity.lineage()
		);
	}

	private PurchaseOrder updatePurchaseOrderStatus(
			PurchaseOrder order,
			PurchaseOrderStatus toStatus,
			PurchaseOrderCompletionOutcome outcome,
			String reason,
			UUID commandId,
			Long actorId,
			OffsetDateTime occurredAt,
			PurchaseOrderActivityType activityType
	) {
		PurchaseOrder updated = purchaseOrderRepository.updateStatus(
				order.id(),
				order.version(),
				toStatus,
				outcome,
				occurredAt
		).orElseThrow(() -> new IllegalStateException("Purchase order changed during shipment workflow"));
		transitionRepository.create(new PurchaseOrderStatusTransitionDraft(
				order.id(),
				order.status(),
				toStatus,
				reason,
				commandId,
				actorId,
				occurredAt
		));
		activityRepository.create(new PurchaseOrderActivityDraft(
				order.id(),
				activityType,
				reason,
				shipmentMetadata(reason, order.id()),
				actorId,
				occurredAt
		));
		return updated;
	}

	private void appendJourneyEvent(
			UUID commandId,
			Long handlingUnitId,
			Long purchaseOrderId,
			HandlingUnitJourneyEventType type,
			Long warehouseStayId,
			Long shipmentId,
			Long loadUnitId,
			OffsetDateTime occurredAt,
			Long actorId
	) {
		journeyEventRepository.create(new HandlingUnitJourneyEventDraft(
				commandId,
				handlingUnitId,
				purchaseOrderId,
				journeyEventRepository.nextSequenceNumberAfterHandlingUnitLock(handlingUnitId),
				type,
				warehouseStayId,
				shipmentId,
				loadUnitId,
				null,
				null,
				occurredAt,
				actorId,
				"{\"shipmentId\":" + shipmentId + "}"
		));
	}

	private Shipment requireShipmentForUpdate(Long id) {
		if (id == null) {
			throw new IllegalArgumentException("Shipment id is required");
		}
		return shipmentRepository.findByIdForUpdate(id)
				.orElseThrow(() -> new IllegalArgumentException("Shipment does not exist"));
	}

	private boolean sameMembership(
			HandlingUnitPurchaseOrderMembership first,
			HandlingUnitPurchaseOrderMembership second
	) {
		return first != null && second != null
				&& Objects.equals(first.id(), second.id())
				&& Objects.equals(first.purchaseOrderId(), second.purchaseOrderId());
	}

	private OffsetDateTime eventTime(OffsetDateTime requested) {
		return requested == null ? OffsetDateTime.now() : requested;
	}

	private void requireNotBefore(OffsetDateTime value, OffsetDateTime minimum, String message) {
		if (value == null || minimum == null || value.isBefore(minimum)) {
			throw new IllegalArgumentException(message);
		}
	}

	private ShipmentFilter toFilter(ShipmentFilterInput input) {
		if (input == null) {
			return ShipmentFilter.empty();
		}
		return new ShipmentFilter(
				input.search(),
				enumSet(input.statuses(), ShipmentStatus.class),
				enumSet(input.modes(), com.frontline.forwarding.domain.shipments.ShipmentMode.class),
				enumSet(input.purposes(), ShipmentPurpose.class),
				input.originWarehouseId(),
				enumValue(input.destinationKind(), ShipmentDestinationKind.class, null),
				input.destinationWarehouseId(),
				input.destinationAgentCompanyId()
		);
	}

	private ShipmentSort toSort(ShipmentSortInput input) {
		if (input == null) {
			return ShipmentSort.createdAtDesc();
		}
		return new ShipmentSort(
				enumValue(input.field(), ShipmentSortField.class, ShipmentSortField.CREATED_AT),
				enumValue(input.direction(), ShipmentSort.Direction.class, ShipmentSort.Direction.DESC)
		);
	}

	private PurchaseOrderSort toPurchaseOrderSort(PurchaseOrderSortInput input) {
		if (input == null) {
			return PurchaseOrderSort.createdAtDesc();
		}
		return new PurchaseOrderSort(
				enumValue(input.field(), PurchaseOrderSortField.class, PurchaseOrderSortField.CREATED_AT),
				enumValue(input.direction(), PurchaseOrderSort.Direction.class, PurchaseOrderSort.Direction.DESC)
		);
	}

	private <E extends Enum<E>> Set<E> enumSet(List<String> values, Class<E> type) {
		if (values == null || values.isEmpty()) {
			return Set.of();
		}
		return values.stream()
				.filter(Objects::nonNull)
				.map(value -> enumValue(value, type, null))
				.filter(Objects::nonNull)
				.collect(Collectors.toUnmodifiableSet());
	}

	private <E extends Enum<E>> E enumValue(String value, Class<E> type, E fallback) {
		if (value == null || value.isBlank()) {
			return fallback;
		}
		try {
			return Enum.valueOf(type, value.trim().toUpperCase());
		} catch (IllegalArgumentException ignored) {
			return fallback;
		}
	}

	private int normalizeSize(Integer size) {
		if (size == null || size < 1) {
			return DEFAULT_PAGE_SIZE;
		}
		return Math.min(size, MAX_PAGE_SIZE);
	}

	private String shipmentMetadata(String reason, Long purchaseOrderId) {
		return "{\"purchaseOrderId\":" + purchaseOrderId + ",\"reasonLength\":"
				+ (reason == null ? 0 : reason.length()) + "}";
	}

	private record WorkflowLocks(
			List<PurchaseOrder> orders,
			List<ShipmentPurchaseOrderParticipation> participations,
			Map<Long, ShipmentPurchaseOrderParticipation> participationByOrderId,
			List<ShipmentLoadUnitContent> contents
	) {
	}

	private record PartialShipmentSplitOperation(
			PurchaseOrder parent,
			PurchaseOrderWarehouseStay parentWarehouseStay,
			List<HandlingUnitPurchaseOrderMembership> memberships,
			Set<Long> selectedHandlingUnitIds,
			ValidatedPartialSelection decision
	) {
	}

	private record ShippingChild(
			PurchaseOrder purchaseOrder,
			PurchaseOrderWarehouseStay warehouseStay,
			List<HandlingUnitPurchaseOrderMembership> memberships
	) {
	}
}

