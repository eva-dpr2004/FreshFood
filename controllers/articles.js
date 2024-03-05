const articlesModels = require('../models/articles');

// articles
exports.articles = async (req, res) => {articlesModels.articles(req, res)};