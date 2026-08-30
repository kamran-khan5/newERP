namespace ERP.Domain.Common;

public interface IAuditableEntity
{
    DateTime CreatedAtUtc { get; set; }
    Guid? CreatedBy { get; set; }
    DateTime? UpdatedAtUtc { get; set; }
    Guid? UpdatedBy { get; set; }
}
