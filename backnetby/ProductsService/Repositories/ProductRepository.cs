using Microsoft.EntityFrameworkCore;
using ProductsService.Models;
using ProductsService.Persistence;

namespace ProductsService.Repositories
{
     public class ProductRepository : IProductRepository
     {
          private readonly AppDbContext db;
          public ProductRepository(AppDbContext db) => this.db = db;

          public async Task<IEnumerable<Product>> GetAllAsync(CancellationToken ct = default) =>
               await db.Products.AsNoTracking().OrderBy(p => p.Name).ToListAsync(ct);

          public Task<Product?> GetByIdAsync(int id, CancellationToken ct = default) =>
               db.Products.FirstOrDefaultAsync(p => p.Id == id, ct);

          public async Task<Product> AddAsync(Product entity, CancellationToken ct = default)
          {
               db.Products.Add(entity);
               await db.SaveChangesAsync(ct);
               return entity;
          }

          public async Task UpdateAsync(Product entity, CancellationToken ct = default)
          {
               db.Products.Update(entity);
               await db.SaveChangesAsync(ct);
          }

          public async Task DeleteAsync(Product entity, CancellationToken ct = default)
          {
               db.Products.Remove(entity);
               await db.SaveChangesAsync(ct);
          }
     }
}
