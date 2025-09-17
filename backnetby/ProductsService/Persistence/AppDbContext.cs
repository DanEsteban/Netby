using Microsoft.EntityFrameworkCore;
using ProductsService.Models;

namespace ProductsService.Persistence
{
     public class AppDbContext : DbContext
     {
          public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

          public DbSet<Product> Products => Set<Product>();

          protected override void OnModelCreating(ModelBuilder modelBuilder)
          {
               var p = modelBuilder.Entity<Product>();
               p.HasKey(x => x.Id);

               p.Property(x => x.Name).HasMaxLength(150).IsRequired();
               p.Property(x => x.Description).HasMaxLength(250);
               p.Property(x => x.Category).HasMaxLength(100).IsRequired();
               p.Property(x => x.Image).HasMaxLength(500);
               p.Property(x => x.Price).HasPrecision(10, 2);
               p.Property(x => x.Stock);
          }
     }
}
