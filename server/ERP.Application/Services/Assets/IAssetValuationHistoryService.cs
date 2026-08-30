using System;
using System.Threading.Tasks;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;

namespace ERP.Application.Services.Assets;

public interface IAssetValuationHistoryService
{
    Task<PagedResponse<AssetValuationHistoryDto>> GetPagedAsync(PagedRequest request);
    Task<AssetValuationHistoryDto?> GetByIdAsync(long id);
    Task<AssetValuationHistoryDto> CreateAsync(CreateAssetValuationHistoryDto dto);
    Task<AssetValuationHistoryDto> UpdateAsync(long id, UpdateAssetValuationHistoryDto dto);
    Task<bool> DeleteAsync(long id);
}
