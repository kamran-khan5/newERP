using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;
using ERP.Application.Services.Assets;

namespace ERP.API.Controllers.Assets;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AssetAcquisitionsController : ControllerBase
{
    private readonly IAssetAcquisitionService _service;

    public AssetAcquisitionsController(IAssetAcquisitionService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResponse<AssetAcquisitionDto>>> GetAll([FromQuery] PagedRequest request)
    {
        var result = await _service.GetAllAsync(request);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AssetAcquisitionDto>> GetById(long id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<AssetAcquisitionDto>> Create([FromBody] CreateAssetAcquisitionDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AssetAcquisitionDto>> Update(long id, [FromBody] UpdateAssetAcquisitionDto dto)
    {
        try
        {
            var result = await _service.UpdateAsync(id, dto);
            return Ok(result);
        }
        catch (System.Collections.Generic.KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(long id)
    {
        var success = await _service.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}
