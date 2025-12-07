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
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
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
      // The auth state change listener will automatically update the user
      return userCredential.user;
    } catch (error) {
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
      const result = await signInWithPopup(this.auth, provider);
      
      // Check if the user is new or existing
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
      
      if (isNewUser) {
        // If it's a new user, create their document in Firestore
        await this.createUserDocument(
          result.user, 
          result.user.displayName || 'Google User',
          result.user.photoURL || ''
        );
      } else {
        // Update last login time for existing users
        const userRef = doc(this.firestore, `users/${result.user.uid}`);
        await setDoc(userRef, {
          lastLoginAt: new Date(),
          photoURL: result.user.photoURL || ''
        }, { merge: true });
      }
      
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }
}