using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

namespace TransactionsService.Persistence
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

               var sv = ServerVersion.AutoDetect(cs);

               var opts = new DbContextOptionsBuilder<AppDbContext>()
                    .UseMySql(cs, sv, o => o.SchemaBehavior(MySqlSchemaBehavior.Ignore))
                    .Options;

               return new AppDbContext(opts);
          }
     }
}
