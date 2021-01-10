using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SimpleIAM.PasswordlessLogin;
using Swashbuckle.AspNetCore.Swagger;
using VueCliMiddleware;

namespace VueWithApi
{
    public class Startup
    {
        private readonly IWebHostEnvironment _env;

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            _env = env;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // If you need to customize the functionality of the Passwordless module
            // you can register custom services for sending mail, hashing password, etc. here
            var builder = services.AddPasswordlessLogin();
            builder.AddPasswordlessLoginAPI();
            builder.AddSmtpEmail(options =>
            {
                options.Port = 25;
                options.Server = "localhost";
                options.UseSsl = false;
                options.UseAuthentication = false;
            });

            builder.AddAuth();

            var connection = Configuration.GetConnectionString(PasswordlessLoginConstants.ConfigurationSections.ConnectionStringName);
            builder.AddSqlServer(options =>
            {
                options.UseSqlServer(connection);
            });

            services.AddMvc(options => options.EnableEndpointRouting = false).SetCompatibilityVersion(CompatibilityVersion.Latest);

            if (_env.IsDevelopment())
            {
                //TODO: Fix for net core 3.1
                // services.AddSwaggerGen(c =>
                // {
                //     c.SwaggerDoc("v1", new Info { Title = "API", Version = "v1" });
                // });
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            _ = CommandLine.Arguments.TryGetOptions(System.Environment.GetCommandLineArgs(), false, out string mode, out ushort port, out bool https);

            // if (env.IsDevelopment())
            // {
            //     app.UseDeveloperExceptionPage();
            //
            //     // Webpack initialization with hot-reload.
            //     app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
            //     {
            //         HotModuleReplacement = true,
            //         EnvParam = "development"
            //     });
            // }
            // else
            // {
            //     app.UseHsts();
            // }

            //app.UseStaticFiles(); //included in usePasswordlessLogin?
            
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            //app.UseRouting(); //included in usePasswordlessLogin?
            app.UsePasswordlessLoginAPI(env.WebRootFileProvider);
            app.UsePasswordlessLogin(env.WebRootFileProvider); //order of this seems important, after route, before UseEndpoints?.
            app.UseAuthorization(); //must occur before UseEndpoints, after UseRouting  https://docs.microsoft.com/en-us/aspnet/core/migration/22-to-30?view=aspnetcore-5.0&tabs=visual-studio

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");

                if (env.IsDevelopment())
                {
                    app.UseDeveloperExceptionPage();

                    // This forwards everything to the "vue-cli-service":
                    endpoints.MapToVueCliProxy(
                        "{*path}",
                        new SpaOptions { SourcePath = "ClientApp" },
                        npmScript: "serve",
                        regex: "Compiled successfully");
                }
                else
                {
                    app.UseHsts();
                }
            });


            //app.UseHttpsRedirection();

            // if (env.IsDevelopment())
            // {
            //     // visit /swagger/ to explore and interact with the API
            //     app.UseSwagger();
            //     app.UseSwaggerUI(c =>
            //     {
            //         c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
            //     });
            // }

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";
            });

            

            //TODO: Still required?
            // app.UseMvc(routes =>
            // {
            //     routes.MapSpaFallbackRoute(
            //         name: "spa-fallback",
            //         defaults: new { controller = "Home", action = "Index" });
            // });
        }
    }
}
