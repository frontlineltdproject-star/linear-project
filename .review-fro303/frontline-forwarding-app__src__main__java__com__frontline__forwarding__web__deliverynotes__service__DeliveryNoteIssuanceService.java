package com.frontline.forwarding.web.deliverynotes.service;

import java.time.OffsetDateTime;

import com.frontline.forwarding.domain.access.AuthorizationService;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNote;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNoteAuthorizationService;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNoteRepository;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNoteStatus;
import com.frontline.forwarding.system.aade.AadeMyDataClient;
import com.frontline.forwarding.system.aade.AadeSubmissionException;
import com.frontline.forwarding.system.aade.AadeSubmissionReference;
import com.frontline.forwarding.system.aade.AadeSubmissionRejectedException;
import com.frontline.forwarding.system.aade.AadeSubmissionResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DeliveryNoteIssuanceService {

	private final AuthorizationService authorizationService;
	private final DeliveryNoteAuthorizationService deliveryNoteAuthorizationService;
	private final DeliveryNoteSubmissionLifecycle lifecycle;
	private final DeliveryNoteRepository deliveryNoteRepository;
	private final AadeMyDataClient aadeMyDataClient;

	public DeliveryNote issue(
			Long shipmentId,
			Long deliveryNoteId,
			Long expectedVersion
	) {
		var actor = authorizationService.currentUser();
		deliveryNoteAuthorizationService.requireIssue(actor);
		if (shipmentId == null || deliveryNoteId == null) {
			throw new IllegalArgumentException("Shipment and delivery note are required");
		}
		DeliveryNote current = deliveryNoteRepository.findById(deliveryNoteId)
				.orElseThrow(() -> new IllegalArgumentException("Delivery note does not exist"));
		if (!shipmentId.equals(current.shipmentId())) {
			throw new IllegalArgumentException("Delivery note does not belong to shipment");
		}
		if (current.status() == DeliveryNoteStatus.SUBMISSION_PENDING) {
			if (expectedVersion == null || current.version() != expectedVersion) {
				throw new IllegalStateException("Delivery note was modified by another user");
			}
			return reconcile(current);
		}
		DeliveryNote pending = lifecycle.prepare(
				shipmentId, deliveryNoteId, expectedVersion, OffsetDateTime.now()
		);
		String xml = deliveryNoteRepository.findSubmittedXmlById(pending.id())
				.orElseThrow(() -> new IllegalStateException("Delivery note submission XML is missing"));
		AadeSubmissionResult result;
		try {
			result = aadeMyDataClient.sendInvoice(xml);
		}
		catch (AadeSubmissionRejectedException exception) {
			lifecycle.fail(pending.id(), submissionError(exception));
			throw exception;
		}
		catch (RuntimeException exception) {
			throw unresolved(exception);
		}
		try {
			return lifecycle.complete(pending.id(), result);
		}
		catch (RuntimeException exception) {
			throw new AadeSubmissionException(
					"AADE accepted the delivery note but its fiscal identity could not be persisted; "
							+ "retry issuance to reconcile the pending submission",
					exception
			);
		}
	}

	private DeliveryNote reconcile(DeliveryNote pending) {
		AadeSubmissionReference reference = new AadeSubmissionReference(
				pending.issuedAt().toLocalDate(),
				pending.series(),
				pending.fiscalNumber(),
				pending.recipient().vatNumber()
		);
		AadeSubmissionResult result = aadeMyDataClient.findTransmittedInvoice(reference)
				.orElseThrow(() -> unresolved(null));
		return lifecycle.complete(pending.id(), result);
	}

	private AadeSubmissionException unresolved(RuntimeException cause) {
		String message = "AADE submission outcome is unresolved; duplicate submission is blocked "
				+ "until the pending delivery note can be reconciled";
		return cause == null
				? new AadeSubmissionException(message)
				: new AadeSubmissionException(message, cause);
	}

	private String submissionError(RuntimeException exception) {
		String message = exception.getMessage();
		return message == null || message.isBlank()
				? "AADE delivery note submission failed"
				: message.substring(0, Math.min(message.length(), 4000));
	}
}

