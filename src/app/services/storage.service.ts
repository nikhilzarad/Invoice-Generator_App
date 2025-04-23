import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storageKey = 'invoices';

  constructor() {}


  addInvoice(invoice: any): void {
   
    console.log("Invoices before adding new one:", invoice); // Log existing invoices
    // invoices.push(invoice); // Add the new invoice
    localStorage.setItem(this.storageKey, JSON.stringify(invoice)); // Save updated invoices
  }

  getInvoices(): any[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]'); // Retrieve all invoices
  }
}
