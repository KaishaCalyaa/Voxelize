import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, mergeMap } from 'rxjs';

/**
 * AI Feedback Service untuk Gemini API
 * 
 * CATATAN PENTING: Untuk menggunakan tanpa billing aktif:
 * 1. Dapatkan API key dari Google AI Studio (GRATIS): https://makersuite.google.com/app/apikey
 * 2. API key dari Google AI Studio tidak memerlukan billing account aktif
 * 3. Update GEMINI_API_KEY di bawah dengan API key dari Google AI Studio
 * 
 * Cara mendapatkan API key gratis:
 * - Kunjungi: https://makersuite.google.com/app/apikey
 * - Login dengan akun Google
 * - Klik "Create API Key"
 * - Copy API key dan paste di bawah
 */
@Injectable({
  providedIn: 'root'
})
export class AiFeedbackService {
  private readonly GEMINI_API_KEY = 'AIzaSyAIVTo671VvJeZp9pw2OgddPlxZHuTYdf8';
  
  // Try multiple endpoint formats - prioritizing basic/free models first
  // For Google AI Studio API key, these models should work without billing
  private getGeminiUrl(): string {
    // Try gemini-pro in v1beta (most common for Google AI Studio)
    return `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`;
  }
  
  private getGeminiUrlFallback(): string {
    // Try gemini-1.5-flash (lighter and faster)
    return `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;
  }
  
  private getGeminiUrlV1(): string {
    // Try gemini-pro in v1
    return `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent`;
  }
  
  private getGeminiUrlV2(): string {
    // Try gemini-1.5-pro
    return `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent`;
  }
  
  private getGeminiUrlV3(): string {
    // Try gemini-1.5-flash-latest
    return `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`;
  }
  
  /**
   * Get URL for a specific model name
   * @param modelName Model name like "gemini-pro" or "models/gemini-pro"
   */
  private getModelUrl(modelName: string, useV1: boolean = false): string {
    // Clean model name (remove "models/" prefix if present)
    const cleanModelName = modelName.replace(/^models\//, '');
    const version = useV1 ? 'v1' : 'v1beta';
    return `https://generativelanguage.googleapis.com/${version}/models/${cleanModelName}:generateContent`;
  }

  constructor(private http: HttpClient) {}

  /**
   * List available models for debugging
   * This can help identify which models are available for the API key
   */
  listAvailableModels(): Observable<any> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${this.GEMINI_API_KEY}`;
    console.log('Checking available models...');
    return this.http.get<any>(url).pipe(
      catchError(error => {
        console.error('Error listing models:', error);
        // If listing models fails, return error with helpful message
        if (error?.status === 404 || error?.status === 403) {
          return throwError(() => new Error('Tidak dapat mengakses model Gemini.\n\nSolusi:\n1. Gunakan API key dari Google AI Studio (gratis): https://makersuite.google.com/app/apikey\n2. Pastikan API key valid dan aktif\n3. Pastikan Generative Language API sudah enabled\n4. Pastikan API key tidak memiliki restrictions yang menghalangi akses'));
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Test API connection - call this first to verify API key works
   */
  testApiConnection(): Observable<any> {
    // Try basic gemini-pro model first (usually free tier)
    const testUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${this.GEMINI_API_KEY}`;
    const testBody = {
      contents: [{
        parts: [{
          text: "Hello"
        }]
      }]
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    console.log('Testing API connection with gemini-pro (basic/free model)...');
    return this.http.post<any>(testUrl, testBody, { headers }).pipe(
      catchError(error => {
        console.error('API connection test failed:', error);
        // Try to list models as fallback
        return this.listAvailableModels();
      })
    );
  }

  /**
   * Analyze JSON code and provide feedback
   * @param userCode The JSON code input by user
   * @param expectedCode The correct/expected JSON code
   * @param exerciseQuestion The exercise question/context
   * @returns Observable with AI feedback
   */
  analyzeCode(userCode: string, expectedCode: string, exerciseQuestion: string): Observable<any> {
    const prompt = this.buildPrompt(userCode, expectedCode, exerciseQuestion);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };

