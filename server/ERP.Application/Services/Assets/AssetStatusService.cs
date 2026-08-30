using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ERP.Application.Common.Interfaces;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;
using ERP.Domain.Entities.Asset;

namespace ERP.Application.Services.Assets;

public class AssetStatusService : IAssetStatusService
{
    private readonly IApplicationDbContext _context;

    public AssetStatusService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<AssetStatusDto>> GetPagedAsync(PagedRequest request)
    {
        var query = _context.AssetStatuses.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            query = query.Where(x => x.Code.Contains(request.SearchTerm) ||
                x.Name.Contains(request.SearchTerm));
        }

        var totalCount = await query.CountAsync();

        if (!string.IsNullOrWhiteSpace(request.SortBy))
        {
            // Very simple dynamic sort for demonstration (usually done via reflection or library like System.Linq.Dynamic.Core)
            if (request.SortBy.ToLower() == "name")
            {
                query = request.SortDescending ? query.OrderByDescending(x => x.Name) : query.OrderBy(x => x.Name);
            }
            else if (request.SortBy.ToLower() == "code")
            {
                query = request.SortDescending ? query.OrderByDescending(x => x.Code) : query.OrderBy(x => x.Code);
            }
            else
            {
                query = request.SortDescending ? query.OrderByDescending(x => x.Id) : query.OrderBy(x => x.Id);
            }
        }
        else
        {
            query = query.OrderBy(x => x.Id);
        }

        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(x => new AssetStatusDto
            {
                Id = x.Id,
            Code = x.Code,
            Name = x.Name,
            Description = x.Description,
            IsActive = x.IsActive
            })
            .ToListAsync();

        return new PagedResponse<AssetStatusDto>(items, totalCount, request.Page, request.PageSize);
    }

    public async Task<AssetStatusDto?> GetByIdAsync(short id)
    {
        var entity = await _context.AssetStatuses.FindAsync(id);
        if (entity == null) return null;

        return new AssetStatusDto
        {
            Id = entity.Id,
            Code = entity.Code,
            Name = entity.Name,
            Description = entity.Description,
            IsActive = entity.IsActive
        };
    }

    public async Task<AssetStatusDto> CreateAsync(CreateAssetStatusDto dto)
    {
        var entity = new AssetStatus
        {
            Code = dto.Code,
            Name = dto.Name,
            Description = dto.Description,
            IsActive = dto.IsActive
        };

        _context.AssetStatuses.Add(entity);
        await _context.SaveChangesAsync();

        return new AssetStatusDto
        {
            Id = entity.Id,
            Code = entity.Code,
            Name = entity.Name,
            Description = entity.Description,
            IsActive = entity.IsActive
        };
    }

    public async Task<bool> UpdateAsync(short id, UpdateAssetStatusDto dto)
    {
        var entity = await _context.AssetStatuses.FindAsync(id);
        if (entity == null) return false;

        entity.Code = dto.Code;
        entity.Name = dto.Name;
        entity.Description = dto.Description;
        entity.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(short id)
    {
        var entity = await _context.AssetStatuses.FindAsync(id);
        if (entity == null) return false;

        _context.AssetStatuses.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}
