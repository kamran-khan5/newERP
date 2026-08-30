using System.Threading.Tasks;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;

namespace ERP.Application.Services.Assets;

public interface ILocationService
{
    Task<PagedResponse<LocationDto>> GetPagedAsync(PagedRequest request);
    Task<LocationDto?> GetByIdAsync(long id);
    Task<LocationDto> CreateAsync(CreateLocationDto dto);
    Task<bool> UpdateAsync(long id, UpdateLocationDto dto);
    Task<bool> DeleteAsync(long id);
}
