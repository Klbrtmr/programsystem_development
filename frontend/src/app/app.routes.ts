import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
 import { adminGuard } from './shared/guards/admin.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'register', loadComponent: () => import('./register/register.component').then((c) => c.RegisterComponent) },
    { path: 'login', loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent) },
    { path: 'login/:id', loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent) },
    { path: 'races', loadComponent: () => import('./races/races.component').then((c) => c.RacesComponent) },
    { path: 'races/:id', loadComponent: () => import('./race-view/race-view.component').then((c) => c.RaceViewComponent) },
    { path: 'drivers', loadComponent: () => import('./drivers/drivers.component').then((c) => c.DriversComponent) },
    { path: 'drivers/:id', loadComponent: () => import('./driver-view/driver-view.component').then((c) => c.DriverViewComponent) },
    { path: 'user-management', loadComponent: () => import('./user-management/user-management.component').then((c) => c.UserManagementComponent), canActivate: [authGuard, adminGuard] },
    { path: '**', redirectTo: 'login' }
];
