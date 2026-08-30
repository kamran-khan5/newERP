using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;
using ERP.Application.Services.Assets;

namespace ERP.API.Controllers.Assets;

[Authorize]
[ApiController]
[Route("api/assets/[controller]")]
public class CurrencyController : ControllerBase
{
    private readonly ICurrencyService _service;

    public CurrencyController(ICurrencyService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] PagedRequest request)
    {
        var result = await _service.GetPagedAsync(request);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null) return NotFound();
        
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateCurrencyDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Code }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, UpdateCurrencyDto dto)
    {
        var success = await _service.UpdateAsync(id, dto);
        if (!success) return NotFound();
        
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var success = await _service.DeleteAsync(id);
        if (!success) return NotFound();
        
        return NoContent();
    }
}
