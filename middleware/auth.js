// Middleware d'authentification simple
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: 'Token d\'authentification requis' });
  }
  
  // Simulation - en vrai tu vérifierais un JWT
  if (token !== 'Bearer secret-token') {
    return res.status(401).json({ message: 'Token invalide' });
  }
  
  // Ajouter les infos utilisateur à la requête
  req.user = { id: 1, nom: "Admin" };
  next();
};

const requireAdmin = (req, res, next) => {
  // Vérifier d'abord l'auth
  requireAuth(req, res, () => {
    if (req.user.nom !== "Admin") {
      return res.status(403).json({ message: 'Droits administrateur requis' });
    }
    next();
  });
};

module.exports = {
  requireAuth,
  requireAdmin
};