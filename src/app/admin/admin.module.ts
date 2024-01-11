import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { TasksComponent } from './tasks/tasks.component';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    TasksComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    ButtonModule,
    CheckboxModule,
    MenubarModule,
    InputTextModule,
    OverlayPanelModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
