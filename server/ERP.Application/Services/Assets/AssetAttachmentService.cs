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

public class AssetAttachmentService : IAssetAttachmentService
{
    private readonly IApplicationDbContext _context;

    public AssetAttachmentService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<AssetAttachmentDto>> GetAllAsync(PagedRequest request)
    {
        var query = _context.AssetAttachments.AsQueryable();

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            query = query.Where(x => x.OriginalFileName.Contains(request.SearchTerm));
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
            .Select(e => new AssetAttachmentDto
            {
            Id = e.Id,
            AssetId = e.AssetId,
            OriginalFileName = e.OriginalFileName,
            StoredFileName = e.StoredFileName,
            MimeType = e.MimeType,
            FileSize = e.FileSize,
            StoragePath = e.StoragePath,
            })
            .ToListAsync();

        return new PagedResponse<AssetAttachmentDto>(items, totalCount, request.Page, request.PageSize);
    }

    public async Task<AssetAttachmentDto?> GetByIdAsync(Guid id)
    {
        var entity = await _context.AssetAttachments
            .FirstOrDefaultAsync(x => x.Id == id);

        if (entity == null) return null;

        return new AssetAttachmentDto
        {
            Id = entity.Id,
            AssetId = entity.AssetId,
            OriginalFileName = entity.OriginalFileName,
            StoredFileName = entity.StoredFileName,
            MimeType = entity.MimeType,
            FileSize = entity.FileSize,
            StoragePath = entity.StoragePath,
        };
    }

    public async Task<AssetAttachmentDto> CreateAsync(CreateAssetAttachmentDto dto)
    {
        var entity = new AssetAttachment
        {
            AssetId = dto.AssetId,
            OriginalFileName = dto.OriginalFileName,
            StoredFileName = dto.StoredFileName,
            MimeType = dto.MimeType,
            FileSize = dto.FileSize,
            StoragePath = dto.StoragePath,
        };

        _context.AssetAttachments.Add(entity);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(entity.Id) ?? throw new System.Exception("Failed to retrieve created entity");
    }

    public async Task<AssetAttachmentDto> UpdateAsync(Guid id, UpdateAssetAttachmentDto dto)
    {
        var entity = await _context.AssetAttachments.FindAsync(id);
        if (entity == null) throw new System.Collections.Generic.KeyNotFoundException($"Entity with id {id} not found");

        entity.AssetId = dto.AssetId;
        entity.OriginalFileName = dto.OriginalFileName;
        entity.StoredFileName = dto.StoredFileName;
        entity.MimeType = dto.MimeType;
        entity.FileSize = dto.FileSize;
        entity.StoragePath = dto.StoragePath;
        _context.AssetAttachments.Update(entity);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(entity.Id) ?? throw new System.Exception("Failed to retrieve updated entity");
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _context.AssetAttachments.FindAsync(id);
        if (entity == null) return false;

        _context.AssetAttachments.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}
