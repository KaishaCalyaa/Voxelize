import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AnimationPatternService } from '../services/animation-pattern.service';
import { AiFeedbackService } from '../services/ai-feedback.service';

interface Exercise {
  question: string;
  hint?: string;
  expectedAnswer: string;
  points: number;
  explanation?: string;
}

interface LearningStep {
  title: string;
  content: string;
  code?: string;
  example?: string;
  icon: string;
  tips?: string[];
  visualExample?: {
    description: string;
    before?: string;
    after?: string;
  };
  exercise?: Exercise;
}

@Component({
  selector: 'app-learning',
  templateUrl: './learning.page.html',
  styleUrls: ['./learning.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class LearningPage implements OnInit {
  currentStep: number = 0;
  learningSteps: LearningStep[] = [];
  patterns: any[] = [];
  
  // Exercise state
  exerciseAnswers: { [stepIndex: number]: string } = {};
  exerciseResults: { [stepIndex: number]: { correct: boolean; score: number } } = {};
  totalScore: number = 0;
  maxScore: number = 0;
  canCopyPaste: boolean = false;
  minScoreToUnlock: number = 60; // Minimal 60% untuk unlock copy-paste

  // AI Feedback state
  aiFeedback: { [stepIndex: number]: string } = {};
  aiLoading: { [stepIndex: number]: boolean } = {};

  constructor(
    private animationPatternService: AnimationPatternService,
    private toastController: ToastController,
    private aiFeedbackService: AiFeedbackService
  ) {}

  ngOnInit() {
    this.loadPatterns();
    this.initializeLearningSteps();
    this.loadExerciseProgress();
    this.calculateMaxScore();
    this.checkUnlockStatus();
  }

  loadPatterns() {
    const patterns = this.animationPatternService.getPatterns();
    this.patterns = patterns.map(p => ({
      id: p.id,
      name: p.name,
      jsonCode: p.jsonCode,
      animNumber: p.animNumber
    }));
  }

  initializeLearningSteps() {
    this.learningSteps = [
      {
        title: 'Selamat Datang! 🎓',
        content: 'Halo! Selamat datang di panduan pembelajaran coding untuk VOXELIZE LED Matrix. Di sini kamu akan belajar bagaimana menggunakan kode JSON untuk mengontrol animasi LED. Mari kita mulai!',
        icon: 'rocket-outline',
        tips: [
          'Ikuti setiap langkah dengan teliti',
          'Jangan terburu-buru, pahami setiap konsep',
          'Coba praktikkan langsung setelah mempelajari'
        ]
      },
      {
        title: 'Apa itu JSON? 📝',
        content: 'JSON (JavaScript Object Notation) adalah format data yang mudah dibaca manusia dan mudah diproses oleh komputer. JSON menggunakan struktur key-value pairs (pasangan kunci-nilai).\n\nBayangkan JSON seperti formulir yang memiliki kolom dan isinya. Setiap "key" adalah nama kolom, dan "value" adalah isinya.',
        code: `{
  "nama": "Budi",
  "umur": 20,
  "aktif": true
}`,
        example: 'Contoh sederhana struktur JSON',
        icon: 'document-text-outline',
        tips: [
          'JSON selalu dimulai dengan { dan diakhiri dengan }',
          'Setiap field dipisahkan dengan koma (,)',
          'Nilai teks harus dalam tanda kutip ganda (")',
          'Nilai angka dan boolean tidak perlu tanda kutip'
        ],
        visualExample: {
          description: 'Struktur dasar JSON',
          before: 'Formulir biasa',
          after: 'Format JSON'
        }
      },
      {
        title: 'Struktur Kode JSON untuk Animasi 🎬',
        content: 'Untuk memainkan animasi di VOXELIZE, kamu perlu menggunakan kode JSON dengan struktur khusus. Setiap animasi memiliki kode JSON unik yang harus kamu input dengan benar.\n\nKode JSON animasi memiliki 3 bagian penting:',
        code: `{
  "animation": 1,              ← Nomor animasi
  "type": "diagonal-bounce",   ← Jenis/ID animasi
  "version": "1.0"             ← Versi kode
}`,
        example: 'Format standar kode JSON untuk semua animasi',
        icon: 'code-outline',
        tips: [
          'Field "animation" adalah nomor 1-10',
          'Field "type" harus sesuai dengan ID animasi',
          'Field "version" biasanya "1.0"',
          'Semua field WAJIB ada dan harus sesuai'
        ]
      },
      {
        title: 'Memahami Setiap Field 🔍',
        content: 'Mari kita pelajari setiap field dalam kode JSON animasi secara detail:',
        code: `{
  "animation": 1,
  //   ↑
  //   Nomor animasi (1-10)
  //   Setiap animasi punya nomor unik
  
  "type": "diagonal-bounce",
  //   ↑
  //   ID animasi dalam format teks
  //   Harus sesuai dengan animasi yang dipilih
  
  "version": "1.0"
  //   ↑
  //   Versi kode JSON
  //   Saat ini menggunakan versi 1.0
}`,
        icon: 'list-outline',
        tips: [
          'animation = 1 untuk Diagonal Bounce',
          'animation = 2 untuk Box Rotate',
          'animation = 3 untuk Wave',
          'Dan seterusnya...'
        ],
        exercise: {
          question: 'Latihan 1: Buat kode JSON untuk animasi "Box Rotate". Field "animation" harus bernilai 2 dan "type" harus "box-rotate".',
          hint: 'Ingat: field "version" selalu "1.0", gunakan tanda kutip untuk string',
          expectedAnswer: '{"animation":2,"type":"box-rotate","version":"1.0"}',
          points: 15,
          explanation: 'Benar! Kode JSON untuk Box Rotate menggunakan animation: 2 dan type: "box-rotate".'
        }
      },
      {
        title: 'Cara Membaca Kode JSON 📖',
        content: 'Membaca kode JSON itu mudah! Ikuti aturan berikut:',
        code: `{
  "animation": 1,           ← Angka (integer)
  "type": "diagonal-bounce", ← Teks (string)
  "version": "1.0"          ← Teks (string)
}`,
        icon: 'book-outline',
        tips: [
          '{ } = Tanda kurung kurawal membuka dan menutup',
          '" " = Tanda kutip untuk nilai teks',
          ': = Titik dua memisahkan key dan value',
          ', = Koma memisahkan field',
          'Tidak ada koma di field terakhir!'
        ],
        visualExample: {
          description: 'Komponen dalam JSON',
          before: 'Struktur sederhana',
          after: 'Dengan penjelasan detail'
        },
        exercise: {
          question: 'Latihan 2: Buat kode JSON untuk animasi "Wave". Nomor animasinya adalah 3.',
          hint: 'Pastikan semua field ada: animation, type, dan version',
          expectedAnswer: '{"animation":3,"type":"wave","version":"1.0"}',
          points: 15,
          explanation: 'Bagus! Kamu sudah memahami struktur JSON dengan baik.'
        }
      },
      {
        title: 'Praktik: Cara Menggunakan Kode 🎯',
        content: 'Sekarang mari kita praktikkan! Ikuti langkah-langkah berikut:',
        icon: 'play-circle-outline',
        tips: [
          'Langkah 1: Pilih animasi yang ingin kamu mainkan',
          'Langkah 2: Modal akan muncul - ini normal!',
          'Langkah 3: Copy kode JSON yang sesuai (lihat daftar di bawah)',
          'Langkah 4: Paste atau ketik kode JSON di textarea',
          'Langkah 5: Klik tombol "Validasi Kode JSON"',
          'Langkah 6: Jika benar, animasi akan langsung diputar!'
        ]
      },
      {
        title: 'Contoh: Diagonal Bounce 🎨',
        content: 'Mari lihat contoh lengkap untuk animasi Diagonal Bounce:',
        code: `{
  "animation": 1,
  "type": "diagonal-bounce",
  "version": "1.0"
}`,
        example: 'Kode ini digunakan saat kamu memilih animasi "Diagonal Bounce"',
        icon: 'color-palette-outline',
        tips: [
          'Nomor animation harus 1',
          'Type harus "diagonal-bounce" (huruf kecil, pakai dash)',
          'Version harus "1.0"',
          'Copy kode ini persis seperti yang tertulis!'
        ],
        exercise: {
          question: 'Latihan 3: Buat kode JSON untuk animasi "Heartbeat". Nomor animasinya adalah 4.',
          hint: 'Type untuk Heartbeat adalah "heartbeat" (huruf kecil, tanpa spasi)',
          expectedAnswer: '{"animation":4,"type":"heartbeat","version":"1.0"}',
          points: 20,
          explanation: 'Sempurna! Kamu sudah menguasai pola pembuatan kode JSON animasi.'
        }
      },
      {
        title: 'Kesalahan Umum ❌',
        content: 'Hindari kesalahan-kesalahan berikut:',
        code: `❌ SALAH:
{
  "animation": 1,
  "type": "Diagonal Bounce"  ← Jangan pakai spasi
}

✅ BENAR:
{
  "animation": 1,
  "type": "diagonal-bounce"  ← Pakai dash (-)
}`,
        icon: 'alert-circle-outline',
        tips: [
          'Jangan gunakan spasi di field "type"',
          'Gunakan dash (-) untuk memisahkan kata',
          'Semua huruf kecil (lowercase)',
          'Jangan lupa tanda kutip untuk string',
          'Pastikan tanda kurung dan koma benar'
        ],
        exercise: {
          question: 'Latihan 4: Buat kode JSON untuk animasi "Border Chase" (nomor 9). Hati-hati dengan kesalahan umum!',
          hint: 'Type harus "border-chase" dengan dash, bukan spasi. Semua huruf kecil!',
          expectedAnswer: '{"animation":9,"type":"border-chase","version":"1.0"}',
          points: 20,
          explanation: 'Luar biasa! Kamu sudah memahami dan menghindari kesalahan umum.'
        }
      },
      {
        title: 'Tips & Trik Ahli 🚀',
        content: 'Tips untuk menjadi ahli menggunakan kode JSON:',
        icon: 'bulb-outline',
        tips: [
          '✅ Selalu copy kode JSON yang tepat untuk animasi yang dipilih',
          '✅ Periksa kembali sebelum klik validasi',
          '✅ Jika error, cek tanda kutip, koma, dan kurung kurawal',
          '✅ Gunakan fitur copy di halaman ini untuk memudahkan',
          '✅ Latih dengan berbagai animasi untuk lebih paham',
          '✅ Pelajari pola - setiap animasi mengikuti format yang sama'
        ]
      }
    ];
  }

  nextStep() {
    if (this.currentStep < this.learningSteps.length - 1) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  goToStep(index: number) {
    this.currentStep = index;
  }

  get currentStepData(): LearningStep {
    return this.learningSteps[this.currentStep];
  }

  get isFirstStep(): boolean {
    return this.currentStep === 0;
  }

  get isLastStep(): boolean {
    return this.currentStep === this.learningSteps.length - 1;
  }

  get progress(): number {
    return ((this.currentStep + 1) / this.learningSteps.length) * 100;
  }

  async copyToClipboard(text: string) {
    if (!this.canCopyPaste) {
      await this.showToast('Selesaikan semua latihan terlebih dahulu untuk unlock fitur copy-paste!', 'warning');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(text);
      await this.showToast('Kode berhasil disalin ke clipboard!', 'success');
    } catch (error) {
      console.error('Failed to copy:', error);
      await this.showToast('Gagal menyalin kode', 'warning');
    }
  }

  // Exercise methods
  getExerciseAnswer(stepIndex: number): string {
    return this.exerciseAnswers[stepIndex] || '';
  }

  setExerciseAnswer(stepIndex: number, answer: string) {
    this.exerciseAnswers[stepIndex] = answer;
    this.saveExerciseProgress();
  }

  validateExercise(stepIndex: number): boolean {
    const step = this.learningSteps[stepIndex];
    if (!step.exercise) return false;

    const userAnswer = this.exerciseAnswers[stepIndex]?.trim();
    if (!userAnswer) return false;

    // Normalize JSON for comparison
    const normalizeJson = (jsonStr: string): string => {
      try {
        const parsed = JSON.parse(jsonStr);
        return JSON.stringify(parsed);
      } catch {
        return jsonStr;
      }
    };

    const normalizedUser = normalizeJson(userAnswer);
    const normalizedExpected = normalizeJson(step.exercise.expectedAnswer);

    const isCorrect = normalizedUser === normalizedExpected;
    
    if (isCorrect && !this.exerciseResults[stepIndex]) {
      this.exerciseResults[stepIndex] = {
        correct: true,
        score: step.exercise.points
      };
      this.totalScore += step.exercise.points;
      this.saveExerciseProgress();
      this.checkUnlockStatus();
    } else if (!isCorrect && !this.exerciseResults[stepIndex]) {
      this.exerciseResults[stepIndex] = {
        correct: false,
        score: 0
      };
      this.saveExerciseProgress();
    }

    return isCorrect;
  }

  async submitExercise(stepIndex: number) {
    const isValid = this.validateExercise(stepIndex);
    const step = this.learningSteps[stepIndex];
    
    if (isValid) {
      this.showToast(`✅ Benar! Kamu mendapat ${step.exercise!.points} poin. ${step.exercise!.explanation || ''}`, 'success');
    } else {
      // Get AI feedback when answer is wrong
      await this.getAiFeedback(stepIndex);
      this.showToast('❌ Belum tepat. Lihat feedback AI di bawah untuk tips!', 'danger');
    }
  }

  async getAiFeedback(stepIndex: number) {
    const step = this.learningSteps[stepIndex];
    if (!step.exercise) return;

    const userAnswer = this.exerciseAnswers[stepIndex]?.trim();
    if (!userAnswer) {
      this.showToast('Masukkan jawaban terlebih dahulu', 'warning');
      return;
    }

    this.aiLoading[stepIndex] = true;

    try {
      const response = await firstValueFrom(
        this.aiFeedbackService.analyzeCode(
          userAnswer,
          step.exercise.expectedAnswer,
          step.exercise.question
        )
      );

      const feedback = this.aiFeedbackService.extractResponse(response);
      this.aiFeedback[stepIndex] = feedback;
    } catch (error: any) {
      console.error('AI Feedback Error:', error);
      const errorMessage = error?.message || 'Tidak diketahui';
      
      // Show detailed error message
      let userMessage = 'Maaf, tidak dapat mendapatkan feedback AI saat ini.\n\n';
      
      if (errorMessage.includes('404') || errorMessage.includes('tidak ditemukan')) {
        userMessage += 'Kemungkinan masalah:\n';
        userMessage += '1. API key tidak memiliki akses ke Gemini API\n';
        userMessage += '2. Gemini API belum diaktifkan di Google Cloud Console\n';
        userMessage += '3. Model Gemini tidak tersedia untuk API key ini\n\n';
        userMessage += 'Solusi: Aktifkan Gemini API di Google Cloud Console untuk project yang menggunakan API key ini.';
      } else if (errorMessage.includes('403') || errorMessage.includes('izin')) {
        userMessage += 'API key tidak memiliki izin akses. Pastikan API key memiliki akses ke Gemini API.';
      } else {
        userMessage += 'Silakan coba lagi atau periksa koneksi internet.';
      }
      
      this.aiFeedback[stepIndex] = userMessage;
      this.showToast('Gagal mendapatkan feedback AI. Lihat pesan detail di bawah.', 'warning');
    } finally {
      this.aiLoading[stepIndex] = false;
    }
  }

  async getLearningTips(stepIndex: number) {
    const step = this.learningSteps[stepIndex];
    const topic = step.title;
    const userLevel = this.getScorePercentage() >= 70 ? 'sedang' : this.getScorePercentage() >= 40 ? 'pemula menengah' : 'pemula';

    this.aiLoading[stepIndex] = true;

    try {
      const response = await firstValueFrom(
        this.aiFeedbackService.getLearningTips(topic, userLevel)
      );
      const tips = this.aiFeedbackService.extractResponse(response);
      
      // Store tips in feedback for display
      if (!this.aiFeedback[stepIndex]) {
        this.aiFeedback[stepIndex] = `💡 Tips Belajar:\n\n${tips}`;
      } else {
        this.aiFeedback[stepIndex] = `${this.aiFeedback[stepIndex]}\n\n---\n\n💡 Tips Belajar:\n\n${tips}`;
      }
      
      this.showToast('Tips AI berhasil dimuat!', 'success');
    } catch (error: any) {
      console.error('AI Tips Error:', error);
      const errorMessage = error?.message || 'Tidak diketahui';
      
      let userMessage = 'Maaf, tidak dapat mendapatkan tips AI saat ini.\n\n';
      
      if (errorMessage.includes('404') || errorMessage.includes('tidak ditemukan')) {
        userMessage += '⚠️ API Gemini tidak tersedia.\n\n';
        userMessage += 'Kemungkinan masalah:\n';
        userMessage += '• Gemini API belum diaktifkan di Google Cloud Console\n';
        userMessage += '• API key tidak memiliki akses ke Gemini API\n\n';
        userMessage += '💡 Untuk mengaktifkan Gemini API:\n';
        userMessage += '1. Buka Google Cloud Console\n';
        userMessage += '2. Pilih project yang menggunakan API key ini\n';
        userMessage += '3. Aktifkan "Generative Language API"\n';
        userMessage += '4. Pastikan API key memiliki akses ke API tersebut';
      } else {
        userMessage += 'Silakan coba lagi nanti.';
      }
      
      if (!this.aiFeedback[stepIndex]) {
        this.aiFeedback[stepIndex] = userMessage;
      } else {
        this.aiFeedback[stepIndex] = `${this.aiFeedback[stepIndex]}\n\n---\n\n${userMessage}`;
      }
      
      this.showToast('Gagal mendapatkan tips AI. Lihat detail di bawah.', 'warning');
    } finally {
      this.aiLoading[stepIndex] = false;
    }
  }

  hasAiFeedback(stepIndex: number): boolean {
    return !!this.aiFeedback[stepIndex];
  }

  isLoadingAi(stepIndex: number): boolean {
    return !!this.aiLoading[stepIndex];
  }

  isExerciseCompleted(stepIndex: number): boolean {
    return this.exerciseResults[stepIndex]?.correct === true;
  }

  getExerciseScore(stepIndex: number): number {
    return this.exerciseResults[stepIndex]?.score || 0;
  }

  calculateMaxScore() {
    this.maxScore = this.learningSteps.reduce((total, step) => {
      return total + (step.exercise?.points || 0);
    }, 0);
  }

  getScorePercentage(): number {
    if (this.maxScore === 0) return 0;
    return Math.round((this.totalScore / this.maxScore) * 100);
  }

  checkUnlockStatus() {
    const percentage = this.getScorePercentage();
    this.canCopyPaste = percentage >= this.minScoreToUnlock;
  }

  saveExerciseProgress() {
    localStorage.setItem('learning_exercise_answers', JSON.stringify(this.exerciseAnswers));
    localStorage.setItem('learning_exercise_results', JSON.stringify(this.exerciseResults));
    localStorage.setItem('learning_total_score', this.totalScore.toString());
  }

  loadExerciseProgress() {
    const savedAnswers = localStorage.getItem('learning_exercise_answers');
    const savedResults = localStorage.getItem('learning_exercise_results');
    const savedScore = localStorage.getItem('learning_total_score');

    if (savedAnswers) {
      try {
        this.exerciseAnswers = JSON.parse(savedAnswers);
      } catch (e) {
        console.error('Error parsing saved answers:', e);
      }
    }
    if (savedResults) {
      try {
        this.exerciseResults = JSON.parse(savedResults);
      } catch (e) {
        console.error('Error parsing saved results:', e);
      }
    }
    if (savedScore) {
      try {
        this.totalScore = parseInt(savedScore, 10);
      } catch (e) {
        console.error('Error parsing saved score:', e);
        this.totalScore = 0;
      }
    }
  }

  resetExercises() {
    this.exerciseAnswers = {};
    this.exerciseResults = {};
    this.totalScore = 0;
    this.canCopyPaste = false;
    localStorage.removeItem('learning_exercise_answers');
    localStorage.removeItem('learning_exercise_results');
    localStorage.removeItem('learning_total_score');
    this.showToast('Latihan telah direset', 'success');
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color,
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

