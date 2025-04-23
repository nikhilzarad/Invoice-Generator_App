import { Routes } from '@angular/router';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { InvoicePreviewComponent } from './invoice-preview/invoice-preview.component';
import { InvoiceItemListComponent } from './invoice-item-list/invoice-item-list.component';

export const routes: Routes = [
    { path: '', redirectTo: 'invoice', pathMatch: 'full' },
    {path: 'invoice',component:InvoiceFormComponent},
    {path: 'preview',component:InvoicePreviewComponent},
    {path: 'itemList',component:InvoiceItemListComponent}
];
