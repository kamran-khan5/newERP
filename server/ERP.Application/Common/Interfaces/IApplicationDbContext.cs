using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ERP.Domain.Entities.Asset;
using ERP.Domain.Entities.Identity;

namespace ERP.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    // Identity
    DbSet<User> Users { get; }

    // Asset Lookups
    DbSet<AssetClass> AssetClasses { get; }
    DbSet<AssetStatus> AssetStatuses { get; }
    DbSet<Currency> Currencies { get; }
    DbSet<Location> Locations { get; }
    DbSet<LifecycleEventType> LifecycleEventTypes { get; }
    DbSet<DepreciationMethod> DepreciationMethods { get; }

    // Asset Core
    DbSet<AssetCategory> AssetCategories { get; }
    DbSet<CategoryAttribute> CategoryAttributes { get; }
    DbSet<CategoryAttributeOption> CategoryAttributeOptions { get; }
    DbSet<Asset> Assets { get; }
    DbSet<AssetAcquisition> AssetAcquisitions { get; }
    DbSet<AssetAttachment> AssetAttachments { get; }

    // Lifecycle
    DbSet<AssetAssignment> AssetAssignments { get; }
    DbSet<AssetLifecycleEvent> AssetLifecycleEvents { get; }
    DbSet<AssetDepreciationSchedule> AssetDepreciationSchedules { get; }
    DbSet<AssetDepreciationEntry> AssetDepreciationEntries { get; }
    DbSet<AssetValuationHistory> AssetValuationHistories { get; }
    DbSet<AssetDisposal> AssetDisposals { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
