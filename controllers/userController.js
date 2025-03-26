const bcrypt = require('bcrypt');
const base64 =  require('base-64');
const Users = require('../Models/Users.js');
const { response } = require('express');

const signup = (req, res) => {
    res.render('signup', {message: null})
}

const loginPage = (req, res)=> {
    res.render('login', {message: null})
}

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await Users.findOne({ email });

        if (existingUser) {
            return res.render('signup', { message: "User already exists, please try with a new email." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Users({ name, email, password: hashedPassword });

        await newUser.save();
        return res.render('login', { message: 'User created successfully' });

    } catch (error) {
        console.error("Signup Error:", error);
        return res.render('signup', { message: 'Error while creating user, please try again later' });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await Users.findOne({ email });

        if (!existingUser) {
            return res.render('login', { message: 'User does not exist, please register first.' });
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatch) {
            return res.render('login', { message: 'Incorrect password, please try again.' });
        }

        req.session.userId = existingUser._id;
        return res.redirect('/home');

    } catch (error) {
        console.error("Login Error:", error);
        return res.render('login', { message: 'Something went wrong, please try again.' });
    }
};


const allUsers = (req, res) => {
    Users.find()
    .then(response => {
        res.json(response)
    })
    .catch( error => {
        res.json(error)
    })
}

const logout = (req, res) => {
    req.session.destroy((err) => {
        if(err){
            console.error("Logout error", err);
            return res.redirect('/home');
        }
         res.clearCookie('connect.sid', {path: '/'})   
         res.redirect('/login');
    });
};

module.exports = { signup, loginPage, register, login, allUsers, logout }
