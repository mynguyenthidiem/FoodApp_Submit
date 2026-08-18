using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Tests.TestHelpers;

/// <summary>
/// Helper dùng chung để giả lập user đăng nhập (ClaimsPrincipal) khi test Controller,
/// vì các controller lấy userId/role thông qua HttpContext.User.
/// </summary>
public static class ControllerTestHelper
{
    public static void SetUser(ControllerBase controller, int userId, params string[] roles)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId.ToString())
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var identity = new ClaimsIdentity(claims, "TestAuthType");
        var principal = new ClaimsPrincipal(identity);

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = principal
            }
        };
    }
}
