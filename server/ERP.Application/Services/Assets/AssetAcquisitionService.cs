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

public class AssetAcquisitionService : IAssetAcquisitionService
{
    private readonly IApplicationDbContext _context;

    public AssetAcquisitionService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<AssetAcquisitionDto>> GetAllAsync(PagedRequest request)
    {
        var query = _context.AssetAcquisitions.AsQueryable();

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            
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
            .Select(e => new AssetAcquisitionDto
            {
            Id = e.Id,
            AssetId = e.AssetId,
            AcquisitionDate = e.AcquisitionDate,
            AcquisitionCost = e.AcquisitionCost,
            CurrencyCode = e.CurrencyCode,
            SupplierId = e.SupplierId,
            PurchaseReference = e.PurchaseReference,
            AcquisitionType = e.AcquisitionType,
            WarrantyExpiryDate = e.WarrantyExpiryDate,
            })
            .ToListAsync();

        return new PagedResponse<AssetAcquisitionDto>(items, totalCount, request.Page, request.PageSize);
    }

    public async Task<AssetAcquisitionDto?> GetByIdAsync(long id)
    {
        var entity = await _context.AssetAcquisitions
            .FirstOrDefaultAsync(x => x.Id == id);

        if (entity == null) return null;

        return new AssetAcquisitionDto
        {
            Id = entity.Id,
            AssetId = entity.AssetId,
            AcquisitionDate = entity.AcquisitionDate,
            AcquisitionCost = entity.AcquisitionCost,
            CurrencyCode = entity.CurrencyCode,
            SupplierId = entity.SupplierId,
            PurchaseReference = entity.PurchaseReference,
            AcquisitionType = entity.AcquisitionType,
            WarrantyExpiryDate = entity.WarrantyExpiryDate,
        };
    }

    public async Task<AssetAcquisitionDto> CreateAsync(CreateAssetAcquisitionDto dto)
    {
        var entity = new AssetAcquisition
        {
            AssetId = dto.AssetId,
            AcquisitionDate = dto.AcquisitionDate,
            AcquisitionCost = dto.AcquisitionCost,
            CurrencyCode = dto.CurrencyCode,
            SupplierId = dto.SupplierId,
            PurchaseReference = dto.PurchaseReference,
            AcquisitionType = dto.AcquisitionType,
            WarrantyExpiryDate = dto.WarrantyExpiryDate,
        };

        _context.AssetAcquisitions.Add(entity);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(entity.Id) ?? throw new System.Exception("Failed to retrieve created entity");
    }

    public async Task<AssetAcquisitionDto> UpdateAsync(long id, UpdateAssetAcquisitionDto dto)
    {
        var entity = await _context.AssetAcquisitions.FindAsync(id);
        if (entity == null) throw new System.Collections.Generic.KeyNotFoundException($"Entity with id {id} not found");

        entity.AssetId = dto.AssetId;
        entity.AcquisitionDate = dto.AcquisitionDate;
        entity.AcquisitionCost = dto.AcquisitionCost;
        entity.CurrencyCode = dto.CurrencyCode;
        entity.SupplierId = dto.SupplierId;
        entity.PurchaseReference = dto.PurchaseReference;
        entity.AcquisitionType = dto.AcquisitionType;
        entity.WarrantyExpiryDate = dto.WarrantyExpiryDate;
        _context.AssetAcquisitions.Update(entity);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(entity.Id) ?? throw new System.Exception("Failed to retrieve updated entity");
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var entity = await _context.AssetAcquisitions.FindAsync(id);
        if (entity == null) return false;

        _context.AssetAcquisitions.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}
