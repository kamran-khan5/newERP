using System.Collections.Generic;
using System.Threading.Tasks;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;

namespace ERP.Application.Services.Assets;

public interface ICategoryAttributeOptionService
{
    Task<PagedResponse<CategoryAttributeOptionDto>> GetAllAsync(PagedRequest request, long? attributeId = null);
    Task<List<CategoryAttributeOptionDto>> GetByAttributeIdAsync(long attributeId);
    Task<CategoryAttributeOptionDto?> GetByIdAsync(long id);
    Task<CategoryAttributeOptionDto> CreateAsync(CreateCategoryAttributeOptionDto dto);
    Task<CategoryAttributeOptionDto> UpdateAsync(long id, UpdateCategoryAttributeOptionDto dto);
    Task<bool> DeleteAsync(long id);
}
