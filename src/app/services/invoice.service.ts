import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private invoiceData = new BehaviorSubject<any>(null);
  private generatePDFSubject = new Subject<void>();

  updateInvoiceData(data: any) {
    this.invoiceData.next(data);
  }
  triggerGeneratePDF() {
    this.generatePDFSubject.next();
  }
  get generatePDF$() {
    return this.generatePDFSubject.asObservable();
  }

  get invoiceFormData() {
    return this.invoiceData.asObservable();
  }
}