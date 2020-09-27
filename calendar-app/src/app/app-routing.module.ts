import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './public/not-found/not-found.component';

export const routes: Routes = [
  {
      path: '',
      redirectTo: '/public/register',
      pathMatch: 'full'
  },
  {
      path: 'public',
      loadChildren: () => import(`./public/public.module`).then(m => m.PublicModule)
  },
  {
      path: 'account',
      canActivate: [AuthGuard],
      loadChildren: () => import(`./account/account.module`).then(m => m.AccountModule)
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
