using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ERP.Application.Common.Interfaces;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;
using ERP.Domain.Entities.Asset;

namespace ERP.Application.Services.Assets;

public class AssetDepreciationScheduleService : IAssetDepreciationScheduleService
{
    private readonly IApplicationDbContext _context;

    public AssetDepreciationScheduleService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<AssetDepreciationScheduleDto>> GetPagedAsync(PagedRequest request)
    {
        var query = _context.AssetDepreciationSchedules.AsQueryable();

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

        return new PagedResponse<AssetDepreciationScheduleDto>(dtos, totalCount, request.Page, request.PageSize);
    }

    public async Task<AssetDepreciationScheduleDto?> GetByIdAsync(long id)
    {
        var entity = await _context.AssetDepreciationSchedules
            .Include(x => x.Asset)
            .FirstOrDefaultAsync(x => x.Id == id);
            
        if (entity == null) return null;
        
        return MapToDto(entity);
    }

    public async Task<AssetDepreciationScheduleDto> CreateAsync(CreateAssetDepreciationScheduleDto dto)
    {
        var entity = new AssetDepreciationSchedule();
        MapToEntity(dto, entity);
        
        _context.AssetDepreciationSchedules.Add(entity);
        await _context.SaveChangesAsync();
        
        return await GetByIdAsync(entity.Id) ?? MapToDto(entity);
    }

    public async Task<AssetDepreciationScheduleDto> UpdateAsync(long id, UpdateAssetDepreciationScheduleDto dto)
    {
        var entity = await _context.AssetDepreciationSchedules.FindAsync(id);
        if (entity == null) throw new Exception("AssetDepreciationSchedule not found");
        
        MapToEntity(dto, entity);
        
        await _context.SaveChangesAsync();
        return await GetByIdAsync(entity.Id) ?? MapToDto(entity);
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var entity = await _context.AssetDepreciationSchedules.FindAsync(id);
        if (entity == null) return false;
        
        _context.AssetDepreciationSchedules.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    private static AssetDepreciationScheduleDto MapToDto(AssetDepreciationSchedule entity)
    {
        return new AssetDepreciationScheduleDto
        {
            Id = entity.Id,
            AssetId = entity.AssetId,
            MethodId = entity.MethodId,
            UsefulLifeMonths = entity.UsefulLifeMonths,
            SalvageValue = entity.SalvageValue,
            StartDate = entity.StartDate,
            IsActive = entity.IsActive,
        };
    }

    private static void MapToEntity(object dto, AssetDepreciationSchedule entity)
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
