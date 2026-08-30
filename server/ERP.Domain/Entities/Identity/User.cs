using System;
using ERP.Domain.Common;

namespace ERP.Domain.Entities.Identity;

public class User : BaseEntity<Guid>
{
    public string Username { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public bool IsActive { get; set; } = true;
}
