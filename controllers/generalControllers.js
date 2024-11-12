const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Message, Result } = require('../models/associations.js')

const fs = require('fs').promises
const path = require('path')


exports.getMain = async (request, response) => {
    try{
        const results = (await Result.findAll({include: User})).sort((a, b) => b.speed-a.speed)
        const formatResults = results.reduce((acc, el) => acc.map(el => String(el.UserId)).includes(String(el.UserId)) ? acc : [...acc, el], [])
        const messages = await Message.findAll({include: User})
        console.log('messages', messages)
        console.log('formatResults', formatResults)
        console.log('results', results)
        response.render('main.hbs', {title: 'dark.typing:_', results: formatResults, cssFile: 'main.css', messages})
    }
    catch(err){
        console.log(err)
    }
} 

exports.getLogin = async (request, response) => {
    try{
        response.render('login.hbs', {title: 'Login', cssFile: 'login.css'})
    }
    catch(err){
        console.log(err)
    }
}

exports.postLogin = async (request, response) => {
    try{
        console.log('im here')
        const user = await User.findOne({where: {email: request.body['email']}})
        if (user){
            const isValid = await bcrypt.compare(request.body['password'], user.password);
            if(isValid){
                const token = jwt.sign({ id: user.id }, process.env.SECRET, {expiresIn: '24h'})
                response.cookie('token', `Bearer ${token}`)
                response.redirect("/")
            }
        }
        response.redirect('/login')
    }
    catch(err){
        console.log(err)
    }
}

exports.getRegister = async (request, response) => {
    try{
        response.render('register.hbs', {title: 'Register', cssFile: 'register.css'})
    }
    catch(err){
        console.log(err)
    }
}
exports.postRegister = async (request, response) => {
    try{
        const {password, ...items} = request.body;
        const salt = await bcrypt.genSalt(7)
        const hash = await bcrypt.hash(password, salt)
        await User.create({...items, password: hash})
        response.redirect('/')
    }
    catch(err){
        console.log(err)
    }
}



exports.logout = async (request, response) => {
    try{
        response.clearCookie('token')
        response.redirect('/')
    }
    catch(err){
        console.log(err)
    }
}