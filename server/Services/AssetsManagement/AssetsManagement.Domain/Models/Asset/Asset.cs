public class Asset : Aggregate<AssetId>
{
  public Code Code { get; private set; } = default!;
  public Name Name { get; private set; } = default!;
  public string? Description { get; private set; }

  public static Asset Create(AssetId assetId, Name name, Code code, string description)
  {
    return new Asset
    {
      Id = assetId,
      Name = name,
      Code = code,
      Description = description,
    };
  }
  
  public void UpdateAsset(Name name, Code code, string description)
  {
      Name = name;
      Code = code;
      Description = description;
  }
}