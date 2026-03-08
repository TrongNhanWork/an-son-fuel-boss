using backend_AnSonFuelBoss.Data;
using backend_AnSonFuelBoss.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace backend_AnSonFuelBoss.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    private static string Sha256(string input)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes);
    }

    private static bool VerifyPassword(string plainPassword, string storedHash)
    {
        if (string.IsNullOrWhiteSpace(storedHash)) return false;

        // BCrypt hashes thường bắt đầu bằng $2a$, $2b$, $2y$
        if (storedHash.StartsWith("$2"))
        {
            return BCrypt.Net.BCrypt.Verify(plainPassword, storedHash);
        }

        // Fallback cho dữ liệu cũ kiểu SHA256 (hex)
        return string.Equals(storedHash, Sha256(plainPassword), StringComparison.OrdinalIgnoreCase);
    }

    public class LoginRequest
    {
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
    }

    public class LoginResponse
    {
        public string Token { get; set; } = "";
        public string Username { get; set; } = "";
        public string Role { get; set; } = "";
        public string FullName { get; set; } = "";
        public int Id { get; set; }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Username) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest("Thiếu username/password.");

        var username = req.Username.Trim();

        var user = await _db.Users.AsNoTracking()
            .FirstOrDefaultAsync(u => u.Username == username && u.Active);

        if (user == null) return Unauthorized("Sai tài khoản hoặc mật khẩu.");

        if (!VerifyPassword(req.Password, user.PasswordHash))
            return Unauthorized("Sai tài khoản hoặc mật khẩu.");

        var token = CreateToken(user);

        return Ok(new LoginResponse
        {
            Token = token,
            Username = user.Username,
            Role = user.Role.ToString(),
            FullName = user.FullName ?? "",
            Id = user.Id
        });
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("uid") ?? "";
        var username = User.FindFirstValue(ClaimTypes.Name) ?? User.Identity?.Name ?? "";
        var fullName = User.FindFirstValue("fullName") ?? "";
        var role = User.FindFirstValue(ClaimTypes.Role) ?? "";
        return Ok(new { id, username, fullName, role });
    }

    private string CreateToken(User user)
    {
        var jwt = _config.GetSection("Jwt");
        var key = jwt["Key"]!;
        var issuer = jwt["Issuer"]!;
        var audience = jwt["Audience"]!;

        var expireMinutes = 10080;
        if (int.TryParse(jwt["ExpireMinutes"], out var m) && m > 0) expireMinutes = m;

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim("fullName", user.FullName ?? ""),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("uid", user.Id.ToString())
        };

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var creds = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expireMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}