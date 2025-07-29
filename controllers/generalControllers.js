const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Message, Result, Mail } = require('../models/associations.js')
const nodemailer = require('nodemailer');

const fs = require('fs').promises
const path = require('path')
const { response } = require('express')
const { where, Op } = require('sequelize')
const verifyMailSender = require('../utils/mailSender.js')


exports.getMain = async (request, response) => {
    try {
        response.render('main.hbs', { title: 'dark.typing:_', cssFile: 'main.css', isMain: true })
    }
    catch (err) {
        
    }
}

exports.getLogin = async (request, response) => {
    try {
        response.render('login.hbs', { title: 'Login', cssFile: 'auth.css' })
    }
    catch (err) {
        
    }
}

exports.postLogin = async (request, response) => {
    try {
        
        const user = await User.findOne({ where: { email: request.body['email'] } })
        if (user) {
            
            const isValid = await bcrypt.compare(request.body['password'], user.password);
            if (isValid && user.isAccept) {
                
                const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '24h' })
                response.cookie('token', `Bearer ${token}`)
                response.redirect("/")
            }
        }
        response.redirect('/login')
    }
    catch (err) {
        
    }
}

exports.getConfirmMail = async (request, response) => {
    if (request.params['id']) {
        const mail = await Mail.findOne({ where: { id: request.params['id'] }, raw: true });
        if (mail) {
            await User.update({ isAccept: true }, { where: { id: mail.UserId } })
            await Mail.destroy({ where: { id: mail.id } })
            return response.render('confirmMail.hbs', { cssFile: 'confirmMail.css' })
        }
    }
}

exports.getDeliveryMail = async (request, response) => {
    return response.render('deliveryMail.hbs', { cssFile: 'deliveryMail.css' })
}

exports.getRegister = async (request, response) => {
    try {
        response.render('register.hbs', { title: 'Register', cssFile: 'auth.css', })
    }
    catch (err) {
        
    }
}
exports.postRegister = async (request, response) => {
    try {
        const { password, ...items } = request.body;
        
        items.username = (items.username).toUpperCase()
        const salt = await bcrypt.genSalt(7)
        const hash = await bcrypt.hash(password, salt)
        const user = await User.create({ ...items, password: hash })
        const mail = await Mail.create({ UserId: user.id })
        const verifyLink = `${request.protocol}://${request.get('host')}/confirmMail/${mail.id}`
        await verifyMailSender(user.email, verifyLink)
        response.redirect('/deliveryMail')
    }
    catch (err) {
        
    }
}



exports.logout = async (request, response) => {
    try {
        response.clearCookie('token')
        response.redirect('/')
    }
    catch (err) {
        
    }
}


exports.getProfile = async (request, response) => {
    try {
        const results = await Result.findAll({ where: { UserId: request.body['userId'] } })
        response.render('profile.hbs', { results, cssFile: 'profile.css' })
    }
    catch (err) {
        
    }
}


exports.logout = async function (request, response) {
    response.clearCookie('token');
    return response.redirect('/');
}