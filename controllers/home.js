const homeModels = require('../models/home');

// home
exports.home = async (req, res) => {homeModels.home(req, res)};