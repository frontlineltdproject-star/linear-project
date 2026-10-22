package com.frontline.forwarding.web.deliverynotes.service;

import com.frontline.forwarding.domain.access.AuthorizationService;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNote;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNoteAuthorizationService;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNoteRepository;
import com.frontline.forwarding.domain.users.UserAuthority;
import com.frontline.forwarding.system.aade.AadeCancellationResult;
import com.frontline.forwarding.system.aade.AadeMyDataClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DeliveryNoteCancellationService {

	private final AuthorizationService authorizationService;
	private final DeliveryNoteAuthorizationService deliveryNoteAuthorizationService;
	private final DeliveryNoteRepository deliveryNoteRepository;
	private final DeliveryNoteCancellationLifecycle lifecycle;
	private final AadeMyDataClient aadeMyDataClient;

	public DeliveryNote cancel(
			Long shipmentId,
			Long deliveryNoteId,
			Long expectedVersion
	) {
		var actor = authorizationService.currentUser();
		deliveryNoteAuthorizationService.requireCancel(actor);
		if (shipmentId == null || deliveryNoteId == null) {
			throw new IllegalArgumentException("Shipment and delivery note are required");
		}
		DeliveryNote note = deliveryNoteRepository.findById(deliveryNoteId)
				.orElseThrow(() -> new IllegalArgumentException("Delivery note does not exist"));
		if (!shipmentId.equals(note.shipmentId())) {
			throw new IllegalArgumentException("Delivery note does not belong to shipment");
		}
		authorizationService.requireCompanyAccess(
				actor, UserAuthority.DELIVERY_NOTE_CANCEL, note.issuerCompanyId()
		);
		DeliveryNote pending = lifecycle.prepare(
				shipmentId, deliveryNoteId, expectedVersion
		);
		AadeCancellationResult result;
		try {
			result = aadeMyDataClient.cancelInvoice(pending.mark());
		}
		catch (RuntimeException exception) {
			lifecycle.fail(pending.id(), cancellationError(exception));
			throw exception;
		}
		return lifecycle.complete(pending.id(), result);
	}

	private String cancellationError(RuntimeException exception) {
		String message = exception.getMessage();
		return message == null || message.isBlank()
				? "AADE delivery note cancellation failed"
				: message.substring(0, Math.min(message.length(), 4000));
	}
}

