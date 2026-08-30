using System.Collections.Generic;
using ERP.Domain.Common;

namespace ERP.Domain.Entities.Asset;

public class Location : BaseEntity<long>
{
    public long? ParentLocationId { get; set; }
    public Location? ParentLocation { get; set; }
    
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? LocationType { get; set; }
    public string? Address { get; set; }
    public bool IsActive { get; set; } = true;
    
    public ICollection<Location> SubLocations { get; set; } = new List<Location>();
}
