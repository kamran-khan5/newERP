using System;
using System.Threading.Tasks;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;

namespace ERP.Application.Services.Assets;

public interface IAssetDepreciationScheduleService
{
    Task<PagedResponse<AssetDepreciationScheduleDto>> GetPagedAsync(PagedRequest request);
    Task<AssetDepreciationScheduleDto?> GetByIdAsync(long id);
    Task<AssetDepreciationScheduleDto> CreateAsync(CreateAssetDepreciationScheduleDto dto);
    Task<AssetDepreciationScheduleDto> UpdateAsync(long id, UpdateAssetDepreciationScheduleDto dto);
    Task<bool> DeleteAsync(long id);
}
