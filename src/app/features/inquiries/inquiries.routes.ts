import { Routes } from '@angular/router';
import { InquiryListComponent } from './inquiry-list/inquiry-list.component';

export const INQUIRIES_ROUTES: Routes = [
  {
    path: '',
    component: InquiryListComponent,
  },
];
