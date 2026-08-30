using System;
using System.Threading.Tasks;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;

namespace ERP.Application.Services.Assets;

public interface IAssetDisposalService
{
    Task<PagedResponse<AssetDisposalDto>> GetPagedAsync(PagedRequest request);
    Task<AssetDisposalDto?> GetByIdAsync(long id);
    Task<AssetDisposalDto> CreateAsync(CreateAssetDisposalDto dto);
    Task<AssetDisposalDto> UpdateAsync(long id, UpdateAssetDisposalDto dto);
    Task<bool> DeleteAsync(long id);
}
