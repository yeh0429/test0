# Firebase setup

The Daymark project is configured with Firebase Authentication and Google sign-in. Its Firebase web app config is published in `firebase-config.public.js`; Firebase web API keys identify a project and are not server secrets. Do not put service-account keys, OAuth client secrets, or private credentials in browser code.

Google sign-in is enabled for the Firebase project `daymark-ef86c`, and the GitHub Pages domain `yeh0429.github.io` is authorized. The app uses Firebase's modular browser SDK via CDN and `signInWithPopup`.

For local testing, serve this folder from `http://localhost` (not `file://`).
