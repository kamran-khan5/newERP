using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ERP.Application.Common.Interfaces;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;
using ERP.Domain.Entities.Asset;

namespace ERP.Application.Services.Assets;

public class LocationService : ILocationService
{
    private readonly IApplicationDbContext _context;

    public LocationService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<LocationDto>> GetPagedAsync(PagedRequest request)
    {
        var query = _context.Locations.AsQueryable();

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
            .Select(x => new LocationDto
            {
                Id = x.Id,
            ParentLocationId = x.ParentLocationId,
            Code = x.Code,
            Name = x.Name,
            LocationType = x.LocationType,
            Address = x.Address,
            IsActive = x.IsActive
            })
            .ToListAsync();

        return new PagedResponse<LocationDto>(items, totalCount, request.Page, request.PageSize);
    }

    public async Task<LocationDto?> GetByIdAsync(long id)
    {
        var entity = await _context.Locations.FindAsync(id);
        if (entity == null) return null;

        return new LocationDto
        {
            Id = entity.Id,
            ParentLocationId = entity.ParentLocationId,
            Code = entity.Code,
            Name = entity.Name,
            LocationType = entity.LocationType,
            Address = entity.Address,
            IsActive = entity.IsActive
        };
    }

    public async Task<LocationDto> CreateAsync(CreateLocationDto dto)
    {
        var entity = new Location
        {
            ParentLocationId = dto.ParentLocationId,
            Code = dto.Code,
            Name = dto.Name,
            LocationType = dto.LocationType,
            Address = dto.Address,
            IsActive = dto.IsActive
        };

        _context.Locations.Add(entity);
        await _context.SaveChangesAsync();

        return new LocationDto
        {
            Id = entity.Id,
            ParentLocationId = entity.ParentLocationId,
            Code = entity.Code,
            Name = entity.Name,
            LocationType = entity.LocationType,
            Address = entity.Address,
            IsActive = entity.IsActive
        };
    }

    public async Task<bool> UpdateAsync(long id, UpdateLocationDto dto)
    {
        var entity = await _context.Locations.FindAsync(id);
        if (entity == null) return false;

        entity.ParentLocationId = dto.ParentLocationId;
        entity.Code = dto.Code;
        entity.Name = dto.Name;
        entity.LocationType = dto.LocationType;
        entity.Address = dto.Address;
        entity.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var entity = await _context.Locations.FindAsync(id);
        if (entity == null) return false;

        _context.Locations.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}
