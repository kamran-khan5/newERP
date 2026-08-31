namespace ERP.Domain.Enums.Asset;

public enum OwnershipType
{
    Owned,
    Leased,
    Rented,
    Finance
}

public enum AttributeDataType
{
    Text,
    Integer,
    Decimal,
    Boolean,
    Date,
    DateTime,
    Select,
    MultiSelect,
    Json
}

public enum AcquisitionType
{
    Purchase,
    Foc,
    Donation,
    Transfer
}

public enum AttachmentType
{
    Image,
    Document,
    Other
}
