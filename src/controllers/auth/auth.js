const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key'; // Hardkodirani JWT tajni ključ
const JWT_REFRESH_EXPIRATION = '1h'; // Hardkodirano vreme isteka JWT tokena

const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, password } = req.body;

        const userExists = await User.findOne({
            where: { firstName }
        });
        if (userExists) {
            return res.status(400).send('Email is already associated with an account');
        }


        await User.create({
            firstName,
            lastName,
            password: password,
        });

        return res.status(200).send('Registration successful');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Error in registering user');
    }
}

const login = async (req, res) => {
    try {
        const { firstName, lastName, password } = req.body;

        const user = await User.findOne({
            where: { firstName }
        });
        if (!user) {
            return res.status(404).json('Email not found');
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return res.status(404).json('Incorrect email and password combination');
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, {
            expiresIn: JWT_REFRESH_EXPIRATION
        });

        res.status(200).send({
            id: user.id,
            
            firstName: user.firstName,
            lastName: user.lastName,
            accessToken: token,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Sign in error');
    }
}

module.exports = {
    registerUser,
    login
}
