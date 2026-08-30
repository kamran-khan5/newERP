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
    Number,
    Boolean,
    Date,
    Datetime,
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
