using System.Reflection;
using Microsoft.EntityFrameworkCore;
using ERP.Application.Common.Interfaces;
using ERP.Domain.Entities.Asset;
using ERP.Domain.Entities.Identity;

namespace ERP.Infrastructure.Data;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    // Identity
    public DbSet<User> Users => Set<User>();

    // Asset Lookups
    public DbSet<AssetClass> AssetClasses => Set<AssetClass>();
    public DbSet<AssetStatus> AssetStatuses => Set<AssetStatus>();
    public DbSet<Currency> Currencies => Set<Currency>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<LifecycleEventType> LifecycleEventTypes => Set<LifecycleEventType>();
    public DbSet<DepreciationMethod> DepreciationMethods => Set<DepreciationMethod>();

    // Asset Core
    public DbSet<AssetCategory> AssetCategories => Set<AssetCategory>();
    public DbSet<CategoryAttribute> CategoryAttributes => Set<CategoryAttribute>();
    public DbSet<Asset> Assets => Set<Asset>();
    public DbSet<AssetAcquisition> AssetAcquisitions => Set<AssetAcquisition>();
    public DbSet<AssetAttachment> AssetAttachments => Set<AssetAttachment>();

    // Lifecycle
    public DbSet<AssetAssignment> AssetAssignments => Set<AssetAssignment>();
    public DbSet<AssetLifecycleEvent> AssetLifecycleEvents => Set<AssetLifecycleEvent>();
    public DbSet<AssetDepreciationSchedule> AssetDepreciationSchedules => Set<AssetDepreciationSchedule>();
    public DbSet<AssetDepreciationEntry> AssetDepreciationEntries => Set<AssetDepreciationEntry>();
    public DbSet<AssetValuationHistory> AssetValuationHistories => Set<AssetValuationHistory>();
    public DbSet<AssetDisposal> AssetDisposals => Set<AssetDisposal>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
