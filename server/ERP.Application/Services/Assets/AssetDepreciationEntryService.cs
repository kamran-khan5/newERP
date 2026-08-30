using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ERP.Application.Common.Interfaces;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;
using ERP.Domain.Entities.Asset;

namespace ERP.Application.Services.Assets;

public class AssetDepreciationEntryService : IAssetDepreciationEntryService
{
    private readonly IApplicationDbContext _context;

    public AssetDepreciationEntryService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<AssetDepreciationEntryDto>> GetPagedAsync(PagedRequest request)
    {
        var query = _context.AssetDepreciationEntries.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            // Add custom search logic here if needed
        }

        var totalCount = await query.CountAsync();

        if (!string.IsNullOrWhiteSpace(request.SortBy))
        {
            if (request.SortDescending)
            {
                query = query.OrderByDescending(x => EF.Property<object>(x, request.SortBy));
            }
            else
            {
                query = query.OrderBy(x => EF.Property<object>(x, request.SortBy));
            }
        }

        var items = await query
            .Include(x => x.Schedule).ThenInclude(s => s.Asset)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();
            
        var dtos = items.Select(x => MapToDto(x)).ToList();

        return new PagedResponse<AssetDepreciationEntryDto>(dtos, totalCount, request.Page, request.PageSize);
    }

    public async Task<AssetDepreciationEntryDto?> GetByIdAsync(long id)
    {
        var entity = await _context.AssetDepreciationEntries
            .Include(x => x.Schedule).ThenInclude(s => s.Asset)
            .FirstOrDefaultAsync(x => x.Id == id);
            
        if (entity == null) return null;
        
        return MapToDto(entity);
    }

    public async Task<AssetDepreciationEntryDto> CreateAsync(CreateAssetDepreciationEntryDto dto)
    {
        var entity = new AssetDepreciationEntry();
        MapToEntity(dto, entity);
        
        _context.AssetDepreciationEntries.Add(entity);
        await _context.SaveChangesAsync();
        
        return await GetByIdAsync(entity.Id) ?? MapToDto(entity);
    }

    public async Task<AssetDepreciationEntryDto> UpdateAsync(long id, UpdateAssetDepreciationEntryDto dto)
    {
        var entity = await _context.AssetDepreciationEntries.FindAsync(id);
        if (entity == null) throw new Exception("AssetDepreciationEntry not found");
        
        MapToEntity(dto, entity);
        
        await _context.SaveChangesAsync();
        return await GetByIdAsync(entity.Id) ?? MapToDto(entity);
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var entity = await _context.AssetDepreciationEntries.FindAsync(id);
        if (entity == null) return false;
        
        _context.AssetDepreciationEntries.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    private static AssetDepreciationEntryDto MapToDto(AssetDepreciationEntry entity)
    {
        return new AssetDepreciationEntryDto
        {
            Id = entity.Id,
            ScheduleId = entity.ScheduleId,
            PeriodStart = entity.PeriodStart,
            PeriodEnd = entity.PeriodEnd,
            OpeningBookValue = entity.OpeningBookValue,
            DepreciationAmount = entity.DepreciationAmount,
            AccumulatedDepreciation = entity.AccumulatedDepreciation,
            BookValueAfter = entity.BookValueAfter,
            Posted = entity.Posted,
            PostedAt = entity.PostedAt,
            PostedBy = entity.PostedBy,
        };
    }

    private static void MapToEntity(object dto, AssetDepreciationEntry entity)
    {
        var props = dto.GetType().GetProperties();
        foreach (var prop in props)
        {
            var entityProp = entity.GetType().GetProperty(prop.Name);
            if (entityProp != null && entityProp.CanWrite)
            {
                entityProp.SetValue(entity, prop.GetValue(dto));
            }
        }
    }
}
