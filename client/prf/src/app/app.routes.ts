import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'signup', loadComponent: () => import('./signup/signup.component').then((c) => c.SignupComponent) },
    { path: 'login', loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent) },
    { path: 'home', loadComponent: () => import('./home/home.component').then((c) => c.HomeComponent), canActivate: [authGuard] },
    { path: 'edit', loadComponent: () => import('./edit/edit.component').then((c) => c.EditComponent), canActivate: [authGuard] },
    { path: 'view', loadComponent: () => import('./view/view.component').then((c) => c.ViewComponent), canActivate: [authGuard] },
    { path: 'edit_content', loadComponent: () => import('./edit-content/edit-content.component').then((c) => c.EditContentComponent), canActivate: [authGuard] },
    { path: '**', redirectTo: 'login' },
];
