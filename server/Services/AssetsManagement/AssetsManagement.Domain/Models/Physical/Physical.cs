public class Physical : Aggregate<PhysicalId>
{
  public AssetId AssetId { get; private set; } = default!;

  public static Physical Create(PhysicalId physicalId, AssetId assetId)
  {
    return new Physical
    {
      Id = physicalId,
      AssetId = assetId
    };
  }
}