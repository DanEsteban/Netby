using Microsoft.EntityFrameworkCore;
using TransactionsService.Models;
using TransactionsService.Persistence;

namespace TransactionsService.Repositories
{
     public class TransactionRepository : ITransactionRepository
     {
          private readonly AppDbContext db;
          public TransactionRepository(AppDbContext db) => this.db = db;

          public async Task<IEnumerable<Transaction>> GetAllAsync(CancellationToken ct = default) =>
               await db.Transactions.AsNoTracking()
                                        .OrderByDescending(t => t.Date)
                                        .ThenBy(t => t.Id)
                                        .ToListAsync(ct);

          public Task<Transaction?> GetByIdAsync(int id, CancellationToken ct = default) =>
               db.Transactions.FirstOrDefaultAsync(t => t.Id == id, ct);

          public async Task<Transaction> AddAsync(Transaction entity, CancellationToken ct = default)
          {
               db.Transactions.Add(entity);
               await db.SaveChangesAsync(ct);
               return entity;
          }

          public async Task UpdateAsync(Transaction entity, CancellationToken ct = default)
          {
               db.Transactions.Update(entity);
               await db.SaveChangesAsync(ct);
          }

          public async Task DeleteAsync(Transaction entity, CancellationToken ct = default)
          {
               db.Transactions.Remove(entity);
               await db.SaveChangesAsync(ct);
          }
     }
}
