# Invoice Generator

A simple browser-based tool for creating invoices and downloading them as PDF files. Add business and client details, enter invoice items, and the app calculates the totals for you.

## Features

- Create invoices with an invoice number, invoice date, and due date
- Enter business and client contact details
- Add or remove invoice items with quantity and unit price
- Automatically calculate item totals and the grand total
- Download the completed invoice as a PDF
- Remember business details and the last invoice number in your browser

## Use the app

1. Clone or download this repository.
2. Open index.html in a web browser.
3. Enter the invoice, business, and client details.
4. Select + Add Item for each line, then enter its description, quantity, and price.
5. Select Download PDF to save the invoice.

No build tools or package installation are needed. The PDF library loads from a CDN, so an internet connection is required when using the app.

## Project files

- index.html — invoice form and page structure
- style.css — page styling
- script.js — item calculations, browser storage, and PDF generation

## Built with

- HTML, CSS, and JavaScript
- jsPDF for PDF generation

## Data storage

The app runs in your browser. It saves the business name, business email, and last invoice number in that browser's local storage. Invoice details are not sent to a server.
