const express = require('express');
const router = express.Router();
const { produits } = require('../models/data');
const { validerProduit } = require('../middleware/validation');

// GET /api/produits - Tous les produits avec filtres
router.get('/', (req, res) => {
  let result = [...produits];
  
  // Filtrer par catégorie
  if (req.query.categorie) {
    result = result.filter(p => 
      p.categorie.toLowerCase() === req.query.categorie.toLowerCase()
    );
  }
  
  // Filtrer par prix maximum
  if (req.query.prix_max) {
    const prixMax = parseFloat(req.query.prix_max);
    result = result.filter(p => p.prix <= prixMax);
  }
  
  // Recherche par nom
  if (req.query.recherche) {
    const terme = req.query.recherche.toLowerCase();
    result = result.filter(p => 
      p.nom.toLowerCase().includes(terme)
    );
  }
  
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedResult = result.slice(startIndex, endIndex);
  
  res.json({
    data: paginatedResult,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(result.length / limit),
      totalItems: result.length,
      hasNext: endIndex < result.length,
      hasPrev: page > 1
    }
  });
});

// GET /api/produits/:id - Un produit spécifique
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const produit = produits.find(p => p.id === id);
  
  if (!produit) {
    return res.status(404).json({ message: 'Produit non trouvé' });
  }
  
  res.json(produit);
});

// POST /api/produits - Créer un nouveau produit
router.post('/', validerProduit, (req, res) => {
  const { nom, prix, stock, categorie, description } = req.body;
  
  const nouveauProduit = {
    id: Date.now(),
    nom,
    prix: parseFloat(prix),
    stock: parseInt(stock) || 0,
    categorie: categorie || 'Non définie',
    description: description || ''
  };
  
  produits.push(nouveauProduit);
  res.status(201).json(nouveauProduit);
});

// PUT /api/produits/:id - Modifier un produit
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = produits.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Produit non trouvé' });
  }
  
  const { nom, prix, stock, categorie, description } = req.body;
  
  produits[index] = {
    ...produits[index],
    nom: nom || produits[index].nom,
    prix: prix ? parseFloat(prix) : produits[index].prix,
    stock: stock !== undefined ? parseInt(stock) : produits[index].stock,
    categorie: categorie || produits[index].categorie,
    description: description || produits[index].description
  };
  
  res.json(produits[index]);
});

// DELETE /api/produits/:id - Supprimer un produit
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = produits.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Produit non trouvé' });
  }
  
  const produitSupprime = produits.splice(index, 1)[0];
  res.json({ message: 'Produit supprimé', produit: produitSupprime });
});

module.exports = router;