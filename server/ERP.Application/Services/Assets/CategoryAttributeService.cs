using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ERP.Application.Common.Interfaces;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;
using ERP.Domain.Entities.Asset;
using System.Collections.Generic;

namespace ERP.Application.Services.Assets;

public class CategoryAttributeService : ICategoryAttributeService
{
    private readonly IApplicationDbContext _context;

    public CategoryAttributeService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<CategoryAttributeDto>> GetAllAsync(PagedRequest request)
    {
        var query = _context.CategoryAttributes.AsQueryable();

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            query = query.Where(x => x.Name.Contains(request.SearchTerm));
        }

        var totalCount = await query.CountAsync();

        if (!string.IsNullOrEmpty(request.SortBy))
        {
            // Simple sort by name or id
            if (request.SortDescending)
                query = query.OrderByDescending(x => EF.Property<object>(x, request.SortBy));
            else
                query = query.OrderBy(x => EF.Property<object>(x, request.SortBy));
        }
        else
        {
            query = query.OrderByDescending(x => x.Id);
        }

        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(e => new CategoryAttributeDto
            {
            Id = e.Id,
            CategoryId = e.CategoryId,
            Code = e.Code,
            Name = e.Name,
            DataType = e.DataType,
            IsRequired = e.IsRequired,
            IsSearchable = e.IsSearchable,
            IsFilterable = e.IsFilterable,
            DisplayOrder = e.DisplayOrder,
            Description = e.Description,
            DefaultValue = e.DefaultValue,
            ValidationRules = e.ValidationRules,
            IsActive = e.IsActive,
            })
            .ToListAsync();

        return new PagedResponse<CategoryAttributeDto>(items, totalCount, request.Page, request.PageSize);
    }

    public async Task<CategoryAttributeDto?> GetByIdAsync(long id)
    {
        var entity = await _context.CategoryAttributes
            .FirstOrDefaultAsync(x => x.Id == id);

        if (entity == null) return null;

        return new CategoryAttributeDto
        {
            Id = entity.Id,
            CategoryId = entity.CategoryId,
            Code = entity.Code,
            Name = entity.Name,
            DataType = entity.DataType,
            IsRequired = entity.IsRequired,
            IsSearchable = entity.IsSearchable,
            IsFilterable = entity.IsFilterable,
            DisplayOrder = entity.DisplayOrder,
            Description = entity.Description,
            DefaultValue = entity.DefaultValue,
            ValidationRules = entity.ValidationRules,
            IsActive = entity.IsActive,
        };
    }

    public async Task<CategoryAttributeDto> CreateAsync(CreateCategoryAttributeDto dto)
    {
        var entity = new CategoryAttribute
        {
            CategoryId = dto.CategoryId,
            Code = dto.Code,
            Name = dto.Name,
            DataType = dto.DataType,
            IsRequired = dto.IsRequired,
            IsSearchable = dto.IsSearchable,
            IsFilterable = dto.IsFilterable,
            DisplayOrder = dto.DisplayOrder,
            Description = dto.Description,
            DefaultValue = dto.DefaultValue,
            ValidationRules = dto.ValidationRules,
            IsActive = dto.IsActive,
        };

        _context.CategoryAttributes.Add(entity);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(entity.Id) ?? throw new System.Exception("Failed to retrieve created entity");
    }

    public async Task<CategoryAttributeDto> UpdateAsync(long id, UpdateCategoryAttributeDto dto)
    {
        var entity = await _context.CategoryAttributes.FindAsync(id);
        if (entity == null) throw new System.Collections.Generic.KeyNotFoundException($"Entity with id {id} not found");

        entity.CategoryId = dto.CategoryId;
        entity.Code = dto.Code;
        entity.Name = dto.Name;
        entity.DataType = dto.DataType;
        entity.IsRequired = dto.IsRequired;
        entity.IsSearchable = dto.IsSearchable;
        entity.IsFilterable = dto.IsFilterable;
        entity.DisplayOrder = dto.DisplayOrder;
        entity.Description = dto.Description;
        entity.DefaultValue = dto.DefaultValue;
        entity.ValidationRules = dto.ValidationRules;
        entity.IsActive = dto.IsActive;
        _context.CategoryAttributes.Update(entity);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(entity.Id) ?? throw new System.Exception("Failed to retrieve updated entity");
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var entity = await _context.CategoryAttributes.FindAsync(id);
        if (entity == null) return false;

        _context.CategoryAttributes.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}
