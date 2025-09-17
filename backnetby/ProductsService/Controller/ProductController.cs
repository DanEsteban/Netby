using Microsoft.AspNetCore.Mvc;
using ProductsService.DTOs;
using ProductsService.Services;

namespace ProductsService.Controllers
{
     [ApiController]
     [Route("api/products")]
     public class ProductsController : ControllerBase
     {
          private readonly IProductService svc;
          public ProductsController(IProductService svc) => this.svc = svc;

          [HttpGet]
          public async Task<ActionResult<IEnumerable<ProductReadDto>>> GetAll(CancellationToken ct)
          {
               return Ok(await svc.GetAllAsync(ct));
          }


          [HttpGet("{id:int}")]
          public async Task<ActionResult<ProductReadDto>> GetById(int id, CancellationToken ct)
          {
               var result = await svc.GetByIdAsync(id, ct);
               return result is null ? NotFound() : Ok(result);
          }

          [HttpPost]
          public async Task<ActionResult<ProductReadDto>> Create([FromBody] ProductCreateDto dto, CancellationToken ct)
          {
               var created = await svc.CreateAsync(dto, ct);
               return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
          }

          [HttpPut("{id:int}")]
          public async Task<ActionResult<ProductReadDto>> Update(int id, [FromBody] ProductUpdateDto dto, CancellationToken ct)
          {
               var updated = await svc.UpdateAsync(id, dto, ct);
               return updated is null ? NotFound() : Ok(updated);
          }

          [HttpDelete("{id:int}")]
          public async Task<IActionResult> Delete(int id, CancellationToken ct)
          {
               var ok = await svc.DeleteAsync(id, ct);
               return ok ? NoContent() : NotFound();
          }
     }
}
