using TransactionsService.Models;

namespace TransactionsService.DTOs
{
     public record TransactionCreateDto(
          DateTime Date,
          TransactionType Type,
          int ProductId,
          int Quantity,
          decimal UnitPrice,
          string? Detail
     );

     public record TransactionUpdateDto(
          DateTime Date,
          TransactionType Type,
          int ProductId,
          int Quantity,
          decimal UnitPrice,
          string? Detail
     );

     public record TransactionReadDto(
          int Id,
          DateTime Date,
          TransactionType Type,
          int ProductId,
          int Quantity,
          decimal UnitPrice,
          decimal TotalPrice,
          string? Detail
     );
}
