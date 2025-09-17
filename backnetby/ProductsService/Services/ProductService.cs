using ProductsService.DTOs;
using ProductsService.Models;
using ProductsService.Repositories;

namespace ProductsService.Services
{
     public class ProductService : IProductService
     {
          private readonly IProductRepository repo;
          public ProductService(IProductRepository repo) => this.repo = repo;

          public async Task<IEnumerable<ProductReadDto>> GetAllAsync(CancellationToken ct = default)
          {
               var list = await repo.GetAllAsync(ct);
               return list.Select(MapToRead);
          }

          public async Task<ProductReadDto?> GetByIdAsync(int id, CancellationToken ct = default)
          {
               var entity = await repo.GetByIdAsync(id, ct);
               return entity is null ? null : MapToRead(entity);
          }

          public async Task<ProductReadDto> CreateAsync(ProductCreateDto dto, CancellationToken ct = default)
          {
               var entity = new Product
               {
                    Name = dto.Name,
                    Description = dto.Description,
                    Category = dto.Category,
                    Image = dto.Image,
                    Price = dto.Price,
                    Stock = dto.Stock
               };
               await repo.AddAsync(entity, ct);
               return MapToRead(entity);
          }

          public async Task<ProductReadDto?> UpdateAsync(int id, ProductUpdateDto dto, CancellationToken ct = default)
          {
               var entity = await repo.GetByIdAsync(id, ct);
               if (entity is null) return null;

               entity.Name = dto.Name;
               entity.Description = dto.Description;
               entity.Category = dto.Category;
               entity.Image = dto.Image;
               entity.Price = dto.Price;
               entity.Stock = dto.Stock;

               await repo.UpdateAsync(entity, ct);
               return MapToRead(entity);
          }

          public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
          {
               var entity = await repo.GetByIdAsync(id, ct);
               if (entity is null) return false;
               await repo.DeleteAsync(entity, ct);
               return true;
          }

          private static ProductReadDto MapToRead(Product p) =>
               new(p.Id, p.Name, p.Description, p.Category, p.Image, p.Price, p.Stock);
     }
}
