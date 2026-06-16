const express = require('express');
const router = express.Router();
const User=require('../mongodb/mongoschema');
const Admin=require('../mongodb/adminschema')

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
         const adminUser = await Admin.findOne({
      username,
      password
    });

    if (adminUser) {
      return res.status(200).json({
        role: 'admin',
        message: 'Admin Login Successful',
        admin: adminUser
      });
    }

        const user = await User.findOne({
            username,
            password
        });
        console.log(user);
       
        if (!user ) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        res.json({
            role:'user',
            message: 'Login successful',
            user
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});
router.post('/register', async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            accountType,
            disabilityTypes
        } = req.body;

        // Username validation
        if (!username || username.trim().length < 3) {
            return res.status(400).json({
                error: 'Username must be at least 3 characters'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email address'
            });
        }

        // Password validation
        if (!password || password.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters'
            });
        }

        // Account type validation
        if (!accountType) {
            return res.status(400).json({
                error: 'Please select an account type'
            });
        }

        // Check existing username or email
        const existingUser = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({
                    error: 'Username already exists'
                });
            }

            if (existingUser.email === email) {
                return res.status(400).json({
                    error: 'Email already registered'
                });
            }
        }

        // Create user
        const user = new User({
            username,
            email,
            password,
            accountType,
            disabilityTypes
        });

        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            user
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;

module.exports = router;