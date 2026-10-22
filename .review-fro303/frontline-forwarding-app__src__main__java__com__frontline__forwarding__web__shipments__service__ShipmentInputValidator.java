package com.frontline.forwarding.web.shipments.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderSplitReason;
import com.frontline.forwarding.domain.shipments.ShipmentDestination;
import com.frontline.forwarding.domain.shipments.ShipmentDestinationKind;
import com.frontline.forwarding.domain.shipments.ShipmentHandoverRecipient;
import com.frontline.forwarding.domain.shipments.ShipmentHandoverRecipientKind;
import com.frontline.forwarding.domain.shipments.ShipmentLoadUnitDimensions;
import com.frontline.forwarding.domain.shipments.ShipmentLoadUnitType;
import com.frontline.forwarding.domain.shipments.ShipmentLoadUnitWeight;
import com.frontline.forwarding.domain.shipments.ShipmentMode;
import com.frontline.forwarding.domain.shipments.ShipmentPurpose;
import com.frontline.forwarding.domain.shipments.ShipmentTransportDocument;
import com.frontline.forwarding.domain.shipments.ShipmentTransportDocumentType;
import com.frontline.forwarding.web.shipments.input.ShipmentCreateInput;
import com.frontline.forwarding.web.shipments.input.ShipmentDispatchInput;
import com.frontline.forwarding.web.shipments.input.ShipmentHandoverInput;
import com.frontline.forwarding.web.shipments.input.ShipmentLoadUnitInput;
import com.frontline.forwarding.web.shipments.input.ShipmentLocationUnknownInput;
import com.frontline.forwarding.web.shipments.input.ShipmentPartialSelectionInput;

final class ShipmentInputValidator {

	private ShipmentInputValidator() {
	}

	static ValidatedCreate validateCreate(ShipmentCreateInput input) {
		if (input == null) {
			throw new IllegalArgumentException("Shipment input is required");
		}
		ShipmentMode mode = requireEnum(input.mode(), ShipmentMode.class, "Valid shipment mode is required");
		ShipmentPurpose purpose = requireEnum(
				input.purpose(),
				ShipmentPurpose.class,
				"Valid shipment purpose is required"
		);
		if (input.originWarehouseId() == null) {
			throw new IllegalArgumentException("Shipment origin warehouse is required");
		}
		ShipmentDestinationKind destinationKind = destinationKind(
				purpose,
				input.destinationWarehouseId(),
				input.destinationAgentCompanyId()
		);
		requirePurposeDestination(purpose, destinationKind);

		if (input.handlingUnitIds() == null || input.handlingUnitIds().isEmpty()) {
			throw new IllegalArgumentException("At least one handling unit is required");
		}
		Set<Long> selectedHandlingUnitIds = new HashSet<>();
		for (Long handlingUnitId : input.handlingUnitIds()) {
			if (handlingUnitId == null || handlingUnitId <= 0) {
				throw new IllegalArgumentException("Handling-unit ids must be positive");
			}
			if (!selectedHandlingUnitIds.add(handlingUnitId)) {
				throw new IllegalArgumentException("A handling unit may be selected only once in a shipment");
			}
		}
		List<ValidatedLoadUnit> loadUnits = new ArrayList<>();
		Set<Long> repackedHandlingUnitIds = new HashSet<>();
		for (ShipmentLoadUnitInput loadUnit : input.loadUnits() == null
				? List.<ShipmentLoadUnitInput>of()
				: input.loadUnits()) {
			ValidatedLoadUnit validated = validateLoadUnit(loadUnit);
			for (Long handlingUnitId : validated.handlingUnitIds()) {
				if (!selectedHandlingUnitIds.contains(handlingUnitId)) {
					throw new IllegalArgumentException("A repacked handling unit must be selected for the shipment");
				}
				if (!repackedHandlingUnitIds.add(handlingUnitId)) {
					throw new IllegalArgumentException("A handling unit may appear in only one shipment load unit");
				}
			}
			loadUnits.add(validated);
		}
		List<ValidatedPartialSelection> partialSelections = new ArrayList<>();
		Set<Long> splitPurchaseOrderIds = new HashSet<>();
		for (ShipmentPartialSelectionInput split : input.partialSelections() == null
				? List.<ShipmentPartialSelectionInput>of()
				: input.partialSelections()) {
			if (split == null || split.purchaseOrderId() == null) {
				throw new IllegalArgumentException("Partial-selection purchase order is required");
			}
			if (!splitPurchaseOrderIds.add(split.purchaseOrderId())) {
				throw new IllegalArgumentException("A purchase order may have only one partial-selection decision");
			}
			PurchaseOrderSplitReason reason = requireEnum(
					split.reason(),
					PurchaseOrderSplitReason.class,
					"Valid partial-selection reason is required"
			);
			String remark = normalize(split.remark());
			if (remark != null && remark.length() > 1000) {
				throw new IllegalArgumentException("Partial-selection remark must not exceed 1000 characters");
			}
			if (reason == PurchaseOrderSplitReason.OTHER && remark == null) {
				throw new IllegalArgumentException("Partial-selection remark is required for OTHER reason");
			}
			partialSelections.add(new ValidatedPartialSelection(split.purchaseOrderId(), reason, remark));
		}

		return new ValidatedCreate(
				mode,
				purpose,
				input.originWarehouseId(),
				new ShipmentDestination(
						destinationKind,
						input.destinationWarehouseId(),
						input.destinationAgentCompanyId()
				),
				List.copyOf(loadUnits),
				Set.copyOf(selectedHandlingUnitIds),
				List.copyOf(partialSelections)
		);
	}

