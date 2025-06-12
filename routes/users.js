const express = require('express');
const router = express.Router();
const { users } = require('../models/data');

// GET /api/users - Tous les utilisateurs
router.get('/', (req, res) => {
  res.json(users);
});

// GET /api/users/:id - Un utilisateur spécifique
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }
  
  res.json(user);
});

// POST /api/users - Créer un nouvel utilisateur
router.post('/', (req, res) => {
  const { nom, email } = req.body;
  
  if (!nom || !email) {
    return res.status(400).json({ message: 'Nom et email requis' });
  }
  
  // Vérifier si l'email existe déjà
  const emailExists = users.find(u => u.email === email);
  if (emailExists) {
    return res.status(400).json({ message: 'Email déjà utilisé' });
  }
  
  const nouvelUser = {
    id: Date.now(),
    nom,
    email,
    dateCreation: new Date().toISOString().split('T')[0],
    actif: true
  };
  
  users.push(nouvelUser);
  res.status(201).json(nouvelUser);
});

// PUT /api/users/:id - Modifier un utilisateur
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }
  
  const { nom, email, actif } = req.body;
  
  users[index] = {
    ...users[index],
    nom: nom || users[index].nom,
    email: email || users[index].email,
    actif: actif !== undefined ? actif : users[index].actif
  };
  
  res.json(users[index]);
});

// DELETE /api/users/:id - Supprimer un utilisateur
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }
  
  const userSupprime = users.splice(index, 1)[0];
  res.json({ message: 'Utilisateur supprimé', user: userSupprime });
});

module.exports = router;