// Fonctions utilitaires

// Générer un ID unique
const genererID = () => {
  return Date.now();
};

// Formater une date
const formaterDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR');
};

// Calculer une remise
const calculerRemise = (prix, pourcentage) => {
  return prix - (prix * pourcentage / 100);
};

// Valider un email
const validerEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Générer un code de commande
const genererCodeCommande = () => {
  return 'CMD-' + Date.now().toString(36).toUpperCase();
};

module.exports = {
  genererID,
  formaterDate,
  calculerRemise,
  validerEmail,
  genererCodeCommande
};