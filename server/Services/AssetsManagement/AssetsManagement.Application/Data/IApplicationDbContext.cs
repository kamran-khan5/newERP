using Microsoft.EntityFrameworkCore;

public interface IApplicationDbContext
{
  DbSet<InventoryCategory> InventoryCategories { get; }
  DbSet<InventoryItem> InventoryItems { get; }
  DbSet<InventoryType> InventoryTypes { get; }
  DbSet<InventoryStock> InventoryStocks { get; }
  DbSet<Purchase> Purchases { get; }
  DbSet<PurchaseLine> PurchaseLines { get; }
  DbSet<Warehouse> Warehouses { get; }
  DbSet<Asset> Assets { get; }

  Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}