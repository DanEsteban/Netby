using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ProductsService.Models
{
     public class Product
     {
          public int Id { get; set; }

          [Required, StringLength(150)]
          public string Name { get; set; } = default!;

          [StringLength(250)]
          public string? Description { get; set; }

          [Required, StringLength(100)]
          public string Category { get; set; } = default!;

          [StringLength(500)]
          public string? Image { get; set; }

          [Range(0, double.MaxValue)]
          public decimal Price { get; set; }

          [Range(0, int.MaxValue)]
          public int Stock { get; set; }
     }
}
