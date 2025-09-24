# 🔐 Comprendre les Headers HTTP et le Middleware d'authentification JWT

## 📌 1. Les Headers HTTP

Un **header HTTP** est une information supplémentaire envoyée dans une
requête ou une réponse HTTP.\
Il s'agit de **paires clé/valeur** qui donnent des détails sur la
requête.

### ✨ Exemples de headers courants :

-   `Content-Type: application/json` → indique que le corps est en JSON
-   `Accept-Language: fr-FR` → indique la langue préférée
-   `Authorization: Bearer <token>` → sert à l'authentification

### ⚡ Exemple d'une requête avec header Authorization :

    GET /dashboard HTTP/1.1
    Host: api.exemple.com
    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...

Ici : - `Authorization` est le header - `Bearer` est le type
d'authentification (JWT dans notre cas) - Le long texte est le **token
JWT**

------------------------------------------------------------------------

## 📌 2. Le Middleware JWT

Un **middleware** dans Express est une fonction qui intercepte les
requêtes avant d'atteindre la route.

Notre middleware sert à :\
1. Vérifier la présence du token dans les headers\
2. Vérifier sa validité avec `jwt.verify()`\
3. Ajouter les infos de l'utilisateur (`req.user`) si le token est
valide\
4. Bloquer l'accès sinon

### 🚀 Exemple de code

``` js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeaders = req.headers["authorization"];
    const token = authHeaders && authHeaders.split(" ")[1]; // format: "Bearer <token>"

    if (!token) {
        return res.status(401).send({
            message: "⛔ Accès refusé : Token manquant",
            success: false
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // On attache les infos de l’utilisateur
        next(); // On continue vers la route protégée
    } catch (err) {
        return res.status(403).send({
            message: "❌ Token invalide ou expiré",
            success: false,
            error: err.message
        });
    }
};

module.exports = authMiddleware;
```

------------------------------------------------------------------------

## 📌 3. Résumé du fonctionnement

1.  Le client envoie une requête avec `Authorization: Bearer <token>`\
2.  Le middleware vérifie le token avec `jwt.verify`\
3.  Si valide → l'utilisateur peut accéder à la route protégée\
4.  Si invalide/expiré → retour `401` ou `403`

------------------------------------------------------------------------

✅ **Conclusion :**\
- Les headers sont des informations attachées à chaque requête HTTP\
- Le header `Authorization` + JWT est utilisé pour sécuriser l'accès\
- Le middleware contrôle la validité du token avant d'autoriser l'accès
