using System.Text.Json.Serialization;

namespace ProductsService.DTOs
{
     public record ProductCreateDto(
          string Name,
          string? Description,
          string Category,
          string? Image,
          decimal Price,
          int Stock
     );

     public record ProductUpdateDto(
          string Name,
          string? Description,
          string Category,
          string? Image,
          decimal Price,
          int Stock
     );

     public record ProductReadDto(
          int Id,
          string Name,
          string? Description,
          string Category,
          string? Image,
          decimal Price,
          int Stock
     );
}
