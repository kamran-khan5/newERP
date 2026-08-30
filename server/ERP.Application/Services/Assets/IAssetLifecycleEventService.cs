using System;
using System.Threading.Tasks;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;

namespace ERP.Application.Services.Assets;

public interface IAssetLifecycleEventService
{
    Task<PagedResponse<AssetLifecycleEventDto>> GetPagedAsync(PagedRequest request);
    Task<AssetLifecycleEventDto?> GetByIdAsync(long id);
    Task<AssetLifecycleEventDto> CreateAsync(CreateAssetLifecycleEventDto dto);
    Task<AssetLifecycleEventDto> UpdateAsync(long id, UpdateAssetLifecycleEventDto dto);
    Task<bool> DeleteAsync(long id);
}
