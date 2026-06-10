// ============================================================
// GANTI dengan konfigurasi Firebase kamu!
// Cara dapat config: Firebase Console → Project Settings → Your Apps
// ============================================================
const firebaseConfig = {
    apiKey: "AIzaSyAiQExK8VQTmBfhtCUnd4e2BnOoWaKk3hA",
    authDomain: "ixcpb-26d18.firebaseapp.com",
    projectId: "ixcpb-26d18",
    messagingSenderId: "416132545026",
    appId: "1:416132545026:web:82e2becb127421db60451b"
    measurementId: "G-KJ6Z1LFKLX"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
