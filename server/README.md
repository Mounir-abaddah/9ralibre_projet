# Validation avec Zod et Express

Ce projet montre comment utiliser **Zod** pour valider les données envoyées dans `req.body` avec Express.  
L’exemple est expliqué de deux façons : une version technique (Express) et une version enfantine (l’histoire de la maîtresse 🎒).

---

## Qu’est-ce que `parse` ?

👉 `parse()` est une fonction de Zod qui **vérifie** si les données correspondent au schéma que tu as défini.  
- Si les données sont **valides** → il retourne l’objet validé.  
- Si les données sont **fausses** → il lance une erreur avec les détails.

C’est comme un **garde de sécurité** 🔐 pour ton API.

---

## Exemple technique (Express)

### Définir un schéma
```js
const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(2),       // Nom = minimum 2 lettres
  email: z.string().email(),     // Email valide
  password: z.string().min(6),   // Mot de passe = minimum 6 caractères
});
```

### Utilisation dans Express
```js
const express = require("express");
const app = express();
app.use(express.json());

app.post("/register", (req, res) => {
  try {
    // Vérification du corps de la requête
    const data = registerSchema.parse(req.body);

    // Si tout est bon
    res.json({ message: "Inscription réussie ✅", data });
  } catch (err) {
    // Si erreur → renvoie les détails
    res.status(400).json({ message: "Erreur ❌", details: err.errors });
  }
});

app.listen(3000, () => console.log("Serveur démarré sur http://localhost:3000"));
```

---

## Exemple enfantin (l’histoire de la maîtresse 🎒)

Imagine que tu veux entrer à l’école. Avant d’entrer, la maîtresse vérifie ton **cartable** :  
- Tu dois avoir **un crayon** ✏️  
- Tu dois avoir **un cahier** 📒  
- Tu dois avoir **au moins 1 bonbon** 🍬  

Sinon, tu ne peux pas entrer.

### En code avec Zod
```js
const { z } = require("zod");

// La maîtresse définit les règles
const cartableSchema = z.object({
  crayon: z.string(),         // il faut un crayon
  cahier: z.string(),         // il faut un cahier
  bonbons: z.number().min(1), // au moins 1 bonbon
});

// Ton cartable (les données)
const monCartable = {
  crayon: "bleu",
  cahier: "maths",
  bonbons: 3,
};

// La maîtresse vérifie
const resultat = cartableSchema.parse(monCartable);

console.log(resultat);
// ✅ Tu passes, car tout est bon
```

### Et si tu triches 😅
```js
const mauvaisCartable = {
  crayon: "rouge",
  cahier: "dessin",
  bonbons: 0,  // pas de bonbon !!
};

const resultat = cartableSchema.parse(mauvaisCartable);
// ❌ Erreur: "bonbons must be greater than or equal to 1"
```

👉 Donc `parse()` = la maîtresse qui vérifie ton cartable 🎒  
- Si tout est correct → tu rentres à l’école 🎉  
- Sinon → elle dit "Erreur !" 🚨

---

## Différence entre `parse` et `safeParse`

- `parse()`  
  → lance une erreur si les données sont invalides.  

- `safeParse()`  
  → ne lance **pas** d’erreur. Il retourne un objet avec `success: true/false`.

### Exemple
```js
const result = registerSchema.safeParse(req.body);

if (!result.success) {
  console.log(result.error.errors); // erreurs
} else {
  console.log(result.data); // données valides
}
```