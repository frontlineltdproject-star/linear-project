package com.frontline.forwarding.domain.purchaseorders;

import com.frontline.forwarding.domain.users.User;
import com.frontline.forwarding.domain.users.UserAuthority;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
public class PurchaseOrderAuthorizationService {

	public void requireCreate(User actor) {
		requireInternalMutation(actor, UserAuthority.PURCHASE_ORDER_CREATE, "Purchase order creation denied");
	}

	public void requireView(User actor, PurchaseOrder purchaseOrder) {
		if (!actor.role().hasAuthority(UserAuthority.PURCHASE_ORDER_VIEW)) {
			throw new AccessDeniedException("Purchase order access denied");
		}
		if (isInternal(actor)) {
			return;
		}
		Long companyId = actor.company().id();
		PurchaseOrderParties parties = purchaseOrder.parties();
		if (!companyId.equals(parties.clientCompanyId())
				&& !companyId.equals(parties.supplierCompanyId())
				&& !companyId.equals(parties.collectionAgentCompanyId())) {
			throw new AccessDeniedException("Purchase order access denied");
		}
	}

	public void requireEdit(User actor, PurchaseOrder purchaseOrder) {
		requireInternalMutation(actor, UserAuthority.PURCHASE_ORDER_EDIT, "Purchase order mutation denied");
	}

	public boolean hasUnrestrictedView(User actor) {
		return isInternal(actor);
	}

	private void requireInternalMutation(User actor, UserAuthority authority, String message) {
		if (!actor.role().hasAuthority(authority) || !isInternal(actor)) {
			throw new AccessDeniedException(message);
		}
	}

	private boolean isInternal(User actor) {
		return actor.isSystemAdmin() || actor.isFrontlineUser();
	}
}

