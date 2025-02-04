import { Routes } from '@angular/router';
import { LayoutComponent } from './modules/portal/components/layout/layout.component';

export const routes: Routes = [
    { path: '', component: LayoutComponent },
    { path: '**', component: LayoutComponent, pathMatch: 'full' }
];
