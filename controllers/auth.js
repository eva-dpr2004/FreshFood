const jwt = require('jsonwebtoken');
const db = require('../config/config');
const { promisify } = require('util');
const authModels = require('../models/auth');

// register
exports.register = (req, res) => {authModels.register(req, res)};

// login
exports.login = async (req, res) => {authModels.login(req, res)};

// Logout
exports.logout = async (req, res) => {authModels.logout(req, res)};

