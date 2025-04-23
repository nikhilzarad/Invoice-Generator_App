import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../services/invoice.service';
import { MaterialModule } from '../Material/material/material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-invoice-preview',
  imports: [MaterialModule,CommonModule,RouterModule], 
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.component.scss'],
})
export class InvoicePreviewComponent implements OnInit {
  recievedInvoiceData: any;
  currentDate: Date = new Date(); // Initialize currentDate to the current date

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit() {
    this.invoiceService.invoiceFormData.subscribe((data) => {
      this.recievedInvoiceData = data; // Assign the actual data
      console.log("Received Data:", this.recievedInvoiceData);
    });
  }

  onDownloadPDF(): void {
    this.invoiceService.triggerGeneratePDF();
  }
}
