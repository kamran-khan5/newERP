namespace ERP.Application.DTOs.Assets;

public class CurrencyDto
{
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Symbol { get; set; }
}
