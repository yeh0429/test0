# Firebase setup

Google sign-in is implemented with Firebase Authentication. To enable it for your deployment:

1. Create or select a Firebase project and register a **Web app**.
2. In Firebase Console → Authentication → Sign-in method, enable **Google**.
3. In Authentication → Settings → Authorized domains, add `yeh0429.github.io` (and `localhost` for local development).
4. Copy `firebase-config.example.js` to `firebase-config.js` and replace the placeholders with the Web app config from Firebase Console.
5. Deploy the updated files to GitHub Pages. Serve the site over HTTPS or localhost; ES modules and Firebase Auth do not work from `file://`.

Firebase Web API keys identify the Firebase project and are not server secrets; protect your data by configuring appropriate Firebase Security Rules if you later add Firestore or other data services.
