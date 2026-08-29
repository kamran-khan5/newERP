public sealed record PurchaseDto(
 Guid Id,
 Guid SupplierId,
 DateTime PurchaseDate,
 PurchaseStatus Status,
 string Currency,
 AddressDto DeliveryAddress,
 DateTime? ExpectedDeliveryDate,
 PaymentTermDto PaymentTerm,
 string? Remarks,
 IList<PurchaseLineDto> Lines
);


public sealed record CurrencyDto(
    string Code
);


public sealed record AddressDto(
    string Street,
    string? Building,
    string City,
    string? State,
    string PostalCode,
    string Country,
    double? Longitude,
    double? Latitude
);

public sealed record PaymentTermDto(
    string Code,
    int DueDays,
    decimal AdvancePercentage
);