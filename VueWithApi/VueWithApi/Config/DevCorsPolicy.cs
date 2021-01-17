using Microsoft.Extensions.DependencyInjection;

namespace VueWithApi.Config
{
    public static class DevCorsPolicy
    {
        public static void AddDevCorsPolicy(this IServiceCollection services, string policyName)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(policyName,
                    builder =>
                    {
                        builder.WithOrigins("http://localhost",
                                "https://localhost",
                                "https://localhost:3000"
                            ).AllowCredentials() //allow sending auth cookies cross origin (assist in dev proxy mode)
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
            });
        }
    }
}