import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Client from '../models/Client';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Get all clients (Admin only)
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 });
        res.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new client (Admin only)
router.post('/', authenticate, authorize(['admin']), async (req: any, res: any) => {
    try {
        const contentType = req.headers['content-type'] || '';

        // Function to handle parsing and uploading logic within the route
        const handleUpload = (): Promise<{ fields: any, logoUrl: string }> => {
            return new Promise((resolve, reject) => {
                if (!contentType.includes('multipart/form-data')) {
                    return resolve({ fields: req.body, logoUrl: req.body.logoUrl || '' });
                }

                import('busboy').then(({ default: Busboy }) => {
                    const busboy = Busboy({ headers: req.headers });
                    const fields: any = {};
                    let fileBuffer: Buffer | null = null;
                    let fileName = "";
                    let mimeType = "";

                    busboy.on("field", (fieldname, value) => {
                        fields[fieldname] = value;
                    });

                    busboy.on("file", (fieldname, file, info) => {
                        if (fieldname === 'logo') {
                            fileName = info.filename;
                            mimeType = info.mimeType;
                            const chunks: Buffer[] = [];
                            file.on("data", (data) => chunks.push(data));
                            file.on("end", () => {
                                fileBuffer = Buffer.concat(chunks);
                            });
                        } else {
                            file.resume(); // consume stream
                        }
                    });

                    busboy.on("finish", async () => {
                        try {
                            let logoUrl = "";
                            if (fileBuffer && fileName) {
                                const { UTApi } = await import('uploadthing/server');
                                const utapi = new UTApi();
                                const file = new File([fileBuffer as any], fileName, { type: mimeType });
                                const response = await utapi.uploadFiles([file]);
                                if (response[0]?.data?.url) {
                                    logoUrl = response[0].data.url;
                                }
                            }
                            resolve({ fields, logoUrl });
                        } catch (err) {
                            reject(err);
                        }
                    });

                    busboy.on("error", (err) => reject(err));
                    req.pipe(busboy);
                });
            });
        };

        const { fields, logoUrl } = await handleUpload();
        console.log("Processed fields:", fields);

        const { name, email, password, industry, primaryColor, secondaryColor, status } = fields;

        // Basic Validation
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // 1. Create Client Profile first
        const newClient = new Client({
            name,
            industry,
            logoUrl: logoUrl || '',
            status: status || 'Onboarding',
            brandColors: {
                primary: primaryColor || '#000000',
                secondary: secondaryColor || '#ffffff'
            }
        });
        await newClient.save();

        // 2. Create User linked to the Client
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            passwordHash,
            role: 'client',
            clientId: newClient._id
        });
        await newUser.save();

        // 3. Link User back to Client
        newClient.userId = newUser._id as any;
        await newClient.save();

        res.status(201).json({
            message: 'Client created successfully',
            client: newClient,
            user: {
                id: newUser._id,
                email: newUser.email
            }
        });

    } catch (error: any) {
        console.error('Error creating client:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

// Get single client details
router.get('/:id', authenticate, async (req: any, res: any) => {
    try {
        const clientId = req.params.id;

        // Security check: Clients can only view their own profile
        if (req.user.role === 'client' && req.user.clientId !== clientId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json(client);
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update client details
router.put('/:id', authenticate, authorize(['admin']), async (req: any, res: any) => {
    try {
        const { name, industry, primaryColor, secondaryColor, status, logoUrl } = req.body;
        const clientId = req.params.id;

        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        client.name = name || client.name;
        client.industry = industry || client.industry;
        client.status = status || client.status;
        client.brandColors = {
            primary: primaryColor || client.brandColors.primary,
            secondary: secondaryColor || client.brandColors.secondary
        };

        if (logoUrl) {
            client.logoUrl = logoUrl;
        }

        await client.save();
        res.json({ message: 'Client updated successfully', client });
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete client
router.delete('/:id', authenticate, authorize(['admin']), async (req: any, res: any) => {
    try {
        const clientId = req.params.id;
        const client = await Client.findById(clientId);

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Delete associated user
        if (client.userId) {
            await User.findByIdAndDelete(client.userId);
        }

        // Delete client profile
        await Client.findByIdAndDelete(clientId);

        res.json({ message: 'Client deleted successfully' });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
