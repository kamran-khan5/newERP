using System;
using System.Threading.Tasks;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;

namespace ERP.Application.Services.Assets;

public interface IAssetCategoryService
{
    Task<PagedResponse<AssetCategoryDto>> GetAllAsync(PagedRequest request);
    Task<AssetCategoryDto?> GetByIdAsync(long id);
    Task<AssetCategoryDto> CreateAsync(CreateAssetCategoryDto dto);
    Task<AssetCategoryDto> UpdateAsync(long id, UpdateAssetCategoryDto dto);
    Task<bool> DeleteAsync(long id);
}
