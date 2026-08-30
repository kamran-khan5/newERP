using System.Threading.Tasks;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;

namespace ERP.Application.Services.Assets;

public interface ICurrencyService
{
    Task<PagedResponse<CurrencyDto>> GetPagedAsync(PagedRequest request);
    Task<CurrencyDto?> GetByIdAsync(string id);
    Task<CurrencyDto> CreateAsync(CreateCurrencyDto dto);
    Task<bool> UpdateAsync(string id, UpdateCurrencyDto dto);
    Task<bool> DeleteAsync(string id);
}
