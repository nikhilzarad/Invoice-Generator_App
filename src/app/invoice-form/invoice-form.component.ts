import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../Material/material/material.module';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InvoiceService } from '../services/invoice.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { RouterModule } from '@angular/router';
import { StorageService } from '../services/storage.service';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-invoice-form',
  imports: [MaterialModule,CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent {
  invoiceForm !: FormGroup;
  
  constructor(private fb: FormBuilder,private storageService :StorageService, private invoiceService: InvoiceService,private router: RouterModule) {
    this.invoiceForm = this.fb.group({
      customerName: ['',Validators.required],
      customerEmail: ['',Validators.email],
      customerContact: ['',Validators.required],
      customerAddress: ['',Validators.required],
      items: this.fb.array([this.createItem()]), // Initialize with at least one item
    });

  }
  
  
  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }
createItem(){
  return this.fb.group({
    description: [''],
    quantity: [0], // Default to 0
    price: [0], // Default to 0
    totalPrice: [0], // Default to 0
  });

}

addItems(){
  this.items.push(this.createItem());
}
removeItems(index: number){
  this.items.removeAt(index);
}
onSubmit(){
console.log(this.invoiceForm.value);
}

ngOnInit(): void {
  this.calculateTotal();
  this.invoiceForm.get('items')?.valueChanges.subscribe(() => {
    this.calculateTotal();
  })
  this.invoiceService.generatePDF$.subscribe(() => {
    this.generatePDF();
  });
}

calculateTotal(): void {
  this.items.controls.forEach((item) => {
    const quantity = item.get('quantity')?.value || 0;
    const price = item.get('price')?.value || 0;
    const totalPrice = quantity * price;
    item.get('totalPrice')?.setValue(totalPrice, { emitEvent: false });
  });
}
get totalAmount(): number {
  let total = 0;
  this.items.controls.forEach((item) => {
    total += item.get('totalPrice')?.value || 0;
  });
  return total;
}

sendToPreview(invoiceData:any) {
 
  // Send invoiceData to the InvoiceService or any other service for further processing

    this.invoiceService.updateInvoiceData(invoiceData);
    // Optionally, navigate to the preview page
    // this.router.navigate(['/preview']);
   
    console.log('Invoice data sent to service:', invoiceData);
  }

generatePDF(): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const primaryColor = '#0c97f3'; // Replace with your primary color
  const accentColor = '#3498db';
    // Generate random invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  


  // Add header
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setFontSize(18);
  doc.setTextColor(255);
  doc.text('INVOICE', 15, 15);

  
  // Add logo
  // doc.addImage(logoData, 'PNG', pageWidth - 40, 5, 30, 15);

  // Date
  const date = formatDate(new Date(), 'MM/dd/yyyy', 'en');
  doc.setFontSize(10);
  doc.text(`Date: ${date}`, pageWidth - 15, 15, { align: 'right' });

  // Reset styles
  doc.setTextColor(0);
  doc.setFontSize(12);

  // Company/Customer details in two columns
  const sellerInfo = [
    'XYZ Company',
    '123 Business Street',
    'India - 123456',
    'Phone: (+91) 123-4567',
    'Email: info@company.com'
  ];

  const customerInfo = [
    'Customer Details:',
    `Name: ${this.invoiceForm.get('customerName')?.value}`,
    `Email: ${this.invoiceForm.get('customerEmail')?.value}`,
    `Contact: ${this.invoiceForm.get('customerContact')?.value}`,
    `Address: ${this.invoiceForm.get('customerAddress')?.value}`
  ];

  // Seller info column
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(sellerInfo, 15, 30);

  
   // Add invoice number
   doc.setFontSize(10);
   doc.text(`Invoice Number: ${invoiceNumber}`, 15, 25);
 
  
  
  // Customer info column
  doc.setFontSize(12);
  doc.setTextColor(primaryColor);
  doc.text(customerInfo, pageWidth - 80, 30);

  // Add line separator
  doc.setDrawColor(200);
  doc.line(15, 75, pageWidth - 15, 75);

  // Order Details
  doc.setFontSize(14);
  doc.setTextColor(primaryColor);
  doc.text('Order Details', 15, 85);
  
  // Prepare item rows
  const itemRows = this.items.controls.map((control) => [
    control.get('description')?.value,
    control.get('quantity')?.value,
    `$${control.get('price')?.value.toFixed(2)}`,
    `$${control.get('totalPrice')?.value.toFixed(2)}`
  ]);

  
  // Add table
  autoTable(doc, {
    startY: 90,
    head: [['Item Description', 'Qty', 'Unit Price', 'Total']],
    body: itemRows,
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: 255,
      fontSize: 12,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 80, fontStyle: 'bold' },
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' }
    },
    styles: {
      fontSize: 11,
      cellPadding: 4,
      lineColor: 200,
      lineWidth: 0.25
    },
    didDrawPage: (data) => {
      if (data.pageNumber) {
        const finalY = data.cursor?.y ?? 100;
        
        // Total Amount
        doc.setFontSize(12);
        doc.setTextColor(primaryColor);
        doc.text(`Subtotal: $${this.totalAmount.toFixed(2)}`, pageWidth - 15, finalY + 10, { align: 'right' });
        doc.text(`Tax (0%): $0.00`, pageWidth - 15, finalY + 16, { align: 'right' });
        doc.setFont('helvetica', 'bold');
        doc.text(`Total: $${this.totalAmount.toFixed(2)}`, pageWidth - 15, finalY + 24, { align: 'right' });

        // Payment Info
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('Payment Due: Immediate', 15, finalY + 20);
        doc.text('Payment Method: Credit Card', 15, finalY + 26);

        // Signature Area
        doc.setFontSize(11);
        doc.setTextColor(primaryColor);
        doc.text('Authorized Signature', pageWidth - 60, finalY + 40);
        doc.line(pageWidth - 60, finalY + 42, pageWidth - 15, finalY + 42);

        // Footer
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text('Thank you for your business!', pageWidth / 2, 280, { align: 'center' });
        doc.text('Terms: Net 30 Days', 15, 285);
      }
    }
  });

  // Save PDF
  doc.save(`invoice_${date.replace(/\//g, '-')}.pdf`);

  this.storageService.addInvoice(this.invoiceForm.value); // Save invoice to local storage
}
}