using System.Threading.Tasks;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;

namespace ERP.Application.Services.Assets;

public interface IDepreciationMethodService
{
    Task<PagedResponse<DepreciationMethodDto>> GetPagedAsync(PagedRequest request);
    Task<DepreciationMethodDto?> GetByIdAsync(short id);
    Task<DepreciationMethodDto> CreateAsync(CreateDepreciationMethodDto dto);
    Task<bool> UpdateAsync(short id, UpdateDepreciationMethodDto dto);
    Task<bool> DeleteAsync(short id);
}
