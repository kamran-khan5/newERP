using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ERP.Application.Common.Models;
using ERP.Application.DTOs.Assets;
using ERP.Application.Services.Assets;

namespace ERP.API.Controllers.Assets;


[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class CategoryAttributeOptionsController : ControllerBase
{
    private readonly ICategoryAttributeOptionService _service;

    public CategoryAttributeOptionsController(ICategoryAttributeOptionService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResponse<CategoryAttributeOptionDto>>> GetAll([FromQuery] PagedRequest request, [FromQuery] long? attributeId = null)
    {
        var result = await _service.GetAllAsync(request, attributeId);
        return Ok(result);
    }

    [HttpGet("by-attribute/{attributeId}")]
    public async Task<ActionResult<List<CategoryAttributeOptionDto>>> GetByAttributeId(long attributeId)
    {
        var result = await _service.GetByAttributeIdAsync(attributeId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryAttributeOptionDto>> GetById(long id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<CategoryAttributeOptionDto>> Create([FromBody] CreateCategoryAttributeOptionDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<CategoryAttributeOptionDto>> Update(long id, [FromBody] UpdateCategoryAttributeOptionDto dto)
    {
        try
        {
            var result = await _service.UpdateAsync(id, dto);
            return Ok(result);
        }
        catch (KeyNotFoundException)
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
