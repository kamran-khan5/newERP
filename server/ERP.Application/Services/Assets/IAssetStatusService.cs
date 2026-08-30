using System.Threading.Tasks;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;

namespace ERP.Application.Services.Assets;

public interface IAssetStatusService
{
    Task<PagedResponse<AssetStatusDto>> GetPagedAsync(PagedRequest request);
    Task<AssetStatusDto?> GetByIdAsync(short id);
    Task<AssetStatusDto> CreateAsync(CreateAssetStatusDto dto);
    Task<bool> UpdateAsync(short id, UpdateAssetStatusDto dto);
    Task<bool> DeleteAsync(short id);
}
