using System;
using System.ComponentModel.DataAnnotations;

namespace ERP.Application.DTOs.Assets;

public class CreateAssetAttachmentDto
{
    [Required]
    public Guid AssetId { get; set; }
    [Required]
    public string OriginalFileName { get; set; } = default!;
    [Required]
    public string StoredFileName { get; set; } = default!;
    [Required]
    public string MimeType { get; set; } = default!;
    public long FileSize { get; set; }
    [Required]
    public string StoragePath { get; set; } = default!;
}
