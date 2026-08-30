using System;
using System.Threading.Tasks;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;

namespace ERP.Application.Services.Assets;

public interface IAssetAttachmentService
{
    Task<PagedResponse<AssetAttachmentDto>> GetAllAsync(PagedRequest request);
    Task<AssetAttachmentDto?> GetByIdAsync(Guid id);
    Task<AssetAttachmentDto> CreateAsync(CreateAssetAttachmentDto dto);
    Task<AssetAttachmentDto> UpdateAsync(Guid id, UpdateAssetAttachmentDto dto);
    Task<bool> DeleteAsync(Guid id);
}
