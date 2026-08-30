using System;
using System.Threading.Tasks;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;

namespace ERP.Application.Services.Assets;

public interface IAssetService
{
    Task<PagedResponse<AssetDto>> GetAllAsync(PagedRequest request);
    Task<AssetDto?> GetByIdAsync(Guid id);
    Task<AssetDto> CreateAsync(CreateAssetDto dto);
    Task<AssetDto> UpdateAsync(Guid id, UpdateAssetDto dto);
    Task<bool> DeleteAsync(Guid id);
}
