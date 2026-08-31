using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ERP.Application.Common.Interfaces;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;
using ERP.Domain.Entities.Asset;

namespace ERP.Application.Services.Assets;

public class CategoryAttributeOptionService : ICategoryAttributeOptionService
{
    private readonly IApplicationDbContext _context;

    public CategoryAttributeOptionService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<CategoryAttributeOptionDto>> GetAllAsync(PagedRequest request, long? attributeId = null)
    {
        var query = _context.CategoryAttributeOptions.AsQueryable();

        if (attributeId.HasValue)
        {
            query = query.Where(x => x.AttributeId == attributeId.Value);
        }

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            query = query.Where(x => x.Label.Contains(request.SearchTerm) || x.Value.Contains(request.SearchTerm));
        }

        var totalCount = await query.CountAsync();

        if (!string.IsNullOrEmpty(request.SortBy))
        {
            if (request.SortDescending)
                query = query.OrderByDescending(x => EF.Property<object>(x, request.SortBy));
            else
                query = query.OrderBy(x => EF.Property<object>(x, request.SortBy));
        }
        else
        {
            query = query.OrderBy(x => x.DisplayOrder).ThenBy(x => x.Id);
        }

        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(e => new CategoryAttributeOptionDto
            {
                Id = e.Id,
                AttributeId = e.AttributeId,
                Value = e.Value,
                Label = e.Label,
                DisplayOrder = e.DisplayOrder,
                IsActive = e.IsActive
            })
            .ToListAsync();

        return new PagedResponse<CategoryAttributeOptionDto>(items, totalCount, request.Page, request.PageSize);
    }

    public async Task<List<CategoryAttributeOptionDto>> GetByAttributeIdAsync(long attributeId)
    {
        return await _context.CategoryAttributeOptions
            .Where(x => x.AttributeId == attributeId && x.IsActive)
            .OrderBy(x => x.DisplayOrder)
            .ThenBy(x => x.Id)
            .Select(e => new CategoryAttributeOptionDto
            {
                Id = e.Id,
                AttributeId = e.AttributeId,
                Value = e.Value,
                Label = e.Label,
                DisplayOrder = e.DisplayOrder,
                IsActive = e.IsActive
            })
            .ToListAsync();
    }

    public async Task<CategoryAttributeOptionDto?> GetByIdAsync(long id)
    {
        var entity = await _context.CategoryAttributeOptions
            .FirstOrDefaultAsync(x => x.Id == id);

        if (entity == null) return null;

        return new CategoryAttributeOptionDto
        {
            Id = entity.Id,
            AttributeId = entity.AttributeId,
            Value = entity.Value,
            Label = entity.Label,
            DisplayOrder = entity.DisplayOrder,
            IsActive = entity.IsActive
        };
    }

    public async Task<CategoryAttributeOptionDto> CreateAsync(CreateCategoryAttributeOptionDto dto)
    {
        var entity = new CategoryAttributeOption
        {
            AttributeId = dto.AttributeId,
            Value = dto.Value,
            Label = dto.Label,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive
        };

        _context.CategoryAttributeOptions.Add(entity);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(entity.Id) ?? throw new Exception("Failed to retrieve created entity");
    }

    public async Task<CategoryAttributeOptionDto> UpdateAsync(long id, UpdateCategoryAttributeOptionDto dto)
    {
        var entity = await _context.CategoryAttributeOptions.FindAsync(id);
        if (entity == null) throw new KeyNotFoundException($"Entity with id {id} not found");

        entity.AttributeId = dto.AttributeId;
        entity.Value = dto.Value;
        entity.Label = dto.Label;
        entity.DisplayOrder = dto.DisplayOrder;
        entity.IsActive = dto.IsActive;

        _context.CategoryAttributeOptions.Update(entity);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(entity.Id) ?? throw new Exception("Failed to retrieve updated entity");
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var entity = await _context.CategoryAttributeOptions.FindAsync(id);
        if (entity == null) return false;

        _context.CategoryAttributeOptions.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}
