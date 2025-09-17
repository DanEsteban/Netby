using TransactionsService.DTOs;
using TransactionsService.Models;
using TransactionsService.Repositories;

namespace TransactionsService.Services
{
     public class TransactionService : ITransactionService
     {
          private readonly ITransactionRepository _repo;
          public TransactionService(ITransactionRepository repo) => _repo = repo;

          public async Task<IEnumerable<TransactionReadDto>> GetAllAsync(
               DateTime? from = null, DateTime? to = null,
               string? type = null, int? productId = null,
               CancellationToken ct = default)
          {
               var list = await _repo.GetAllAsync(ct);

               // Filtros opcionales en memoria (puedes llevarlos a consultas si prefieres)
               if (from is not null) list = list.Where(t => t.Date >= from.Value);
               if (to is not null) list = list.Where(t => t.Date <= to.Value);
               if (!string.IsNullOrWhiteSpace(type) && Enum.TryParse<TransactionType>(type, true, out var parsed))
                    list = list.Where(t => t.Type == parsed);
               if (productId is not null) list = list.Where(t => t.ProductId == productId.Value);

               return list.Select(MapToRead);
          }

          public async Task<TransactionReadDto?> GetByIdAsync(int id, CancellationToken ct = default)
          {
               var entity = await _repo.GetByIdAsync(id, ct);
               return entity is null ? null : MapToRead(entity);
          }

          public async Task<TransactionReadDto> CreateAsync(TransactionCreateDto dto, CancellationToken ct = default)
          {
               ValidateNonNegative(dto.Quantity, dto.UnitPrice);

               var entity = new Transaction
               {
                    Date = dto.Date,              // ideal: DateTime.UtcNow si decides forzar UTC
                    Type = dto.Type,
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity,
                    UnitPrice = dto.UnitPrice,
                    TotalPrice = Math.Round(dto.Quantity * dto.UnitPrice, 2),
                    Detail = dto.Detail
               };

               await _repo.AddAsync(entity, ct);
               return MapToRead(entity);
          }

          public async Task<TransactionReadDto?> UpdateAsync(int id, TransactionUpdateDto dto, CancellationToken ct = default)
          {
               ValidateNonNegative(dto.Quantity, dto.UnitPrice);

               var entity = await _repo.GetByIdAsync(id, ct);
               if (entity is null) return null;

               entity.Date = dto.Date;
               entity.Type = dto.Type;
               entity.ProductId = dto.ProductId;
               entity.Quantity = dto.Quantity;
               entity.UnitPrice = dto.UnitPrice;
               entity.TotalPrice = Math.Round(dto.Quantity * dto.UnitPrice, 2);
               entity.Detail = dto.Detail;

               await _repo.UpdateAsync(entity, ct);
               return MapToRead(entity);
          }

          public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
          {
               var entity = await _repo.GetByIdAsync(id, ct);
               if (entity is null) return false;
               await _repo.DeleteAsync(entity, ct);
               return true;
          }

          private static void ValidateNonNegative(int qty, decimal unit)
          {
               if (qty < 0) throw new InvalidOperationException("Quantity no puede ser negativa.");
               if (unit < 0) throw new InvalidOperationException("UnitPrice no puede ser negativo.");
          }

          private static TransactionReadDto MapToRead(Transaction t) =>
               new(t.Id, t.Date, t.Type, t.ProductId, t.Quantity, t.UnitPrice, t.TotalPrice, t.Detail);
     }
}
