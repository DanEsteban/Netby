using Microsoft.AspNetCore.Mvc;
using TransactionsService.DTOs;
using TransactionsService.Services;

namespace TransactionsService.Controllers
{
     [ApiController]
     [Route("api/[controller]")]
     public class TransactionsController : ControllerBase
     {
          private readonly ITransactionService _svc;
          public TransactionsController(ITransactionService svc) => _svc = svc;

          [HttpGet]
          public async Task<ActionResult<IEnumerable<TransactionReadDto>>> GetAll(
               [FromQuery] DateTime? from,
               [FromQuery] DateTime? to,
               [FromQuery] string? type,
               [FromQuery] int? productId,
               CancellationToken ct)
               => Ok(await _svc.GetAllAsync(from, to, type, productId, ct));

          [HttpGet("{id:int}")]
          public async Task<ActionResult<TransactionReadDto>> GetById(int id, CancellationToken ct)
          {
               var result = await _svc.GetByIdAsync(id, ct);
               return result is null ? NotFound() : Ok(result);
          }

          [HttpPost]
          public async Task<ActionResult<TransactionReadDto>> Create([FromBody] TransactionCreateDto dto, CancellationToken ct)
          {
               var created = await _svc.CreateAsync(dto, ct);
               return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
          }

          [HttpPut("{id:int}")]
          public async Task<ActionResult<TransactionReadDto>> Update(int id, [FromBody] TransactionUpdateDto dto, CancellationToken ct)
          {
               var updated = await _svc.UpdateAsync(id, dto, ct);
               return updated is null ? NotFound() : Ok(updated);
          }

          [HttpDelete("{id:int}")]
          public async Task<IActionResult> Delete(int id, CancellationToken ct)
          {
               var ok = await _svc.DeleteAsync(id, ct);
               return ok ? NoContent() : NotFound();
          }
     }
}
