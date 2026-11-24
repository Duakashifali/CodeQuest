import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from './firebase';

export async function registerUser(name, email, password) {
  const credential = await createUserWithEmailAndPassword(
    auth, email.trim().toLowerCase(), password
  );
  const user = credential.user;

await setDoc(doc(db, 'users', user.uid), {
  uid: user.uid,
  name: name || user.displayName || 'Learner',
  email: user.email,
  xp: 0,
  streak: 1,
  badges: [],
  done: {},
  onboarded: false,
  createdAt: serverTimestamp()
});

  return user;
}

export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(
    auth, email.trim().toLowerCase(), password
  );
  return credential.user;
}

export async function getUserData(uid) {
  const snapshot = await getDoc(doc(db, 'users', uid));
  return snapshot.exists() ? snapshot.data() : null;
}

export async function saveUserData(uid, data) {
  await setDoc(doc(db, 'users', uid), data, { merge: true });
}

export async function updateUserData(uid, data) {
  await updateDoc(doc(db, 'users', uid), data);
}

export async function logoutUser() {
  await signOut(auth);
}
