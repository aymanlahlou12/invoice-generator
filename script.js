const addItemBtn = document.getElementById('addItemBtn');
const itemsTableBody = document.querySelector('#itemsTable tbody');
const grandTotalEl = document.getElementById('grandTotal');

addItemBtn.addEventListener('click', addItemRow);
// Auto-generate invoice number and set today's date on load
window.addEventListener('DOMContentLoaded', () => {
  const savedNumber = localStorage.getItem('lastInvoiceNumber');
  const nextNumber = savedNumber ? parseInt(savedNumber) + 1 : 1;
  document.getElementById('invoiceNumber').value = 'INV-' + String(nextNumber).padStart(4, '0');

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('invoiceDate').value = today;

  // Load saved business info
  const savedBusiness = JSON.parse(localStorage.getItem('businessInfo') || '{}');
  if (savedBusiness.name) document.getElementById('businessName').value = savedBusiness.name;
  if (savedBusiness.email) document.getElementById('businessEmail').value = savedBusiness.email;
});

function addItemRow() {
  const row = document.createElement('tr');

  row.innerHTML = `
    <td><input type="text" class="itemDesc" placeholder="Item description"></td>
    <td><input type="number" class="itemQty" value="1" min="1"></td>
    <td><input type="number" class="itemPrice" value="0" min="0" step="0.01"></td>
    <td class="itemTotal">$0.00</td>
    <td><button class="removeBtn">✕</button></td>
  `;

  itemsTableBody.appendChild(row);

  // Recalculate this row's total when qty or price changes
  const qtyInput = row.querySelector('.itemQty');
  const priceInput = row.querySelector('.itemPrice');
  const totalCell = row.querySelector('.itemTotal');

  function updateRowTotal() {
    const qty = parseFloat(qtyInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    const total = qty * price;
    totalCell.textContent = '$' + total.toFixed(2);
    updateGrandTotal();
  }

  qtyInput.addEventListener('input', updateRowTotal);
  priceInput.addEventListener('input', updateRowTotal);

  // Remove row button
  row.querySelector('.removeBtn').addEventListener('click', () => {
    row.remove();
    updateGrandTotal();
  });

  updateRowTotal();
}

function updateGrandTotal() {
  const totalCells = document.querySelectorAll('.itemTotal');
  let sum = 0;
  totalCells.forEach(cell => {
    sum += parseFloat(cell.textContent.replace('$', '')) || 0;
  });
  grandTotalEl.textContent = sum.toFixed(2);
}
const downloadBtn = document.getElementById('downloadBtn');
downloadBtn.addEventListener('click', generatePDF);

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const businessName = document.getElementById('businessName').value || 'Your Business';
  const businessEmail = document.getElementById('businessEmail').value || '';
  const clientName = document.getElementById('clientName').value || 'Client Name';
  const clientEmail = document.getElementById('clientEmail').value || '';

  let y = 20;

  doc.setFontSize(22);
  doc.text('INVOICE', 20, y);
  y += 15;
  // Save business info for next time
  localStorage.setItem('businessInfo', JSON.stringify({
    name: businessName,
    email: businessEmail}));

  // Save invoice number so next invoice increments
  
  doc.setFontSize(11);
  doc.text(`From: ${businessName}`, 20, y);
  y += 6;
  if (businessEmail) { doc.text(businessEmail, 20, y); y += 6; }

  y += 6;
  doc.text(`To: ${clientName}`, 20, y);
  y += 6;
  if (clientEmail) { doc.text(clientEmail, 20, y); y += 6; }

  y += 10;
  doc.setFontSize(12);
  doc.text('Description', 20, y);
  doc.text('Qty', 110, y);
  doc.text('Price', 135, y);
  doc.text('Total', 165, y);
  y += 4;
  doc.line(20, y, 190, y);
  y += 8;

  doc.setFontSize(11);
  const rows = document.querySelectorAll('#itemsTable tbody tr');
  rows.forEach(row => {
    const desc = row.querySelector('.itemDesc').value || '-';
    const qty = row.querySelector('.itemQty').value;
    const price = row.querySelector('.itemPrice').value;
    const total = row.querySelector('.itemTotal').textContent;

    doc.text(desc, 20, y);
    doc.text(qty, 110, y);
    doc.text('$' + parseFloat(price).toFixed(2), 135, y);
    doc.text(total, 165, y);
    y += 8;
  });

  y += 6;
  doc.line(20, y, 190, y);
  y += 10;

  doc.setFontSize(14);
  const grandTotal = document.getElementById('grandTotal').textContent;
  doc.text(`Grand Total: $${grandTotal}`, 130, y);
    // Save business info for next time
  localStorage.setItem('businessInfo', JSON.stringify({
    name: businessName,
    email: businessEmail
  }));

  // Save invoice number so next invoice increments
  const invoiceNum = document.getElementById('invoiceNumber').value.replace(/\D/g, '');
  if (invoiceNum) localStorage.setItem('lastInvoiceNumber', invoiceNum);

  doc.save(`invoice-${clientName.replace(/\s+/g, '_') || 'draft'}.pdf`);
}