using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ERP.Application.Common.Interfaces;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;
using ERP.Domain.Entities.Asset;

namespace ERP.Application.Services.Assets;

public class LifecycleEventTypeService : ILifecycleEventTypeService
{
    private readonly IApplicationDbContext _context;

    public LifecycleEventTypeService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<LifecycleEventTypeDto>> GetPagedAsync(PagedRequest request)
    {
        var query = _context.LifecycleEventTypes.AsQueryable();

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
            .Select(x => new LifecycleEventTypeDto
            {
                Id = x.Id,
            Stage = x.Stage,
            Code = x.Code,
            Name = x.Name,
            Description = x.Description,
            IsActive = x.IsActive
            })
            .ToListAsync();

        return new PagedResponse<LifecycleEventTypeDto>(items, totalCount, request.Page, request.PageSize);
    }

    public async Task<LifecycleEventTypeDto?> GetByIdAsync(short id)
    {
        var entity = await _context.LifecycleEventTypes.FindAsync(id);
        if (entity == null) return null;

        return new LifecycleEventTypeDto
        {
            Id = entity.Id,
            Stage = entity.Stage,
            Code = entity.Code,
            Name = entity.Name,
            Description = entity.Description,
            IsActive = entity.IsActive
        };
    }

    public async Task<LifecycleEventTypeDto> CreateAsync(CreateLifecycleEventTypeDto dto)
    {
        var entity = new LifecycleEventType
        {
            Stage = dto.Stage,
            Code = dto.Code,
            Name = dto.Name,
            Description = dto.Description,
            IsActive = dto.IsActive
        };

        _context.LifecycleEventTypes.Add(entity);
        await _context.SaveChangesAsync();

        return new LifecycleEventTypeDto
        {
            Id = entity.Id,
            Stage = entity.Stage,
            Code = entity.Code,
            Name = entity.Name,
            Description = entity.Description,
            IsActive = entity.IsActive
        };
    }

    public async Task<bool> UpdateAsync(short id, UpdateLifecycleEventTypeDto dto)
    {
        var entity = await _context.LifecycleEventTypes.FindAsync(id);
        if (entity == null) return false;

        entity.Stage = dto.Stage;
        entity.Code = dto.Code;
        entity.Name = dto.Name;
        entity.Description = dto.Description;
        entity.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(short id)
    {
        var entity = await _context.LifecycleEventTypes.FindAsync(id);
        if (entity == null) return false;

        _context.LifecycleEventTypes.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}
