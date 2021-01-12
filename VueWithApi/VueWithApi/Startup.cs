using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using SimpleIAM.PasswordlessLogin;
//using VueCliMiddleware;

namespace VueWithApi
{
    public class Startup
    {
        private readonly IWebHostEnvironment _env;
        private string _CORSPolicy = "DevPolicy";

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

            services.AddCors(options =>
            {
                options.AddPolicy(_CORSPolicy,
                    builder =>
                    {
                        builder.WithOrigins("http://localhost",
                            "https://localhost",
                            "https://localhost:3000",
                            "http://localhost:3000"
                            ).AllowAnyHeader()
                            .AllowAnyMethod();
                    });
            });

            var connection =
                Configuration.GetConnectionString(PasswordlessLoginConstants.ConfigurationSections
                    .ConnectionStringName);
            builder.AddSqlServer(options => { options.UseSqlServer(connection); });

            services.AddMvc(options => options.EnableEndpointRouting = false)
                .SetCompatibilityVersion(CompatibilityVersion.Latest);

            if (_env.IsDevelopment())
            {
                services.AddSwaggerGen(c => { c.SwaggerDoc("v1", new OpenApiInfo {Title = "API", Version = "v1"}); });
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            const bool useVue = false;

            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseCors(_CORSPolicy);

            app.UsePasswordlessLoginAPI(env.WebRootFileProvider);
            app.UsePasswordlessLogin(env
                .WebRootFileProvider); //order of this seems important, after route, before UseEndpoints?.  Includes UseRouting()
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
                    if (useVue)
                    {
                        // endpoints.MapToVueCliProxy(
                        //     "{*path}",
                        //     new SpaOptions {SourcePath = "ClientApp"},
                        //     npmScript: "serve",
                        //     regex: "Compiled successfully");
                    }

                    app.UseSwagger();
                    app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1"); });
                }
                else
                {
                    app.UseHsts();
                }
            });


            //app.UseHttpsRedirection();

            app.UseSpa(spa => { spa.Options.SourcePath = "ClientApp"; });
        }
    }
}