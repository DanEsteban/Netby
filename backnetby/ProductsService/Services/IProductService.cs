using ProductsService.DTOs;

namespace ProductsService.Services
{
     public interface IProductService
     {
          Task<IEnumerable<ProductReadDto>> GetAllAsync(CancellationToken ct = default);
          Task<ProductReadDto?> GetByIdAsync(int id, CancellationToken ct = default);
          Task<ProductReadDto> CreateAsync(ProductCreateDto dto, CancellationToken ct = default);
          Task<ProductReadDto?> UpdateAsync(int id, ProductUpdateDto dto, CancellationToken ct = default);
          Task<bool> DeleteAsync(int id, CancellationToken ct = default);
     }
}
