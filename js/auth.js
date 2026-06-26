import { auth, rtdb } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const LOGIN_URL = 'https://login.dasopedia.f5.si';
const EDITOR_ROLES = ['owner', 'admin', 'editor'];

export async function requireEditor(callback) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) { window.location.href = LOGIN_URL; return; }
    const snap = await get(ref(rtdb, `users/${user.uid}`));
    const userData = snap.exists() ? snap.val() : { role: 'viewer' };
    if (!EDITOR_ROLES.includes(userData.role)) {
      window.location.href = 'https://dasopedia.f5.si';
      return;
    }
    if (callback) callback(user, userData);
  });
}

export async function logout() {
  await signOut(auth);
  window.location.href = LOGIN_URL;
}

export { auth };
