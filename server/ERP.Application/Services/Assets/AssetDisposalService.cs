using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ERP.Application.Common.Interfaces;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;
using ERP.Domain.Entities.Asset;

namespace ERP.Application.Services.Assets;

public class AssetDisposalService : IAssetDisposalService
{
    private readonly IApplicationDbContext _context;

    public AssetDisposalService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<AssetDisposalDto>> GetPagedAsync(PagedRequest request)
    {
        var query = _context.AssetDisposals.AsQueryable();

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

        return new PagedResponse<AssetDisposalDto>(dtos, totalCount, request.Page, request.PageSize);
    }

    public async Task<AssetDisposalDto?> GetByIdAsync(long id)
    {
        var entity = await _context.AssetDisposals
            .Include(x => x.Asset)
            .FirstOrDefaultAsync(x => x.Id == id);
            
        if (entity == null) return null;
        
        return MapToDto(entity);
    }

    public async Task<AssetDisposalDto> CreateAsync(CreateAssetDisposalDto dto)
    {
        var entity = new AssetDisposal();
        MapToEntity(dto, entity);
        
        _context.AssetDisposals.Add(entity);
        await _context.SaveChangesAsync();
        
        return await GetByIdAsync(entity.Id) ?? MapToDto(entity);
    }

    public async Task<AssetDisposalDto> UpdateAsync(long id, UpdateAssetDisposalDto dto)
    {
        var entity = await _context.AssetDisposals.FindAsync(id);
        if (entity == null) throw new Exception("AssetDisposal not found");
        
        MapToEntity(dto, entity);
        
        await _context.SaveChangesAsync();
        return await GetByIdAsync(entity.Id) ?? MapToDto(entity);
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var entity = await _context.AssetDisposals.FindAsync(id);
        if (entity == null) return false;
        
        _context.AssetDisposals.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    private static AssetDisposalDto MapToDto(AssetDisposal entity)
    {
        return new AssetDisposalDto
        {
            Id = entity.Id,
            AssetId = entity.AssetId,
            DisposalDate = entity.DisposalDate,
            DisposalMethod = entity.DisposalMethod,
            DisposalValue = entity.DisposalValue,
            CurrencyCode = entity.CurrencyCode,
            BuyerInfo = entity.BuyerInfo,
            Reason = entity.Reason,
            ApprovedBy = entity.ApprovedBy,
        };
    }

    private static void MapToEntity(object dto, AssetDisposal entity)
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
