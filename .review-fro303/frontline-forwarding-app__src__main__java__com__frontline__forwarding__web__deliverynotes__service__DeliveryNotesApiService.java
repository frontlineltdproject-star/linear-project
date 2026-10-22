package com.frontline.forwarding.web.deliverynotes.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.frontline.forwarding.domain.access.AuthorizationService;
import com.frontline.forwarding.domain.companies.Company;
import com.frontline.forwarding.domain.companies.CompanyRepository;
import com.frontline.forwarding.domain.companies.CompanyTaxRegistration;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNote;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNoteAddress;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNoteAuthorizationService;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNoteDraftPlan;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNoteMovementPurpose;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNoteRecipient;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNoteRepository;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNoteRepository.DeliveryNoteDraft;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNoteRepository.DeliveryNoteDraftUpdate;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNoteStatus;
import com.frontline.forwarding.domain.shipments.ShipmentRepository;
import com.frontline.forwarding.web.deliverynotes.input.DeliveryNoteAddressInput;
import com.frontline.forwarding.web.deliverynotes.input.DeliveryNoteDraftUpdateInput;
import com.frontline.forwarding.web.deliverynotes.input.DeliveryNoteDraftBatchUpdateInput;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DeliveryNotesApiService {

	private static final String DEFAULT_ISSUE_PLACE = "ΠΕΙΡΑΙΑΣ";
	private static final DeliveryNoteAddress DEFAULT_LOADING_ADDRESS =
			new DeliveryNoteAddress("ΚΩΝΣΤΑΝΤΙΝΟΥΠΟΛΕΩΣ", "45", "18540", "ΠΕΙΡΑΙΑΣ");

	private final AuthorizationService authorizationService;
	private final DeliveryNoteAuthorizationService deliveryNoteAuthorizationService;
	private final DeliveryNoteDraftSourceService draftSourceService;
	private final ShipmentRepository shipmentRepository;
	private final DeliveryNoteRepository deliveryNoteRepository;
	private final CompanyRepository companyRepository;
	private final DeliveryNoteProperties properties;

	@Transactional
	public List<DeliveryNote> createForShipment(Long shipmentId) {
		var actor = authorizationService.currentUser();
		deliveryNoteAuthorizationService.requireCreate(actor);
		if (shipmentId == null || shipmentRepository.findByIdForUpdate(shipmentId).isEmpty()) {
			throw new IllegalArgumentException("Shipment does not exist");
		}
		List<DeliveryNote> existing = deliveryNoteRepository.findCurrentByShipmentId(shipmentId);
		List<DeliveryNote> current = new ArrayList<>(existing);
		Set<Long> currentInvoiceCompanyIds = new HashSet<>();
		existing.stream()
				.map(DeliveryNote::invoiceCompanyId)
				.forEach(currentInvoiceCompanyIds::add);
		for (DeliveryNoteDraftPlan plan : draftSourceService.planForShipment(shipmentId)) {
			if (currentInvoiceCompanyIds.contains(plan.invoiceCompanyId())) {
				continue;
			}
			Company invoiceCompany = companyRepository.findById(plan.invoiceCompanyId())
					.orElseThrow(() -> new IllegalStateException("Invoice company does not exist"));
			DeliveryNoteRecipient recipient = new DeliveryNoteRecipient(
					invoiceCompany.name(),
					requireCompanyField(invoiceCompany.profession(), invoiceCompany, "profession"),
					recipientAddress(invoiceCompany),
					requireCompanyField(invoiceCompany.city(), invoiceCompany, "city"),
					requireCompanyField(invoiceCompany.postalCode(), invoiceCompany, "postal code"),
					requireCompanyField(invoiceCompany.vatNumber(), invoiceCompany, "VAT number"),
					invoiceCompany.taxRegistration() == CompanyTaxRegistration.GREEK
							? requireCompanyField(invoiceCompany.taxOffice(), invoiceCompany, "tax office")
							: optionalText(invoiceCompany.taxOffice(), 255, "Invoice company tax office")
			);
			current.add(deliveryNoteRepository.createDraft(
					new DeliveryNoteDraft(
							plan.shipmentId(),
							plan.invoiceCompanyId(),
							actor.company().id(),
							plan.vesselId(),
							properties.series(),
							DEFAULT_ISSUE_PLACE,
							DEFAULT_LOADING_ADDRESS,
							recipient,
							plan.totalCollis(),
							plan.totalGrossWeightKg(),
							actor.id()
					),
					plan.lines()
			));
			currentInvoiceCompanyIds.add(plan.invoiceCompanyId());
		}
		return List.copyOf(current);
	}

	private String recipientAddress(Company company) {
		requireCompanyField(company.street(), company, "address");
		return company.addressLine();
	}

	private String requireCompanyField(String value, Company company, String fieldName) {
		if (value == null || value.isBlank()) {
			throw new IllegalStateException(
					"Invoice company " + company.name() + " is missing its " + fieldName
			);
		}
		return value.trim();
	}

	public List<DeliveryNote> findByShipmentId(Long shipmentId) {
		var actor = authorizationService.currentUser();
		deliveryNoteAuthorizationService.requireView(actor);
		return deliveryNoteRepository.findCurrentByShipmentId(shipmentId);
	}

	@Transactional
	public DeliveryNote updateDraft(Long deliveryNoteId, DeliveryNoteDraftUpdateInput input) {
		return updateDraft(null, deliveryNoteId, input);
	}

	@Transactional
	public DeliveryNote updateDraftForShipment(
			Long shipmentId,
			Long deliveryNoteId,
			DeliveryNoteDraftUpdateInput input
	) {
		if (shipmentId == null) {
			throw new IllegalArgumentException("Shipment id is required");
		}
		return updateDraft(shipmentId, deliveryNoteId, input);
	}

	private DeliveryNote updateDraft(
			Long expectedShipmentId,
			Long deliveryNoteId,
			DeliveryNoteDraftUpdateInput input
	) {
		var actor = authorizationService.currentUser();
		deliveryNoteAuthorizationService.requireCreate(actor);
		if (deliveryNoteId == null || input == null || input.version() == null) {
			throw new IllegalArgumentException("Delivery note id, input, and version are required");
		}
		DeliveryNote current = deliveryNoteRepository.findById(deliveryNoteId)
				.orElseThrow(() -> new IllegalArgumentException("Delivery note does not exist"));
		if (expectedShipmentId != null && !expectedShipmentId.equals(current.shipmentId())) {
			throw new IllegalArgumentException("Delivery note does not belong to shipment");
		}
		if (current.status() != DeliveryNoteStatus.DRAFT) {
			throw new IllegalStateException("Only draft delivery notes can be edited");
		}
		return deliveryNoteRepository.updateDraft(
				deliveryNoteId,
				input.version(),
				validatedUpdate(
						input.issuePlace(), input.movementStartAt(), input.vehicleNumber(),
						input.movementPurpose(), input.otherMovementPurposeTitle(),
						input.loadingAddress(), input.destinationAddress(),
						input.notes(), input.relatedDocumentNumber()
				)
		);
	}

	@Transactional
	public List<DeliveryNote> updateDraftsForShipment(
			Long shipmentId,
			DeliveryNoteDraftBatchUpdateInput input
	) {
		var actor = authorizationService.currentUser();
		deliveryNoteAuthorizationService.requireCreate(actor);
		if (shipmentId == null || input == null || input.deliveryNotes() == null
				|| input.deliveryNotes().isEmpty()) {
			throw new IllegalArgumentException("Shipment id, input, and delivery note versions are required");
		}
		if (shipmentRepository.findByIdForUpdate(shipmentId).isEmpty()) {
			throw new IllegalArgumentException("Shipment does not exist");
		}
		List<DeliveryNote> current = deliveryNoteRepository.findCurrentByShipmentId(shipmentId);
		if (current.isEmpty() || current.stream().anyMatch(note -> note.status() != DeliveryNoteStatus.DRAFT)) {
			throw new IllegalStateException("All current delivery notes must be drafts");
		}
		Map<Long, Long> versions = new HashMap<>();
		input.deliveryNotes().forEach(item -> {
			if (item == null || item.deliveryNoteId() == null || item.version() == null
					|| versions.putIfAbsent(item.deliveryNoteId(), item.version()) != null) {
				throw new IllegalArgumentException("Delivery note versions must be complete and unique");
			}
		});
		if (versions.size() != current.size()
				|| current.stream().anyMatch(note -> !versions.containsKey(note.id()))) {
			throw new IllegalArgumentException("Versions are required for every current shipment delivery note");
		}
		DeliveryNoteDraftUpdate update = validatedUpdate(
				input.issuePlace(), input.movementStartAt(), input.vehicleNumber(),
				input.movementPurpose(), input.otherMovementPurposeTitle(),
				input.loadingAddress(), input.destinationAddress(),
				input.notes(), input.relatedDocumentNumber()
		);
		return current.stream()
				.map(note -> deliveryNoteRepository.updateDraft(note.id(), versions.get(note.id()), update))
				.toList();
	}

	private DeliveryNoteDraftUpdate validatedUpdate(
			String issuePlace,
			java.time.OffsetDateTime movementStartAt,
			String vehicleNumber,
			DeliveryNoteMovementPurpose movementPurpose,
			String otherMovementPurposeTitle,
			DeliveryNoteAddressInput loadingAddress,
			DeliveryNoteAddressInput destinationAddress,
			String notes,
			String relatedDocumentNumber
	) {
		DeliveryNoteMovementPurpose validatedPurpose = requireValue(movementPurpose, "Movement purpose");
		String validatedOtherPurpose = validatedPurpose == DeliveryNoteMovementPurpose.OTHER_MOVEMENTS
				? requireText(otherMovementPurposeTitle, 100, "Other movement purpose")
				: null;
		return new DeliveryNoteDraftUpdate(
				requireText(issuePlace, 255, "Issue place"),
				requireValue(movementStartAt, "Movement start"),
				requireText(vehicleNumber, 100, "Vehicle number"),
				validatedPurpose,
				validatedOtherPurpose,
				requireAddress(loadingAddress, "Loading address"),
				requireAddress(destinationAddress, "Destination address"),
				optionalText(notes, 2000, "Notes"),
				optionalText(relatedDocumentNumber, 255, "Related document number")
		);
	}

	private DeliveryNoteAddress requireAddress(DeliveryNoteAddressInput value, String fieldName) {
		if (value == null) {
			throw new IllegalArgumentException(fieldName + " is required");
		}
		return new DeliveryNoteAddress(
				requireText(value.street(), 255, fieldName + " street"),
				requireText(value.number(), 40, fieldName + " number"),
				requireText(value.postalCode(), 40, fieldName + " postal code"),
				requireText(value.city(), 255, fieldName + " city")
		);
	}

	private String requireText(String value, int maxLength, String fieldName) {
		String normalized = optionalText(value, maxLength, fieldName);
		if (normalized == null) {
			throw new IllegalArgumentException(fieldName + " is required");
		}
		return normalized;
	}

	private <T> T requireValue(T value, String fieldName) {
		if (value == null) {
			throw new IllegalArgumentException(fieldName + " is required");
		}
		return value;
	}

	private String optionalText(String value, int maxLength, String fieldName) {
		if (value == null || value.isBlank()) {
			return null;
		}
		String normalized = value.trim();
		if (normalized.length() > maxLength) {
			throw new IllegalArgumentException(fieldName + " must be at most " + maxLength + " characters");
		}
		return normalized;
	}
}

