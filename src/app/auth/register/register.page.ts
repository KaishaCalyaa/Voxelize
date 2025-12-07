import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  standalone: false, // Ditambahkan untuk memastikan ini BUKAN standalone component
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  passwordToggleIcon = 'eye-outline';
  confirmPasswordToggleIcon = 'eye-outline';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    // Penggunaan FormBuilder membutuhkan ReactiveFormsModule di AuthModule
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.matchingPasswords('password', 'confirmPassword') });
  }

  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    this.passwordToggleIcon = this.showPassword ? 'eye-off-outline' : 'eye-outline';
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
    this.confirmPasswordToggleIcon = this.showConfirmPassword ? 'eye-off-outline' : 'eye-outline';
  }

  // Menggunakan ValidatorFn untuk tipe yang lebih ketat
  matchingPasswords(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const password = group.get(passwordKey);
      const confirmPassword = group.get(confirmPasswordKey);

      if (!password || !confirmPassword) {
        return null;
      }

      if (password.value !== confirmPassword.value) {
        // Menetapkan error hanya pada confirmPassword
        confirmPassword.setErrors({ mismatch: true });
        return { mismatch: true };
      } else {
        // Menghapus error jika cocok
        if (confirmPassword.hasError('mismatch')) {
          confirmPassword.setErrors(null);
        }
        return null;
      }
    };
  }

  async register() {
    if (this.registerForm.valid) {
      if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Passwords do not match',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }
      const loading = await this.loadingController.create({
        message: 'Creating account...'
      });
      await loading.present();

      try {
        await this.authService.register(
          this.registerForm.value.email,
          this.registerForm.value.password,
          this.registerForm.value.name
        );
        
        // Show success message
        const successAlert = await this.alertController.create({
          header: 'Registration Successful',
          message: 'Your account has been created successfully!',
          buttons: [{
            text: 'OK',
            handler: () => {
              this.router.navigateByUrl('/home');
            }
          }]
        });
        await successAlert.present();
        
      } catch (error: any) {
        console.error('Registration error:', error);
        let errorMessage = 'An error occurred during registration';
        
        // More specific error messages
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'This email is already registered. Please use a different email or login instead.';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'The password is too weak. Please choose a stronger password.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'The email address is not valid.';
        } else if (error.code) {
          errorMessage = error.message;
        }
        
        const alert = await this.alertController.create({
          header: 'Registration Failed',
          message: errorMessage,
          buttons: ['OK']
        });
        await alert.present();
      } finally {
        await loading.dismiss();
      }
    }
  }

  ngOnInit() {}
}