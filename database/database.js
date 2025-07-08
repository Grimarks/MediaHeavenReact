// database.js (ES Modules, JSON via fs)
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Mengakali __dirname di ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load firebase-admin.json secara manual
const serviceAccount = JSON.parse(
    fs.readFileSync(path.join(__dirname, "firebase-admin.json"), "utf8")
);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();
export { db };
export default db;
