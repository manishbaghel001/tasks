import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { VerifyemailComponent } from './form/verifyemail/verifyemail.component';
import { ForgotpasswordComponent } from './form/forgotpassword/forgotpassword.component';
import { AuthGuard } from './services/auth.guard';
import { FormComponent } from './form/form.component';

const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: 'tasks', component: HeaderComponent, canActivate: [AuthGuard] },
  { path: 'form', component: FormComponent },
  { path: 'verify-email', component: VerifyemailComponent },
  { path: 'forgot-password', component: ForgotpasswordComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule { }

