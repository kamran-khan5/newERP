using Scalar.AspNetCore;
using ERP.API.Middleware;
using ERP.Application;
using ERP.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ERP.API.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Clean Architecture layer dependencies
builder.Services.AddInfrastructureServices(builder.Configuration);

// Auto-register Application Services
var appAssembly = typeof(ERP.Application.Common.Interfaces.IApplicationDbContext).Assembly;
var serviceTypes = appAssembly.GetTypes()
    .Where(t => t.IsClass && !t.IsAbstract && t.Name.EndsWith("Service"));

foreach (var type in serviceTypes)
{
    var interfaceType = type.GetInterfaces().FirstOrDefault(i => i.Name == $"I{type.Name}");
    if (interfaceType != null)
    {
        builder.Services.AddScoped(interfaceType, type);
    }
    else 
    {
        builder.Services.AddScoped(type);
    }
}

// 2. Configure Controllers & API Behaviors
builder.Services.AddControllers();

// 2.5 Configure JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwtKey = builder.Configuration["Jwt:Key"] !;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

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

// 4. Configure OpenAPI / Scalar + Transformer
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
});

var app = builder.Build();

// 5. Global Exception Handler Middleware
app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

// 6. HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
