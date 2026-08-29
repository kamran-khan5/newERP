using NewERP.API.Middleware;
using NewERP.Application;
using NewERP.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Clean Architecture layer dependencies
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

// 2. Configure Controllers & API Behaviors
builder.Services.AddControllers();

// 3. Configure CORS (allowing local frontend client during development)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 4. Configure OpenAPI / Swagger
builder.Services.AddOpenApi();

var app = builder.Build();

// 5. Global Exception Handler Middleware
app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

// 6. HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
