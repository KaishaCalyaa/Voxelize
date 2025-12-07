import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { FirebaseError } from '@angular/fire/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  passwordToggleIcon = 'eye-outline';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Initialization logic can be added here if needed
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    this.passwordToggleIcon = this.showPassword ? 'eye-off-outline' : 'eye-outline';
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Logging in...',
    });
    await loading.present();

    try {
      const { email, password } = this.loginForm.value;
      const user = await this.authService.login(email, password);
      
      if (user) {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
        this.router.navigateByUrl(returnUrl, { replaceUrl: true });
      } else {
        throw new Error('Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      let errorMessage = 'An error occurred during login';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      } else if (error.code) {
        errorMessage = error.message;
      }
      
      const alert = await this.alertCtrl.create({
        header: 'Login Failed',
        message: errorMessage,
        buttons: ['OK']
      });
      await alert.present();
    } finally {
      await loading.dismiss();
    }
  }

  async onForgotPassword(event: Event) {
    event.preventDefault();
    
    const alert = await this.alertCtrl.create({
      header: 'Reset Password',
      message: 'Enter your email to receive a password reset link',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Your email',
          value: this.email?.value || ''
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Send Reset Link',
          handler: async (data: { email: string }) => {
            if (!data.email) {
              this.showAlert('Error', 'Please enter your email');
              return false;
            }
            
            const loading = await this.loadingCtrl.create({
              message: 'Sending reset link...'
            });
            await loading.present();
            
            try {
              // Call your auth service password reset method here
              // Example: await this.authService.resetPassword(data.email);
              await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
              
              await loading.dismiss();
              this.showAlert('Email Sent', 'Check your email for the password reset link');
            } catch (error) {
              await loading.dismiss();
              this.showAlert('Error', 'Failed to send reset link. Please try again.');
            }
            
            return true;
          }
        }
      ]
    });
    
    await alert.present();
  }
  
  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    
    await alert.present();
  }

  async signInWithGoogle() {
    const loading = await this.loadingCtrl.create({
      message: 'Signing in with Google...',
    });
    await loading.present();

    try {
      await this.authService.signInWithGoogle();
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
      this.router.navigateByUrl(returnUrl, { replaceUrl: true });
    } catch (error: any) {
      console.error('Google sign in error:', error);
      let errorMessage = 'An error occurred during Google Sign-In';
      
      if (error.code) {
        switch (error.code) {
          case 'auth/account-exists-with-different-credential':
            errorMessage = 'An account already exists with the same email but different sign-in credentials.';
            break;
          case 'auth/popup-closed-by-user':
            errorMessage = 'Sign in was canceled. Please try again.';
            break;
          default:
            errorMessage = error.message || errorMessage;
        }
      }
      
      const alert = await this.alertCtrl.create({
        header: 'Google Sign-In Failed',
        message: errorMessage,
        buttons: ['OK']
      });
      await alert.present();
    } finally {
      await loading.dismiss();
    }
  }

}