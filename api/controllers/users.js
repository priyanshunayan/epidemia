const Users = require('../models/users');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt');
const bcrypt = require('bcrypt');

const signUp = (req, res, next) => {

}

module.exports = {
    signUp
}