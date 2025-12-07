import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from './login/login.page';
import { RegisterPage } from './register/register.page';
import { AuthService } from './auth.service';
import { RouterModule } from '@angular/router';

@NgModule({
  // Komponen harus dideklarasikan karena mereka bukan standalone
  declarations: [
    LoginPage,
    RegisterPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // Penting untuk FormBuilder
    IonicModule,
    RouterModule.forChild([
      {
        path: 'login',
        component: LoginPage
      },
      {
        path: 'register',
        component: RegisterPage
      }
    ])
  ],
  providers: [
    // AuthGuard tidak diimplementasikan di sini, tapi AuthService ada
    AuthService 
  ]
})
export class AuthModule { }