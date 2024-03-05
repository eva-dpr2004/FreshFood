const recettesModels = require('../models/recettes');

exports.recettes = async (req, res) => {recettesModels.recettes(req, res)};

exports.addRecipes = async (req, res) => {recettesModels.addRecipes(req, res)};

exports.GetRecipes = async (req, res) => {recettesModels.GetRecipes(req, res)};

exports.showAddRecipes = async (req, res) => {recettesModels.showAddRecipes(req, res)};
