import * as admin from "firebase-admin";

let firebase: admin.app.App;

const paths = [
  "../../../GoogleServices/chalk-firebase-adminsdk.json",
  "/etc/secrets/chalk-firebase-adminsdk.json",
];

const path =
  paths.find((p) => {
    try {
      return require.resolve(p);
    } catch (error) {
      return false;
    }
  }) || "";

if (path) {
  firebase = admin.initializeApp({
    credential: admin.credential.cert(require(path)),
  });
} else {
  throw "Error loading Firebase credentials file.";
}

export default firebase;
