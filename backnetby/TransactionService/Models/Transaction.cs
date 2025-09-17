using System.ComponentModel.DataAnnotations;

namespace TransactionsService.Models
{
     public class Transaction
     {
          public int Id { get; set; }                                   // id
          public DateTime Date { get; set; }                            // date (UTC recomendado)
          public TransactionType Type { get; set; }                     // type
          public int ProductId { get; set; }                            // productId

          [Range(0, int.MaxValue)]
          public int Quantity { get; set; }                             // quantity

          [Range(0, double.MaxValue)]
          public decimal UnitPrice { get; set; }                        // unitPrice

          [Range(0, double.MaxValue)]
          public decimal TotalPrice { get; set; }                       // totalPrice (calculado)

          [StringLength(1000)]
          public string? Detail { get; set; }                           // detail
     }
}
