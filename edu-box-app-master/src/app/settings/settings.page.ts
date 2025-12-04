import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { ThemeService, ThemeMode } from '../services/theme.service';

// 👉 Tambahkan interface
interface User {
  name: string;
  role: string;
  status: 'owner' | 'viewer';
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})

export class SettingsPage implements OnInit {

  bluetoothStatus: 'Disconnected' | 'Scanning' | 'Connected' = 'Disconnected';
  statusMessage = 'No device found nearby.';

  loggedInUserName: string = '';

  // 👉 Tentukan tipe datanya
  authorizedUsers: User[] = [];

  // Dark mode property
  isDarkMode: boolean = false;

  constructor(
    private router: Router,
    private themeService: ThemeService
  ) {
    // Initialize dark mode
    this.isDarkMode = this.themeService.isDarkMode();
  }

  ngOnInit() {
    const savedName = localStorage.getItem('username');

    this.loggedInUserName = savedName ? savedName : 'User';

    // 👉 Isi data sesuai tipe User
    this.authorizedUsers = [
      { name: this.loggedInUserName, role: 'Owner', status: 'owner' },
      { name: 'Guest User 1', role: 'Viewer', status: 'viewer' }
    ];
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

    }, 4000);
  }

  openUserSettings(user: User) {
    console.log('Open settings for:', user.name);
  }

  /**
   * Toggle dark mode on/off
   * @param event - The ion-toggle change event
   */
  toggleDarkMode(event: any): void {
    const isEnabled = event.detail.checked;
    this.isDarkMode = isEnabled;
    this.themeService.setDarkMode(isEnabled);
    console.log(`Dark mode ${isEnabled ? 'enabled' : 'disabled'}`);
  }
}
