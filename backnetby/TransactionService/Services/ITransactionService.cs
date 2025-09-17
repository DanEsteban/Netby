using TransactionsService.DTOs;

namespace TransactionsService.Services
{
     public interface ITransactionService
     {
          Task<IEnumerable<TransactionReadDto>> GetAllAsync(
               DateTime? from = null, DateTime? to = null,
               string? type = null, int? productId = null,
               CancellationToken ct = default);

          Task<TransactionReadDto?> GetByIdAsync(int id, CancellationToken ct = default);
          Task<TransactionReadDto> CreateAsync(TransactionCreateDto dto, CancellationToken ct = default);
          Task<TransactionReadDto?> UpdateAsync(int id, TransactionUpdateDto dto, CancellationToken ct = default);
          Task<bool> DeleteAsync(int id, CancellationToken ct = default);
     }
}
