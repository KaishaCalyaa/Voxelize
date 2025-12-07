import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

interface User {
  name: string;
  role: string;
  email: string;
  status: 'owner' | 'viewer';
  photoURL?: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})

export class SettingsPage implements OnInit, OnDestroy {
  bluetoothStatus: 'Disconnected' | 'Scanning' | 'Connected' = 'Disconnected';
  statusMessage = 'No device found nearby.';
  private authSub: Subscription = new Subscription();
  isDarkMode = false;

  // User data
  user: User = { 
    name: 'Loading...', 
    role: 'User', 
    email: 'loading...',
    status: 'viewer'
  };

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private authService: AuthService
  ) {
    this.isDarkMode = this.themeService.isDarkMode();
  }

  // Check if the current user is the admin
  get isAdmin(): boolean {
    return this.user?.email === 'a@gmail.com';
  }

  // Get the display status text based on user role
  get displayStatus(): string {
    if (this.isAdmin) return 'Administrator';
    return this.user.status === 'owner' ? 'Pemilik' : 'Pengguna';
  }

  // Get the status color class
  get statusColor(): string {
    if (this.isAdmin) return 'admin';
    return this.user.status === 'owner' ? 'owner' : 'viewer';
  }

  ngOnInit() {
    this.authSub = this.authService.user$.subscribe(firebaseUser => {
      if (firebaseUser) {
        this.user = {
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || 'No email',
          role: 'Administrator',
          status: 'owner',
          photoURL: firebaseUser.photoURL || undefined
        };
      }
    });
  }

  // Get status icon based on user role
  getStatusIcon(): string {
    if (this.isAdmin) return 'shield-checkmark';
    return this.user.status === 'owner' ? 'star' : 'person';
  }

  // Get status description based on user role
  getStatusDescription(): string {
    if (this.isAdmin) return 'Anda memiliki akses penuh ke semua fitur';
    return this.user.status === 'owner' 
      ? 'Anda dapat mengatur pengguna lain' 
      : 'Anda dapat melihat konten yang dibagikan';
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  startPairing() {
    if (this.bluetoothStatus === 'Scanning') return;

    this.bluetoothStatus = 'Scanning';
    this.statusMessage = 'Scanning for devices... Please wait...';

    setTimeout(() => {
      const success = Math.random() > 0.5;

      if (success) {
        this.bluetoothStatus = 'Connected';
        this.statusMessage = 'Device "MyLightHub" connected successfully.';
      } else {
        this.bluetoothStatus = 'Disconnected';
        this.statusMessage = 'Pairing failed. No device found nearby.';
      }
    }, 2000);
  }

  openUserSettings(user: User) {
    // Implement user settings logic here
    console.log('Opening settings for user:', user);
  }

  toggleDarkMode(event: any) {
    const isEnabled = event?.detail?.checked ?? !this.isDarkMode;
    this.isDarkMode = isEnabled;
    this.themeService.setDarkMode(isEnabled);
  }
}