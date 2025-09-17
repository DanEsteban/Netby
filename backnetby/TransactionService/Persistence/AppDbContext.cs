using Microsoft.EntityFrameworkCore;
using TransactionsService.Models;

namespace TransactionsService.Persistence
{
     public class AppDbContext : DbContext
     {
          public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

          public DbSet<Transaction> Transactions => Set<Transaction>();

          protected override void OnModelCreating(ModelBuilder modelBuilder)
          {
               var t = modelBuilder.Entity<Transaction>();
               t.ToTable("transactions");
               t.HasKey(x => x.Id);

               t.Property(x => x.Date).IsRequired();

               t.Property(x => x.Type)
               .HasConversion<string>()
               .HasMaxLength(16)
               .IsRequired();

               t.Property(x => x.ProductId).IsRequired();
               t.Property(x => x.Quantity).IsRequired();
               t.Property(x => x.UnitPrice).HasPrecision(18, 2).IsRequired();
               t.Property(x => x.TotalPrice).HasPrecision(18, 2).IsRequired();
               t.Property(x => x.Detail).HasMaxLength(1000);

               t.HasIndex(x => x.Date);
               t.HasIndex(x => x.ProductId);
               t.HasIndex(x => x.Type);
          }
     }
}
