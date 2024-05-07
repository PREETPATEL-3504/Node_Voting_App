const express = require('express')
const router = express.Router();
const User = require('../Models/User')
const { jwtAuthmiddelware, generateToken } = require('../jwt');

router.post('/signup', async (req, res) => {
    try {
        const data = req.body
        // Check if there is already an admin user
        const adminUser = await User.findOne({ role: 'admin' });
        if (data.role === 'admin' && adminUser) {
            return res.status(400).json({ error: 'Admin user already exists' });
        }
        const newUser = new User(data);
        const response = await newUser.save();
        console.log("data saved");
        const playload = {
            id: response.id
        }
        const token = generateToken(playload);
        res.status(200).json({ response: response, token: token });
    } catch (error) {
        res.status(500).json({ error: "Internal Server error" });
    }
})
//Login route
router.post('/login', async (req, res) => {
    try {
        const { aadharcardnumber, password } = req.body;
        const user = await User.findOne({ aadharcardnumber: aadharcardnumber });
        if (!user || !(await user.comparepassword(password))) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        const payload = {
            id: user.id
        };
        const token = await generateToken(payload); // Use await for asynchronous generation
        res.json({ token });
    } catch (error) {
        console.error("Login error:", error); // Log the actual error for debugging
        res.status(500).json({ error: "Login failed" }); // More generic error message
    }
})
router.get('/profile', jwtAuthmiddelware, async (req, res) => {
    try {
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId)
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal Server error" });
    }
})
router.put('/profile/password', jwtAuthmiddelware, async (req, res) => {
    try {
        const userId = req.user;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId)

        if (!(await user.comparepassword(currentPassword))) {
            return res.status(401).json({ error: "Invalid Current password" });
        }
        user.password = newPassword;
        await user.save()

        console.log('Password updated')
        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({ error: "Internal Server error" });
    }
})
module.exports = router;