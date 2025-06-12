// Base de données simulée en mémoire

let produits = [
  { id: 1, nom: "iPhone 15", prix: 999, stock: 50, categorie: "Tech", description: "Dernier iPhone d'Apple" },
  { id: 2, nom: "MacBook Pro", prix: 1999, stock: 20, categorie: "Tech", description: "Ordinateur portable puissant" },
  { id: 3, nom: "AirPods Pro", prix: 249, stock: 100, categorie: "Audio", description: "Écouteurs sans fil premium" },
  { id: 4, nom: "iPad Air", prix: 599, stock: 30, categorie: "Tech", description: "Tablette polyvalente" }
];

let users = [
  { 
    id: 1, 
    nom: "Jean Dupont", 
    email: "jean@email.com", 
    dateCreation: "2024-01-15",
    actif: true 
  },
  { 
    id: 2, 
    nom: "Marie Martin", 
    email: "marie@email.com", 
    dateCreation: "2024-02-20",
    actif: true 
  }
];

let commandes = [
  { 
    id: 1, 
    userId: 1, 
    produits: [
      { produitId: 1, quantite: 1, prixUnitaire: 999 }
    ], 
    total: 999, 
    status: "En cours",
    dateCommande: "2024-03-01"
  },
  { 
    id: 2, 
    userId: 2, 
    produits: [
      { produitId: 3, quantite: 2, prixUnitaire: 249 }
    ], 
    total: 498, 
    status: "Livrée",
    dateCommande: "2024-03-05"
  }
];

module.exports = {
  produits,
  users,
  commandes
};