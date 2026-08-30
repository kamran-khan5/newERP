using Microsoft.AspNetCore.Mvc;
using ERP.Application.Common.Models;

namespace ERP.API.Controllers;

public class HealthController : ApiControllerBase
{
    [HttpGet]
    public ActionResult<ApiResponse<object>> GetStatus()
    {
        return Ok(ApiResponse<object>.Success(new
        {
            status = "Healthy",
            service = "ERP API",
            timestamp = DateTime.UtcNow,
            version = "1.0.0"
        }, "Service is healthy"));
    }
}
