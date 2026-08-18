using backend.Models;
using backend.Repositories.Interfaces;
using backend.Services.Interfaces;

namespace backend.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _repo;

        public PaymentService(IPaymentRepository repo)
        {
            _repo = repo;
        }

        public async Task<Payment> CreatePayment(int orderId, int userId, PaymentMethod method)
        {
            var order = await _repo.GetOrderForPaymentAsync(orderId);

            if (order == null)
            {
                throw new KeyNotFoundException(
                    "Order not found."
                );
            }
            if (order.UserId != userId)
            {
                throw new UnauthorizedAccessException(
                    "You are not authorized to pay for this order."
                );
            }
            if (order.Status == OrderStatus.Cancelled)
            {
                throw new InvalidOperationException(
                    "Cancelled orders cannot be paid."
                );
            }
            if (order.Payment != null)
            {
                throw new InvalidOperationException(
                    "This order already has a payment."
                );
            }
            if (order.TotalAmount <= 0)
            {
                throw new InvalidOperationException(
                    "Order amount must be greater than zero."
                );
            }
            var payment = new Payment
            {
                OrderId = order.Id,
                Amount = order.TotalAmount,
                Method = method,
                Status = method == PaymentMethod.COD
                    ? PaymentStatus.Pending
                    : PaymentStatus.Completed,
                TransactionId = method == PaymentMethod.COD
                    ? null
                    : $"DEMO-{Guid.NewGuid():N}",

                CreatedAt = DateTime.UtcNow
            };
            order.PaymentMethod = method;
            if (order.Status == OrderStatus.Pending)
            {
                order.Status = OrderStatus.Confirmed;
            }
            await _repo.AddAsync(payment);

            await _repo.SaveChangesAsync();
            return payment;
        }

        public async Task<Payment?> GetByOrderId(int orderId)
        {
            return await _repo.GetByOrderIdAsync(orderId);
        }

        public async Task CompletePayment(int orderId, int ownerId, string? transactionId)
        {
            var payment = await _repo.GetPaymentWithOrderAsync(orderId);

            if (payment == null)
            {
                throw new KeyNotFoundException("Payment not found.");
            }

            if (payment.Order == null)
            {
                throw new InvalidOperationException("Order associated with this payment was not found.");
            }

            if (payment.Order.Restaurant == null)
            {
                throw new InvalidOperationException("Restaurant information for this order is missing.");
            }

            if (payment.Order.Status == OrderStatus.Cancelled)
            {
                throw new InvalidOperationException("Cancelled orders cannot be paid.");
            }

            if (payment.Order.Restaurant.OwnerId != ownerId)
            {
                throw new UnauthorizedAccessException("You are not authorized to complete payment for this restaurant's order.");
            }

            if (payment.Method != PaymentMethod.COD)
            {
                throw new InvalidOperationException("Only COD payments can be completed manually.");
            }

            if (payment.Status == PaymentStatus.Completed)
            {
                throw new InvalidOperationException("Payment has already been completed.");
            }

            payment.Status = PaymentStatus.Completed;
            payment.TransactionId =
                string.IsNullOrWhiteSpace(transactionId)
                    ? $"COD-{Guid.NewGuid():N}"
                    : transactionId;
            await _repo.SaveChangesAsync();
        }

        public async Task FailPayment(int orderId)
        {
            var payment = await GetByOrderId(orderId);
            if (payment == null)
            {
                throw new KeyNotFoundException("Payment not found.");
            }

            if (payment.Status == PaymentStatus.Completed)
            {
                throw new InvalidOperationException("Completed payment cannot be marked as failed.");
            }

            payment.Status = PaymentStatus.Failed;
            await _repo.SaveChangesAsync();
        }
    }
}