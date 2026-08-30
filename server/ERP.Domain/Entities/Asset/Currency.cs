using System.ComponentModel.DataAnnotations;

namespace ERP.Domain.Entities.Asset;

public class Currency
{
    [Key]
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Symbol { get; set; }
}
