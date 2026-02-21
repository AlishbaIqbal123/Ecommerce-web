# Firebase Backend Setup Guide - NoorMarket

Follow these steps to fully productionize the backend and connect your local frontend to a real Firebase project.

## 1. Prerequisites
- **Node.js** v18+ installed.
- **Firebase CLI** installed (`npm install -g firebase-tools`).

## 2. Initialize Firebase Project
If you haven't already created a Firebase project:
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project (e.g., "noormarket-prod").
3. Enable **Google Analytics** (optional).

## 3. Login to Firebase CLI
Open your terminal in `c:/Users/Hp/OneDrive/Documents/internee.pk/ecommerce/app` and run:
```bash
firebase login
```
Follow the browser prompts to authenticate.

## 4. Connect Project & Initialize
Run the following command to link your local code to the Firebase project:
```bash
firebase init
```
- **Select Features**: Select **Firestore**, **Storage**, **Emulators** (optional).
- **Select Project**: Choose "Use an existing project" and select the one you created.
- **Firestore Rules**: Press Enter to use `firestore.rules` (already created).
- **Firestore Indexes**: Press Enter to use `firestore.indexes.json` (already created).

## 5. Deploy Rules & Indexes
Push the security rules and indexes to the cloud:
```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## 6. Configure Environment Variables
1. Go to **Project Settings** > **General** in Firebase Console.
2. Scroll to "Your apps" > Click the Web icon (</>).
3. Register the app (e.g., "NoorMarket Web").
4. Copy the `firebaseConfig` object values.
5. Create a `.env` file in the `app` root (if not exists) and populate it:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=https://your_database_url.firebaseio.com
```

## 7. Enable Authentication
1. Go to **Authentication** > **Sign-in method** in Firebase Console.
2. Enable **Email/Password**.
3. Enable **Google** (optional).

## 8. Seed the Database (Important!)
Since your new Firestore database is empty, the app will fallback to mock data initially. To populate it with real data:
1. I have exported a `seedDatabase` function in `src/lib/firebase/firestore.ts`.
2. You can temporarily call this function from `src/main.tsx` or a temporary button to populate `products`, `categories`, and `vendors`.
   - Example: Add `<button onClick={() => seedDatabase()}>Seed DB</button>` temporarily in `App.tsx`.
3. Once seeded, the app will load meaningful data from Firestore.

## 9. Verify
Run the app:
```bash
npm run dev
```
- Open console. 
- If you see "Database empty, falling back to mock data", proceed to seed.
- If you see products without that log, you are successfully pulling from Firestore!

## Troubleshooting "Blank Screen"
- Ensure `.env` variables are correct.
- Check browser console for "Firebase: Error (auth/invalid-api-key)" or similar configuration errors.
- If the screen is blank indefinitely, it means `initializeAuth` in `authStore.ts` is hanging. This usually happens if the Firebase API Key is invalid or network is blocked.
