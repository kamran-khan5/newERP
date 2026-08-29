public sealed class WorkInProgress : Entity<WorkInProgressId>
{
  public const int RemarksMaxLength = 1000;

  public ProductionOrderId ProductionOrderId { get; private set; } = default!;

  public ProductionStage CurrentStage { get; private set; }

  public decimal ProgressPercentage { get; private set; }

  public DateTime RecordedAt { get; private set; }

  public PersonId RecordedBy { get; private set; } = default!;

  public string Remarks { get; private set; } = default!;


  public static WorkInProgress Create(
         WorkInProgressId id,
         ProductionOrderId productionOrderId,
         ProductionStage currentStage,
         decimal progressPercentage,
         DateTime recordedAt,
         PersonId recordedBy,
         string remarks)
  {
    if (progressPercentage < 0 || progressPercentage > 100)
      throw new DomainException("Progress percentage must be between 0 and 100.");

    return new WorkInProgress
    {
      Id = id,
      ProductionOrderId = productionOrderId,
      CurrentStage = currentStage,
      ProgressPercentage = progressPercentage,
      RecordedAt = recordedAt,
      RecordedBy = recordedBy,
      Remarks = remarks,
    };
  }
}