# ERP Asset Management API

This is the backend API for the ERP Asset Management module, built with **.NET 10**, **Entity Framework Core**, and **PostgreSQL**.

## 🏗 Architecture Overview

The solution follows a pragmatic, robust N-Tier/Clean Architecture hybrid designed to minimize bloat while keeping concerns strictly separated.

### 1. `ERP.Domain`
* **What lives here:** The absolute core of the application. Database Entities (`Asset`, `AssetCategory`, etc.), Enums, and base interfaces like `IAuditableEntity`.
* **Rules:** This project has **zero external dependencies**. It does not know about EF Core, HTTP, or the database.

### 2. `ERP.Application`
* **What lives here:** The business logic. 
  * `DTOs/`: Data Transfer Objects (e.g., `AssetDto`). All API inputs and outputs must use DTOs, strictly avoiding raw Entities to prevent over-posting and JSON cycles.
  * `Services/`: Business logic classes that inject `ApplicationDbContext` to query data, map to DTOs, and handle pagination/filtering.
  * `Common/`: Shared utilities like `PagedRequest` and `PagedResponse<T>`.
* **Rules:** No HTTP/Web concerns. Services should throw standard exceptions (like `KeyNotFoundException`) which the API layer catches.

### 3. `ERP.Infrastructure`
* **What lives here:** External concerns and data access.
  * `Data/`: Contains the concrete `ApplicationDbContext`.
  * `Migrations/`: Entity Framework Core database migrations.
* **Rules:** This layer is responsible for communicating with Postgres.

### 4. `ERP.API`
* **What lives here:** The presentation layer. 
  * `Controllers/`: Standard ASP.NET Core controllers that handle HTTP requests and delegate to Application Services.
  * `Middleware/`: Global error handling (e.g., `GlobalExceptionHandlerMiddleware`).
* **Rules:** Controllers contain **no business logic**. They only return `ActionResult` (e.g., `Ok()`, `NotFound()`).

---

## 🚀 Setting Up the Development Environment

### Prerequisites
1. **.NET 10 SDK** installed.
2. **PostgreSQL** running locally (or accessible via network).
3. **EF Core CLI Tools** installed. If not installed, run:
   ```bash
   dotnet tool install --global dotnet-ef
   ```

### 1. Configure the Database
Open `ERP.API/appsettings.Development.json` (or `appsettings.json`) and update the `DefaultConnection` string with your local PostgreSQL credentials:
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=newerp;Username=postgres;Password=yourpassword"
}
```

### 2. Apply Database Migrations
Because the `DbContext` lives in the Infrastructure layer, you must explicitly tell EF Core which projects to use when running migrations.

Run these commands from the root `server/` directory:

**To create a new migration:**
```bash
dotnet ef migrations add <MigrationName> --project ./ERP.Infrastructure/ERP.Infrastructure.csproj --startup-project ./ERP.API/ERP.API.csproj
```

**To apply migrations to your database:**
```bash
dotnet ef database update --project ./ERP.Infrastructure/ERP.Infrastructure.csproj --startup-project ./ERP.API/ERP.API.csproj
```

### 3. Run the Application
You can run the application using the .NET CLI:
```bash
dotnet run --project ./ERP.API/ERP.API.csproj
```
*(The API will start and you can explore the endpoints via the generated Swagger/OpenAPI UI).*

---

## 💡 Best Practices Implemented
* **Zero CQRS Bloat:** We removed complex CQRS/MediatR pipelines in favor of fast, simple Application Services.
* **No `ApiResponse<T>` Wrappers:** We rely on standard HTTP Status Codes (200, 400, 404) keeping the JSON payloads lean.
* **Global Exception Handling:** All unhandled errors are automatically caught and transformed into safe, consistent JSON responses without leaking stack traces.
* **Auto-Registered DI:** Services are automatically registered via reflection in `Program.cs`, meaning you don't have to manually edit DI files when adding new modules!