	static ShipmentDestinationKind destinationKind(
			ShipmentPurpose purpose,
			Long warehouseId,
			Long agentCompanyId
	) {
		if (purpose == ShipmentPurpose.DELIVERY_TO_VESSEL) {
			if (warehouseId != null || agentCompanyId != null) {
				throw new IllegalArgumentException("Direct delivery on board does not accept a warehouse or agent destination");
			}
			return ShipmentDestinationKind.VESSEL;
		}
		if ((warehouseId == null) == (agentCompanyId == null)) {
			throw new IllegalArgumentException("Exactly one shipment destination is required");
		}
		return warehouseId != null ? ShipmentDestinationKind.WAREHOUSE : ShipmentDestinationKind.AGENT;
	}

	static ShipmentTransportDocument validateDispatch(ShipmentMode mode, ShipmentDispatchInput input) {
		if (input == null) {
			throw new IllegalArgumentException("Shipment dispatch input is required");
		}
		String number = requireText(input.transportDocumentNumber(), "Transport document number is required");
		ShipmentTransportDocumentType type = switch (mode) {
			case AIR -> ShipmentTransportDocumentType.AIR_WAYBILL;
			case ROAD -> ShipmentTransportDocumentType.CMR;
			case SEA -> ShipmentTransportDocumentType.BILL_OF_LADING;
		};
		return new ShipmentTransportDocument(type, number);
	}

	static ValidatedHandover validateHandover(ShipmentPurpose purpose, ShipmentHandoverInput input) {
		if (purpose == ShipmentPurpose.NETWORK_TRANSFER) {
			if (input != null) {
				throw new IllegalArgumentException("Frontline network transfers do not record a final handover");
			}
			return null;
		}
		if (input == null) {
			throw new IllegalArgumentException("Shipment handover is required");
		}
		ShipmentHandoverRecipientKind kind = requireEnum(
				input.recipientKind(),
				ShipmentHandoverRecipientKind.class,
				"Valid handover recipient kind is required"
		);
		requireHandoverPurpose(purpose, kind);
		requireHandoverShape(kind, input);
		return new ValidatedHandover(
				new ShipmentHandoverRecipient(
						kind,
						input.agentCompanyId(),
						input.companyId(),
						input.vesselId(),
						normalize(input.recipientName()),
						normalize(input.recipientAddress())
				),
				requireText(input.receivedBy(), "Handover receiver is required"),
				normalize(input.proofDocumentReference())
		);
	}

	static String requireCancellationReason(String reason) {
		return requireText(reason, "Shipment cancellation reason is required");
	}

	static String requireLocationUnknownReason(ShipmentLocationUnknownInput input) {
		if (input == null) {
			throw new IllegalArgumentException("Shipment location-unknown input is required");
		}
		String reason = requireText(input.reason(), "Shipment location-unknown reason is required");
		if (reason.length() > 1000) {
			throw new IllegalArgumentException("Shipment location-unknown reason cannot exceed 1000 characters");
		}
		return reason;
	}

	private static ValidatedLoadUnit validateLoadUnit(ShipmentLoadUnitInput input) {
		if (input == null) {
			throw new IllegalArgumentException("Shipment load units cannot contain null entries");
		}
		ShipmentLoadUnitType type = requireEnum(
				input.type(),
				ShipmentLoadUnitType.class,
				"Valid shipment load-unit type is required"
		);
		if (input.lengthCm() == null || input.lengthCm() <= 0
				|| input.widthCm() == null || input.widthCm() <= 0
				|| input.heightCm() == null || input.heightCm() <= 0) {
			throw new IllegalArgumentException("Shipment load-unit dimensions must all be positive");
		}
		validateWeight(input.grossWeightKg(), input.netWeightKg());
		if (input.handlingUnitIds() == null || input.handlingUnitIds().isEmpty()) {
			throw new IllegalArgumentException("Each shipment load unit must contain at least one handling unit");
		}
		if (input.handlingUnitIds().stream().anyMatch(id -> id == null || id <= 0)) {
			throw new IllegalArgumentException("Handling-unit ids must be positive");
		}
		return new ValidatedLoadUnit(
				type,
				normalize(input.label()),
				new ShipmentLoadUnitDimensions(input.lengthCm(), input.widthCm(), input.heightCm()),
				input.grossWeightKg() == null && input.netWeightKg() == null
						? null
						: new ShipmentLoadUnitWeight(input.grossWeightKg(), input.netWeightKg()),
				normalize(input.notes()),
				List.copyOf(input.handlingUnitIds())
		);
	}

