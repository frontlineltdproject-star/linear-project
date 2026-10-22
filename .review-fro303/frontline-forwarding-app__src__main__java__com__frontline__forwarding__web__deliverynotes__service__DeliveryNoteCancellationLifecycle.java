package com.frontline.forwarding.web.deliverynotes.service;

import com.frontline.forwarding.domain.deliverynotes.DeliveryNote;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNoteRepository;
import com.frontline.forwarding.domain.deliverynotes.DeliveryNoteStatus;
import com.frontline.forwarding.system.aade.AadeCancellationResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DeliveryNoteCancellationLifecycle {

	private final DeliveryNoteRepository deliveryNoteRepository;

	@Transactional
	public DeliveryNote prepare(
			Long shipmentId,
			Long deliveryNoteId,
			Long expectedVersion
	) {
		if (shipmentId == null || deliveryNoteId == null || expectedVersion == null) {
			throw new IllegalArgumentException("Shipment, delivery note, and version are required");
		}
		DeliveryNote note = deliveryNoteRepository.findById(deliveryNoteId)
				.orElseThrow(() -> new IllegalArgumentException("Delivery note does not exist"));
		if (!shipmentId.equals(note.shipmentId())) {
			throw new IllegalArgumentException("Delivery note does not belong to shipment");
		}
		if (note.status() != DeliveryNoteStatus.ISSUED) {
			throw new IllegalStateException("Only issued delivery notes can be cancelled");
		}
		if (note.mark() == null || note.mark().isBlank()) {
			throw new IllegalStateException("Issued delivery note does not have an AADE mark");
		}
		return deliveryNoteRepository.beginCancellation(note.id(), expectedVersion);
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public DeliveryNote complete(Long deliveryNoteId, AadeCancellationResult result) {
		return deliveryNoteRepository.completeCancellation(
				deliveryNoteId, result.cancellationMark()
		);
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public DeliveryNote fail(Long deliveryNoteId, String error) {
		return deliveryNoteRepository.failCancellation(deliveryNoteId, error);
	}
}

