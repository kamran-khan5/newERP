public class Plant : Entity<PlantId>
{

  private readonly List<PlantItem> _plantItems = new();
  public IReadOnlyList<PlantItem> PlantItems => _plantItems.AsReadOnly();
  public PhysicalId PhysicalId { get; } = default!;

  public void AddItem(PlantItem plantItem)
  {
    _plantItems.Add(plantItem);
  }

  public void RemoveItem(PlantItemId plantItemId)
  {
    var plantItem = _plantItems.FirstOrDefault(p => p.Id == plantItemId);
    _plantItems.Remove(plantItem!);
  }
}