	private static void validateWeight(BigDecimal gross, BigDecimal net) {
		if (gross == null && net == null) {
			return;
		}
		if (gross == null || gross.signum() <= 0
				|| (net != null && (net.signum() < 0 || net.compareTo(gross) > 0))) {
			throw new IllegalArgumentException("Shipment load-unit weights are invalid");
		}
	}

	private static void requirePurposeDestination(
			ShipmentPurpose purpose,
			ShipmentDestinationKind destinationKind
	) {
		if (purpose == ShipmentPurpose.NETWORK_TRANSFER && destinationKind != ShipmentDestinationKind.WAREHOUSE) {
			throw new IllegalArgumentException("Frontline network transfers require a warehouse destination");
		}
		if ((purpose == ShipmentPurpose.THIRD_PARTY_TRANSFER
				|| purpose == ShipmentPurpose.DELIVERY_TO_LAUNCH_STATION)
				&& destinationKind != ShipmentDestinationKind.AGENT) {
			throw new IllegalArgumentException("Third-party and launch-station shipments require an agent destination");
		}
		if (purpose == ShipmentPurpose.DELIVERY_TO_VESSEL
				&& destinationKind != ShipmentDestinationKind.VESSEL) {
			throw new IllegalArgumentException("Direct delivery on board requires a vessel destination");
		}
	}

	private static void requireHandoverPurpose(
			ShipmentPurpose purpose,
			ShipmentHandoverRecipientKind kind
	) {
		if (purpose == ShipmentPurpose.DELIVERY_TO_LAUNCH_STATION
				&& kind != ShipmentHandoverRecipientKind.LAUNCH_STATION) {
			throw new IllegalArgumentException("Launch-station delivery requires a launch-station handover");
		}
		if (purpose == ShipmentPurpose.DELIVERY_TO_VESSEL && kind != ShipmentHandoverRecipientKind.VESSEL) {
			throw new IllegalArgumentException("Vessel delivery requires a vessel handover");
		}
		if (purpose == ShipmentPurpose.THIRD_PARTY_TRANSFER
				&& kind != ShipmentHandoverRecipientKind.AGENT) {
			throw new IllegalArgumentException("Third-party transfer requires an agent handover");
		}
	}

	private static void requireHandoverShape(
			ShipmentHandoverRecipientKind kind,
			ShipmentHandoverInput input
	) {
		boolean hasAgent = input.agentCompanyId() != null;
		boolean hasCompany = input.companyId() != null;
		boolean hasVessel = input.vesselId() != null;
		boolean hasName = input.recipientName() != null && !input.recipientName().isBlank();
		switch (kind) {
			case AGENT -> {
				if (!hasAgent || hasCompany || hasVessel) {
					throw new IllegalArgumentException("Agent handover requires only an agent company");
				}
			}
			case VESSEL -> {
				if (!hasVessel || hasAgent || hasCompany) {
					throw new IllegalArgumentException("Vessel handover requires only a vessel");
				}
			}
			case COMPANY -> {
				if (!hasCompany || hasAgent || hasVessel) {
					throw new IllegalArgumentException("Company handover requires only a company");
				}
			}
			case LAUNCH_STATION, PERSON, OTHER -> {
				if (hasAgent || hasCompany || hasVessel || !hasName) {
					throw new IllegalArgumentException("Named handover recipients require a name and no entity id");
				}
			}
		}
	}

	private static <E extends Enum<E>> E requireEnum(String value, Class<E> type, String message) {
		if (value == null || value.isBlank()) {
			throw new IllegalArgumentException(message);
		}
		try {
			return Enum.valueOf(type, value.trim().toUpperCase(Locale.ROOT));
		} catch (IllegalArgumentException exception) {
			throw new IllegalArgumentException(message);
		}
	}

	private static String requireText(String value, String message) {
		String normalized = normalize(value);
		if (normalized == null) {
			throw new IllegalArgumentException(message);
		}
		return normalized;
	}

	private static String normalize(String value) {
		return value == null || value.isBlank() ? null : value.trim();
	}

	record ValidatedCreate(
			ShipmentMode mode,
			ShipmentPurpose purpose,
			Long originWarehouseId,
			ShipmentDestination destination,
			List<ValidatedLoadUnit> loadUnits,
			Set<Long> selectedHandlingUnitIds,
			List<ValidatedPartialSelection> partialSelections
	) {
	}

	record ValidatedPartialSelection(
			Long purchaseOrderId,
			PurchaseOrderSplitReason reason,
			String remark
	) {
	}

	record ValidatedLoadUnit(
			ShipmentLoadUnitType type,
			String label,
			ShipmentLoadUnitDimensions dimensions,
			ShipmentLoadUnitWeight weight,
			String notes,
			List<Long> handlingUnitIds
	) {
	}

	record ValidatedHandover(
			ShipmentHandoverRecipient recipient,
			String receivedBy,
			String proofReference
	) {
	}
}

