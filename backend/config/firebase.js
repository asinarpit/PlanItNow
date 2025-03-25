const admin = require("firebase-admin");
// const serviceAccount = require("../config/serviceAccountKey.json"); 

admin.initializeApp({
  credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT_KEY),
});


module.exports = admin;
