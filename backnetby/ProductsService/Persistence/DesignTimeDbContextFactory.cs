using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

namespace ProductsService.Persistence
{
     public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
     {
          public AppDbContext CreateDbContext(string[] args)
          {
               var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";

               var config = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false)
                    .AddJsonFile($"appsettings.{env}.json", optional: true)
                    .AddEnvironmentVariables()
                    .Build();

               var cs = config.GetConnectionString("Default")
                    ?? throw new InvalidOperationException("Missing ConnectionStrings:Default");

               var serverVersion = ServerVersion.AutoDetect(cs);

               var options = new DbContextOptionsBuilder<AppDbContext>()
                    .UseMySql(cs, serverVersion, o => o.SchemaBehavior(MySqlSchemaBehavior.Ignore))
                    .Options;

               return new AppDbContext(options);
          }
     }
}
