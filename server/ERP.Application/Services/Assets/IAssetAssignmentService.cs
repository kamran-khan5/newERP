using System;
using System.Threading.Tasks;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;

namespace ERP.Application.Services.Assets;

public interface IAssetAssignmentService
{
    Task<PagedResponse<AssetAssignmentDto>> GetPagedAsync(PagedRequest request);
    Task<AssetAssignmentDto?> GetByIdAsync(long id);
    Task<AssetAssignmentDto> CreateAsync(CreateAssetAssignmentDto dto);
    Task<AssetAssignmentDto> UpdateAsync(long id, UpdateAssetAssignmentDto dto);
    Task<bool> DeleteAsync(long id);
}
