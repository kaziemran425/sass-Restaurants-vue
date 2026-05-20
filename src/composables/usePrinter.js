// src/composables/usePrinter.js
export function usePrinter() {
  const printInvoice = (htmlContent) => {
    const win = window.open("", "_blank");

    if (!win) {
      alert("Popup blocked! Allow popups to print.");
      return;
    }

    win.document.open();
    win.document.write(`
      <html>
        <head>
          <title>Invoice Print</title>
          <style>
            body { font-family: Arial; padding: 10px; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `);
    win.document.close();

    setTimeout(() => {
      win.print();
      win.close();
    }, 500);
  };

  return { printInvoice };
}
