import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';

dotenv.config({ path: '../.env' }); // try parent
dotenv.config(); // try current

const seed = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/helios';
        console.log('Connecting to:', uri);
        await mongoose.connect(uri);

        const email = 'admin@helios.com';
        const password = 'password123';
        const passwordHash = await bcrypt.hash(password, 10);

        // Update or Create
        const user = await User.findOneAndUpdate(
            { email },
            {
                email,
                passwordHash,
                role: 'admin'
            },
            { upsert: true, new: true }
        );

        console.log(`Admin user ensured: ${email} / ${password}`);
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seed();
