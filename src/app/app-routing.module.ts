import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyemailComponent } from './form/verifyemail/verifyemail.component';
import { ForgotpasswordComponent } from './form/forgotpassword/forgotpassword.component';
import { AuthGuard } from './services/auth.guard';
import { RegisterComponent } from './form/register/register.component';
import { LoginComponent } from './form/login/login.component';
import { TasksComponent } from './tasks/tasks.component';

const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: 'tasks', component: TasksComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyemailComponent },
  { path: 'forgot-password', component: ForgotpasswordComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule { }

