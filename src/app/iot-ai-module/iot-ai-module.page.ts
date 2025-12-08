import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

interface ModuleSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  content: string;
}

@Component({
  selector: 'app-iot-ai-module',
  templateUrl: './iot-ai-module.page.html',
  styleUrls: ['./iot-ai-module.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class IotAiModulePage implements OnInit {
  currentSection: string = '';
  completedSections: Set<string> = new Set();

  modules: ModuleSection[] = [
    {
      id: 'overview',
      title: 'Overview IoT & AI',
      icon: 'layers-outline',
      description: 'Pengenalan dasar tentang IoT dan AI',
      content: `
        <h2>🌐 Apa itu IoT (Internet of Things)?</h2>
        <p>Internet of Things (IoT) adalah jaringan perangkat fisik yang tertanam dengan sensor, perangkat lunak, dan teknologi lainnya untuk menghubungkan dan bertukar data dengan perangkat dan sistem lain melalui internet.</p>
        
        <h3>Komponen Utama IoT:</h3>
        <ul>
          <li><strong>Sensor & Aktuator:</strong> Mengumpulkan data dari lingkungan</li>
          <li><strong>Konektivitas:</strong> Wi-Fi, Bluetooth, LoRa, dll</li>
          <li><strong>Data Processing:</strong> Cloud atau Edge computing</li>
          <li><strong>User Interface:</strong> Dashboard, aplikasi mobile</li>
        </ul>

        <h2>🤖 Apa itu AI (Artificial Intelligence)?</h2>
        <p>Artificial Intelligence (AI) adalah kemampuan mesin untuk meniru fungsi kognitif manusia seperti belajar, memecahkan masalah, dan membuat keputusan.</p>
        
        <h3>Jenis-jenis AI:</h3>
        <ul>
          <li><strong>Machine Learning:</strong> Belajar dari data</li>
          <li><strong>Deep Learning:</strong> Jaringan neural yang kompleks</li>
          <li><strong>Natural Language Processing:</strong> Memahami bahasa manusia</li>
          <li><strong>Computer Vision:</strong> Memahami gambar dan video</li>
        </ul>

        <h2>🔗 IoT + AI = Masa Depan</h2>
        <p>Ketika IoT dan AI digabungkan, kita mendapatkan sistem cerdas yang dapat:</p>
        <ul>
          <li>Mengumpulkan data real-time dari sensor</li>
          <li>Menganalisis data dengan AI untuk menemukan pola</li>
          <li>Membuat keputusan otomatis</li>
          <li>Belajar dan meningkatkan performa dari waktu ke waktu</li>
        </ul>
      `
    },
    {
      id: 'iot-basics',
      title: 'Dasar-dasar IoT',
      icon: 'hardware-chip-outline',
      description: 'Mempelajari komponen dan arsitektur IoT',
      content: `
        <h2>🏗️ Arsitektur IoT</h2>
        <p>IoT memiliki 4 layer utama:</p>
        
        <h3>1. Perception Layer (Sensor Layer)</h3>
        <p>Layer paling bawah yang berisi sensor dan aktuator untuk mengumpulkan data fisik.</p>
        <ul>
          <li>Suhu, kelembaban, cahaya</li>
          <li>Motion sensor, proximity sensor</li>
          <li>Camera, microphone</li>
        </ul>

        <h3>2. Network Layer</h3>
        <p>Menghubungkan perangkat IoT ke internet atau jaringan lokal.</p>
        <ul>
          <li><strong>Wi-Fi:</strong> Untuk aplikasi rumah pintar</li>
          <li><strong>Bluetooth:</strong> Untuk perangkat jarak dekat</li>
          <li><strong>LoRaWAN:</strong> Untuk aplikasi jarak jauh, low power</li>
          <li><strong>5G:</strong> Untuk aplikasi real-time yang memerlukan bandwidth tinggi</li>
        </ul>

        <h3>3. Processing Layer (Edge/Cloud)</h3>
        <p>Mengolah dan menyimpan data dari perangkat IoT.</p>
        <ul>
          <li><strong>Edge Computing:</strong> Pemrosesan di dekat sensor (latency rendah)</li>
          <li><strong>Cloud Computing:</strong> Pemrosesan di server cloud (skalabilitas tinggi)</li>
        </ul>

        <h3>4. Application Layer</h3>
        <p>Layer aplikasi yang berinteraksi dengan pengguna.</p>
        <ul>
          <li>Dashboard monitoring</li>
          <li>Aplikasi mobile</li>
          <li>API untuk integrasi</li>
        </ul>

        <h2>💡 Contoh Penerapan IoT</h2>
        <ul>
          <li><strong>Smart Home:</strong> Lampu, AC, kunci pintu yang bisa dikendalikan via smartphone</li>
          <li><strong>Smart Agriculture:</strong> Monitoring tanah, cuaca, dan irigasi otomatis</li>
          <li><strong>Industrial IoT:</strong> Predictive maintenance untuk mesin pabrik</li>
          <li><strong>Smart City:</strong> Traffic management, waste management, energy management</li>
        </ul>
      `
    },
    {
      id: 'ai-basics',
      title: 'Dasar-dasar AI',
      icon: 'bulb-outline',
      description: 'Konsep machine learning dan neural networks',
      content: `
        <h2>🧠 Machine Learning Fundamentals</h2>
        <p>Machine Learning adalah subset dari AI yang memungkinkan komputer belajar dari data tanpa diprogram secara eksplisit.</p>

        <h3>Jenis-jenis Machine Learning:</h3>
        
        <h4>1. Supervised Learning (Pembelajaran Terbimbing)</h4>
        <p>Model belajar dari data yang sudah diberi label.</p>
        <ul>
          <li><strong>Classification:</strong> Mengkategorikan data (contoh: spam/not spam)</li>
          <li><strong>Regression:</strong> Memprediksi nilai kontinu (contoh: harga rumah)</li>
        </ul>

        <h4>2. Unsupervised Learning (Pembelajaran Tidak Terbimbing)</h4>
        <p>Model menemukan pola dari data tanpa label.</p>
        <ul>
          <li><strong>Clustering:</strong> Mengelompokkan data serupa</li>
          <li><strong>Dimensionality Reduction:</strong> Mengurangi kompleksitas data</li>
        </ul>

        <h4>3. Reinforcement Learning</h4>
        <p>Model belajar melalui trial and error dengan reward/punishment.</p>
        <ul>
          <li>Game AI (Chess, Go)</li>
          <li>Autonomous vehicles</li>
          <li>Robot control</li>
        </ul>

        <h2>🧬 Neural Networks</h2>
        <p>Jaringan neural meniru cara otak manusia bekerja dengan neuron yang saling terhubung.</p>

        <h3>Struktur Neural Network:</h3>
        <ul>
          <li><strong>Input Layer:</strong> Menerima data input</li>
          <li><strong>Hidden Layers:</strong> Memproses data (bisa beberapa layer)</li>
          <li><strong>Output Layer:</strong> Menghasilkan hasil akhir</li>
        </ul>

        <h3>Deep Learning:</h3>
        <p>Neural network dengan banyak hidden layers. Digunakan untuk:</p>
        <ul>
          <li>Image recognition</li>
          <li>Speech recognition</li>
          <li>Natural language processing</li>
          <li>Autonomous driving</li>
        </ul>

        <h2>🎯 Algoritma Populer</h2>
        <ul>
          <li><strong>Linear Regression:</strong> Prediksi nilai kontinu</li>
          <li><strong>Decision Trees:</strong> Membuat keputusan berdasarkan kondisi</li>
          <li><strong>Random Forest:</strong> Gabungan banyak decision trees</li>
          <li><strong>Support Vector Machines (SVM):</strong> Classification dengan margin optimal</li>
          <li><strong>K-Means:</strong> Clustering data</li>
        </ul>
      `
    },
    {
      id: 'integration',
      title: 'Integrasi IoT & AI',
      icon: 'git-network-outline',
      description: 'Cara menggabungkan IoT dengan AI untuk solusi cerdas',
      content: `
        <h2>🔗 Mengapa Integrasi IoT & AI?</h2>
        <p>IoT menghasilkan banyak data, tetapi data mentah tidak berguna tanpa analisis. AI dapat mengubah data IoT menjadi insights yang actionable.</p>

        <h2>🔄 Alur Kerja IoT + AI</h2>
        
        <h3>1. Data Collection (Pengumpulan Data)</h3>
        <p>Sensor IoT mengumpulkan data secara terus-menerus.</p>
        <ul>
          <li>Suhu, kelembaban, tekanan</li>
          <li>Gambar, video, audio</li>
          <li>Lokasi, gerakan</li>
        </ul>

        <h3>2. Data Preprocessing (Pemrosesan Awal)</h3>
        <p>Membersihkan dan memformat data sebelum dianalisis.</p>
        <ul>
          <li>Menghapus noise dan outliers</li>
          <li>Normalisasi data</li>
          <li>Feature extraction</li>
        </ul>

        <h3>3. AI Analysis (Analisis AI)</h3>
        <p>AI menganalisis data untuk menemukan pola dan membuat prediksi.</p>
        <ul>
          <li>Anomaly detection</li>
          <li>Pattern recognition</li>
          <li>Predictive analytics</li>
          <li>Real-time decision making</li>
        </ul>

        <h3>4. Action (Tindakan)</h3>
        <p>Berdasarkan hasil analisis AI, sistem mengambil tindakan.</p>
        <ul>
          <li>Mengirim notifikasi</li>
          <li>Mengontrol aktuator</li>
          <li>Memperbarui dashboard</li>
          <li>Menyimpan insights</li>
        </ul>

        <h2>💼 Contoh Aplikasi IoT + AI</h2>
        
        <h3>1. Smart Agriculture</h3>
        <ul>
          <li><strong>IoT:</strong> Sensor tanah, cuaca, kelembaban</li>
          <li><strong>AI:</strong> Prediksi waktu panen optimal, deteksi penyakit tanaman</li>
          <li><strong>Result:</strong> Peningkatan hasil panen hingga 30%</li>
        </ul>

        <h3>2. Predictive Maintenance</h3>
        <ul>
          <li><strong>IoT:</strong> Sensor getaran, suhu, tekanan pada mesin</li>
          <li><strong>AI:</strong> Prediksi kapan mesin perlu maintenance</li>
          <li><strong>Result:</strong> Mengurangi downtime dan biaya maintenance</li>
        </ul>

        <h3>3. Smart Healthcare</h3>
        <ul>
          <li><strong>IoT:</strong> Wearable devices, monitor kesehatan</li>
          <li><strong>AI:</strong> Deteksi dini penyakit, rekomendasi pengobatan</li>
          <li><strong>Result:</strong> Perawatan kesehatan yang lebih personal dan efektif</li>
        </ul>

        <h3>4. Autonomous Vehicles</h3>
        <ul>
          <li><strong>IoT:</strong> Kamera, lidar, radar, GPS</li>
          <li><strong>AI:</strong> Object detection, path planning, decision making</li>
          <li><strong>Result:</strong> Kendaraan yang dapat mengemudi sendiri</li>
        </ul>
      `
    },
    {
      id: 'tools',
      title: 'Tools & Platform',
      icon: 'construct-outline',
      description: 'Platform dan tools untuk mengembangkan IoT & AI',
      content: `
        <h2>🛠️ Platform IoT</h2>
        
        <h3>1. Arduino & Raspberry Pi</h3>
        <ul>
          <li><strong>Arduino:</strong> Mikrokontroler untuk prototyping cepat</li>
          <li><strong>Raspberry Pi:</strong> Mini komputer untuk proyek yang lebih kompleks</li>
          <li>Kedua platform memiliki komunitas besar dan library yang banyak</li>
        </ul>

        <h3>2. Cloud Platforms</h3>
        <ul>
          <li><strong>AWS IoT:</strong> Platform IoT dari Amazon</li>
          <li><strong>Google Cloud IoT:</strong> Integrasi dengan Google Cloud services</li>
          <li><strong>Microsoft Azure IoT:</strong> Solusi enterprise IoT</li>
          <li><strong>ThingSpeak:</strong> Platform IoT open source</li>
        </ul>

        <h3>3. Communication Protocols</h3>
        <ul>
          <li><strong>MQTT:</strong> Protokol lightweight untuk IoT</li>
          <li><strong>CoAP:</strong> Constrained Application Protocol</li>
          <li><strong>HTTP/HTTPS:</strong> Protokol web standard</li>
        </ul>

        <h2>🤖 Platform AI & ML</h2>
        
        <h3>1. Machine Learning Frameworks</h3>
        <ul>
          <li><strong>TensorFlow:</strong> Framework ML dari Google (Python)</li>
          <li><strong>PyTorch:</strong> Framework ML dari Facebook (Python)</li>
          <li><strong>Scikit-learn:</strong> Library ML untuk Python</li>
          <li><strong>Keras:</strong> High-level API untuk neural networks</li>
        </ul>

        <h3>2. AI Cloud Services</h3>
        <ul>
          <li><strong>Google Cloud AI:</strong> Vision API, Speech API, NLP API</li>
          <li><strong>AWS AI Services:</strong> Rekognition, Polly, Comprehend</li>
          <li><strong>Azure Cognitive Services:</strong> Computer Vision, Speech, Language</li>
        </ul>

        <h3>3. Edge AI Platforms</h3>
        <ul>
          <li><strong>TensorFlow Lite:</strong> Untuk mobile dan edge devices</li>
          <li><strong>ONNX Runtime:</strong> Cross-platform inference</li>
          <li><strong>NVIDIA Jetson:</strong> Hardware untuk edge AI</li>
        </ul>

        <h2>📚 Learning Resources</h2>
        <ul>
          <li><strong>Coursera:</strong> IoT & AI courses</li>
          <li><strong>edX:</strong> MIT, Harvard courses</li>
          <li><strong>Udemy:</strong> Practical projects</li>
          <li><strong>Kaggle:</strong> Competitions dan datasets</li>
          <li><strong>GitHub:</strong> Open source projects</li>
        </ul>

        <h2>💻 Development Tools</h2>
        <ul>
          <li><strong>Python:</strong> Bahasa utama untuk AI/ML</li>
          <li><strong>C/C++:</strong> Untuk embedded IoT systems</li>
          <li><strong>Node.js:</strong> Untuk IoT backends</li>
          <li><strong>Jupyter Notebooks:</strong> Untuk eksperimen ML</li>
          <li><strong>Docker:</strong> Untuk containerization</li>
        </ul>
      `
    },
    {
      id: 'projects',
      title: 'Proyek Praktis',
      icon: 'code-working-outline',
      description: 'Ide-ide proyek untuk dipraktikkan',
      content: `
        <h2>🚀 Proyek IoT + AI untuk Pemula</h2>
        
        <h3>1. Smart Home Temperature Control</h3>
        <p><strong>Komponen:</strong></p>
        <ul>
          <li>Sensor suhu & kelembaban (DHT22)</li>
          <li>Raspberry Pi atau Arduino</li>
          <li>Relay untuk mengontrol AC/kipas</li>
          <li>ML model untuk prediksi suhu optimal</li>
        </ul>
        <p><strong>Cara Kerja:</strong> Sensor mengirim data ke cloud, AI memprediksi kebutuhan pendinginan, sistem mengontrol AC secara otomatis.</p>

        <h3>2. Plant Monitoring System</h3>
        <p><strong>Komponen:</strong></p>
        <ul>
          <li>Sensor kelembaban tanah</li>
          <li>Sensor cahaya</li>
          <li>ESP32 atau Arduino</li>
          <li>Water pump (opsional)</li>
          <li>AI untuk deteksi penyakit tanaman dari gambar</li>
        </ul>
        <p><strong>Cara Kerja:</strong> Monitor kondisi tanaman, kirim notifikasi jika perlu air, gunakan AI untuk deteksi penyakit dari foto daun.</p>

        <h3>3. Smart Parking System</h3>
        <p><strong>Komponen:</strong></p>
        <ul>
          <li>Ultrasonic sensor atau camera</li>
          <li>Raspberry Pi dengan camera module</li>
          <li>Display LED untuk status parkir</li>
          <li>Computer vision untuk deteksi mobil</li>
        </ul>
        <p><strong>Cara Kerja:</strong> Camera mendeteksi mobil, AI menentukan apakah spot kosong, update display dan aplikasi real-time.</p>

        <h3>4. Fitness Tracker dengan AI Analysis</h3>
        <p><strong>Komponen:</strong></p>
        <ul>
          <li>Accelerometer & gyroscope sensor</li>
          <li>ESP32 atau smartwatch</li>
          <li>ML model untuk klasifikasi aktivitas</li>
          <li>Mobile app untuk visualisasi</li>
        </ul>
        <p><strong>Cara Kerja:</strong> Sensor mengukur gerakan, AI mengklasifikasi aktivitas (jalan, lari, bersepeda), memberikan insights kesehatan.</p>

        <h2>🎓 Proyek Lanjutan</h2>
        
        <h3>1. Predictive Maintenance System</h3>
        <ul>
          <li>Sensor getaran & suhu pada mesin</li>
          <li>Time-series analysis dengan LSTM</li>
          <li>Prediksi waktu maintenance optimal</li>
        </ul>

        <h3>2. Smart Traffic Management</h3>
        <ul>
          <li>Camera di persimpangan</li>
          <li>Object detection untuk menghitung kendaraan</li>
          <li>Optimasi waktu lampu lalu lintas</li>
        </ul>

        <h3>3. Agriculture Drone dengan AI</h3>
        <ul>
          <li>Drone dengan camera</li>
          <li>Computer vision untuk analisis lahan</li>
          <li>Deteksi hama dan penyakit tanaman</li>
        </ul>

        <h2>📝 Tips Memulai Proyek</h2>
        <ol>
          <li><strong>Mulai dari yang sederhana:</strong> Pilih proyek dengan komponen minimal</li>
          <li><strong>Pelajari dasar-dasar:</strong> Pahami setiap komponen sebelum menggabungkannya</li>
          <li><strong>Gunakan prototipe:</strong> Buat MVP (Minimum Viable Product) dulu</li>
          <li><strong>Iterasi dan perbaiki:</strong> Tambahkan fitur secara bertahap</li>
          <li><strong>Dokumentasikan:</strong> Catat proses dan pembelajaran</li>
        </ol>
      `
    },
    {
      id: 'future',
      title: 'Masa Depan IoT & AI',
      icon: 'rocket-outline',
      description: 'Trend dan masa depan teknologi IoT & AI',
      content: `
        <h2>🔮 Trend IoT & AI ke Depan</h2>
        
        <h3>1. Edge AI (AI di Edge)</h3>
        <p>AI akan semakin banyak berjalan di edge devices, bukan hanya di cloud. Ini memberikan:</p>
        <ul>
          <li>Latency lebih rendah (real-time response)</li>
          <li>Privacy lebih baik (data tidak dikirim ke cloud)</li>
          <li>Menghemat bandwidth</li>
          <li>Bekerja offline</li>
        </ul>

        <h3>2. 5G & IoT</h3>
        <p>Dengan 5G, IoT akan memiliki:</p>
        <ul>
          <li>Kecepatan data sangat tinggi</li>
          <li>Latency ultra-low (1ms)</li>
          <li>Konektivitas massal (juta perangkat per km²)</li>
          <li>Mendukung aplikasi real-time seperti autonomous vehicles</li>
        </ul>

        <h3>3. Federated Learning</h3>
        <p>Model AI belajar dari data di perangkat tanpa mengirim data mentah ke cloud.</p>
        <ul>
          <li>Privacy-preserving</li>
          <li>Menghemat bandwidth</li>
          <li>Distributed learning</li>
        </ul>

        <h3>4. Digital Twins</h3>
        <p>Replika digital dari objek fisik yang terus diperbarui dengan data real-time.</p>
        <ul>
          <li>Simulasi dan prediksi</li>
          <li>Optimasi sistem</li>
          <li>Maintenance planning</li>
        </ul>

        <h3>5. AIoT (AI + IoT) Standardization</h3>
        <p>Standar yang lebih baik untuk integrasi AI dan IoT:</p>
        <ul>
          <li>Protocol standar</li>
          <li>Interoperability</li>
          <li>Security standards</li>
        </ul>

        <h2>🌟 Peluang Karir</h2>
        
        <h3>Job Roles:</h3>
        <ul>
          <li><strong>IoT Engineer:</strong> Merancang dan mengimplementasikan sistem IoT</li>
          <li><strong>AI/ML Engineer:</strong> Mengembangkan model machine learning</li>
          <li><strong>Data Scientist:</strong> Menganalisis data dari IoT devices</li>
          <li><strong>Edge AI Engineer:</strong> Mengoptimalkan AI untuk edge devices</li>
          <li><strong>IoT Solutions Architect:</strong> Merancang solusi IoT end-to-end</li>
        </ul>

        <h3>Skills yang Dibutuhkan:</h3>
        <ul>
          <li>Programming (Python, C/C++, JavaScript)</li>
          <li>Machine Learning & Deep Learning</li>
          <li>Embedded Systems</li>
          <li>Cloud Platforms (AWS, GCP, Azure)</li>
          <li>Data Analytics</li>
          <li>Network Protocols (MQTT, HTTP, CoAP)</li>
        </ul>

        <h2>🎯 Kesimpulan</h2>
        <p>IoT dan AI adalah dua teknologi yang saling melengkapi. IoT menghasilkan data, AI menganalisisnya untuk menghasilkan insights dan keputusan. Kombinasi keduanya akan membentuk fondasi untuk teknologi masa depan seperti:</p>
        <ul>
          <li>Smart Cities</li>
          <li>Autonomous Systems</li>
          <li>Personalized Healthcare</li>
          <li>Sustainable Agriculture</li>
          <li>Industrial Automation 4.0</li>
        </ul>
        <p><strong>Mulai belajar sekarang, karena masa depan sudah ada di sini! 🚀</strong></p>
      `
    }
  ];

  constructor() { }

  ngOnInit() {
    // Load completed sections from localStorage
    const saved = localStorage.getItem('iot-ai-completed-sections');
    if (saved) {
      this.completedSections = new Set(JSON.parse(saved));
    }
  }

  selectSection(sectionId: string) {
    this.currentSection = sectionId;
    // Scroll to top
    window.scrollTo(0, 0);
  }

  markComplete(sectionId: string) {
    this.completedSections.add(sectionId);
    localStorage.setItem('iot-ai-completed-sections', JSON.stringify(Array.from(this.completedSections)));
  }

  isCompleted(sectionId: string): boolean {
    return this.completedSections.has(sectionId);
  }

  getCurrentModule(): ModuleSection | undefined {
    return this.modules.find(m => m.id === this.currentSection);
  }

  getCurrentModuleIndex(): number {
    const index = this.modules.findIndex(m => m.id === this.currentSection);
    return index >= 0 ? index + 1 : 0;
  }

  getProgress(): number {
    return Math.round((this.completedSections.size / this.modules.length) * 100);
  }

  navigateModule(direction: number) {
    const currentIndex = this.modules.findIndex(m => m.id === this.currentSection);
    if (currentIndex !== -1) {
      const newIndex = currentIndex + direction;
      if (newIndex >= 0 && newIndex < this.modules.length) {
        this.selectSection(this.modules[newIndex].id);
      }
    }
  }

  backToGrid() {
    this.currentSection = '';
    window.scrollTo(0, 0);
  }
}

