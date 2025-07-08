import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { db } from "../firebase/firebaseConfig.js";
import {
    collection,
    addDoc,
    getDocs,
    where,
    query,
    doc,
    setDoc,
    getDoc,
    deleteDoc,
    orderBy
} from "firebase/firestore";
import bcrypt from "bcryptjs"; // Pastikan Anda menginstal 'bcryptjs' atau 'bcrypt'

const app = express();
const PORT = 5173;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Root
app.get("/", (req, res) => {
    res.send("Welcome to MediaHeaven API!");
});

// --- User Authentication ---

// Register User
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Menggunakan email sebagai ID dokumen untuk memastikan keunikan dan kemudahan pencarian
        // Ini lebih disarankan daripada username karena email harus unik secara global
        const userRef = doc(db, "users", email); // Menggunakan email sebagai doc ID
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return res.status(409).json({ message: "Email already registered." }); // 409 Conflict lebih tepat
        }

        // Opsional: Cek juga username apakah sudah ada jika Anda ingin username juga unik
        const usernameQuery = query(collection(db, "users"), where("username", "==", username));
        const usernameSnapshot = await getDocs(usernameQuery);
        if (!usernameSnapshot.empty) {
            return res.status(409).json({ message: "Username already taken." }); // 409 Conflict
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan data dengan email sebagai ID dokumen, dan username sebagai field di dalam dokumen
        await setDoc(userRef, { username, email, password: hashedPassword });

        res.status(201).json({ message: "Registration successful!", user: { username, email } }); // 201 Created
    } catch (err) {
        console.error("Error registering user:", err);
        // Pastikan respons error selalu JSON
        res.status(500).json({ message: "Internal server error during registration." });
    }
});

// Login User
app.post("/login", async (req, res) => {
    const { username, password } = req.body; // Menerima username (atau email)

    if (!username || !password) {
        return res.status(400).json({ message: "Username/Email and password are required." }); // Konsisten JSON
    }

    try {
        // Coba cari berdasarkan email dulu, atau username jika email tidak ditemukan
        let userDoc;
        let userData;

        // Asumsi username bisa berupa username atau email saat login
        // Jika username adalah format email, coba cari berdasarkan email
        if (username.includes('@')) {
            const userRef = doc(db, "users", username); // Coba cari dengan email sebagai ID dokumen
            userDoc = await getDoc(userRef);
        }

        // Jika tidak ditemukan sebagai email ID, atau jika input adalah username, cari berdasarkan field 'username'
        if (!userDoc || !userDoc.exists) {
            const userQuery = query(collection(db, "users"), where("username", "==", username));
            const userSnapshot = await getDocs(userQuery);
            if (!userSnapshot.empty) {
                userDoc = userSnapshot.docs[0]; // Ambil dokumen pertama jika ada
            }
        }

        if (!userDoc || !userDoc.exists) {
            return res.status(401).json({ message: "Invalid username/email or password." }); // Konsisten JSON
        }

        userData = userDoc.data();
        const isPasswordValid = await bcrypt.compare(password, userData.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username/email or password." }); // Konsisten JSON
        }

        res.status(200).json({ message: "Login successful", user: { username: userData.username, email: userData.email } });
    } catch (error) {
        console.error("Error logging in:", error);
        // Pastikan respons error selalu JSON
        res.status(500).json({ message: "Internal server error during login." });
    }
});

// --- Wishlist Management ---

