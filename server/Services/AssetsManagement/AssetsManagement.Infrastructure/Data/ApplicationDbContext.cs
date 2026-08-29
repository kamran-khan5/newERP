using System.Reflection;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
  public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
  public DbSet<InventoryCategory> InventoryCategories => Set<InventoryCategory>();

  public DbSet<InventoryItem> InventoryItems => Set<InventoryItem>();

  public DbSet<InventoryType> InventoryTypes => Set<InventoryType>();

  public DbSet<InventoryStock> InventoryStocks => Set<InventoryStock>();

  public DbSet<Purchase> Purchases => Set<Purchase>();

  public DbSet<PurchaseLine> PurchaseLines => Set<PurchaseLine>();

  public DbSet<Warehouse> Warehouses => Set<Warehouse>();

  public DbSet<Asset> Assets => Set<Asset>();

  protected override void OnModelCreating(ModelBuilder builder)
  {
    builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    base.OnModelCreating(builder);
  }
}

