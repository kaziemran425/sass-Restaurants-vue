// src/composables/usePrinter.js
import { useQuasar } from "quasar";

export function usePrinter() {
  const $q = useQuasar();

  const printInvoice = (orderData) => {
    // এখানে ব্রাউজার প্রিন্টিং বা থার্মাল প্রিন্টার API ইন্টিগ্রেট করা যায়
    console.log("Printing Invoice for Order:", orderData.id);

    const printWindow = window.open("", "_blank", "width=300,height=600");

    // থার্মাল প্রিন্টার ফরম্যাটে সিম্পল HTML ডিজাইন
    const htmlContent = `
      <div style="font-family: monospace; width: 100%; font-size: 12px;">
        <h3 style="text-align: center;">SAAS RESTAURANT</h3>
        <p style="text-align: center;">Mirpur, Dhaka</p>
        <hr>
        <p>Order: #${orderData.id} | Table: ${orderData.table}</p>
        <hr>
        <table style="width: 100%">
          ${orderData.items
            .map(
              (item) => `
            <tr>
              <td>${item.name} x${item.qty}</td>
              <td style="text-align: right;">${item.price * item.qty}</td>
            </tr>
          `,
            )
            .join("")}
        </table>
        <hr>
        <p style="text-align: right;"><strong>Total: ৳ ${orderData.total}</strong></p>
        <p style="text-align: center;">Thank You!</p>
      </div>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();

    $q.notify({
      message: "Sending to printer...",
      color: "info",
      icon: "print",
    });
  };

  return {
    printInvoice,
  };
}
