import { Injectable } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = new BehaviorSubject<FirebaseUser | null>(null);
  user$ = this.user.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    this.auth.onAuthStateChanged((user: FirebaseUser | null) => {
      this.user.next(user);
    });
  }

  async register(email: string, password: string, name: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      // Update the user's display name
      await this.createUserDocument(userCredential.user, name);
      // The auth state change listener will automatically update the user
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw { code: 'auth/account-not-registered', message: 'Email belum terdaftar' };
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        throw { code: 'auth/wrong-credentials', message: 'Email atau password salah' };
      } else if (error.code === 'auth/too-many-requests') {
        throw { code: 'auth/too-many-requests', message: 'Terlalu banyak percobaan. Silakan coba lagi nanti.' };
      }
      throw error;
    }
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  private async createUserDocument(user: FirebaseUser, name: string, photoURL: string = '') {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: name,
      photoURL: photoURL || user.photoURL || '',
      createdAt: new Date(),
      lastLoginAt: new Date()
    });
  }

  get isAuthenticated$() {
    return new Promise<boolean>((resolve) => {
      this.auth.onAuthStateChanged((user: FirebaseUser | null) => {
        resolve(!!user);
      });
    });
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      
      // Set custom parameters for faster sign-in
      provider.setCustomParameters({
        prompt: 'select_account'  // Always show account picker for faster selection
      });
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign in timed out. Please try again.')), 30000)
      );
      
      // Race between sign-in and timeout
      const result = await Promise.race([
        signInWithPopup(this.auth, provider),
        timeoutPromise
      ]) as UserCredential;
      
      // Process user data in the background
      this.createUserDocument(
        result.user,
        result.user.displayName || 'Google User',
        result.user.photoURL || ''
      ).catch(e => console.error('Background user doc update failed:', e));
      
      return result.user;
    } catch (error: unknown) {
      console.error('Error signing in with Google:', error);
      
      // Handle different error types
      if (error instanceof Error) {
        if ('code' in error && error.code === 'auth/popup-closed-by-user') {
          throw new Error('Sign in was cancelled');
        } else if (error.message.includes('timed out')) {
          throw new Error('Sign in took too long. Please check your internet connection and try again.');
        }
      }
      
      // For other unknown errors
      throw new Error('An unexpected error occurred during sign in');
    }
  }
}