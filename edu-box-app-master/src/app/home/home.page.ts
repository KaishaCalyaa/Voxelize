import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ]
})
export class HomePage {
  // Properti untuk menyimpan status LED (true = ON, false = OFF)
  // 6x6 = 36 LED
  ledGrid: boolean[] = new Array(36).fill(false);

  // Properti Layer (Z-Axis)
  layers: number[] = [1, 2, 3, 4, 5, 6];
  currentLayer: number = 1;

  // Theme properties
  headerIcon: string = 'cube';
  themeName: string = 'EDUBOX';

  constructor(
    private router: Router,
    private toastController: ToastController,
    private themeService: ThemeService
  ) {
    // Theme is always EDUBOX
    this.headerIcon = 'cube';
    this.themeName = 'EDUBOX';
  }

  /**
   * Fungsi untuk memilih layer (Z-Axis) yang sedang diedit.
   * Di aplikasi nyata, ini akan memuat status LED dari layer tersebut.
   * @param layer Nomor layer yang dipilih.
   */
  selectLayer(layer: number) {
    this.currentLayer = layer;
    
    // TODO: Di sini Anda akan menambahkan logika untuk mengambil 
    // status 36 LED dari database/service berdasarkan this.currentLayer
    // Untuk contoh, kita reset ke kosong
    this.ledGrid.fill(false);
    console.log(`Layer ${layer} dipilih. Status grid direset.`);
  }

  /**
   * Fungsi untuk mengganti status (ON/OFF) LED yang diklik.
   * @param index Indeks LED yang diklik (0 hingga 35).
   */
  toggleLed(index: number) {
    this.ledGrid[index] = !this.ledGrid[index];
    
    const ledStatus = this.ledGrid[index] ? 'ON' : 'OFF';
    console.log(`LED di Layer ${this.currentLayer}, Index ${index} diubah menjadi ${ledStatus}`);
    
    // TODO: Di sini Anda akan menambahkan logika untuk mengirim 
    // status LED ini ke Bluetooth/WiFi untuk mengontrol LED fisik.
    this.sendGridState();
  }

  /**
   * Mengisi seluruh layer (36 LED) dengan status ON.
   */
  fillLayer() {
    this.ledGrid.fill(true);
    console.log(`Layer ${this.currentLayer} diisi penuh.`);
    this.sendGridState();
  }

  /**
   * Mengosongkan seluruh layer (36 LED) dengan status OFF.
   */
  clearLayer() {
    this.ledGrid.fill(false);
    console.log(`Layer ${this.currentLayer} dikosongkan.`);
    this.sendGridState();
  }
  
  /**
   * Fungsi Placeholder untuk mengirim data ke hardware.
   */
  sendGridState() {
    const dataToSend = {
      layer: this.currentLayer,
      grid: this.ledGrid.map(status => status ? 1 : 0) // Mengubah boolean menjadi array 1s dan 0s
    };
    
    console.log("Data siap dikirim ke hardware:", dataToSend);
    // TODO: Implementasi HTTP/Bluetooth/Serial communication service di sini.
  }

  /**
   * Menyimpan pola LED saat ini
   */
  async savePattern() {
    // Buat objek pola yang akan disimpan
    const pattern = {
      layer: this.currentLayer,
      grid: this.ledGrid.map(status => status ? 1 : 0),
      timestamp: new Date().toISOString()
    };

    console.log('Menyimpan pola:', pattern);
    
    // TODO: Implementasi penyimpanan ke penyimpanan lokal atau server
    // Contoh:
    // localStorage.setItem(`pattern_${this.currentLayer}`, JSON.stringify(pattern));
    
    // Tampilkan pesan sukses
    await this.presentToast('Pola berhasil disimpan!');
  }

  /**
   * Navigasi ke halaman Patterns
   */
  navigateToPatterns() {
    this.router.navigate(['/pattern']);
  }

  /**
   * Menampilkan pesan toast
   * @param message Pesan yang akan ditampilkan
   */
  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'success',
      buttons: [
        {
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    
    await toast.present();
  }
}
