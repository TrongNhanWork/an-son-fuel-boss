namespace backend_AnSonFuelBoss.Models;

public enum UserRole
{
    Manager = 1,
    Cashier = 2,
    Warehouse = 3
}

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = "";
    public string FullName { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public UserRole Role { get; set; } = UserRole.Cashier;
    public bool Active { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}