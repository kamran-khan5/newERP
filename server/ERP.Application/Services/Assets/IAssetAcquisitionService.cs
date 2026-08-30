using System;
using System.Threading.Tasks;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;

namespace ERP.Application.Services.Assets;

public interface IAssetAcquisitionService
{
    Task<PagedResponse<AssetAcquisitionDto>> GetAllAsync(PagedRequest request);
    Task<AssetAcquisitionDto?> GetByIdAsync(long id);
    Task<AssetAcquisitionDto> CreateAsync(CreateAssetAcquisitionDto dto);
    Task<AssetAcquisitionDto> UpdateAsync(long id, UpdateAssetAcquisitionDto dto);
    Task<bool> DeleteAsync(long id);
}
