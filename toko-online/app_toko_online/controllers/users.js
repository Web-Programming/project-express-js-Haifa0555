const User = require('../models/users');

// Middleware dummy untuk simulasi otorisasi Admin (PERLU diganti dengan JWT/Session di aplikasi nyata)
const checkAdmin = (req, res, next) => {
    // Diasumsikan di aplikasi nyata, req.user akan disetel oleh middleware otentikasi
    // Untuk tujuan demonstrasi: Admin memiliki ID 'admin-id-123'
    if (req.headers['x-user-id'] === 'admin-id-123' && req.headers['x-is-admin'] === 'true') {
        next();
    } else {
        res.status(403).json({ message: 'Akses ditolak. Hanya Admin yang diizinkan.' });
    }
};

// 1. POST / : Membuat User baru (Registration)
exports.createUser = async (req, res) => {
    const { username, email, password, address, isAdmin } = req.body;

    // Validasi input minimal
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Harap isi semua kolom wajib: username, email, dan password.' });
    }

    try {
        // Cek jika user sudah ada (menggunakan email untuk pengecekan cepat)
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User dengan email tersebut sudah terdaftar.' });
        }

        // Catatan: Password HARUS di-HASH sebelum disimpan di sini!
        const user = await User.create({
            username,
            email,
            password, 
            address,
            isAdmin: isAdmin || false 
        });

        // 201 Created: Berhasil membuat sumber daya baru
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            message: 'Registrasi user berhasil.'
        });

    } catch (error) {
        // 500 Internal Server Error: Kesalahan server atau validasi Mongoose lainnya
        res.status(500).json({ message: 'Gagal membuat user.', error: error.message });
    }
};

// 2. GET / : Mengambil semua User (Hanya untuk Admin)
// Menggunakan middleware checkAdmin
exports.getUsers = [checkAdmin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password'); // Jangan tampilkan password
        
        // 200 OK: Permintaan berhasil
        res.status(200).json(users);
    } catch (error) {
        // 500 Internal Server Error
        res.status(500).json({ message: 'Gagal mengambil daftar user.', error: error.message });
    }
}];

// 3. GET /:id : Mengambil detail satu User berdasarkan ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (user) {
            // 200 OK: User ditemukan
            res.status(200).json(user);
        } else {
            // 404 Not Found: User dengan ID tersebut tidak ditemukan
            res.status(404).json({ message: 'User tidak ditemukan.' });
        }
    } catch (error) {
        // 400 Bad Request: Seringkali karena ID tidak valid (bukan format ObjectId)
        if (error.name === 'CastError') {
             return res.status(400).json({ message: 'Format ID tidak valid.' });
        }
        res.status(500).json({ message: 'Gagal mencari user.', error: error.message });
    }
};

// 4. PUT /:id : Memperbarui detail User
// Untuk kesederhanaan, tidak ada cek otorisasi di sini, namun di aplikasi nyata HARUS ada cek otorisasi.
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            // Update fields yang tersedia di req.body
            user.username = req.body.username !== undefined ? req.body.username : user.username;
            user.email = req.body.email !== undefined ? req.body.email : user.email;
            user.address = req.body.address !== undefined ? req.body.address : user.address;
            
            // Logika untuk isAdmin (Hanya Admin yang boleh mengupdatenya)
            if (req.body.isAdmin !== undefined) { 
                user.isAdmin = req.body.isAdmin;
            }

            // Jika ada password baru, update (dan HASH)
            if (req.body.password) {
                // user.password = await bcrypt.hash(req.body.password, 10); // Implementasi HASH nyata
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            // 200 OK: Update berhasil
            res.status(200).json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                updatedAt: updatedUser.updatedAt,
                message: 'Update user berhasil.'
            });
        } else {
            // 404 Not Found
            res.status(404).json({ message: 'User tidak ditemukan.' });
        }
    } catch (error) {
         if (error.name === 'CastError') {
             return res.status(400).json({ message: 'Format ID tidak valid.' });
        }
        // 500 Internal Server Error
        res.status(500).json({ message: 'Gagal mengupdate user.', error: error.message });
    }
};

// 5. DELETE /:id : Menghapus User (Hanya untuk Admin)
// Menggunakan middleware checkAdmin
exports.deleteUser = [checkAdmin, async (req, res) => {
    try {
        const result = await User.deleteOne({ _id: req.params.id });
        
        if (result.deletedCount === 0) {
            // 404 Not Found: User tidak ditemukan untuk dihapus
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }

        // 200 OK: Hapus berhasil
        res.status(200).json({ message: 'User berhasil dihapus.' });
    } catch (error) {
        if (error.name === 'CastError') {
             return res.status(400).json({ message: 'Format ID tidak valid.' });
        }
        // 500 Internal Server Error
        res.status(500).json({ message: 'Gagal menghapus user.', error: error.message });
    }
}];