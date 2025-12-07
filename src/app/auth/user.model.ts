import { User as FirebaseUser } from 'firebase/auth';

export interface User extends FirebaseUser {
  // These properties are already included in FirebaseUser
  // Add any additional user properties you might have below
  // For example:
  // customField?: string;
}
