using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ERP.Application.Common.Interfaces;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;
using ERP.Domain.Entities.Asset;

namespace ERP.Application.Services.Assets;

public class CurrencyService : ICurrencyService
{
    private readonly IApplicationDbContext _context;

    public CurrencyService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<CurrencyDto>> GetPagedAsync(PagedRequest request)
    {
        var query = _context.Currencies.AsQueryable();

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
                query = request.SortDescending ? query.OrderByDescending(x => x.Code) : query.OrderBy(x => x.Code);
            }
        }
        else
        {
            query = query.OrderBy(x => x.Code);
        }

        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(x => new CurrencyDto
            {
                Code = x.Code,
            Name = x.Name,
            Symbol = x.Symbol
            })
            .ToListAsync();

        return new PagedResponse<CurrencyDto>(items, totalCount, request.Page, request.PageSize);
    }

    public async Task<CurrencyDto?> GetByIdAsync(string id)
    {
        var entity = await _context.Currencies.FindAsync(id);
        if (entity == null) return null;

        return new CurrencyDto
        {
            Code = entity.Code,
            Name = entity.Name,
            Symbol = entity.Symbol
        };
    }

    public async Task<CurrencyDto> CreateAsync(CreateCurrencyDto dto)
    {
        var entity = new Currency
        {
            Code = dto.Code,
            Name = dto.Name,
            Symbol = dto.Symbol
        };

        _context.Currencies.Add(entity);
        await _context.SaveChangesAsync();

        return new CurrencyDto
        {
            Code = entity.Code,
            Name = entity.Name,
            Symbol = entity.Symbol
        };
    }

    public async Task<bool> UpdateAsync(string id, UpdateCurrencyDto dto)
    {
        var entity = await _context.Currencies.FindAsync(id);
        if (entity == null) return false;

        entity.Name = dto.Name;
        entity.Symbol = dto.Symbol;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var entity = await _context.Currencies.FindAsync(id);
        if (entity == null) return false;

        _context.Currencies.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}
