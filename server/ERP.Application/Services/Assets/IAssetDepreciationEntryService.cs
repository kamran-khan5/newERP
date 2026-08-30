using System;
using System.Threading.Tasks;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;

namespace ERP.Application.Services.Assets;

public interface IAssetDepreciationEntryService
{
    Task<PagedResponse<AssetDepreciationEntryDto>> GetPagedAsync(PagedRequest request);
    Task<AssetDepreciationEntryDto?> GetByIdAsync(long id);
    Task<AssetDepreciationEntryDto> CreateAsync(CreateAssetDepreciationEntryDto dto);
    Task<AssetDepreciationEntryDto> UpdateAsync(long id, UpdateAssetDepreciationEntryDto dto);
    Task<bool> DeleteAsync(long id);
}
