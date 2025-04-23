import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../Material/material/material.module';

@Component({
  selector: 'app-invoice-item-list',
  imports: [CommonModule,MaterialModule],
  templateUrl: './invoice-item-list.component.html',
  styleUrl: './invoice-item-list.component.scss'
})
export class InvoiceItemListComponent {

  invoiceItems: any[] = []; 
  dataSource = new MatTableDataSource<any>(); // Initialize MatTableDataSource
  displayedColumns: string[] = ['customerName', 'customerEmail', 'customerContact', 'totalPrice'];

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    const data = this.storageService.getInvoices(); // Fetch the invoices from storage
    this.invoiceItems.push(data);
    console.log("recieved data to LIST", this.invoiceItems); // Log the fetched invoices
    this.dataSource.data = this.invoiceItems.flatMap(data$ =>
      data$.items.map((items:any) => ({
        customerName: data$.customerName,
        customerEmail: data$.customerEmail,
        customerContact: data$.customerContact,
        totalPrice: items.totalPrice
      }))

    );
  }




}