// Add to Wishlist
app.post("/add-to-wishlist", async (req, res) => {
    const { id_movie, username } = req.body;

    if (!id_movie || !username) {
        return res.status(400).json({ message: "Movie ID and Username are required." });
    }

    try {
        // Disarankan untuk menggunakan ID dokumen yang lebih kuat, misal menggabungkan username dan id_movie
        // atau menggunakan ID unik Firestore yang dihasilkan otomatis dan membuat query filter
        const wishlistDocId = `${username}_${id_movie}`; // Contoh ID unik
        const wishlistRef = doc(db, "wishlist", wishlistDocId);
        const wishlistDoc = await getDoc(wishlistRef);

        if (wishlistDoc.exists()) {
            return res.status(409).json({ message: "Movie already in wishlist." }); // 409 Conflict
        }

        await setDoc(wishlistRef, { id_movie, username, addedAt: new Date() }); // Tambahkan timestamp
        res.status(201).json({ message: "Movie successfully added to wishlist!" }); // 201 Created
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({ message: "Internal server error while adding to wishlist." });
    }
});

// Get Wishlist
app.get("/wishlist", async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ message: "Username is required." }); // Konsisten JSON
    }

    try {
        const q = query(
            collection(db, "wishlist"),
            where("username", "==", username),
            orderBy("addedAt", "desc") // Urutkan berdasarkan waktu penambahan terbaru
        );
        const wishlistSnapshot = await getDocs(q);

        if (wishlistSnapshot.empty) {
            return res.status(200).json([]); // Mengembalikan array kosong dengan status 200 jika tidak ada
        }

        const wishlist = wishlistSnapshot.docs.map((doc) => ({
            id: doc.id, // Sertakan ID dokumen Firestore jika perlu di frontend
            ...doc.data(),
        }));
        res.json(wishlist); // Status 200 OK secara default
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ message: "Internal server error while fetching wishlist." });
    }
});

// Remove from Wishlist
app.delete("/wishlist", async (req, res) => {
    const { id_movie, username } = req.body;

    if (!id_movie || !username) {
        return res.status(400).json({ message: "Movie ID and Username are required." }); // Konsisten JSON
    }

    try {
        const wishlistDocId = `${username}_${id_movie}`; // Gunakan ID yang sama saat menambahkan
        const wishlistRef = doc(db, "wishlist", wishlistDocId);
        const wishlistDoc = await getDoc(wishlistRef); // Cek keberadaan

        if (!wishlistDoc.exists()) {
            // Ini bisa jadi 200 OK dengan pesan bahwa tidak ada yang perlu dihapus,
            // atau 404 Not Found jika Anda ingin strict
            return res.status(404).json({ message: "Movie not found in wishlist." });
        }

        await deleteDoc(wishlistRef);
        res.status(200).json({ message: "Movie removed from wishlist!" });
    } catch (error) {
        console.error("Error removing movie from wishlist:", error);
        res.status(500).json({ message: "Internal server error while removing from wishlist." });
    }
});

// --- Community Posts ---

// Add Post to Community
app.post("/addPost", async (req, res) => {
    const { comment, username } = req.body; // Asumsi ada username juga yang dikirim

    if (!comment || comment.trim() === "") {
        return res.status(400).json({ message: "Comment cannot be empty." }); // Konsisten JSON
    }
    // Opsional: Validasi username jika itu field wajib untuk setiap post
    if (!username || username.trim() === "") {
        return res.status(400).json({ message: "Username is required for the post." });
    }

    try {
        const newPostRef = await addDoc(collection(db, "community"), {
            comment,
            username, // Simpan username
            created_at: new Date(),
            // Tambahkan field lain jika diperlukan, misal: userId, likes, etc.
        });

        res.status(201).json({ message: "Comment added successfully!", id: newPostRef.id }); // 201 Created
    } catch (error) {
        console.error("Error inserting comment:", error);
        res.status(500).json({ message: "Internal server error while adding post." }); // Konsisten JSON
    }
});

// Get Community Posts
app.get("/getPosts", async (req, res) => {
    try {
        const q = query(collection(db, "community"), orderBy("created_at", "desc"));
        const postsSnapshot = await getDocs(q);

        if (postsSnapshot.empty) {
            return res.status(200).json([]); // Mengembalikan array kosong dengan status 200
        }

        const posts = postsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(posts); // Status 200 OK secara eksplisit
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal server error while fetching posts." }); // Konsisten JSON
    }
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});