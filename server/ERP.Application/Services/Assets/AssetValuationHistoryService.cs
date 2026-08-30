using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ERP.Application.Common.Interfaces;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;
using ERP.Domain.Entities.Asset;

namespace ERP.Application.Services.Assets;

public class AssetValuationHistoryService : IAssetValuationHistoryService
{
    private readonly IApplicationDbContext _context;

    public AssetValuationHistoryService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<AssetValuationHistoryDto>> GetPagedAsync(PagedRequest request)
    {
        var query = _context.AssetValuationHistories.AsQueryable();

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

        return new PagedResponse<AssetValuationHistoryDto>(dtos, totalCount, request.Page, request.PageSize);
    }

    public async Task<AssetValuationHistoryDto?> GetByIdAsync(long id)
    {
        var entity = await _context.AssetValuationHistories
            .Include(x => x.Asset)
            .FirstOrDefaultAsync(x => x.Id == id);
            
        if (entity == null) return null;
        
        return MapToDto(entity);
    }

    public async Task<AssetValuationHistoryDto> CreateAsync(CreateAssetValuationHistoryDto dto)
    {
        var entity = new AssetValuationHistory();
        MapToEntity(dto, entity);
        
        _context.AssetValuationHistories.Add(entity);
        await _context.SaveChangesAsync();
        
        return await GetByIdAsync(entity.Id) ?? MapToDto(entity);
    }

    public async Task<AssetValuationHistoryDto> UpdateAsync(long id, UpdateAssetValuationHistoryDto dto)
    {
        var entity = await _context.AssetValuationHistories.FindAsync(id);
        if (entity == null) throw new Exception("AssetValuationHistory not found");
        
        MapToEntity(dto, entity);
        
        await _context.SaveChangesAsync();
        return await GetByIdAsync(entity.Id) ?? MapToDto(entity);
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var entity = await _context.AssetValuationHistories.FindAsync(id);
        if (entity == null) return false;
        
        _context.AssetValuationHistories.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    private static AssetValuationHistoryDto MapToDto(AssetValuationHistory entity)
    {
        return new AssetValuationHistoryDto
        {
            Id = entity.Id,
            AssetId = entity.AssetId,
            ValuationDate = entity.ValuationDate,
            Value = entity.Value,
            CurrencyCode = entity.CurrencyCode,
            ValuationMethod = entity.ValuationMethod,
            ValuedBy = entity.ValuedBy,
            Notes = entity.Notes,
        };
    }

    private static void MapToEntity(object dto, AssetValuationHistory entity)
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
