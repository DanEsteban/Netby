using TransactionsService.Models;

namespace TransactionsService.Repositories
{
     public interface ITransactionRepository
     {
          Task<IEnumerable<Transaction>> GetAllAsync(CancellationToken ct = default);
          Task<Transaction?> GetByIdAsync(int id, CancellationToken ct = default);
          Task<Transaction> AddAsync(Transaction entity, CancellationToken ct = default);
          Task UpdateAsync(Transaction entity, CancellationToken ct = default);
          Task DeleteAsync(Transaction entity, CancellationToken ct = default);
     }
}
