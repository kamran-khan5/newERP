using System;
using System.Threading.Tasks;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;

namespace ERP.Application.Services.Assets;

public interface ICategoryAttributeService
{
    Task<PagedResponse<CategoryAttributeDto>> GetAllAsync(PagedRequest request);
    Task<CategoryAttributeDto?> GetByIdAsync(long id);
    Task<CategoryAttributeDto> CreateAsync(CreateCategoryAttributeDto dto);
    Task<CategoryAttributeDto> UpdateAsync(long id, UpdateCategoryAttributeDto dto);
    Task<bool> DeleteAsync(long id);
}
