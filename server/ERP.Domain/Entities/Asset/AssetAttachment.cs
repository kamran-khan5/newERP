using System;
using ERP.Domain.Common;

namespace ERP.Domain.Entities.Asset;

public class AssetAttachment : BaseEntity
{
    public Guid AssetId { get; set; }
    public Asset Asset { get; set; } = default!;
    
    public string OriginalFileName { get; set; } = default!;
    public string StoredFileName { get; set; } = default!;
    
    public string MimeType { get; set; } = default!;
    public long FileSize { get; set; }
    public string StoragePath { get; set; } = default!;
    
    public Guid? CreatedBy { get; set; }
}
