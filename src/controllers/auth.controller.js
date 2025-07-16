const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { OAuth2Client } = require('google-auth-library'); // Import OAuth2Client

const oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.signup = async (req, res) => {
    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 8);
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email
        });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 7200 }); // 2 hours
        res.status(200).json({
            auth: true,
            token: token,
            userId: user._id,
            email: user.email,
            username: user.username,
            message: 'User registered successfully'
        });
    } catch (error) {
        res.status(500).send({ message: 'Error registering user', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        console.log(req.body);
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(404).send({ message: 'User not found' });

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null, message: 'Invalid password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 7200 });
        // res.cookie('token', token, { httpOnly: false, maxAge: 7200000 }); 
        // res.cookie('userId', user._id.toString(), { httpOnly: false, maxAge: 7200000 });
        // res.cookie('email', user.email, { httpOnly: false, maxAge: 7200000 }); 
        // res.cookie('username', user.username, { httpOnly: false, maxAge: 7200000 });

        // console.log(token);
        res.status(200).json({
            auth: true,
            token: token,
            userId: user._id,
            email: user.email,
            username: user.username
        });
    } catch (error) {
        res.status(500).send({ message: 'Error on the server', error: error.message });
    }
};

exports.checkAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        if (user.isAdmin) {
            return res.status(200).send({ message: 'User is an admin' });
        } else {
            return res.status(250).send({ message: 'User is not an admin' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error checking admin status', error: error.message });
    }
};


exports.google=async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await oauth2Client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        
        const payload = ticket.getPayload();
        const email = payload['email'];
        const username = email.split('@')[0];

        let user = await User.findOne({ email });
        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8);
            
            user = new User({
                username,
                password:randomPassword,
                email
            });
            await user.save();
        }
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 7200 });
        
        res.status(200).json({
            auth: true,
            token: jwtToken,
            userId: user._id,
            email: user.email,
            username: user.username
        });
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
}