using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ERP.Application.Common.Interfaces;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;
using ERP.Domain.Entities.Asset;

namespace ERP.Application.Services.Assets;

public class AssetLifecycleEventService : IAssetLifecycleEventService
{
    private readonly IApplicationDbContext _context;

    public AssetLifecycleEventService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<AssetLifecycleEventDto>> GetPagedAsync(PagedRequest request)
    {
        var query = _context.AssetLifecycleEvents.AsQueryable();

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
            .Include(x => x.Asset)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();
            
        var dtos = items.Select(x => MapToDto(x)).ToList();

        return new PagedResponse<AssetLifecycleEventDto>(dtos, totalCount, request.Page, request.PageSize);
    }

    public async Task<AssetLifecycleEventDto?> GetByIdAsync(long id)
    {
        var entity = await _context.AssetLifecycleEvents
            .Include(x => x.Asset)
            .FirstOrDefaultAsync(x => x.Id == id);
            
        if (entity == null) return null;
        
        return MapToDto(entity);
    }

    public async Task<AssetLifecycleEventDto> CreateAsync(CreateAssetLifecycleEventDto dto)
    {
        var entity = new AssetLifecycleEvent();
        MapToEntity(dto, entity);
        
        _context.AssetLifecycleEvents.Add(entity);
        await _context.SaveChangesAsync();
        
        return await GetByIdAsync(entity.Id) ?? MapToDto(entity);
    }

    public async Task<AssetLifecycleEventDto> UpdateAsync(long id, UpdateAssetLifecycleEventDto dto)
    {
        var entity = await _context.AssetLifecycleEvents.FindAsync(id);
        if (entity == null) throw new Exception("AssetLifecycleEvent not found");
        
        MapToEntity(dto, entity);
        
        await _context.SaveChangesAsync();
        return await GetByIdAsync(entity.Id) ?? MapToDto(entity);
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var entity = await _context.AssetLifecycleEvents.FindAsync(id);
        if (entity == null) return false;
        
        _context.AssetLifecycleEvents.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    private static AssetLifecycleEventDto MapToDto(AssetLifecycleEvent entity)
    {
        return new AssetLifecycleEventDto
        {
            Id = entity.Id,
            AssetId = entity.AssetId,
            EventTypeId = entity.EventTypeId,
            EventDate = entity.EventDate,
            PerformedBy = entity.PerformedBy,
            Notes = entity.Notes,
            Details = entity.Details,
        };
    }

    private static void MapToEntity(object dto, AssetLifecycleEvent entity)
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
