using Microsoft.AspNetCore.Mvc;
using NewERP.Application.Common.Models;

namespace NewERP.API.Controllers;

public class HealthController : ApiControllerBase
{
    [HttpGet]
    public ActionResult<ApiResponse<object>> GetStatus()
    {
        return Ok(ApiResponse<object>.Success(new
        {
            status = "Healthy",
            service = "NewERP API",
            timestamp = DateTime.UtcNow,
            version = "1.0.0"
        }, "Service is healthy"));
    }
}
