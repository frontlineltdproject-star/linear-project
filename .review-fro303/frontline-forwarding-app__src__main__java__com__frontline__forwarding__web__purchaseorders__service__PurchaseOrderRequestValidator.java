package com.frontline.forwarding.web.purchaseorders.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.frontline.forwarding.domain.companies.Company;
import com.frontline.forwarding.domain.companies.CompanyRepository;
import com.frontline.forwarding.domain.companies.CompanyType;
import com.frontline.forwarding.domain.locations.City;
import com.frontline.forwarding.domain.locations.Country;
import com.frontline.forwarding.domain.locations.LocationRepository;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitDangerousClass;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitDimensions;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitPackageType;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitVolumeWeight;
import com.frontline.forwarding.domain.purchaseorders.HandlingUnitWeight;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrder;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderCustomsValue;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderDocuments;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderInvoiceUnit;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderMoney;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderParties;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderReferences;
import com.frontline.forwarding.domain.purchaseorders.PurchaseOrderRoute;
import com.frontline.forwarding.domain.vessels.Vessel;
import com.frontline.forwarding.domain.vessels.VesselRepository;
import com.frontline.forwarding.domain.warehouses.FreightWarehouse;
import com.frontline.forwarding.domain.warehouses.FreightWarehouseRepository;
import com.frontline.forwarding.web.purchaseorders.input.HandlingUnitInput;
import com.frontline.forwarding.web.purchaseorders.input.HandlingUnitMeasurementInput;
import com.frontline.forwarding.web.purchaseorders.input.MoneyValueInput;
import com.frontline.forwarding.web.purchaseorders.input.PurchaseOrderCreateInput;
import com.frontline.forwarding.web.purchaseorders.input.PurchaseOrderInvoiceRowInput;
import com.frontline.forwarding.web.purchaseorders.input.PurchaseOrderUpdateInput;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PurchaseOrderRequestValidator {

	private final CompanyRepository companyRepository;
	private final VesselRepository vesselRepository;
	private final FreightWarehouseRepository warehouseRepository;
	private final LocationRepository locationRepository;

	public HeaderValues validateCreate(PurchaseOrderCreateInput input) {
		if (input == null) {
			throw new IllegalArgumentException("Purchase order input is required");
		}
		Company client = requireCompany(input.clientCompanyId(), CompanyType.CLIENT, "Client company", true);
		Long vesselId = validateVessel(client.id(), input.vesselId());
		Company supplier = requireCompany(
				input.supplierCompanyId(),
				CompanyType.SUPPLIER_COMPANY,
				"Supplier company",
				false
		);
		boolean pickupInGreece = input.pickupInGreece() == null || input.pickupInGreece();
		Company agent = validateCollectionAgent(input.collectionAgentCompanyId(), pickupInGreece);
		Company invoice = validateInvoiceCompany(input.invoiceCompanyId(), client.id(), vesselId, false);
		FreightWarehouse warehouse = requireActiveWarehouse(input.openingWarehouseId());
		PurchaseOrderRoute route = validateRoute(
				input.originCountryId(),
				input.originCityId(),
				input.destinationCountryId(),
				input.destinationCityId(),
				pickupInGreece
		);
		return new HeaderValues(
				new PurchaseOrderParties(
						client.id(),
						vesselId,
						id(supplier),
						id(agent),
						id(invoice)
				),
				warehouse.id(),
				new PurchaseOrderReferences(
						optionalText(input.messageNumber(), 100, "Message number"),
						requiredText(input.ownerReference(), 255, "Owner reference"),
						optionalText(input.supplierReference(), 255, "Supplier reference")
				),
				Boolean.TRUE.equals(input.urgent()),
				input.readinessDate(),
				optionalText(input.readinessRemark(), 1000, "Readiness remark"),
				route,
				new PurchaseOrderDocuments(
						optionalText(input.deliveryNoteImport(), 255, "Import delivery note"),
						optionalText(input.deliveryNoteExport(), 255, "Export delivery note"),
						optionalText(input.mrn(), 255, "MRN")
				),
				customsValues(input.alk(), input.kta(), false, input.valueExclVat(), input.valueInclVat(), input.duties()),
				optionalText(input.urgentInformation(), 1000, "Urgent information"),
				optionalText(input.notes(), 2000, "Notes")
		);
	}

	public HeaderValues validateUpdate(PurchaseOrder purchaseOrder, PurchaseOrderUpdateInput input) {
		if (input == null) {
			throw new IllegalArgumentException("Purchase order input is required");
		}
		Long clientId = purchaseOrder.parties().clientCompanyId();
		Long vesselId = purchaseOrder.parties().vesselId();
		Company supplier = requireCompany(
				input.supplierCompanyId(),
				CompanyType.SUPPLIER_COMPANY,
				"Supplier company",
				false
		);
		boolean pickupInGreece = input.pickupInGreece() == null
				? purchaseOrder.route().pickupInGreece()
				: input.pickupInGreece();
		Company agent = validateCollectionAgent(input.collectionAgentCompanyId(), pickupInGreece);
		Company invoice = validateInvoiceCompany(input.invoiceCompanyId(), clientId, vesselId, false);
		PurchaseOrderRoute route = validateRoute(
				input.originCountryId(),
				input.originCityId(),
				input.destinationCountryId(),
				input.destinationCityId(),
				pickupInGreece
		);
		return new HeaderValues(
				new PurchaseOrderParties(
						clientId,
						vesselId,
						id(supplier),
						id(agent),
						id(invoice)
				),
				purchaseOrder.openingWarehouseId(),
				new PurchaseOrderReferences(
						optionalText(input.messageNumber(), 100, "Message number"),
						input.ownerReference() == null
								? purchaseOrder.references().ownerReference()
								: requiredText(input.ownerReference(), 255, "Owner reference"),
						optionalText(input.supplierReference(), 255, "Supplier reference")
				),
				input.urgent() == null ? purchaseOrder.urgent() : input.urgent(),
				purchaseOrder.readinessDate(),
				optionalText(input.readinessRemark(), 1000, "Readiness remark"),
				route,
				new PurchaseOrderDocuments(
						optionalText(input.deliveryNoteImport(), 255, "Import delivery note"),
						optionalText(input.deliveryNoteExport(), 255, "Export delivery note"),
						optionalText(input.mrn(), 255, "MRN")
				),
				customsValues(
						input.alk(),
						input.kta(),
						purchaseOrder.customsValue().kta(),
						input.valueExclVat(),
						input.valueInclVat(),
						input.duties()
				),
				optionalText(input.urgentInformation(), 1000, "Urgent information"),
				optionalText(input.notes(), 2000, "Notes")
		);
	}

	public List<HandlingUnitValues> validateHandlingUnits(List<HandlingUnitInput> inputs) {
		if (inputs == null || inputs.isEmpty()) {
			return List.of();
		}
		if (inputs.stream().anyMatch(java.util.Objects::isNull)) {
			throw new IllegalArgumentException("Handling units cannot contain null entries");
		}
		return inputs.stream().map(this::validateHandlingUnit).toList();
	}

	public List<InvoiceRowValues> validateInvoiceRows(
			List<PurchaseOrderInvoiceRowInput> inputs,
			boolean allowExistingIds
	) {
		if (inputs == null || inputs.isEmpty()) {
			return List.of();
		}
		if (inputs.stream().anyMatch(java.util.Objects::isNull)) {
			throw new IllegalArgumentException("Invoice rows cannot contain null entries");
		}
		return inputs.stream().map(input -> {
			if (!allowExistingIds && input.id() != null) {
				throw new IllegalArgumentException("New purchase-order invoice rows cannot specify an id");
			}
			if (input.quantity() == null || input.quantity() <= 0) {
				throw new IllegalArgumentException("Invoice row quantity must be a positive whole number");
			}
			if (input.unit() == null) {
				throw new IllegalArgumentException("Invoice row unit is required");
			}
			if (input.totalValue() == null) {
				throw new IllegalArgumentException("Invoice row total value is required");
			}
			return new InvoiceRowValues(
					input.id(),
					requiredText(input.description(), 1000, "Invoice row description"),
					optionalText(input.hsCode(), 100, "Invoice row HS code"),
					input.quantity(),
					input.unit(),
					money(input.totalValue(), "Invoice row total value")
			);
		}).toList();
	}

	public MeasurementValues validateMeasurement(HandlingUnitMeasurementInput input) {
		if (input == null || input.handlingUnitId() == null) {
			throw new IllegalArgumentException("Handling unit measurement id is required");
		}
		HandlingUnitDimensions dimensions = dimensions(input.lengthCm(), input.widthCm(), input.heightCm());
		HandlingUnitWeight weight = weight(input.grossWeightKg(), input.netWeightKg());
		if (dimensions == null && weight == null) {
			throw new IllegalArgumentException("A measurement requires dimensions or weight");
		}
		return new MeasurementValues(input.handlingUnitId(), dimensions, weight);
	}

	public FreightWarehouse requireActiveWarehouse(Long warehouseId) {
		if (warehouseId == null) {
			throw new IllegalArgumentException("Warehouse is required");
		}
		FreightWarehouse warehouse = warehouseRepository.findById(warehouseId)
				.orElseThrow(() -> new IllegalArgumentException("Warehouse does not exist"));
		if (!warehouse.active()) {
			throw new IllegalArgumentException("Warehouse must be active");
		}
		return warehouse;
	}

	private HandlingUnitValues validateHandlingUnit(HandlingUnitInput input) {
		if (input.pcs() != null && input.pcs() <= 0) {
			throw new IllegalArgumentException("Handling unit pieces must be positive");
		}
		HandlingUnitDimensions dimensions = dimensions(input.lengthCm(), input.widthCm(), input.heightCm());
		HandlingUnitWeight weight = weight(input.grossWeightKg(), input.netWeightKg());
		HandlingUnitDangerousClass dangerousClass = optionalEnum(
				HandlingUnitDangerousClass.class,
				input.dangerousGoodsClass(),
				"Dangerous goods class is invalid"
		);
		return new HandlingUnitValues(
				input.pcs(),
				optionalText(input.setDescription(), 255, "Set description"),
				input.packageType() == null || input.packageType().isBlank()
						? HandlingUnitPackageType.OTHER
						: requireEnum(HandlingUnitPackageType.class, input.packageType(), "Package type is invalid"),
				Boolean.TRUE.equals(input.dangerousGoods()) || dangerousClass != null,
				Boolean.TRUE.equals(input.bonded()),
				dangerousClass,
				dimensions,
				weight,
				volumeWeight(input),
				optionalText(input.importDeliveryNote(), 255, "Import delivery note"),
				optionalText(input.notes(), 1000, "Handling unit notes")
		);
	}

	private Company validateCollectionAgent(Long agentId, boolean pickupInGreece) {
		if (pickupInGreece) {
			if (agentId != null) {
				throw new IllegalArgumentException("Collection agent must be empty for pickup in Greece");
			}
			return null;
		}
		return requireCompany(agentId, CompanyType.AGENT, "Collection agent", true);
	}

	private Company validateInvoiceCompany(
			Long invoiceCompanyId,
			Long clientCompanyId,
			Long vesselId,
			boolean required
	) {
		Company invoice = requireCompany(
				invoiceCompanyId,
				CompanyType.INVOICE_COMPANY,
				"Invoice company",
				required
		);
		if (invoice == null) {
			return null;
		}
		boolean assigned = companyRepository.findAvailableInvoicingCompanies(clientCompanyId, vesselId).stream()
				.anyMatch(candidate -> invoice.id().equals(candidate.id()) && candidate.active());
		if (!assigned) {
			throw new IllegalArgumentException("Invoice company is not assigned to the client and vessel");
		}
		return invoice;
	}

	private Long validateVessel(Long clientCompanyId, Long vesselId) {
		List<Vessel> clientVessels = vesselRepository.findByCompanyId(clientCompanyId);
		if (!clientVessels.isEmpty() && vesselId == null) {
			throw new IllegalArgumentException("Vessel is required for a client company with vessels");
		}
		if (vesselId == null) {
			return null;
		}
		Vessel vessel = vesselRepository.findById(vesselId)
				.orElseThrow(() -> new IllegalArgumentException("Vessel does not exist"));
		if (!clientCompanyId.equals(vessel.companyId())) {
			throw new IllegalArgumentException("Vessel must belong to the client company");
		}
		return vessel.id();
	}

	private Company requireCompany(Long id, CompanyType type, String label, boolean required) {
		if (id == null) {
			if (required) {
				throw new IllegalArgumentException(label + " is required");
			}
			return null;
		}
		Company company = companyRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException(label + " does not exist"));
		if (company.type() != type) {
			throw new IllegalArgumentException(label + " has an invalid company type");
		}
		if (!company.active()) {
			throw new IllegalArgumentException(label + " must be active");
		}
		return company;
	}

	private PurchaseOrderRoute validateRoute(
			Long originCountryId,
			Long originCityId,
			Long destinationCountryId,
			Long destinationCityId,
			boolean pickupInGreece
	) {
		List<Country> countries = locationRepository.findCountries();
		List<City> cities = locationRepository.findCities(null);
		validateLocationPair("Origin", originCountryId, originCityId, countries, cities);
		validateLocationPair("Destination", destinationCountryId, destinationCityId, countries, cities);
		return new PurchaseOrderRoute(
				originCountryId,
				originCityId,
				destinationCountryId,
				destinationCityId,
				pickupInGreece
		);
	}

	private void validateLocationPair(
			String label,
			Long countryId,
			Long cityId,
			List<Country> countries,
			List<City> cities
	) {
		if (countryId != null && countries.stream().noneMatch(country -> countryId.equals(country.id()))) {
			throw new IllegalArgumentException(label + " country does not exist");
		}
		if (cityId == null) {
			return;
		}
		if (countryId == null) {
			throw new IllegalArgumentException(label + " country is required when a city is selected");
		}
		City city = cities.stream()
				.filter(candidate -> cityId.equals(candidate.id()))
				.findFirst()
				.orElseThrow(() -> new IllegalArgumentException(label + " city does not exist"));
		if (!countryId.equals(city.countryId())) {
			throw new IllegalArgumentException(label + " city must belong to the selected country");
		}
	}

	private PurchaseOrderCustomsValue customsValues(
			String alk,
			Boolean kta,
			boolean defaultKta,
			MoneyValueInput valueExclVat,
			MoneyValueInput valueInclVat,
			MoneyValueInput duties
	) {
		String normalizedAlk = optionalText(alk, 50, "ALK");
		if (normalizedAlk != null && !normalizedAlk.matches("[0-9]+")) {
			throw new IllegalArgumentException("ALK must contain digits only");
		}
		return new PurchaseOrderCustomsValue(
				normalizedAlk,
				kta == null ? defaultKta : kta,
				money(valueExclVat, "Value excluding VAT"),
				money(valueInclVat, "Value including VAT"),
				money(duties, "Duties")
		);
	}

	private PurchaseOrderMoney money(MoneyValueInput input, String label) {
		if (input == null) {
			return null;
		}
		if (input.amount() == null || input.currency() == null || input.currency().isBlank()) {
			throw new IllegalArgumentException(label + " requires both amount and currency");
		}
		if (input.amount().signum() < 0) {
			throw new IllegalArgumentException(label + " amount cannot be negative");
		}
		String currency = input.currency().trim().toUpperCase(java.util.Locale.ROOT);
		if (!currency.matches("[A-Z]{3}")) {
			throw new IllegalArgumentException(label + " currency must be a three-letter code");
		}
		return new PurchaseOrderMoney(input.amount(), currency);
	}

	private HandlingUnitDimensions dimensions(Integer length, Integer width, Integer height) {
		if (length == null && width == null && height == null) {
			return null;
		}
		if (length == null || width == null || height == null || length <= 0 || width <= 0 || height <= 0) {
			throw new IllegalArgumentException("Dimensions must contain positive length, width and height");
		}
		return new HandlingUnitDimensions(length, width, height);
	}

	private HandlingUnitWeight weight(BigDecimal gross, BigDecimal net) {
		if (gross == null && net == null) {
			return null;
		}
		if (gross == null
				|| gross.signum() <= 0
				|| (net != null && (net.signum() < 0 || net.compareTo(gross) > 0))) {
			throw new IllegalArgumentException("Weight requires positive gross and optional non-negative net not exceeding gross");
		}
		return new HandlingUnitWeight(gross, net);
	}

	private HandlingUnitVolumeWeight volumeWeight(HandlingUnitInput input) {
		List<BigDecimal> values = List.of(
				nullToZero(input.volumeWeightRoadKg()),
				nullToZero(input.volumeWeightSeaKg()),
				nullToZero(input.volumeWeightAirKg()),
				nullToZero(input.volumeWeightCourierKg())
		);
		if (values.stream().anyMatch(value -> value.signum() < 0)) {
			throw new IllegalArgumentException("Volume weights cannot be negative");
		}
		if (input.volumeWeightRoadKg() == null
				&& input.volumeWeightSeaKg() == null
				&& input.volumeWeightAirKg() == null
				&& input.volumeWeightCourierKg() == null) {
			return null;
		}
		return new HandlingUnitVolumeWeight(
				input.volumeWeightRoadKg(),
				input.volumeWeightSeaKg(),
				input.volumeWeightAirKg(),
				input.volumeWeightCourierKg()
		);
	}

	private BigDecimal nullToZero(BigDecimal value) {
		return value == null ? BigDecimal.ZERO : value;
	}

	private <E extends Enum<E>> E requireEnum(Class<E> type, String value, String message) {
		E parsed = optionalEnum(type, value, message);
		if (parsed == null) {
			throw new IllegalArgumentException(message);
		}
		return parsed;
	}

	private <E extends Enum<E>> E optionalEnum(Class<E> type, String value, String message) {
		if (value == null || value.isBlank()) {
			return null;
		}
		try {
			return Enum.valueOf(type, value.trim().toUpperCase(java.util.Locale.ROOT));
		} catch (IllegalArgumentException exception) {
			throw new IllegalArgumentException(message);
		}
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

	private String requiredText(String value, int maxLength, String label) {
		String normalized = optionalText(value, maxLength, label);
		if (normalized == null) {
			throw new IllegalArgumentException(label + " is required");
		}
		return normalized;
	}

	private Long id(Company company) {
		return company == null ? null : company.id();
	}

	public record HeaderValues(
			PurchaseOrderParties parties,
			Long openingWarehouseId,
			PurchaseOrderReferences references,
			boolean urgent,
			LocalDate readinessDate,
			String readinessRemark,
			PurchaseOrderRoute route,
			PurchaseOrderDocuments documents,
			PurchaseOrderCustomsValue customsValue,
			String urgentInformation,
			String notes
	) {
	}

	public record HandlingUnitValues(
			Integer pcs,
			String setDescription,
			HandlingUnitPackageType packageType,
			boolean dangerousGoods,
			boolean bonded,
			HandlingUnitDangerousClass dangerousClass,
			HandlingUnitDimensions dimensions,
			HandlingUnitWeight weight,
			HandlingUnitVolumeWeight volumeWeight,
			String importDeliveryNote,
			String notes
	) {
	}

	public record MeasurementValues(
			Long handlingUnitId,
			HandlingUnitDimensions dimensions,
			HandlingUnitWeight weight
	) {
	}

	public record InvoiceRowValues(
			Long id,
			String description,
			String hsCode,
			int quantity,
			PurchaseOrderInvoiceUnit unit,
			PurchaseOrderMoney totalValue
	) {
	}
}

