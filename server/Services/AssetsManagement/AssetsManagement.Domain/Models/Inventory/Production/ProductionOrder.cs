public sealed class ProductionOrder : Aggregate<ProductionOrderId>
{
  public Code Code { get; private set; } = default!;
  public Name ProductionOrderName { get; private set; } = default!;
  public string Description { get; private set; } = default!;
  public DateTime PlannedStartDate { get; private set; } = default!;
  public DateTime PlannedEndDate { get; private set; } = default!;
  public DateTime? ActualStartDate { get; private set; } = default!;
  public DateTime? ActualEndDate { get; private set; } = default!;
  public WarehouseId WarehouseId { get; private set; } = default!;
  public PersonId SuperVisorId { get; private set; } = default!;
  public string Notes { get; private set; } = default!;
  public bool IsApproved { get; private set; } = default!;
  public DateTime? ApprovedAt { get; private set; } = default!;

  public static ProductionOrder Create(
        ProductionOrderId id,
        Code code,
        Name productionOrderName,
        string description,
        DateTime plannedStartDate,
        DateTime plannedEndDate,
        WarehouseId warehouseId,
        PersonId supervisorId,
        string notes)
  {
    return new ProductionOrder
    {
      Id = id,
      Code = code,
      ProductionOrderName = productionOrderName,
      Description = description,
      PlannedStartDate = plannedStartDate,
      PlannedEndDate = plannedEndDate,
      WarehouseId = warehouseId,
      SuperVisorId = supervisorId,
      Notes = notes,

      IsApproved = false,
      ActualStartDate = null,
      ActualEndDate = null,
      ApprovedAt = null,
    };
  }

  public void ApproveProductionOrder()
  {
    IsApproved = true;
    ApprovedAt = DateTime.Now;
  }

}