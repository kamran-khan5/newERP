using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;
using ERP.Application.Services.Assets;

namespace ERP.API.Controllers.Assets;


[ApiController]
[Route("api/assets/[controller]")]
[AllowAnonymous]
public class AssetClassController : ControllerBase
{
    private readonly IAssetClassService _service;

    public AssetClassController(IAssetClassService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] PagedRequest request)
    {
        PagedResponse<AssetClassDto>? result = await _service.GetPagedAsync(request);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(short id)
    {
        AssetClassDto? result = await _service.GetByIdAsync(id);
        if (result == null) return NotFound();
        
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateAssetClassDto dto)
    {
        AssetClassDto? result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(short id, UpdateAssetClassDto dto)
    {
        bool success = await _service.UpdateAsync(id, dto);
        if (!success) return NotFound();
        
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(short id)
    {
        bool success = await _service.DeleteAsync(id);
        if (!success) return NotFound();
        
        return NoContent();
    }
}
