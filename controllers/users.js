const usersModel = require('../models/users') 

// Update 
exports.update = async (req, res) => {usersModel.update(req, res)};
  
// Supprimer le compte
exports.delete = async (req, res) => {usersModel.delete(req, res)};

// registerGet
exports.registerGet = async (req, res) => {usersModel.registerGet(req, res)};

// loginGet
exports.loginGet = async (req, res) => {usersModel.loginGet(req, res)};

// profilGet
exports.profilGet = async (req, res) => {usersModel.profilGet(req, res)};

// updateProfil
exports.updateProfil = async (req, res) => {usersModel.updateProfil(req, res)};

// deleteProfil
exports.deleteProfil = async (req, res) => {usersModel.deleteProfil(req, res)};

// AllUser
exports.AllUser = async (req, res) => {usersModel.AllUser(req, res)};

// Admin edit
exports.adminEdit = async (req, res) => {usersModel.adminEdit(req, res)};

// Update user by admin
exports.updateAdmin = async (req, res) => {usersModel.updateAdmin(req, res)};

// EN COURS ...

// Delete user by admin
exports.deleteAdmin = async (req, res) => {usersModel.deleteAdmin(req, res)};


  