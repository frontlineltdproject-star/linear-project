package com.frontline.forwarding.web.deliverynotes.service;

import java.time.OffsetDateTime;

import com.frontline.forwarding.domain.companies.Company;
import com.frontline.forwarding.domain.companies.CompanyRepository;
import com.frontline.forwarding.domain.companies.CompanyTaxRegistration;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNote;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNoteRepository;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNoteStatus;
import com.frontline.forwarding.system.aade.AadeSubmissionResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DeliveryNoteSubmissionLifecycle {

	private final DeliveryNoteRepository deliveryNoteRepository;
	private final CompanyRepository companyRepository;
	private final AadeDeliveryNoteXmlBuilder xmlBuilder;

	@Transactional
	public DeliveryNote prepare(
			Long shipmentId,
			Long deliveryNoteId,
			Long expectedVersion,
			OffsetDateTime issuedAt
	) {
		if (shipmentId == null || deliveryNoteId == null || expectedVersion == null) {
			throw new IllegalArgumentException("Shipment, delivery note, and version are required");
		}
		DeliveryNote note = deliveryNoteRepository.findById(deliveryNoteId)
				.orElseThrow(() -> new IllegalArgumentException("Delivery note does not exist"));
		if (!shipmentId.equals(note.shipmentId())) {
			throw new IllegalArgumentException("Delivery note does not belong to shipment");
		}
		if (note.status() != DeliveryNoteStatus.DRAFT) {
			throw new IllegalStateException("Only draft delivery notes can be issued");
		}
		Company recipientCompany = companyRepository.findById(note.invoiceCompanyId())
				.orElseThrow(() -> new IllegalStateException("Invoice company does not exist"));
		Company issuerCompany = companyRepository.findById(note.issuerCompanyId())
				.orElseThrow(() -> new IllegalStateException("Issuer company does not exist"));
		if (recipientCompany.taxRegistration() != CompanyTaxRegistration.GREEK) {
			throw new IllegalStateException(
					"Foreign invoice companies require an ISO country code before AADE issuance"
			);
		}
		if (issuerCompany.taxRegistration() != CompanyTaxRegistration.GREEK) {
			throw new IllegalStateException(
					"Foreign issuer companies require an ISO country code before AADE issuance"
			);
		}
		long fiscalNumber = deliveryNoteRepository.allocateFiscalNumber(
				note.issuerCompanyId(), note.series()
		);
		String xml = xmlBuilder.build(note, issuerCompany, fiscalNumber, issuedAt, "GR");
		return deliveryNoteRepository.beginSubmission(
				note.id(), expectedVersion, fiscalNumber, issuedAt, xml
		);
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public DeliveryNote complete(Long deliveryNoteId, AadeSubmissionResult result) {
		return deliveryNoteRepository.completeSubmission(
				deliveryNoteId, result.mark(), result.uid(), result.qrUrl()
		);
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public DeliveryNote fail(Long deliveryNoteId, String error) {
		return deliveryNoteRepository.failSubmission(deliveryNoteId, error);
	}
}