    // Try primary URL first
    return this.tryGeminiRequest(this.getGeminiUrl(), body, headers).pipe(
      catchError(error => {
        console.warn('Primary endpoint failed, trying fallback 1...', error?.status);
        // Try fallback 1
        return this.tryGeminiRequest(this.getGeminiUrlFallback(), body, headers).pipe(
          catchError(error2 => {
            console.warn('Fallback 1 failed, trying fallback 2...', error2?.status);
            // Try fallback 2
            return this.tryGeminiRequest(this.getGeminiUrlV1(), body, headers).pipe(
              catchError(error3 => {
                console.warn('Fallback 2 failed, trying fallback 3...', error3?.status);
                // Try fallback 3
                return this.tryGeminiRequest(this.getGeminiUrlV2(), body, headers).pipe(
                  catchError(error4 => {
                    console.warn('Fallback 3 failed, trying fallback 4...', error4?.status);
                    // Try fallback 4
                    return this.tryGeminiRequest(this.getGeminiUrlV3(), body, headers).pipe(
                      catchError(error5 => {
                        console.error('All Gemini endpoints failed. Trying to list available models and use them...');
                        // Try to get available models and use them
                        return this.listAvailableModels().pipe(
                          catchError(listError => {
                            console.error('Failed to list models as well:', listError);
                            return this.handleApiError(error5 || error4 || error3 || error2 || error);
                          }),
                          // If list models succeeds, try using available models
                          mergeMap((modelsResponse: any) => {
                            if (modelsResponse?.models && Array.isArray(modelsResponse.models)) {
                              const availableModels = modelsResponse.models
                                .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
                                .map((m: any) => m.name)
                                .slice(0, 5); // Try first 5 available models
                              
                              console.log('Found available models, trying to use them:', availableModels);
                              
                              if (availableModels.length > 0) {
                                // Try using first available model
                                const modelUrl = this.getModelUrl(availableModels[0]);
                                return this.tryGeminiRequest(modelUrl, body, headers).pipe(
                                  catchError(() => {
                                    // If first model fails, return the list models response for display
                                    return throwError(() => new Error(`Semua model yang dicoba gagal. Model yang tersedia: ${availableModels.join(', ')}. Pastikan API key dari Google AI Studio valid dan aktif.`));
                                  })
                                );
                              }
                            }
                            // If no models found, return error
                            return throwError(() => new Error('Tidak ada model yang tersedia untuk generateContent. Pastikan API key dari Google AI Studio valid.'));
                          })
                        );
                      })
                    );
                  })
                );
              })
            );
          })
        );
      })
    );
  }
  
  private tryGeminiRequest(url: string, body: any, headers: HttpHeaders): Observable<any> {
    // Handle URL that might already have key parameter
    let fullUrl: string;
    if (url.includes('?key=')) {
      fullUrl = url;
    } else {
      fullUrl = `${url}?key=${this.GEMINI_API_KEY}`;
    }
    
    console.log('Trying Gemini API URL:', fullUrl.replace(this.GEMINI_API_KEY, 'API_KEY_HIDDEN'));
    console.log('Request body:', JSON.stringify(body).substring(0, 200) + '...');
    
    return this.http.post<any>(fullUrl, body, { headers }).pipe(
      catchError(error => {
        console.error(`Request failed for ${url}:`, {
          status: error.status,
          statusText: error.statusText,
          error: error.error
        });
        return throwError(() => error);
      })
    );
  }
  
  private handleApiError(error: any): Observable<never> {
    const status = error?.status || error?.error?.code || 'unknown';
    const errorMessage = error?.error?.message || error?.message || '';
    const detailedError = error?.error?.error?.message || errorMessage;
    
    console.error('API Error Details:', {
      status,
      statusText: error?.statusText,
      error: error?.error,
      message: errorMessage
    });
    
    if (status === 404) {
      return throwError(() => new Error(`Model Gemini tidak ditemukan atau tidak tersedia (404).\n\n${detailedError || ''}\n\nSolusi:\n1. Pastikan API key valid (dari Google AI Studio: https://makersuite.google.com/app/apikey)\n2. Pastikan Generative Language API sudah enabled\n3. Coba gunakan API key dari Google AI Studio untuk akses gratis\n4. Periksa apakah model yang digunakan tersedia untuk API key ini`));
    } else if (status === 403) {
      return throwError(() => new Error(`API key tidak memiliki izin akses (403).\n\nSolusi:\n1. Pastikan API key benar dan aktif\n2. Gunakan API key dari Google AI Studio untuk akses gratis\n3. Pastikan API key tidak memiliki restrictions yang menghalangi akses\n4. Cek di Google AI Studio: https://makersuite.google.com/app/apikey`));
    } else if (status === 400) {
      return throwError(() => new Error(`Request tidak valid (400). ${detailedError || errorMessage}\n\nPeriksa format request atau coba lagi.`));
    } else if (status === 429) {
      return throwError(() => new Error('Terlalu banyak request (429). Silakan tunggu sebentar dan coba lagi.'));
    }
    return throwError(() => new Error(`Gagal mendapatkan feedback dari AI. Status: ${status}. ${errorMessage || 'Silakan coba lagi nanti.'}`));
  }

  /**
   * Get AI tips for learning
   * @param topic The learning topic or concept
   * @param userLevel Current understanding level based on exercises
   * @returns Observable with AI tips
   */
  getLearningTips(topic: string, userLevel: string): Observable<any> {
    const prompt = `Kamu adalah tutor coding yang baik dan sabar. Berikan tips belajar yang praktis dan mudah dipahami tentang "${topic}" untuk pemula yang level pemahamannya "${userLevel}". 
    
Berikan 3-5 tips singkat dan actionable dalam bahasa Indonesia. Format: list dengan bullet points.`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };

    // Try primary URL first
    return this.tryGeminiRequest(this.getGeminiUrl(), body, headers).pipe(
      catchError(error => {
        console.warn('Primary endpoint failed, trying fallback 1...', error?.status);
        // Try fallback 1
        return this.tryGeminiRequest(this.getGeminiUrlFallback(), body, headers).pipe(
          catchError(error2 => {
            console.warn('Fallback 1 failed, trying fallback 2...', error2?.status);
            // Try fallback 2
            return this.tryGeminiRequest(this.getGeminiUrlV1(), body, headers).pipe(
              catchError(error3 => {
                console.warn('Fallback 2 failed, trying fallback 3...', error3?.status);
                // Try fallback 3
                return this.tryGeminiRequest(this.getGeminiUrlV2(), body, headers).pipe(
                  catchError(error4 => {
                    console.warn('Fallback 3 failed, trying fallback 4...', error4?.status);
                    // Try fallback 4
                    return this.tryGeminiRequest(this.getGeminiUrlV3(), body, headers).pipe(
                      catchError(error5 => {
                        console.error('All Gemini endpoints failed. Trying to list available models and use them...');
                        // Try to get available models and use them
                        return this.listAvailableModels().pipe(
                          catchError(listError => {
                            console.error('Failed to list models as well:', listError);
                            return this.handleApiError(error5 || error4 || error3 || error2 || error);
                          }),
                          // If list models succeeds, try using available models
                          mergeMap((modelsResponse: any) => {
                            if (modelsResponse?.models && Array.isArray(modelsResponse.models)) {
                              const availableModels = modelsResponse.models
                                .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
                                .map((m: any) => m.name)
                                .slice(0, 5); // Try first 5 available models
                              
                              console.log('Found available models, trying to use them:', availableModels);
                              
                              if (availableModels.length > 0) {
                                // Try using first available model
                                const modelUrl = this.getModelUrl(availableModels[0]);
                                return this.tryGeminiRequest(modelUrl, body, headers).pipe(
                                  catchError(() => {
                                    // If first model fails, return the list models response for display
                                    return throwError(() => new Error(`Semua model yang dicoba gagal. Model yang tersedia: ${availableModels.join(', ')}. Pastikan API key dari Google AI Studio valid dan aktif.`));
                                  })
                                );
                              }
                            }
                            // If no models found, return error
                            return throwError(() => new Error('Tidak ada model yang tersedia untuk generateContent. Pastikan API key dari Google AI Studio valid.'));
                          })
                        );
                      })
                    );
                  })
                );
              })
            );
          })
        );
      })
    );
  }

  /**
   * Build prompt for code analysis
   */
  private buildPrompt(userCode: string, expectedCode: string, exerciseQuestion: string): string {
    return `Kamu adalah tutor coding JSON yang baik dan sabar. Analisis kode JSON berikut dan berikan feedback yang membantu untuk pembelajaran.

Konteks Latihan:
${exerciseQuestion}

Kode yang user input:
${userCode}

Kode yang benar/expected:
${expectedCode}

Tugas kamu:
1. Analisis kode user dan bandingkan dengan kode yang benar
2. Jika salah, jelaskan kesalahan dengan detail dan mudah dipahami
3. Berikan tips spesifik untuk memperbaiki kesalahan
4. Jika hampir benar, berikan apresiasi dan tunjukkan sedikit perbaikan yang dibutuhkan
5. Jika benar, berikan pujian dan penjelasan kenapa kodenya benar

Format respon dalam bahasa Indonesia:
- Gunakan bahasa yang ramah dan mendidik
- Fokus pada pembelajaran, bukan hanya menunjukkan kesalahan
- Berikan contoh jika perlu
- Maksimal 150 kata

Mulai analisis:`;
  }

  /**
   * Extract text from Gemini API response
   */
  extractResponse(response: any): string {
    try {
      // Handle generateContent response format
      if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return response.candidates[0].content.parts[0].text;
      }
      
      // Alternative format check
      if (response?.candidates?.[0]?.text) {
        return response.candidates[0].text;
      }
      
      // Handle list models response format (for debugging)
      if (response?.models && Array.isArray(response.models)) {
        const availableModels = response.models
          .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
          .map((m: any) => m.name)
          .slice(0, 10);
        
        console.log('Available models with generateContent support:', availableModels);
        
        return `Model Gemini tersedia, tapi endpoint generateContent tidak dapat diakses.\n\n` +
               `Model yang tersedia:\n${availableModels.join('\n')}\n\n` +
               `Solusi:\n` +
               `1. Pastikan menggunakan API key dari Google AI Studio (gratis tanpa billing):\n` +
               `   https://makersuite.google.com/app/apikey\n` +
               `2. Pastikan Generative Language API sudah enabled\n` +
               `3. Coba gunakan API key yang berbeda dari Google AI Studio\n` +
               `4. Periksa apakah ada error spesifik di console browser`;
      }
      
      // If no text found, return error message
      console.warn('Unexpected API response format:', response);
      return 'Tidak dapat memproses respon AI. Format response tidak dikenali.';
    } catch (error) {
      console.error('Error extracting AI response:', error);
      return 'Terjadi kesalahan saat memproses feedback AI.';
    }
  }
}

