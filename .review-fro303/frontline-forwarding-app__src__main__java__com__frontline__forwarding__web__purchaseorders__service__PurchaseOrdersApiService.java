package com.frontline.forwarding.web.purchaseorders.service;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.frontline.forwarding.domain.access.AuthorizationService;
import com.frontline.forwarding.domain.attachments.AttachmentRepository;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnit;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitJourneyEventRepository;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitJourneyEventRepository.HandlingUnitJourneyEventDraft;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitJourneyEventType;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitMeasurementRepository;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitMeasurementRepository.HandlingUnitMeasurementDraft;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitMeasurementSource;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitMembershipReason;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitMembershipRepository;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitMembershipRepository.HandlingUnitMembershipDraft;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitPurchaseOrderMembership;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitRepository;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitRepository.HandlingUnitDraft;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitTerminalDisposition;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitTerminalDispositionRepository;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitTerminalDispositionRepository.HandlingUnitTerminalDispositionDraft;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitTerminalDispositionType;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrder;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderFilter;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderInvoiceRow;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderInvoiceRowRepository;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderInvoiceRowRepository.PurchaseOrderInvoiceRowDraft;
import com.frontline.forwarding.domain.preferences.PurchaseOrderTableGrouping;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderActivity;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderActivityRepository;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderActivityRepository.PurchaseOrderActivityDraft;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderActivityType;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderAuthorizationService;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderCompletionOutcome;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderRepository;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderRepository.PurchaseOrderChildIdentity;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderRepository.PurchaseOrderDraft;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderRepository.PurchaseOrderHeaderUpdate;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderSplit;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderSplitItem;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderSplitReason;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderSplitRepository;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderSplitRepository.PurchaseOrderSplitDraft;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderStatus;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderSort;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderSortField;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderStatusTransitionRepository;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderStatusTransitionRepository.PurchaseOrderStatusTransitionDraft;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderWarehouseStay;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderWarehouseStayRepository;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderWarehouseStayRepository.PurchaseOrderWarehouseStayDraft;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderWarehouseStayRepository.PurchaseOrderWarehouseStayUpdate;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderWarehouseStayState;
import com.frontline.forwarding.domain.shipments.ShipmentLoadUnitContentRepository;
import com.frontline.forwarding.domain.shipments.ShipmentPurchaseOrderParticipationRepository;
import com.frontline.forwarding.domain.users.User;
import com.frontline.forwarding.domain.users.UserAuthority;
import com.frontline.forwarding.domain.warehouses.FreightWarehouse;
import com.frontline.forwarding.domain.warehouses.FreightWarehouseRepository;
import com.frontline.forwarding.web.operations.output.WarehouseOutput;
import com.frontline.forwarding.web.purchaseorders.input.HandlingUnitMeasurementInput;
import com.frontline.forwarding.web.purchaseorders.input.HandlingUnitTerminalDispositionInput;
import com.frontline.forwarding.web.purchaseorders.input.LocationUnknownInput;
import com.frontline.forwarding.web.purchaseorders.input.PurchaseOrderCreateInput;
import com.frontline.forwarding.web.purchaseorders.input.PurchaseOrderFilterInput;
import com.frontline.forwarding.web.purchaseorders.input.PurchaseOrderHandlingUnitUpdateInput;
import com.frontline.forwarding.web.purchaseorders.input.PurchaseOrderInvoiceRowInput;
import com.frontline.forwarding.web.purchaseorders.input.PurchaseOrderReadinessInput;
import com.frontline.forwarding.web.purchaseorders.input.PurchaseOrderReadyInput;
import com.frontline.forwarding.web.purchaseorders.input.PurchaseOrderSplitInput;
import com.frontline.forwarding.web.purchaseorders.input.PurchaseOrderSortInput;
import com.frontline.forwarding.web.purchaseorders.input.PurchaseOrderStatusCorrectionInput;
import com.frontline.forwarding.web.purchaseorders.input.PurchaseOrderUpdateInput;
import com.frontline.forwarding.web.purchaseorders.input.StockConfirmationInput;
import com.frontline.forwarding.web.purchaseorders.input.WarehouseArrivalInput;
import com.frontline.forwarding.web.purchaseorders.output.HandlingUnitOutput;
import com.frontline.forwarding.web.purchaseorders.output.PurchaseOrderActivityOutput;
import com.frontline.forwarding.web.purchaseorders.output.PurchaseOrderOutput;
import com.frontline.forwarding.web.purchaseorders.output.PurchaseOrderPageOutput;
import com.frontline.forwarding.web.purchaseorders.output.PurchaseOrderGroupOutput;
import com.frontline.forwarding.web.purchaseorders.output.PurchaseOrderSplitOutput;
import com.frontline.forwarding.web.purchaseorders.service.PurchaseOrderRequestValidator.HeaderValues;
import com.frontline.forwarding.web.purchaseorders.service.PurchaseOrderRequestValidator.HandlingUnitValues;
import com.frontline.forwarding.web.purchaseorders.service.PurchaseOrderRequestValidator.InvoiceRowValues;
import com.frontline.forwarding.web.purchaseorders.service.PurchaseOrderRequestValidator.MeasurementValues;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class PurchaseOrdersApiService {

	private static final int DEFAULT_PAGE_SIZE = 20;
	private static final int MAX_PAGE_SIZE = 100;
	private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
	private static final Set<PurchaseOrderStatus> HEADER_EDITABLE_STATUSES = Set.of(
			PurchaseOrderStatus.PENDING,
			PurchaseOrderStatus.EXPECTED_READINESS,
			PurchaseOrderStatus.READY,
			PurchaseOrderStatus.IN_STOCK
	);
	private static final Set<PurchaseOrderStatus> HANDLING_UNIT_EDITABLE_STATUSES = Set.of(
			PurchaseOrderStatus.PENDING,
			PurchaseOrderStatus.EXPECTED_READINESS,
			PurchaseOrderStatus.READY,
			PurchaseOrderStatus.IN_STOCK
	);
	private static final Set<PurchaseOrderStatus> TERMINAL_DISPOSITION_STATUSES = Set.of(
			PurchaseOrderStatus.PENDING,
			PurchaseOrderStatus.EXPECTED_READINESS,
			PurchaseOrderStatus.READY,
			PurchaseOrderStatus.IN_STOCK
	);
	private static final Set<PurchaseOrderStatus> CORRECTABLE_STATUSES = Set.of(
			PurchaseOrderStatus.PENDING,
			PurchaseOrderStatus.EXPECTED_READINESS,
			PurchaseOrderStatus.READY
	);

	private final PurchaseOrderRepository purchaseOrderRepository;
	private final HandlingUnitRepository handlingUnitRepository;
	private final HandlingUnitMembershipRepository membershipRepository;
	private final HandlingUnitMeasurementRepository measurementRepository;
	private final HandlingUnitTerminalDispositionRepository terminalDispositionRepository;
	private final HandlingUnitJourneyEventRepository journeyEventRepository;
	private final PurchaseOrderWarehouseStayRepository warehouseStayRepository;
	private final PurchaseOrderStatusTransitionRepository statusTransitionRepository;
	private final PurchaseOrderActivityRepository activityRepository;
	private final PurchaseOrderInvoiceRowRepository invoiceRowRepository;
	private final PurchaseOrderSplitRepository splitRepository;
	private final AttachmentRepository attachmentRepository;
	private final ShipmentLoadUnitContentRepository shipmentContentRepository;
	private final ShipmentPurchaseOrderParticipationRepository shipmentParticipationRepository;
	private final FreightWarehouseRepository warehouseRepository;
	private final AuthorizationService authorizationService;
	private final PurchaseOrderAuthorizationService purchaseOrderAuthorizationService;
	private final PurchaseOrderRequestValidator requestValidator;
	private final PurchaseOrderOutputAssembler outputAssembler;

	public PurchaseOrderPageOutput list(Integer page, Integer size) {
		return list(null, page, size, null);
	}

	public PurchaseOrderPageOutput list(
			PurchaseOrderFilterInput filter,
			Integer page,
			Integer size,
			PurchaseOrderSortInput sort
	) {
		User actor = authorizationService.currentUser();
		authorizationService.requireAuthority(actor, UserAuthority.PURCHASE_ORDER_VIEW);
		int safePage = page == null || page < 0 ? 0 : page;
		int safeSize = normalizeSize(size);
		Long participantCompanyId = purchaseOrderAuthorizationService.hasUnrestrictedView(actor)
				? null
				: actor.company().id();
		PurchaseOrderFilter purchaseOrderFilter = toFilter(filter);
		long totalElements = purchaseOrderRepository.count(purchaseOrderFilter, participantCompanyId);
		List<PurchaseOrder> purchaseOrders = purchaseOrderRepository.findPage(
				purchaseOrderFilter,
				(long) safePage * safeSize,
				safeSize,
				toSort(sort),
				participantCompanyId
		);
		return new PurchaseOrderPageOutput(
				outputAssembler.toSummaries(purchaseOrders, participantCompanyId),
				safePage,
				safeSize,
				totalElements,
				(int) Math.ceil((double) totalElements / safeSize)
		);
	}

	public List<PurchaseOrderGroupOutput> groups(
			PurchaseOrderFilterInput filter,
			PurchaseOrderTableGrouping grouping
	) {
		User actor = authorizationService.currentUser();
		authorizationService.requireAuthority(actor, UserAuthority.PURCHASE_ORDER_VIEW);
		Long participantCompanyId = purchaseOrderAuthorizationService.hasUnrestrictedView(actor)
				? null
				: actor.company().id();
		return purchaseOrderRepository.findGroups(toFilter(filter), grouping, participantCompanyId)
				.stream()
				.map(PurchaseOrderGroupOutput::from)
				.toList();
	}

	private PurchaseOrderFilter toFilter(PurchaseOrderFilterInput input) {
		if (input == null) {
			return PurchaseOrderFilter.empty();
		}
		if (input.readyInDays() != null && input.readyInDays() < 1) {
			throw new IllegalArgumentException("Ready in days must be a positive number");
		}
		return new PurchaseOrderFilter(
				input.search(),
				enumSet(input.statuses(), PurchaseOrderStatus.class),
				input.clientCompanyId(),
				input.supplierCompanyId(),
				input.vesselId(),
				input.warehouseId(),
				input.hasVessel(),
				input.hasCurrentWarehouse(),
				input.readinessDate(),
				input.readyInDays(),
				input.createdDate(),
				input.urgent(),
				input.active(),
				false
		);
	}

	private PurchaseOrderSort toSort(PurchaseOrderSortInput input) {
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

	public PurchaseOrderOutput findById(Long id) {
		User actor = authorizationService.currentUser();
		PurchaseOrder purchaseOrder = requirePurchaseOrder(id);
		purchaseOrderAuthorizationService.requireView(actor, purchaseOrder);
		Long participantCompanyId = purchaseOrderAuthorizationService.hasUnrestrictedView(actor)
				? null
				: actor.company().id();
		return outputAssembler.toOutput(purchaseOrder, participantCompanyId);
	}

	public HandlingUnitOutput findHandlingUnitById(Long id) {
		User actor = authorizationService.currentUser();
		HandlingUnit handlingUnit = requireHandlingUnit(id);
		requireHandlingUnitView(actor, handlingUnit);
		return outputAssembler.toHandlingUnitOutput(handlingUnit);
	}

	public HandlingUnitOutput findHandlingUnitByTrackingCode(String trackingCode) {
		User actor = authorizationService.currentUser();
		String normalized = requiredText(trackingCode, 100, "Handling unit tracking code is required");
		HandlingUnit handlingUnit = handlingUnitRepository.findByTrackingCode(normalized)
				.orElseThrow(() -> new IllegalArgumentException("Handling unit does not exist"));
		requireHandlingUnitView(actor, handlingUnit);
		return outputAssembler.toHandlingUnitOutput(handlingUnit);
	}

	private void requireHandlingUnitView(User actor, HandlingUnit handlingUnit) {
		HandlingUnitPurchaseOrderMembership membership = membershipRepository.findActiveByHandlingUnitId(handlingUnit.id())
				.orElseThrow(() -> new IllegalStateException("Handling unit has no current purchase order membership"));
		PurchaseOrder purchaseOrder = requirePurchaseOrder(membership.purchaseOrderId());
		purchaseOrderAuthorizationService.requireView(actor, purchaseOrder);
	}

	public List<WarehouseOutput> listWarehouses(boolean activeOnly) {
		User actor = authorizationService.currentUser();
		authorizationService.requireAuthority(actor, UserAuthority.PURCHASE_ORDER_VIEW);
		return outputAssembler.warehouseOutputs(activeOnly ? warehouseRepository.findActive() : warehouseRepository.findAll());
	}

	@Transactional
	public PurchaseOrderOutput create(PurchaseOrderCreateInput input) {
		User actor = authorizationService.currentUser();
		purchaseOrderAuthorizationService.requireCreate(actor);
		HeaderValues header = requestValidator.validateCreate(input);
		List<HandlingUnitValues> handlingUnitValues = requestValidator.validateHandlingUnits(input.handlingUnits());
		List<InvoiceRowValues> invoiceRowValues = requestValidator.validateInvoiceRows(input.invoiceRows(), false);
		OffsetDateTime occurredAt = now();
		UUID commandId = UUID.randomUUID();
		PurchaseOrder purchaseOrder = purchaseOrderRepository.create(new PurchaseOrderDraft(
				null,
				header.parties(),
				header.openingWarehouseId(),
				PurchaseOrderStatus.PENDING,
				null,
				header.references(),
				header.urgent(),
				header.readinessDate(),
				header.readinessRemark(),
				header.route(),
				header.documents(),
				header.customsValue(),
				header.urgentInformation(),
				header.notes(),
				actor.id(),
				occurredAt
		));
		warehouseStayRepository.create(new PurchaseOrderWarehouseStayDraft(
				purchaseOrder.id(),
				header.openingWarehouseId(),
				PurchaseOrderWarehouseStayState.EXPECTED,
				null,
				null,
				null,
				null,
				null,
				null,
				actor.id()
		));

		for (HandlingUnitValues values : handlingUnitValues) {
			HandlingUnit handlingUnit = handlingUnitRepository.create(new HandlingUnitDraft(
					null,
					purchaseOrder.id(),
					values.pcs(),
					values.setDescription(),
					values.packageType(),
					values.dangerousGoods(),
					values.bonded(),
					values.dangerousClass(),
					values.dimensions(),
					values.weight(),
					values.volumeWeight(),
					values.importDeliveryNote(),
					values.notes(),
					actor.id()
			));
			membershipRepository.create(new HandlingUnitMembershipDraft(
					handlingUnit.id(),
					purchaseOrder.id(),
					HandlingUnitMembershipReason.INITIAL,
					null,
					occurredAt,
					null,
					actor.id()
			));
			if (values.dimensions() != null || values.weight() != null) {
				measurementRepository.create(new HandlingUnitMeasurementDraft(
						handlingUnit.id(),
						null,
						HandlingUnitMeasurementSource.DECLARED,
						values.dimensions(),
						values.weight(),
						actor.id(),
						occurredAt
				));
			}
			handlingUnitRepository.findByIdForUpdate(handlingUnit.id()).orElseThrow();
			appendJourneyEvent(
					handlingUnit.id(),
					purchaseOrder.id(),
					HandlingUnitJourneyEventType.REGISTERED,
					null,
					null,
					null,
					occurredAt,
					actor.id(),
					commandId,
					Map.of()
			);
		}
		for (int index = 0; index < invoiceRowValues.size(); index++) {
			invoiceRowRepository.create(invoiceRowDraft(
					purchaseOrder.id(), index + 1, invoiceRowValues.get(index), actor.id(), occurredAt
			));
		}
		appendStatusTransition(
				purchaseOrder.id(),
				null,
				PurchaseOrderStatus.PENDING,
				"Purchase order created",
				commandId,
				actor.id(),
				occurredAt
		);
		appendActivity(
				purchaseOrder.id(),
				PurchaseOrderActivityType.PURCHASE_ORDER_CREATED,
				null,
				Map.of(
						"handlingUnitCount", handlingUnitValues.size(),
						"invoiceRowCount", invoiceRowValues.size()
				),
				actor.id(),
				occurredAt
		);
		if (!invoiceRowValues.isEmpty()) {
			appendActivity(
					purchaseOrder.id(),
					PurchaseOrderActivityType.INVOICE_ROWS_CHANGED,
					null,
					Map.of("added", invoiceRowValues.size(), "updated", 0, "removed", 0),
					actor.id(),
					occurredAt
			);
		}
		return outputAssembler.toOutput(requirePurchaseOrder(purchaseOrder.id()));
	}

	@Transactional
	public PurchaseOrderOutput update(Long id, PurchaseOrderUpdateInput input) {
		User actor = authorizationService.currentUser();
		PurchaseOrder purchaseOrder = requirePurchaseOrderForUpdate(id);
		purchaseOrderAuthorizationService.requireEdit(actor, purchaseOrder);
		if (!HEADER_EDITABLE_STATUSES.contains(purchaseOrder.status())) {
			throw new IllegalArgumentException("Purchase order header cannot be changed after shipment preparation starts");
		}
		HeaderValues header = requestValidator.validateUpdate(purchaseOrder, input);
		if (purchaseOrder.lineage().child()
				&& !purchaseOrder.references().ownerReference().equals(header.references().ownerReference())) {
			throw new IllegalArgumentException("A child purchase-order owner reference cannot be changed");
		}
		OffsetDateTime occurredAt = now();
		if (input.handlingUnits() != null) {
			if (!HANDLING_UNIT_EDITABLE_STATUSES.contains(purchaseOrder.status())) {
				throw new IllegalArgumentException("Handling units cannot be changed in the current purchase order state");
			}
			if (shipmentParticipationRepository.findOpenByPurchaseOrderId(purchaseOrder.id()).isPresent()) {
				throw new IllegalArgumentException(
						"Handling units cannot be changed while the purchase order participates in a shipment"
				);
			}
			correctPreStockHandlingUnits(purchaseOrder, input.handlingUnits(), actor, occurredAt);
		}
		if (input.invoiceRows() != null) {
			if (shipmentParticipationRepository.findOpenByPurchaseOrderId(purchaseOrder.id()).isPresent()) {
				throw new IllegalArgumentException(
						"Invoice rows cannot be changed while the purchase order participates in a shipment"
				);
			}
			correctInvoiceRows(purchaseOrder.id(), input.invoiceRows(), actor.id(), occurredAt);
		}
		PurchaseOrder updated = purchaseOrderRepository.updateHeader(
				purchaseOrder.id(),
				purchaseOrder.version(),
				new PurchaseOrderHeaderUpdate(
						header.parties().supplierCompanyId(),
						header.parties().collectionAgentCompanyId(),
						header.parties().invoiceCompanyId(),
						header.references(),
						header.urgent(),
						header.readinessRemark(),
						header.route(),
						header.documents(),
						header.customsValue(),
						header.urgentInformation(),
						header.notes()
				),
				occurredAt
		).orElseThrow(() -> new IllegalStateException("Purchase order was changed concurrently"));
		appendActivity(
				updated.id(),
				PurchaseOrderActivityType.HEADER_UPDATED,
				null,
				Map.of(),
				actor.id(),
				occurredAt
		);
		return outputAssembler.toOutput(updated);
	}

	private void correctInvoiceRows(
			Long purchaseOrderId,
			List<PurchaseOrderInvoiceRowInput> inputs,
			Long actorId,
			OffsetDateTime occurredAt
	) {
		List<InvoiceRowValues> values = requestValidator.validateInvoiceRows(inputs, true);
		List<PurchaseOrderInvoiceRow> current = invoiceRowRepository.findByPurchaseOrderId(purchaseOrderId);
		Map<Long, PurchaseOrderInvoiceRow> currentById = current.stream()
				.collect(Collectors.toMap(PurchaseOrderInvoiceRow::id, Function.identity()));
		Set<Long> retainedIds = new HashSet<>();
		for (InvoiceRowValues value : values) {
			if (value.id() == null) {
				continue;
			}
			if (!retainedIds.add(value.id())) {
				throw new IllegalArgumentException("An invoice row cannot appear more than once");
			}
			if (!currentById.containsKey(value.id())) {
				throw new IllegalArgumentException("Invoice row must belong to the purchase order");
			}
		}

		List<Long> removedIds = current.stream()
				.map(PurchaseOrderInvoiceRow::id)
				.filter(id -> !retainedIds.contains(id))
				.toList();
		invoiceRowRepository.deleteByIds(purchaseOrderId, removedIds);
		int added = 0;
		int updated = 0;
		for (int index = 0; index < values.size(); index++) {
			InvoiceRowValues value = values.get(index);
			PurchaseOrderInvoiceRowDraft draft =
					invoiceRowDraft(purchaseOrderId, index + 1, value, actorId, occurredAt);
			if (value.id() == null) {
				invoiceRowRepository.create(draft);
				added++;
			} else {
				invoiceRowRepository.update(value.id(), draft);
				updated++;
			}
		}
		appendActivity(
				purchaseOrderId,
				PurchaseOrderActivityType.INVOICE_ROWS_CHANGED,
				null,
				Map.of("added", added, "updated", updated, "removed", removedIds.size()),
				actorId,
				occurredAt
		);
	}

	private PurchaseOrderInvoiceRowDraft invoiceRowDraft(
			Long purchaseOrderId,
			int lineNumber,
			InvoiceRowValues values,
			Long actorId,
			OffsetDateTime occurredAt
	) {
		return new PurchaseOrderInvoiceRowDraft(
				purchaseOrderId,
				lineNumber,
				values.description(),
				values.hsCode(),
				values.quantity(),
				values.unit(),
				values.totalValue(),
				actorId,
				occurredAt
		);
	}

	private void correctPreStockHandlingUnits(
			PurchaseOrder purchaseOrder,
			List<PurchaseOrderHandlingUnitUpdateInput> inputs,
			User actor,
			OffsetDateTime occurredAt
	) {
		List<HandlingUnitValues> values = requestValidator.validateHandlingUnits(
				inputs.stream().map(PurchaseOrderHandlingUnitUpdateInput::values).toList()
		);
		CurrentHandlingUnits current = lockCurrentHandlingUnits(purchaseOrder.id());
		Map<Long, HandlingUnit> currentById = current.movable().stream()
				.collect(Collectors.toMap(HandlingUnit::id, Function.identity()));
		Set<Long> retainedIds = new HashSet<>();
		for (int index = 0; index < inputs.size(); index++) {
			PurchaseOrderHandlingUnitUpdateInput input = inputs.get(index);
			HandlingUnitValues unitValues = values.get(index);
			if (input.id() == null) {
				createEditableHandlingUnit(purchaseOrder, unitValues, actor.id(), occurredAt);
				continue;
			}
			if (!retainedIds.add(input.id())) {
				throw new IllegalArgumentException("A handling unit cannot appear more than once");
			}
			HandlingUnit existing = currentById.get(input.id());
			if (existing == null) {
				throw new IllegalArgumentException("Handling unit must be a current nonterminal member of the purchase order");
			}
			handlingUnitRepository.update(existing.id(), handlingUnitDraft(purchaseOrder.id(), unitValues, actor.id()));
			appendActivity(
					purchaseOrder.id(), PurchaseOrderActivityType.HEADER_UPDATED, null,
					Map.of("handlingUnitId", existing.id(), "change", "HANDLING_UNIT_UPDATED"),
					actor.id(), occurredAt
			);
		}

		for (HandlingUnit removed : current.movable()) {
			if (retainedIds.contains(removed.id())) {
				continue;
			}
			UUID commandId = UUID.randomUUID();
			Long stayId = purchaseOrder.status() == PurchaseOrderStatus.IN_STOCK
					? warehouseStayRepository.findActiveByPurchaseOrderId(purchaseOrder.id())
							.map(PurchaseOrderWarehouseStay::id)
							.orElse(null)
					: null;
			HandlingUnitTerminalDisposition disposition = terminalDispositionRepository.create(
					new HandlingUnitTerminalDispositionDraft(
							removed.id(), purchaseOrder.id(), HandlingUnitTerminalDispositionType.CANCELLED,
							"Removed during purchase order colli correction", null, stayId, actor.id(), occurredAt
					)
			);
			appendJourneyEvent(
					removed.id(), purchaseOrder.id(), HandlingUnitJourneyEventType.TERMINAL_DISPOSITION_RECORDED,
					stayId, null, disposition.id(), occurredAt, actor.id(), commandId,
					Map.of("disposition", HandlingUnitTerminalDispositionType.CANCELLED.name(),
							"reason", "Removed during purchase order colli correction")
			);
			appendActivity(
					purchaseOrder.id(), PurchaseOrderActivityType.HANDLING_UNIT_TERMINATED, null,
					Map.of("handlingUnitId", removed.id(), "disposition", "CANCELLED"), actor.id(), occurredAt
			);
		}
	}

	private void createEditableHandlingUnit(
			PurchaseOrder purchaseOrder,
			HandlingUnitValues values,
			Long actorId,
			OffsetDateTime occurredAt
	) {
		Long purchaseOrderId = purchaseOrder.id();
		PurchaseOrderWarehouseStay stockStay = purchaseOrder.status() == PurchaseOrderStatus.IN_STOCK
				? warehouseStayRepository.findActiveByPurchaseOrderId(purchaseOrderId)
						.filter(stay -> stay.state() == PurchaseOrderWarehouseStayState.IN_STOCK)
						.orElseThrow(() -> new IllegalStateException(
								"An in-stock purchase order must have an active in-stock warehouse stay"
						))
				: null;
		HandlingUnit handlingUnit = handlingUnitRepository.create(
				handlingUnitDraft(purchaseOrderId, values, actorId)
		);
		membershipRepository.create(new HandlingUnitMembershipDraft(
				handlingUnit.id(), purchaseOrderId, HandlingUnitMembershipReason.INITIAL,
				null, occurredAt, null, actorId
		));
		if (values.dimensions() != null || values.weight() != null) {
			measurementRepository.create(new HandlingUnitMeasurementDraft(
					handlingUnit.id(),
					stockStay == null ? null : stockStay.id(),
					stockStay == null
							? HandlingUnitMeasurementSource.DECLARED
							: HandlingUnitMeasurementSource.WAREHOUSE_CONFIRMED,
					values.dimensions(), values.weight(), actorId, occurredAt
			));
		}
		handlingUnitRepository.findByIdForUpdate(handlingUnit.id()).orElseThrow();
		appendJourneyEvent(
				handlingUnit.id(), purchaseOrderId, HandlingUnitJourneyEventType.REGISTERED,
				null, null, null, occurredAt, actorId, UUID.randomUUID(), Map.of()
		);
		if (stockStay != null) {
			appendJourneyEvent(
					handlingUnit.id(), purchaseOrderId, HandlingUnitJourneyEventType.STOCKED,
					stockStay.id(), null, null, occurredAt, actorId, UUID.randomUUID(),
					stockStay.storagePosition() == null
							? Map.of()
							: Map.of("storagePosition", stockStay.storagePosition())
			);
		}
		appendActivity(
				purchaseOrderId, PurchaseOrderActivityType.HANDLING_UNIT_ADDED, null,
				Map.of("handlingUnitId", handlingUnit.id()), actorId, occurredAt
		);
	}

	private HandlingUnitDraft handlingUnitDraft(Long purchaseOrderId, HandlingUnitValues values, Long actorId) {
		return new HandlingUnitDraft(
				null, purchaseOrderId, values.pcs(), values.setDescription(), values.packageType(),
				values.dangerousGoods(), values.bonded(), values.dangerousClass(),
				values.dimensions(), values.weight(), values.volumeWeight(),
				values.importDeliveryNote(), values.notes(), actorId
		);
	}

	@Transactional
	public PurchaseOrderOutput setReadiness(Long id, PurchaseOrderReadinessInput input) {
		User actor = authorizationService.currentUser();
		PurchaseOrder purchaseOrder = requirePurchaseOrderForUpdate(id);
		purchaseOrderAuthorizationService.requireEdit(actor, purchaseOrder);
		if (input == null || input.readinessDate() == null) {
			throw new IllegalArgumentException("Readiness date is required");
		}
		if (purchaseOrder.status() != PurchaseOrderStatus.PENDING) {
			throw new IllegalArgumentException("Only a pending purchase order can receive an expected readiness date");
		}
		String remark = optionalText(input.remark(), 1000, "Readiness remark");
		OffsetDateTime occurredAt = now();
		UUID commandId = UUID.randomUUID();
		CurrentHandlingUnits current = lockCurrentHandlingUnits(purchaseOrder.id());
		PurchaseOrder updated = purchaseOrderRepository.setReadiness(
				purchaseOrder.id(),
				purchaseOrder.version(),
				input.readinessDate(),
				remark,
				occurredAt
		).orElseThrow(() -> new IllegalStateException("Purchase order was changed concurrently"));
		for (HandlingUnit handlingUnit : current.movable()) {
			appendJourneyEvent(
					handlingUnit.id(),
					purchaseOrder.id(),
					HandlingUnitJourneyEventType.EXPECTED_READINESS_RECORDED,
					null,
					null,
					null,
					occurredAt,
					actor.id(),
					commandId,
					Map.of("readinessDate", input.readinessDate().toString())
			);
		}
		appendStatusTransition(
				purchaseOrder.id(),
				PurchaseOrderStatus.PENDING,
				PurchaseOrderStatus.EXPECTED_READINESS,
				remark,
				commandId,
				actor.id(),
				occurredAt
		);
		appendStatusActivity(updated, PurchaseOrderStatus.PENDING, actor.id(), occurredAt);
		return outputAssembler.toOutput(updated);
	}

	@Transactional
	public PurchaseOrderOutput markReady(Long id, PurchaseOrderReadyInput input) {
		User actor = authorizationService.currentUser();
		PurchaseOrder purchaseOrder = requirePurchaseOrderForUpdate(id);
		purchaseOrderAuthorizationService.requireEdit(actor, purchaseOrder);
		if (purchaseOrder.status() != PurchaseOrderStatus.EXPECTED_READINESS) {
			throw new IllegalArgumentException("Only a purchase order awaiting readiness can be marked ready");
		}
		String remark = optionalText(input == null ? null : input.remark(), 1000, "Readiness remark");
		OffsetDateTime occurredAt = now();
		UUID commandId = UUID.randomUUID();
		CurrentHandlingUnits current = lockCurrentHandlingUnits(purchaseOrder.id());
		PurchaseOrder updated = updateStatus(purchaseOrder, PurchaseOrderStatus.READY, null, occurredAt);
		for (HandlingUnit handlingUnit : current.movable()) {
			appendJourneyEvent(
					handlingUnit.id(),
					purchaseOrder.id(),
					HandlingUnitJourneyEventType.READY_FOR_COLLECTION,
					null,
					null,
					null,
					occurredAt,
					actor.id(),
					commandId,
					remark == null ? Map.of() : Map.of("remark", remark)
			);
		}
		appendStatusTransition(
				purchaseOrder.id(),
				PurchaseOrderStatus.EXPECTED_READINESS,
				PurchaseOrderStatus.READY,
				remark,
				commandId,
				actor.id(),
				occurredAt
		);
		appendStatusActivity(updated, PurchaseOrderStatus.EXPECTED_READINESS, actor.id(), occurredAt);
		return outputAssembler.toOutput(updated);
	}

	@Transactional
	public PurchaseOrderOutput correctStatus(Long id, PurchaseOrderStatusCorrectionInput input) {
		User actor = authorizationService.currentUser();
		PurchaseOrder purchaseOrder = requirePurchaseOrderForUpdate(id);
		purchaseOrderAuthorizationService.requireEdit(actor, purchaseOrder);
		if (input == null || input.status() == null) {
			throw new IllegalArgumentException("Corrected purchase-order status is required");
		}
		if (!CORRECTABLE_STATUSES.contains(purchaseOrder.status())) {
			throw new IllegalArgumentException("Only a pre-shipment purchase-order status can be corrected");
		}
		if (!CORRECTABLE_STATUSES.contains(input.status())) {
			throw new IllegalArgumentException("Purchase-order status can only be corrected to a pre-shipment status");
		}
		if (input.status() == purchaseOrder.status()) {
			throw new IllegalArgumentException("Corrected purchase-order status must differ from its current status");
		}
		if (shipmentParticipationRepository.findOpenByPurchaseOrderId(purchaseOrder.id()).isPresent()) {
			throw new IllegalArgumentException(
					"Purchase-order status cannot be corrected while it participates in an open shipment"
			);
		}
		String reason = requiredText(input.reason(), 1000, "Status correction reason is required");
		if (input.status() == PurchaseOrderStatus.EXPECTED_READINESS && input.readinessDate() == null) {
			throw new IllegalArgumentException("Readiness date is required for expected readiness");
		}
		LocalDate readinessDate = switch (input.status()) {
			case PENDING -> null;
			case EXPECTED_READINESS -> input.readinessDate();
			case READY -> purchaseOrder.readinessDate();
			default -> throw new IllegalStateException("Unsupported corrected purchase-order status");
		};
		String readinessRemark = input.status() == PurchaseOrderStatus.PENDING
				? null
				: purchaseOrder.readinessRemark();
		OffsetDateTime occurredAt = now();
		UUID commandId = UUID.randomUUID();
		PurchaseOrder updated = purchaseOrderRepository.correctStatus(
				purchaseOrder.id(),
				purchaseOrder.version(),
				input.status(),
				readinessDate,
				readinessRemark,
				occurredAt
		).orElseThrow(() -> new IllegalStateException("Purchase order was changed concurrently"));
		appendStatusTransition(
				purchaseOrder.id(),
				purchaseOrder.status(),
				updated.status(),
				reason,
				commandId,
				actor.id(),
				occurredAt
		);
		appendActivity(
				purchaseOrder.id(),
				PurchaseOrderActivityType.STATUS_CHANGED,
				null,
				Map.of(
						"fromStatus", purchaseOrder.status().name(),
						"toStatus", updated.status().name(),
						"reason", reason,
						"commandId", commandId.toString()
				),
				actor.id(),
				occurredAt
		);
		return outputAssembler.toOutput(updated);
	}

	@Transactional
	public PurchaseOrderOutput recordWarehouseArrival(Long id, WarehouseArrivalInput input) {
		User actor = authorizationService.currentUser();
		PurchaseOrder purchaseOrder = requirePurchaseOrderForUpdate(id);
		purchaseOrderAuthorizationService.requireEdit(actor, purchaseOrder);
		if (input == null || input.warehouseId() == null) {
			throw new IllegalArgumentException("Warehouse arrival input is required");
		}
		if (purchaseOrder.status() != PurchaseOrderStatus.READY) {
			throw new IllegalArgumentException("Only a ready purchase order can record its initial warehouse arrival");
		}
		FreightWarehouse warehouse = requestValidator.requireActiveWarehouse(input.warehouseId());
		PurchaseOrderWarehouseStay stay = requireCurrentStayForUpdate(purchaseOrder.id());
		if (!warehouse.id().equals(stay.warehouseId())) {
			throw new IllegalArgumentException("Arrival warehouse must match the purchase order expected warehouse");
		}
		if (stay.state() != PurchaseOrderWarehouseStayState.EXPECTED || stay.inboundShipmentId() != null) {
			throw new IllegalArgumentException("Inbound shipment arrivals must be recorded through the shipment workflow");
		}
		OffsetDateTime occurredAt = input.arrivedAt() == null ? now() : input.arrivedAt();
		if (stay.expectedAt() != null && occurredAt.isBefore(stay.expectedAt())) {
			throw new IllegalArgumentException("Warehouse arrival cannot precede the expected arrival time");
		}
		UUID commandId = UUID.randomUUID();
		CurrentHandlingUnits current = lockCurrentHandlingUnits(purchaseOrder.id());
		PurchaseOrderWarehouseStay arrivedStay = warehouseStayRepository.updateState(
				stay.id(),
				new PurchaseOrderWarehouseStayUpdate(
						PurchaseOrderWarehouseStayState.AT_WAREHOUSE,
						stay.expectedAt(),
						occurredAt,
						null,
						null,
						null,
						occurredAt
				)
		).orElseThrow(() -> new IllegalStateException("Warehouse stay was changed concurrently"));
		for (HandlingUnit handlingUnit : current.movable()) {
			appendJourneyEvent(
					handlingUnit.id(),
					purchaseOrder.id(),
					HandlingUnitJourneyEventType.ARRIVED_AT_WAREHOUSE,
					arrivedStay.id(),
					null,
					null,
					occurredAt,
					actor.id(),
					commandId,
					Map.of("warehouseId", warehouse.id())
			);
		}
		return outputAssembler.toOutput(purchaseOrder);
	}

	@Transactional
	public PurchaseOrderOutput confirmInStock(Long id, StockConfirmationInput input) {
		User actor = authorizationService.currentUser();
		PurchaseOrder purchaseOrder = requirePurchaseOrderForUpdate(id);
		purchaseOrderAuthorizationService.requireEdit(actor, purchaseOrder);
		if (purchaseOrder.status() != PurchaseOrderStatus.READY
				&& purchaseOrder.status() != PurchaseOrderStatus.AWAITING_IMPORT) {
			throw new IllegalArgumentException("Only a purchase order at a warehouse can be confirmed in stock");
		}
		if (input == null) {
			throw new IllegalArgumentException("Stock confirmation input is required");
		}
		String storagePosition = requiredText(input.storagePosition(), 255, "Storage position is required");
		OffsetDateTime occurredAt = input.stockedAt() == null ? now() : input.stockedAt();
		PurchaseOrderWarehouseStay stay = requireCurrentStayForUpdate(purchaseOrder.id());
		boolean recordsInitialArrival = purchaseOrder.status() == PurchaseOrderStatus.READY
				&& stay.state() == PurchaseOrderWarehouseStayState.EXPECTED
				&& stay.inboundShipmentId() == null;
		if (!recordsInitialArrival
				&& (stay.state() != PurchaseOrderWarehouseStayState.AT_WAREHOUSE || stay.arrivedAt() == null)) {
			throw new IllegalArgumentException("Purchase order must have a recorded warehouse arrival");
		}
		if (recordsInitialArrival && stay.expectedAt() != null && occurredAt.isBefore(stay.expectedAt())) {
			throw new IllegalArgumentException("Warehouse arrival cannot precede the expected arrival time");
		}
		if (!recordsInitialArrival && occurredAt.isBefore(stay.arrivedAt())) {
			throw new IllegalArgumentException("Stock confirmation cannot precede warehouse arrival");
		}
		CurrentHandlingUnits current = lockCurrentHandlingUnits(purchaseOrder.id());
		if (current.movable().isEmpty()) {
			throw new IllegalArgumentException("A purchase order without movable handling units cannot enter stock");
		}
		List<MeasurementValues> measurements = validateConfirmationMeasurements(input.measurements(), current.movable());
		UUID commandId = UUID.randomUUID();
		if (recordsInitialArrival) {
			stay = warehouseStayRepository.updateState(
					stay.id(),
					new PurchaseOrderWarehouseStayUpdate(
							PurchaseOrderWarehouseStayState.AT_WAREHOUSE,
							stay.expectedAt(),
							occurredAt,
							null,
							null,
							null,
							occurredAt
					)
			).orElseThrow(() -> new IllegalStateException("Warehouse stay was changed concurrently"));
			for (HandlingUnit handlingUnit : current.movable()) {
				appendJourneyEvent(
						handlingUnit.id(),
						purchaseOrder.id(),
						HandlingUnitJourneyEventType.ARRIVED_AT_WAREHOUSE,
						stay.id(),
						null,
						null,
						occurredAt,
						actor.id(),
						commandId,
						Map.of("warehouseId", stay.warehouseId())
				);
			}
		}
		for (MeasurementValues measurement : measurements) {
			measurementRepository.create(new HandlingUnitMeasurementDraft(
					measurement.handlingUnitId(),
					stay.id(),
					HandlingUnitMeasurementSource.WAREHOUSE_CONFIRMED,
					measurement.dimensions(),
					measurement.weight(),
					actor.id(),
					occurredAt
			));
		}
		PurchaseOrderWarehouseStay stockedStay = warehouseStayRepository.updateState(
				stay.id(),
				new PurchaseOrderWarehouseStayUpdate(
						PurchaseOrderWarehouseStayState.IN_STOCK,
						stay.expectedAt(),
						stay.arrivedAt(),
						occurredAt,
						null,
						storagePosition,
						occurredAt
				)
		).orElseThrow(() -> new IllegalStateException("Warehouse stay was changed concurrently"));
		PurchaseOrderStatus nextStatus = shipmentParticipationRepository
				.findOpenByPurchaseOrderId(purchaseOrder.id())
				.isPresent()
				? PurchaseOrderStatus.PREPARED_FOR_SHIPMENT
				: PurchaseOrderStatus.IN_STOCK;
		PurchaseOrder updated = updateStatus(
				purchaseOrder,
				nextStatus,
				null,
				occurredAt
		);
		PurchaseOrderStatus previousStatus = purchaseOrder.status();
		for (HandlingUnit handlingUnit : current.movable()) {
			appendJourneyEvent(
					handlingUnit.id(),
					purchaseOrder.id(),
					HandlingUnitJourneyEventType.STOCKED,
					stockedStay.id(),
					null,
					null,
					occurredAt,
					actor.id(),
					commandId,
					Map.of("storagePosition", storagePosition)
			);
		}
		appendStatusTransition(
				purchaseOrder.id(),
				previousStatus,
				nextStatus,
				nextStatus == PurchaseOrderStatus.PREPARED_FOR_SHIPMENT
						? "Stock confirmed and reserved shipment is ready for dispatch"
						: "Stock confirmed",
				commandId,
				actor.id(),
				occurredAt
		);
		appendStatusActivity(updated, previousStatus, actor.id(), occurredAt);
		return outputAssembler.toOutput(updated);
	}

	@Transactional
	public PurchaseOrderSplitOutput split(Long id, PurchaseOrderSplitInput input) {
		User actor = authorizationService.currentUser();
		PurchaseOrder observedParent = requirePurchaseOrder(id);
		purchaseOrderAuthorizationService.requireEdit(actor, observedParent);
		Long rootId = observedParent.lineage().effectiveRootPurchaseOrderId(observedParent.id());
		Set<Long> lineageLockIds = new java.util.LinkedHashSet<>(List.of(rootId, observedParent.id()));
		PurchaseOrder parent = purchaseOrderRepository.findByIdsForUpdate(lineageLockIds).stream()
				.filter(order -> order.id().equals(observedParent.id()))
				.findFirst()
				.orElseThrow(() -> new IllegalArgumentException("Purchase order does not exist"));
		if (parent.status() != PurchaseOrderStatus.PENDING
				&& parent.status() != PurchaseOrderStatus.EXPECTED_READINESS
				&& parent.status() != PurchaseOrderStatus.READY) {
			throw new IllegalArgumentException("Only a purchase order before warehouse arrival can be split");
		}
		if (input == null || input.handlingUnitIds() == null || input.handlingUnitIds().isEmpty()) {
			throw new IllegalArgumentException("At least one handling unit must be selected for a split");
		}
		if (input.handlingUnitIds().stream().anyMatch(Objects::isNull)) {
			throw new IllegalArgumentException("Split handling unit ids cannot contain null values");
		}
		Set<Long> selectedIds = new HashSet<>(input.handlingUnitIds());
		if (selectedIds.size() != input.handlingUnitIds().size()) {
			throw new IllegalArgumentException("Split handling unit ids must be unique");
		}
		PurchaseOrderSplitReason reason = requireEnum(
				PurchaseOrderSplitReason.class,
				input.reason(),
				"Valid split reason is required"
		);
		String remark = optionalText(input.remark(), 1000, "Split remark");
		if (reason == PurchaseOrderSplitReason.OTHER && remark == null) {
			throw new IllegalArgumentException("Split remark is required for OTHER reason");
		}
		CurrentHandlingUnits current = lockCurrentHandlingUnits(parent.id());
		Set<Long> currentIds = current.memberships().stream()
				.map(HandlingUnitPurchaseOrderMembership::handlingUnitId)
				.collect(Collectors.toSet());
		if (!currentIds.containsAll(selectedIds)) {
			throw new IllegalArgumentException("Every selected handling unit must currently belong to the parent order");
		}
		if (selectedIds.size() == currentIds.size()) {
			throw new IllegalArgumentException("A split must leave at least one handling unit in the parent order");
		}
		Set<Long> movableIds = current.movable().stream().map(HandlingUnit::id).collect(Collectors.toSet());
		if (!movableIds.containsAll(selectedIds)) {
			throw new IllegalArgumentException("Terminal handling units cannot move to a child order");
		}
		if (!shipmentContentRepository.findActiveAllocationsByHandlingUnitIds(selectedIds).isEmpty()) {
			throw new IllegalArgumentException("Actively allocated handling units cannot move to a child order");
		}

		OffsetDateTime occurredAt = now();
		UUID commandId = UUID.randomUUID();
		PurchaseOrderWarehouseStay parentStay = requireCurrentStayForUpdate(parent.id());
		PurchaseOrderChildIdentity childIdentity = purchaseOrderRepository.nextChildIdentity(parent);
		PurchaseOrder child = purchaseOrderRepository.create(
				copyAsPendingDraft(parent, childIdentity, actor.id(), occurredAt)
		);
		invoiceRowRepository.copyTo(parent.id(), child.id(), actor.id(), occurredAt);
		warehouseStayRepository.create(new PurchaseOrderWarehouseStayDraft(
				child.id(),
				parentStay.warehouseId(),
				PurchaseOrderWarehouseStayState.EXPECTED,
				null,
				parentStay.expectedAt(),
				null,
				null,
				null,
				null,
				actor.id()
		));
		PurchaseOrderSplit split = splitRepository.create(new PurchaseOrderSplitDraft(
				parent.id(),
				child.id(),
				reason,
				remark,
				actor.id(),
				occurredAt
		));
		attachmentRepository.inheritPurchaseOrderAttachments(
				parent.id(),
				child.id(),
				split.id(),
				occurredAt
		);
		Map<Long, HandlingUnitPurchaseOrderMembership> parentMemberships = current.memberships().stream()
				.collect(Collectors.toMap(HandlingUnitPurchaseOrderMembership::handlingUnitId, Function.identity()));
		List<PurchaseOrderSplitItem> items = new ArrayList<>();
		for (Long handlingUnitId : selectedIds.stream().sorted().toList()) {
			HandlingUnitPurchaseOrderMembership parentMembership = parentMemberships.get(handlingUnitId);
			if (!membershipRepository.close(parentMembership.id(), occurredAt)) {
				throw new IllegalStateException("Handling unit membership was changed concurrently");
			}
			HandlingUnitPurchaseOrderMembership childMembership = membershipRepository.create(
					new HandlingUnitMembershipDraft(
							handlingUnitId,
							child.id(),
							HandlingUnitMembershipReason.SPLIT_TO_CHILD,
							split.id(),
							occurredAt,
							null,
							actor.id()
					)
			);
			items.add(new PurchaseOrderSplitItem(
					split.id(),
					handlingUnitId,
					parentMembership.id(),
					childMembership.id()
			));
		}
		splitRepository.createItems(items);
		for (Long handlingUnitId : selectedIds.stream().sorted().toList()) {
			appendJourneyEvent(
					handlingUnitId,
					child.id(),
					HandlingUnitJourneyEventType.REASSIGNED_TO_CHILD_PO,
					null,
					split.id(),
					null,
					occurredAt,
					actor.id(),
					commandId,
					Map.of("parentPurchaseOrderId", parent.id(), "childPurchaseOrderId", child.id())
			);
		}
		appendStatusTransition(
				child.id(),
				null,
				PurchaseOrderStatus.PENDING,
				"Child purchase order created by split",
				commandId,
				actor.id(),
				occurredAt
		);
		appendActivity(
				child.id(),
				PurchaseOrderActivityType.PURCHASE_ORDER_CREATED,
				null,
				Map.of("parentPurchaseOrderId", parent.id(), "splitId", split.id()),
				actor.id(),
				occurredAt
		);
		Map<String, Object> splitMetadata = Map.of(
				"splitId", split.id(),
				"parentPurchaseOrderId", parent.id(),
				"childPurchaseOrderId", child.id(),
				"handlingUnitIds", selectedIds.stream().sorted().toList()
		);
		appendActivity(
				parent.id(),
				PurchaseOrderActivityType.PURCHASE_ORDER_SPLIT,
				null,
				splitMetadata,
				actor.id(),
				occurredAt
		);
		appendActivity(
				child.id(),
				PurchaseOrderActivityType.PURCHASE_ORDER_SPLIT,
				null,
				splitMetadata,
				actor.id(),
				occurredAt
		);
		PurchaseOrder parentResult = parent;
		if (selectedIds.size() == current.movable().size()) {
			parentResult = updateStatus(
					parent,
					PurchaseOrderStatus.CANCELLED,
					PurchaseOrderCompletionOutcome.NO_MOVABLE_COLLIS,
					occurredAt
			);
			appendStatusTransition(
					parent.id(),
					parent.status(),
					PurchaseOrderStatus.CANCELLED,
					"No movable handling units remain after split",
					commandId,
					actor.id(),
					occurredAt
			);
			appendStatusActivity(parentResult, parent.status(), actor.id(), occurredAt);
		}
		return new PurchaseOrderSplitOutput(
				split.id(),
				outputAssembler.toOutput(parentResult),
				outputAssembler.toOutput(requirePurchaseOrder(child.id()))
		);
	}

	@Transactional
	public PurchaseOrderOutput recordTerminalDisposition(
			Long purchaseOrderId,
			Long handlingUnitId,
			HandlingUnitTerminalDispositionInput input
	) {
		User actor = authorizationService.currentUser();
		PurchaseOrder purchaseOrder = requirePurchaseOrderForUpdate(purchaseOrderId);
		purchaseOrderAuthorizationService.requireEdit(actor, purchaseOrder);
		if (!TERMINAL_DISPOSITION_STATUSES.contains(purchaseOrder.status())) {
			throw new IllegalArgumentException("Handling units cannot be terminated in the current purchase order status");
		}
		if (input == null) {
			throw new IllegalArgumentException("Terminal disposition input is required");
		}
		HandlingUnitTerminalDispositionType dispositionType = requireEnum(
				HandlingUnitTerminalDispositionType.class,
				input.disposition(),
				"Valid terminal disposition is required"
		);
		String reason = requiredText(input.reason(), 1000, "Terminal disposition reason is required");
		String remark = optionalText(input.remark(), 1000, "Terminal disposition remark");
		CurrentHandlingUnits current = lockCurrentHandlingUnits(purchaseOrder.id());
		HandlingUnit handlingUnit = current.movable().stream()
				.filter(candidate -> candidate.id().equals(handlingUnitId))
				.findFirst()
				.orElseThrow(() -> new IllegalArgumentException(
						"Handling unit must be a current nonterminal member of the purchase order"
				));
		if (shipmentContentRepository.findActiveAllocationByHandlingUnitId(handlingUnit.id()).isPresent()) {
			throw new IllegalArgumentException("An actively allocated handling unit cannot be terminated");
		}
		OffsetDateTime occurredAt = input.occurredAt() == null ? now() : input.occurredAt();
		if (occurredAt.isBefore(handlingUnit.createdAt())) {
			throw new IllegalArgumentException("Terminal disposition cannot precede handling unit creation");
		}
		UUID commandId = UUID.randomUUID();
		Long stayId = warehouseStayRepository.findActiveByPurchaseOrderId(purchaseOrder.id())
				.filter(stay -> stay.arrivedAt() != null)
				.map(PurchaseOrderWarehouseStay::id)
				.orElse(null);
		HandlingUnitTerminalDisposition disposition = terminalDispositionRepository.create(
				new HandlingUnitTerminalDispositionDraft(
						handlingUnit.id(),
						purchaseOrder.id(),
						dispositionType,
						reason,
						remark,
						stayId,
						actor.id(),
						occurredAt
				)
		);
		appendJourneyEvent(
				handlingUnit.id(),
				purchaseOrder.id(),
				HandlingUnitJourneyEventType.TERMINAL_DISPOSITION_RECORDED,
				stayId,
				null,
				disposition.id(),
				occurredAt,
				actor.id(),
				commandId,
				Map.of("disposition", dispositionType.name(), "reason", reason)
		);
		appendActivity(
				purchaseOrder.id(),
				PurchaseOrderActivityType.HANDLING_UNIT_TERMINATED,
				null,
				Map.of("handlingUnitId", handlingUnit.id(), "disposition", dispositionType.name()),
				actor.id(),
				occurredAt
		);
		PurchaseOrder result = purchaseOrder;
		if (current.movable().size() == 1) {
			result = updateStatus(
					purchaseOrder,
					PurchaseOrderStatus.CANCELLED,
					PurchaseOrderCompletionOutcome.NO_MOVABLE_COLLIS,
					occurredAt
			);
			appendStatusTransition(
					purchaseOrder.id(),
					purchaseOrder.status(),
					PurchaseOrderStatus.CANCELLED,
					"No movable handling units remain",
					commandId,
					actor.id(),
					occurredAt
			);
			appendStatusActivity(result, purchaseOrder.status(), actor.id(), occurredAt);
		}
		return outputAssembler.toOutput(result);
	}

	@Transactional
	public PurchaseOrderOutput markLocationUnknown(Long id, LocationUnknownInput input) {
		User actor = authorizationService.currentUser();
		PurchaseOrder purchaseOrder = requirePurchaseOrderForUpdate(id);
		purchaseOrderAuthorizationService.requireEdit(actor, purchaseOrder);
		if (!canMarkLocationUnknown(purchaseOrder.status())) {
			throw new IllegalArgumentException("Purchase order cannot be marked location unknown in its current status");
		}
		if (input == null) {
			throw new IllegalArgumentException("Location-unknown input is required");
		}
		String reason = requiredText(input.reason(), 1000, "Location-unknown reason is required");
		OffsetDateTime occurredAt = input.occurredAt() == null ? now() : input.occurredAt();
		UUID commandId = UUID.randomUUID();
		CurrentHandlingUnits current = lockCurrentHandlingUnits(purchaseOrder.id());
		if (!shipmentContentRepository.findActiveAllocationsByHandlingUnitIds(
				current.movable().stream().map(HandlingUnit::id).toList()
		).isEmpty()) {
			throw new IllegalArgumentException(
					"A purchase order with handling units allocated to an active shipment cannot be marked location unknown"
			);
		}
		PurchaseOrderWarehouseStay currentStay = requireCurrentStayForUpdate(purchaseOrder.id());
		PurchaseOrder updated = updateStatus(
				purchaseOrder,
				PurchaseOrderStatus.LOCATION_UNKNOWN,
				null,
				occurredAt
		);
		PurchaseOrderWarehouseStay unknownStay = warehouseStayRepository.updateState(
				currentStay.id(),
				new PurchaseOrderWarehouseStayUpdate(
						PurchaseOrderWarehouseStayState.LOCATION_UNKNOWN,
						currentStay.expectedAt(),
						currentStay.arrivedAt(),
						currentStay.stockedAt(),
						currentStay.departedAt(),
						occurredAt,
						currentStay.storagePosition(),
						occurredAt
				)
		).orElseThrow(() -> new IllegalStateException("Warehouse stay changed while marking location unknown"));
		Long stayId = unknownStay.arrivedAt() == null ? null : unknownStay.id();
		for (HandlingUnit handlingUnit : current.movable()) {
			appendJourneyEvent(
					handlingUnit.id(),
					purchaseOrder.id(),
					HandlingUnitJourneyEventType.LOCATION_UNKNOWN,
					stayId,
					null,
					null,
					occurredAt,
					actor.id(),
					commandId,
					Map.of("reason", reason)
			);
		}
		appendStatusTransition(
				purchaseOrder.id(),
				purchaseOrder.status(),
				PurchaseOrderStatus.LOCATION_UNKNOWN,
				reason,
				commandId,
				actor.id(),
				occurredAt
		);
		appendStatusActivity(updated, purchaseOrder.status(), actor.id(), occurredAt);
		return outputAssembler.toOutput(updated);
	}

	@Transactional
	public PurchaseOrderActivityOutput addMessage(Long id, String message) {
		User actor = authorizationService.currentUser();
		PurchaseOrder purchaseOrder = requirePurchaseOrderForUpdate(id);
		purchaseOrderAuthorizationService.requireEdit(actor, purchaseOrder);
		String normalizedMessage = requiredText(message, 2000, "Purchase order message is required");
		PurchaseOrderActivity activity = appendActivity(
				purchaseOrder.id(),
				PurchaseOrderActivityType.MESSAGE,
				normalizedMessage,
				Map.of(),
				actor.id(),
				now()
		);
		return outputAssembler.activityOutput(activity);
	}

	private List<MeasurementValues> validateConfirmationMeasurements(
			List<HandlingUnitMeasurementInput> inputs,
			List<HandlingUnit> movableHandlingUnits
	) {
		if (inputs == null) {
			throw new IllegalArgumentException("Warehouse-confirmed measurements are required");
		}
		List<MeasurementValues> measurements = inputs.stream()
				.map(requestValidator::validateMeasurement)
				.toList();
		Set<Long> measuredIds = measurements.stream()
				.map(MeasurementValues::handlingUnitId)
				.collect(Collectors.toSet());
		Set<Long> expectedIds = movableHandlingUnits.stream().map(HandlingUnit::id).collect(Collectors.toSet());
		if (measuredIds.size() != measurements.size()) {
			throw new IllegalArgumentException("Each movable handling unit must have exactly one confirmed measurement");
		}
		if (!measuredIds.equals(expectedIds)) {
			throw new IllegalArgumentException("Confirmed measurements must cover every current nonterminal handling unit");
		}
		return measurements;
	}

	private CurrentHandlingUnits lockCurrentHandlingUnits(Long purchaseOrderId) {
		List<HandlingUnitPurchaseOrderMembership> memberships =
				membershipRepository.findActiveByPurchaseOrderIdForUpdate(purchaseOrderId);
		List<Long> handlingUnitIds = memberships.stream()
				.map(HandlingUnitPurchaseOrderMembership::handlingUnitId)
				.sorted()
				.toList();
		List<HandlingUnit> handlingUnits = handlingUnitRepository.findByIdsForUpdate(handlingUnitIds);
		if (handlingUnits.size() != handlingUnitIds.size()) {
			throw new IllegalStateException("Purchase order membership references a missing handling unit");
		}
		Map<Long, HandlingUnitTerminalDisposition> terminalDispositions = new LinkedHashMap<>();
		for (HandlingUnit handlingUnit : handlingUnits) {
			terminalDispositionRepository.findByHandlingUnitIdForUpdate(handlingUnit.id())
					.ifPresent(disposition -> terminalDispositions.put(handlingUnit.id(), disposition));
		}
		List<HandlingUnit> movable = handlingUnits.stream()
				.filter(handlingUnit -> !terminalDispositions.containsKey(handlingUnit.id()))
				.toList();
		return new CurrentHandlingUnits(memberships, handlingUnits, movable, terminalDispositions);
	}

	private PurchaseOrderDraft copyAsPendingDraft(
			PurchaseOrder parent,
			PurchaseOrderChildIdentity childIdentity,
			Long actorId,
			OffsetDateTime occurredAt
	) {
		return new PurchaseOrderDraft(
				childIdentity.internalNumber(),
				parent.parties(),
				parent.openingWarehouseId(),
				PurchaseOrderStatus.PENDING,
				null,
				new com.frontline.forwarding.domain.purchaseorders.PurchaseOrderReferences(
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

	private PurchaseOrder updateStatus(
			PurchaseOrder purchaseOrder,
			PurchaseOrderStatus status,
			PurchaseOrderCompletionOutcome completionOutcome,
			OffsetDateTime occurredAt
	) {
		if (occurredAt.isBefore(purchaseOrder.statusChangedAt())) {
			throw new IllegalArgumentException("Status change cannot precede the previous purchase order status change");
		}
		return purchaseOrderRepository.updateStatus(
				purchaseOrder.id(),
				purchaseOrder.version(),
				status,
				completionOutcome,
				occurredAt
		).orElseThrow(() -> new IllegalStateException("Purchase order was changed concurrently"));
	}

	private PurchaseOrderStatusTransitionDraft appendStatusTransition(
			Long purchaseOrderId,
			PurchaseOrderStatus fromStatus,
			PurchaseOrderStatus toStatus,
			String reason,
			UUID commandId,
			Long actorId,
			OffsetDateTime occurredAt
	) {
		PurchaseOrderStatusTransitionDraft draft = new PurchaseOrderStatusTransitionDraft(
				purchaseOrderId,
				fromStatus,
				toStatus,
				optionalText(reason, 1000, "Status transition reason"),
				commandId,
				actorId,
				occurredAt
		);
		statusTransitionRepository.create(draft);
		return draft;
	}

	private PurchaseOrderActivity appendActivity(
			Long purchaseOrderId,
			PurchaseOrderActivityType type,
			String message,
			Map<String, ?> metadata,
			Long actorId,
			OffsetDateTime occurredAt
	) {
		return activityRepository.create(new PurchaseOrderActivityDraft(
				purchaseOrderId,
				type,
				message,
				json(metadata),
				actorId,
				occurredAt
		));
	}

	private void appendStatusActivity(
			PurchaseOrder purchaseOrder,
			PurchaseOrderStatus previousStatus,
			Long actorId,
			OffsetDateTime occurredAt
	) {
		appendActivity(
				purchaseOrder.id(),
				PurchaseOrderActivityType.STATUS_CHANGED,
				null,
				Map.of("fromStatus", previousStatus.name(), "toStatus", purchaseOrder.status().name()),
				actorId,
				occurredAt
		);
	}

	private void appendJourneyEvent(
			Long handlingUnitId,
			Long purchaseOrderId,
			HandlingUnitJourneyEventType type,
			Long warehouseStayId,
			Long splitId,
			Long terminalDispositionId,
			OffsetDateTime occurredAt,
			Long actorId,
			UUID commandId,
			Map<String, ?> details
	) {
		journeyEventRepository.findLatestByHandlingUnitId(handlingUnitId).ifPresent(previous -> {
			if (occurredAt.isBefore(previous.occurredAt())) {
				throw new IllegalArgumentException("Journey event cannot precede the handling unit previous event");
			}
		});
		journeyEventRepository.create(new HandlingUnitJourneyEventDraft(
				commandId,
				handlingUnitId,
				purchaseOrderId,
				journeyEventRepository.nextSequenceNumberAfterHandlingUnitLock(handlingUnitId),
				type,
				warehouseStayId,
				null,
				null,
				splitId,
				terminalDispositionId,
				occurredAt,
				actorId,
				json(details)
		));
	}

	private PurchaseOrder requirePurchaseOrder(Long id) {
		if (id == null) {
			throw new IllegalArgumentException("Purchase order id is required");
		}
		return purchaseOrderRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Purchase order does not exist"));
	}

	private PurchaseOrder requirePurchaseOrderForUpdate(Long id) {
		if (id == null) {
			throw new IllegalArgumentException("Purchase order id is required");
		}
		return purchaseOrderRepository.findByIdForUpdate(id)
				.orElseThrow(() -> new IllegalArgumentException("Purchase order does not exist"));
	}

	private HandlingUnit requireHandlingUnit(Long id) {
		if (id == null) {
			throw new IllegalArgumentException("Handling unit id is required");
		}
		return handlingUnitRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Handling unit does not exist"));
	}

	private PurchaseOrderWarehouseStay requireCurrentStayForUpdate(Long purchaseOrderId) {
		return warehouseStayRepository.findActiveByPurchaseOrderIdForUpdate(purchaseOrderId)
				.orElseThrow(() -> new IllegalStateException("Purchase order has no current warehouse stay"));
	}

	private boolean canMarkLocationUnknown(PurchaseOrderStatus status) {
		return switch (status) {
			case PENDING, EXPECTED_READINESS, READY, IN_STOCK, PREPARED_FOR_SHIPMENT, SHIPPED,
					AWAITING_IMPORT -> true;
			case ARRIVED_AT_DESTINATION, LOCATION_UNKNOWN, CANCELLED -> false;
		};
	}

	private int normalizeSize(Integer size) {
		if (size == null || size < 1) {
			return DEFAULT_PAGE_SIZE;
		}
		return Math.min(size, MAX_PAGE_SIZE);
	}

	private OffsetDateTime now() {
		return OffsetDateTime.now(ZoneOffset.UTC);
	}

	private String requiredText(String value, int maxLength, String message) {
		String normalized = optionalText(value, maxLength, message);
		if (normalized == null) {
			throw new IllegalArgumentException(message);
		}
		return normalized;
	}

	private String optionalText(String value, int maxLength, String label) {
		if (value == null || value.isBlank()) {
			return null;
		}
		String normalized = value.trim();
		if (normalized.length() > maxLength) {
			throw new IllegalArgumentException(label + " cannot exceed " + maxLength + " characters");
		}
		return normalized;
	}

	private <E extends Enum<E>> E requireEnum(Class<E> type, String value, String message) {
		if (value == null || value.isBlank()) {
			throw new IllegalArgumentException(message);
		}
		try {
			return Enum.valueOf(type, value.trim().toUpperCase(java.util.Locale.ROOT));
		} catch (IllegalArgumentException exception) {
			throw new IllegalArgumentException(message);
		}
	}

	private String json(Map<String, ?> value) {
		try {
			return OBJECT_MAPPER.writeValueAsString(value == null ? Map.of() : value);
		} catch (JsonProcessingException exception) {
			throw new IllegalStateException("Could not serialize purchase order audit metadata", exception);
		}
	}

	private record CurrentHandlingUnits(
			List<HandlingUnitPurchaseOrderMembership> memberships,
			List<HandlingUnit> all,
			List<HandlingUnit> movable,
			Map<Long, HandlingUnitTerminalDisposition> terminalDispositions
	) {
	}
}

