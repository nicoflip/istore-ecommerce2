const express = require('express');
const router = express.Router();
const { commandes, produits, users } = require('../models/data');

// GET /api/commandes - Toutes les commandes
router.get('/', (req, res) => {
  res.json(commandes);
});

// GET /api/commandes/user/:userId - Commandes d'un utilisateur
router.get('/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const commandesUser = commandes.filter(c => c.userId === userId);
  
  res.json(commandesUser);
});

// GET /api/commandes/:id - Une commande spécifique
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const commande = commandes.find(c => c.id === id);
  
  if (!commande) {
    return res.status(404).json({ message: 'Commande non trouvée' });
  }
  
  res.json(commande);
});


// POST /api/commandes - Créer une nouvelle commande
router.post('/', (req, res) => {
  const { userId, produits: produitsCommande } = req.body;
  
  if (!userId || !produitsCommande || !Array.isArray(produitsCommande)) {
    return res.status(400).json({ message: 'UserId et produits requis' });
  }
  
  // Vérifier que l'utilisateur existe
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }
  
  // Calculer le total
  let total = 0;
  const produitsValides = [];
  
  for (const item of produitsCommande) {
    const produit = produits.find(p => p.id === item.produitId);
    if (!produit) {
      return res.status(404).json({ message: `Produit ${item.produitId} non trouvé` });
    }
    
    if (produit.stock < item.quantite) {
      return res.status(400).json({ message: `Stock insuffisant pour ${produit.nom}` });
    }
    
    const sousTotal = produit.prix * item.quantite;
    total += sousTotal;
    
    produitsValides.push({
      produitId: item.produitId,
      quantite: item.quantite,
      prixUnitaire: produit.prix
    });
    
    // Réduire le stock
    produit.stock -= item.quantite;
  }
  
  const nouvelleCommande = {
    id: Date.now(),
    userId,
    produits: produitsValides,
    total,
    status: "En cours",
    dateCommande: new Date().toISOString().split('T')[0]
  };
  
  commandes.push(nouvelleCommande);
  res.status(201).json(nouvelleCommande);
});

// PUT /api/commandes/:id - Modifier le statut d'une commande
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = commandes.findIndex(c => c.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Commande non trouvée' });
  }
  
  const { status } = req.body;
  const statusValides = ["En cours", "Expédiée", "Livrée", "Annulée"];
  
  if (status && !statusValides.includes(status)) {
    return res.status(400).json({ message: 'Status invalide', statusValides });
  }
  
  commandes[index] = {
    ...commandes[index],
    status: status || commandes[index].status
  };
  
  res.json(commandes[index]);
});

module.exports = router;