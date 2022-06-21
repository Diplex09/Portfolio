import { RoleGuardService as RoleGuard } from './services/role-guard.service';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'rating/:id',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/grade/grade.module').then( m => m.GradePageModule)
  },
  {
    path: 'dashboard',
    canActivate: [RoleGuard], 
    data: { 
      expectedRole: [0]
    },
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'chat',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'feedback',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/feedback/feedback.module').then( m => m.FeedbackPageModule)
  },
  {
    path: 'feedbacks',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/feedbacks/feedbacks.module').then( m => m.FeedbacksPageModule)
  },
  {
    path: 'admin-dashboard',
    canActivate: [RoleGuard], 
    data: { 
      expectedRole: [1, 2]
    },
    loadChildren: () => import('./pages/admin-dashboard/admin-dashboard.module').then( m => m.AdminDashboardPageModule)
  },
  {
    path: 'super-admin',
    canActivate: [RoleGuard], 
    data: { 
      expectedRole: [2]
    },
    loadChildren: () => import('./pages/super-admin/super-admin.module').then( m => m.SuperAdminPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: '**',
    redirectTo: 'login'
  },
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

