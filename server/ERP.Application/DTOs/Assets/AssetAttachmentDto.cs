using System;
using System.ComponentModel.DataAnnotations;

namespace ERP.Application.DTOs.Assets;

public class AssetAttachmentDto
{
    public Guid Id { get; set; }
    [Required]
    public Guid AssetId { get; set; }
    public string OriginalFileName { get; set; } = default!;
    public string StoredFileName { get; set; } = default!;
    public string MimeType { get; set; } = default!;
    public long FileSize { get; set; }
    public string StoragePath { get; set; } = default!;
}
