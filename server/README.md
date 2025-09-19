# 🔐 Reset Password Flow avec JWT et Node.js

Ce projet implémente une fonctionnalité de réinitialisation de mot de
passe sécurisée avec **Node.js**, **Express**, **MongoDB**, **bcryptjs**
et **jsonwebtoken**.

------------------------------------------------------------------------

## 🚀 Étapes du processus

### 1. Génération du lien de réinitialisation

Quand l'utilisateur clique sur *mot de passe oublié*, on génère un
**token JWT** contenant l'`userId` :

``` js
const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);
```

➡️ Ce token est envoyé par email sous forme de lien :

    http://tonsite.com/reset-password/<token>

------------------------------------------------------------------------

### 2. Lien cliqué → Route de réinitialisation

Quand l'utilisateur clique sur le lien, il est redirigé vers la route :

``` js
router.put('/resetPassword/:token', async (req, res) => { ... })
```

1.  **On vérifie le token** :

``` js
const payload = jwt.verify(token, process.env.JWT_SECRET);
```

👉 Si invalide ou expiré → erreur.

2.  **On récupère l'utilisateur** avec `userId` :

``` js
const user = await User.findById(payload.userId);
```

3.  **On compare l'ancien et le nouveau mot de passe** :

``` js
const MemeMotdepasse = await bcrypt.compare(req.body.password, user.password);
if (MemeMotdepasse) {
  return res.status(400).send({ message: "Impossible de réutiliser l'ancien mot de passe" });
}
```

4.  **On enregistre le nouveau mot de passe** (haché avec `bcrypt`) :

``` js
user.password = await bcrypt.hash(req.body.password, 10);
await user.save();
```

5.  **Réponse finale** :

``` js
res.status(200).send({ message: "Mot de passe réinitialisé avec succès ✅", success: true });
```

------------------------------------------------------------------------

## 📑 Exemple complet de la route

``` js
router.put('/resetPassword/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const validationOublierPassword = passwordResetShema.parse(req.body);

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).send({ message: "Lien invalide ou expiré", success: false });
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(404).send({ message: "Utilisateur introuvable", success: false });
    }

    const MemeMotdepasse = await bcrypt.compare(validationOublierPassword.password, user.password);
    if (MemeMotdepasse) {
      return res.status(400).send({ message: "Impossible de réutiliser l'ancien mot de passe", success: false });
    }

    user.password = await bcrypt.hash(validationOublierPassword.password, 10);
    await user.save();

    return res.status(200).send({ message: "Mot de passe réinitialisé avec succès ✅", success: true });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).send({
        success: false,
        message: err.issues.map(e => e.message)
      });
    }
    console.error(err);
    res.status(500).send({ success: false, message: "Une erreur est survenue" });
  }
});
```

------------------------------------------------------------------------

## 📝 Résumé simple

1.  Génération du lien avec `userId` → Email envoyé ✅\
2.  L'utilisateur clique → `resetPassword/:token` ✅\
3.  Vérification du token et récupération de l'utilisateur ✅\
4.  Vérification que le nouveau mot de passe est différent ✅\
5.  Sauvegarde en base du mot de passe haché ✅

------------------------------------------------------------------------

## 📌 Points de sécurité

-   Utiliser `expiresIn` pour limiter la durée de validité du token.\
-   Ne jamais stocker un mot de passe en clair (toujours
    `bcrypt.hash`).\
-   Bloquer la réutilisation de l'ancien mot de passe.\
-   Cacher `JWT_SECRET` dans un fichier `.env`.

------------------------------------------------------------------------

✅ Avec ce système, ton API permet de réinitialiser les mots de passe de
façon **sécurisée et robuste**.
