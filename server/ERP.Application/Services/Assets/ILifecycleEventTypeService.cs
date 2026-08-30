using System.Threading.Tasks;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;

namespace ERP.Application.Services.Assets;

public interface ILifecycleEventTypeService
{
    Task<PagedResponse<LifecycleEventTypeDto>> GetPagedAsync(PagedRequest request);
    Task<LifecycleEventTypeDto?> GetByIdAsync(short id);
    Task<LifecycleEventTypeDto> CreateAsync(CreateLifecycleEventTypeDto dto);
    Task<bool> UpdateAsync(short id, UpdateLifecycleEventTypeDto dto);
    Task<bool> DeleteAsync(short id);
}
