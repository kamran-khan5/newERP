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

public class AssetService : IAssetService
{
    private readonly IApplicationDbContext _context;

    public AssetService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<AssetDto>> GetAllAsync(PagedRequest request)
    {
        var query = _context.Assets.Include(a => a.AssetClass).Include(a => a.Category).Include(a => a.Status).Include(a => a.CurrentLocation).AsQueryable();

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            query = query.Where(x => x.Name.Contains(request.SearchTerm) || x.AssetCode.Contains(request.SearchTerm));
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
            .Select(e => new AssetDto
            {
                Id = e.Id,
                AssetCode = e.AssetCode,
                Name = e.Name,
                Description = e.Description,
                Ownership = e.Ownership,
                AssetClassId = e.AssetClassId,
                AssetClassName = e.AssetClass != null ? e.AssetClass.Name : null,
                CategoryId = e.CategoryId,
                CategoryName = e.Category != null ? e.Category.Name : null,
                StatusId = e.StatusId,
                StatusName = e.Status != null ? e.Status.Name : null,
                DepartmentId = e.DepartmentId,
                CustodianId = e.CustodianId,
                CurrentLocationId = e.CurrentLocationId,
                CurrentLocationName = e.CurrentLocation != null ? e.CurrentLocation.Name : null,
                ExtraAttributes = e.ExtraAttributes,
                IsActive = e.IsActive,
            })
            .ToListAsync();

        return new PagedResponse<AssetDto>(items, totalCount, request.Page, request.PageSize);
    }

    public async Task<AssetDto?> GetByIdAsync(Guid id)
    {
        var entity = await _context.Assets.Include(a => a.AssetClass).Include(a => a.Category).Include(a => a.Status).Include(a => a.CurrentLocation)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (entity == null) return null;

        return new AssetDto
        {
            Id = entity.Id,
            AssetCode = entity.AssetCode,
            Name = entity.Name,
            Description = entity.Description,
            Ownership = entity.Ownership,
            AssetClassId = entity.AssetClassId,
            AssetClassName = entity.AssetClass != null ? entity.AssetClass.Name : null,
            CategoryId = entity.CategoryId,
            CategoryName = entity.Category != null ? entity.Category.Name : null,
            StatusId = entity.StatusId,
            StatusName = entity.Status != null ? entity.Status.Name : null,
            DepartmentId = entity.DepartmentId,
            CustodianId = entity.CustodianId,
            CurrentLocationId = entity.CurrentLocationId,
            CurrentLocationName = entity.CurrentLocation != null ? entity.CurrentLocation.Name : null,
            ExtraAttributes = entity.ExtraAttributes,
            IsActive = entity.IsActive,
        };
    }

    public async Task<AssetDto> CreateAsync(CreateAssetDto dto)
    {
        var entity = new Asset
        {
            AssetCode = dto.AssetCode,
            Name = dto.Name,
            Description = dto.Description,
            Ownership = dto.Ownership,
            AssetClassId = dto.AssetClassId,
            CategoryId = dto.CategoryId,
            StatusId = dto.StatusId,
            DepartmentId = dto.DepartmentId,
            CustodianId = dto.CustodianId,
            CurrentLocationId = dto.CurrentLocationId,
            ExtraAttributes = dto.ExtraAttributes,
            IsActive = dto.IsActive,
        };

        _context.Assets.Add(entity);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(entity.Id) ?? throw new System.Exception("Failed to retrieve created entity");
    }

    public async Task<AssetDto> UpdateAsync(Guid id, UpdateAssetDto dto)
    {
        var entity = await _context.Assets.FindAsync(id);
        if (entity == null) throw new System.Collections.Generic.KeyNotFoundException($"Entity with id {id} not found");

        entity.AssetCode = dto.AssetCode;
        entity.Name = dto.Name;
        entity.Description = dto.Description;
        entity.Ownership = dto.Ownership;
        entity.AssetClassId = dto.AssetClassId;
        entity.CategoryId = dto.CategoryId;
        entity.StatusId = dto.StatusId;
        entity.DepartmentId = dto.DepartmentId;
        entity.CustodianId = dto.CustodianId;
        entity.CurrentLocationId = dto.CurrentLocationId;
        entity.ExtraAttributes = dto.ExtraAttributes;
        entity.IsActive = dto.IsActive;
        _context.Assets.Update(entity);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(entity.Id) ?? throw new System.Exception("Failed to retrieve updated entity");
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _context.Assets.FindAsync(id);
        if (entity == null) return false;

        _context.Assets.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}
