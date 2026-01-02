import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { adminGuard } from './admin/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'admin',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      { path: 'login', loadComponent: () => import('./admin/login.component').then((m) => m.LoginComponent) },
      {
        path: 'dashboard',
        canActivate: [adminGuard],
        loadComponent: () => import('./admin/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'resume',
        canActivate: [adminGuard],
        loadComponent: () => import('./admin/resume-editor.component').then((m) => m.ResumeEditorComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' }
];
