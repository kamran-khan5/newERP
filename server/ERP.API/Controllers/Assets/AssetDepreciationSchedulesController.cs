using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;
using ERP.Application.Services.Assets;

namespace ERP.API.Controllers.Assets;

[ApiController]
[Route("api/assets/[controller]")]
[Authorize]
public class AssetDepreciationSchedulesController : ControllerBase
{
    private readonly IAssetDepreciationScheduleService _service;

    public AssetDepreciationSchedulesController(IAssetDepreciationScheduleService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResponse<AssetDepreciationScheduleDto>>> GetPaged([FromQuery] PagedRequest request)
    {
        var result = await _service.GetPagedAsync(request);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AssetDepreciationScheduleDto>> GetById(long id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null)
            return NotFound();
            
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<AssetDepreciationScheduleDto>> Create([FromBody] CreateAssetDepreciationScheduleDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AssetDepreciationScheduleDto>> Update(long id, [FromBody] UpdateAssetDepreciationScheduleDto dto)
    {
        if (id != dto.Id)
            return BadRequest("ID mismatch");

        try
        {
            var result = await _service.UpdateAsync(id, dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(long id)
    {
        var success = await _service.DeleteAsync(id);
        if (!success)
            return NotFound();
            
        return NoContent();
    }
}
