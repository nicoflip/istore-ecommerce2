const express = require('express');
const cors = require('cors');
const path = require('path');

// Import des routes
const produitsRouter = require('./routes/produits');
const usersRouter = require('./routes/users');
const commandesRouter = require('./routes/commandes');

// Import des middlewares
const { requireAuth, requireAdmin } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques depuis le dossier public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes principales
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenue sur l\'API E-commerce !',
    endpoints: {
      produits: '/api/produits',
      users: '/api/users',
      commandes: '/api/commandes',
      stats: '/api/stats',
      frontend: '/shop' // Pour accéder à l'interface HTML
    }
  });
});

// Route pour servir l'interface HTML
//app.get('/shop', (req, res) => {
//  res.sendFile(path.join(__dirname, 'public', 'index.html'));
//});

//debut test claude

app.get('/shop', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'index.html');
    console.log('Tentative de lecture du fichier:', filePath);
    
    // Vérifier si le fichier existe
    const fs = require('fs');
    if (fs.existsSync(filePath)) {
      console.log('Le fichier existe !');
      res.sendFile(filePath);
    } else {
      console.log('Le fichier n\'existe pas !');
      res.status(404).send('Fichier HTML introuvable');
    }
  });

  //fin test claude

// Utilisation des routes API
app.use('/api/produits', produitsRouter);
app.use('/api/users', usersRouter);
app.use('/api/commandes', commandesRouter);

// Route de statistiques
app.get('/api/stats', (req, res) => {
  const { produits, users, commandes } = require('./models/data');
  
  const stats = {
    totalProduits: produits.length,
    totalUsers: users.length,
    totalCommandes: commandes.length,
    chiffreAffaires: commandes.reduce((sum, cmd) => sum + cmd.total, 0),
    categoriesPopulaires: produits.reduce((acc, prod) => {
      acc[prod.categorie] = (acc[prod.categorie] || 0) + 1;
      return acc;
    }, {}),
    produitsEnRupture: produits.filter(p => p.stock === 0).length,
    commandesEnCours: commandes.filter(c => c.status === 'En cours').length
  };
  
  res.json(stats);
});

// Routes protégées par authentification
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const { produits, users, commandes } = require('./models/data');
  
  const detailedStats = {
    produits: produits.map(p => ({
      nom: p.nom,
      stock: p.stock,
      vendu: commandes.reduce((total, cmd) => {
        const produitCommande = cmd.produits.find(pc => pc.produitId === p.id);
        return total + (produitCommande ? produitCommande.quantite : 0);
      }, 0)
    })),
    revenusParMois: commandes.reduce((acc, cmd) => {
      const mois = cmd.dateCommande.substring(0, 7);
      acc[mois] = (acc[mois] || 0) + cmd.total;
      return acc;
    }, {}),
    topClients: users.map(u => ({
      nom: u.nom,
      email: u.email,
      totalCommandes: commandes.filter(c => c.userId === u.id).length,
      totalDepense: commandes
        .filter(c => c.userId === u.id)
        .reduce((sum, c) => sum + c.total, 0)
    })).sort((a, b) => b.totalDepense - a.totalDepense)
  };
  
  res.json(detailedStats);
});

// Route de test de l'authentification
app.get('/api/test-auth', requireAuth, (req, res) => {
  res.json({ 
    message: 'Authentification réussie !', 
    user: req.user 
  });
});

// Middleware pour les routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route non trouvée',
    availableRoutes: [
      'GET /',
      'GET /shop',
      'GET /api/produits',
      'GET /api/users', 
      'GET /api/commandes',
      'GET /api/stats'
    ]
  });
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.stack);
  res.status(500).json({ 
    message: 'Erreur serveur interne',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📚 API Documentation : http://localhost:${PORT}`);
  console.log(`🛒 Interface boutique : http://localhost:${PORT}/shop`);
  console.log(`📊 Statistiques : http://localhost:${PORT}/api/stats`);
  console.log('');
  console.log('📋 Routes API disponibles :');
  console.log('  GET  /api/produits');
  console.log('  POST /api/produits');
  console.log('  GET  /api/users');
  console.log('  POST /api/users');
  console.log('  GET  /api/commandes');
  console.log('  POST /api/commandes');
  console.log('');
  console.log('🔐 Routes protégées (nécessitent Authorization: Bearer secret-token) :');
  console.log('  GET  /api/test-auth');
  console.log('  GET  /api/admin/stats');
});

module.exports = app;