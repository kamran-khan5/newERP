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

public class AssetCategoryService : IAssetCategoryService
{
    private readonly IApplicationDbContext _context;

    public AssetCategoryService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<AssetCategoryDto>> GetAllAsync(PagedRequest request)
    {
        var query = _context.AssetCategories.AsQueryable();

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
            .Select(e => new AssetCategoryDto
            {
            Id = e.Id,
            AssetClassId = e.AssetClassId,
            ParentCategoryId = e.ParentCategoryId,
            Code = e.Code,
            Name = e.Name,
            Description = e.Description,
            Path = e.Path,
            Depth = e.Depth,
            DisplayOrder = e.DisplayOrder,
            IsActive = e.IsActive,
            })
            .ToListAsync();

        return new PagedResponse<AssetCategoryDto>(items, totalCount, request.Page, request.PageSize);
    }

    public async Task<AssetCategoryDto?> GetByIdAsync(long id)
    {
        var entity = await _context.AssetCategories
            .FirstOrDefaultAsync(x => x.Id == id);

        if (entity == null) return null;

        return new AssetCategoryDto
        {
            Id = entity.Id,
            AssetClassId = entity.AssetClassId,
            ParentCategoryId = entity.ParentCategoryId,
            Code = entity.Code,
            Name = entity.Name,
            Description = entity.Description,
            Path = entity.Path,
            Depth = entity.Depth,
            DisplayOrder = entity.DisplayOrder,
            IsActive = entity.IsActive,
        };
    }

    public async Task<AssetCategoryDto> CreateAsync(CreateAssetCategoryDto dto)
    {
        var entity = new AssetCategory
        {
            AssetClassId = dto.AssetClassId,
            ParentCategoryId = dto.ParentCategoryId,
            Code = dto.Code,
            Name = dto.Name,
            Description = dto.Description,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive,
        };

        _context.AssetCategories.Add(entity);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(entity.Id) ?? throw new System.Exception("Failed to retrieve created entity");
    }

    public async Task<AssetCategoryDto> UpdateAsync(long id, UpdateAssetCategoryDto dto)
    {
        var entity = await _context.AssetCategories.FindAsync(id);
        if (entity == null) throw new System.Collections.Generic.KeyNotFoundException($"Entity with id {id} not found");

        entity.AssetClassId = dto.AssetClassId;
        entity.ParentCategoryId = dto.ParentCategoryId;
        entity.Code = dto.Code;
        entity.Name = dto.Name;
        entity.Description = dto.Description;
        entity.DisplayOrder = dto.DisplayOrder;
        entity.IsActive = dto.IsActive;
        _context.AssetCategories.Update(entity);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(entity.Id) ?? throw new System.Exception("Failed to retrieve updated entity");
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var entity = await _context.AssetCategories.FindAsync(id);
        if (entity == null) return false;

        _context.AssetCategories.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}
