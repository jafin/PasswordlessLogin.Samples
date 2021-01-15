using Microsoft.AspNetCore.Mvc;
using SimpleIAM.PasswordlessLogin.Orchestrators;
using System.Net;
using System.Threading.Tasks;

namespace VueWithApi.Controllers
{
    public class AuthController : Controller
    {
        private readonly AuthenticateOrchestrator _authenticateOrchestrator;

        public AuthController(AuthenticateOrchestrator authenticateOrchestrator)
        {
            _authenticateOrchestrator = authenticateOrchestrator;
        }

        [HttpGet("signin/{longCode}")]
        public async Task<IActionResult> SignInLink(string longCode)
        {
            var response = await _authenticateOrchestrator.AuthenticateLongCodeAsync(longCode).ConfigureAwait(false);
            return response.StatusCode switch
            {
                HttpStatusCode.Redirect => Redirect(response.RedirectUrl),
                HttpStatusCode.NotFound => NotFound(),
                HttpStatusCode.Unauthorized =>
                    Redirect("/signin") // todo: pass response.Message along to be displayed to the user
                ,
                _ => Redirect("/signin")
            };
        }
    }
}
