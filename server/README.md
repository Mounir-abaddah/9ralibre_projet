# 📧 Vérification d'Email avec Node.js, Express et Mongoose

## 📌 Objectif
Mettre en place un système permettant de vérifier l’adresse email d’un utilisateur après son inscription.

- Lors de l’inscription, un email avec un lien de confirmation est envoyé.  
- L’utilisateur doit cliquer sur ce lien pour activer son compte.  
- Le champ **accountVerified** dans MongoDB passe alors de `false` → `true`.  

---

## 🛠️ Modèle utilisateur (Mongoose)

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  type: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // ✅ Vérification de compte
  accountVerified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("User", userSchema);
```

---

## 🚀 Route d’inscription `/register`

1. Validation des données (via Zod par exemple).  
2. Vérification que l’email n’existe pas déjà.  
3. Hashage du mot de passe et enregistrement en base.  
4. Génération d’un token JWT.  
5. Envoi d’un email avec un lien de vérification.  

---

## ✅ Route de confirmation `/confirm-email/:token`

1. Vérifie et décode le token JWT.  
2. Recherche l’utilisateur correspondant.  
3. Si trouvé, met à jour `accountVerified = true`.  
4. Retourne une réponse confirmant l’activation du compte.  

---

## 📂 Exemple de réponse API

### Succès inscription
```json
{
  "success": true,
  "message": "Lien de confirmation d'email envoyé"
}
```

### Compte déjà vérifié
```json
{
  "success": true,
  "message": "Votre compte est déjà vérifié ✅"
}
```

### Lien invalide ou expiré
```json
{
  "success": false,
  "message": "Lien invalide ou expiré ❌"
}
```

---

## © 9ralibre
