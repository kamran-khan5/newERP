using System.Threading.Tasks;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;

namespace ERP.Application.Services.Assets;

public interface IAssetClassService
{
    Task<PagedResponse<AssetClassDto>> GetPagedAsync(PagedRequest request);
    Task<AssetClassDto?> GetByIdAsync(short id);
    Task<AssetClassDto> CreateAsync(CreateAssetClassDto dto);
    Task<bool> UpdateAsync(short id, UpdateAssetClassDto dto);
    Task<bool> DeleteAsync(short id);
}
