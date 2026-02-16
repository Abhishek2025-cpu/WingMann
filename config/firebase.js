const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey.json"); // path to your JSON file

// If the private key has \n, replace them properly (sometimes needed)
if (serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };