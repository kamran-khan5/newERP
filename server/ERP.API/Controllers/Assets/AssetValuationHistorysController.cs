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
public class AssetValuationHistorysController : ControllerBase
{
    private readonly IAssetValuationHistoryService _service;

    public AssetValuationHistorysController(IAssetValuationHistoryService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResponse<AssetValuationHistoryDto>>> GetPaged([FromQuery] PagedRequest request)
    {
        var result = await _service.GetPagedAsync(request);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AssetValuationHistoryDto>> GetById(long id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null)
            return NotFound();
            
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<AssetValuationHistoryDto>> Create([FromBody] CreateAssetValuationHistoryDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AssetValuationHistoryDto>> Update(long id, [FromBody] UpdateAssetValuationHistoryDto dto)
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
