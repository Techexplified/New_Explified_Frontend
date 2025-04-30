# 🚀 React + Vite + Firebase Starter

A fast and modern web app starter using [React](https://react.dev/), [Vite](https://vitejs.dev/), and [Firebase](https://firebase.google.com/) for hosting, authentication, and optionally Firestore.

## 📦 Features

- ⚡️ Lightning-fast build with Vite
- 🔥 Firebase Hosting and Authentication
- 📂 Clean project structure
- 🌐 Deployable in one command
- 📱 PWA-ready (optional)

---

## 🧰 Tech Stack

- [React 18+](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Firebase](https://firebase.google.com/)
- [React Router (optional)](https://reactrouter.com/)
- [Tailwind CSS (optional)](https://tailwindcss.com/)

---

## 🛠️ Getting Started

### 1. Clone the repo

```
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Install dependencies

```
npm install
```

### 3. Configure Firebase

- Go to Firebase Console
- Create a new project
- Go to Project Settings > General > Your Apps (</> icon)
- Copy the config and replace in src/firebase.js

```
// src/firebase.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);

export default app;
```

### 4. Run the development server

```
npm run dev
```

# 🚀 Deploy to Firebase

### 1. Install Firebase CLI
```
npm install -g firebase-tools
```

### 2. Login & Initialize
```
firebase login
firebase init
```

### 3. Build and deploy
 - Select: Hosting
 - Use dist as the build folder
 - Choose "Single-page app" if you're using React Router
```
npm run build
firebase deploy
```

# 📁 Project Structure

```
src/
├── assets/         # Static assets
├── components/     # Reusable components
├── pages/          # Page components (if using routing)
├── firebase.js     # Firebase config/init
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```

# 🔒 Optional: Enable Firebase Auth

To use Firebase Authentication:

1. Enable an auth provider in Firebase Console > Authentication > Sign-in method

2. Use the Firebase Auth SDK in your app:

```
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const auth = getAuth();
const provider = new GoogleAuthProvider();

signInWithPopup(auth, provider)
  .then((result) => {
    // User signed in
  })
  .catch((error) => {
    console.error(error);
  });
```

# 💡 Tips
 - Use .env for sensitive config in production builds.
 - Firebase Functions can be added later for backend logic.
 - Use vite-plugin-pwa to add Progressive Web App support.

Made with ❤️ using Vite + Firebase
```
Would you like a TypeScript version or one that includes Firestore setup as well?
```