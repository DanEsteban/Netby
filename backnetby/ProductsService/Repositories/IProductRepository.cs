using ProductsService.Models;

namespace ProductsService.Repositories
{
     public interface IProductRepository
     {
          Task<IEnumerable<Product>> GetAllAsync(CancellationToken ct = default);
          Task<Product?> GetByIdAsync(int id, CancellationToken ct = default);
          Task<Product> AddAsync(Product entity, CancellationToken ct = default);
          Task UpdateAsync(Product entity, CancellationToken ct = default);
          Task DeleteAsync(Product entity, CancellationToken ct = default);
     }
}