// Middleware de validation pour les produits
const validerProduit = (req, res, next) => {
  const { nom, prix } = req.body;
  
  if (!nom || nom.length < 2) {
    return res.status(400).json({ message: 'Nom requis (minimum 2 caractères)' });
  }
  
  if (!prix || prix <= 0) {
    return res.status(400).json({ message: 'Prix requis et doit être positif' });
  }
  
  if (isNaN(parseFloat(prix))) {
    return res.status(400).json({ message: 'Prix doit être un nombre' });
  }
  
  next();
};

// Middleware de validation pour les utilisateurs
const validerUser = (req, res, next) => {
  const { nom, email } = req.body;
  
  if (!nom || nom.length < 2) {
    return res.status(400).json({ message: 'Nom requis (minimum 2 caractères)' });
  }
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Email valide requis' });
  }
  
  next();
};

module.exports = {
  validerProduit,
  validerUser
};