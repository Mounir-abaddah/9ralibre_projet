# 📧 Confirmation d'Email – 9ralibre

Ce module permet d'ajouter une **vérification par email** lors de l'inscription d'un utilisateur.  
Un email contenant un lien de confirmation est envoyé à l'utilisateur.  
Celui-ci doit cliquer dessus pour activer son compte. ✅

---

## 🚀 Fonctionnalités

- Validation des données d'inscription avec **Zod**.
- Vérification que l'email n'existe pas déjà dans la base de données.
- Hachage du mot de passe avec **bcrypt**.
- Création d'un nouvel utilisateur avec le champ `accountVerified: false`.
- Génération d’un **token JWT temporaire (1h)** contenant l'ID de l’utilisateur et un type `verifyEmail`.
- Envoi d’un email avec **Nodemailer** incluant un lien de confirmation.
- Vérification du token à la réception du lien pour activer le compte.

---

## 📂 Code principal

### 1. **Inscription et envoi du mail de confirmation**

\`\`\`js
router.post('/register', async (req, res) => {
  try {
    // 1. Validation des données
    const registerValidation = registerShema.parse(req.body);

    // 2. Vérification si l'email existe déjà
    const emailExists = await User.findOne({ email: registerValidation.email });
    if (emailExists) {
      return res.status(400).send({ message: 'Impossible de créer un compte avec ces informations', success: false });
    }

    // 3. Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(registerValidation.password, 10);

    // 4. Création de l'utilisateur (non vérifié)
    const newUser = new User({
      nom: registerValidation.nom,
      prenom: registerValidation.prenom,
      type: registerValidation.type,
      email: registerValidation.email,
      password: hashedPassword,
      accountVerified: false
    });
    await newUser.save();

    // 5. Génération du token de vérification
    const verifiedToken = jwt.sign(
      { userId: newUser._id, type: "verifyEmail" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const accountVerifiedUrl = \`\${process.env.FRONTEND_URL}/register/confirm-email/\${verifiedToken}\`;

    // 6. Envoi de l’email avec Nodemailer
    var transporter = nodemailer.createTransport({
      service: 'GMAIL',
      auth: {
        user: process.env.EMAIL_CLIENT,
        pass: process.env.PASSWORD_CLIENT
      }
    });

    var mailOption = {
      from: process.env.EMAIL_CLIENT,
      to: registerValidation.email,
      html: \`<p>Bonjour \${newUser.nom},</p>
             <p>Merci pour votre inscription sur <b>9ralibre</b>. Veuillez confirmer votre email :</p>
             <a href="\${accountVerifiedUrl}">Confirmer mon adresse email</a>\`
    };

    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(400).send({ message: "Compte créé, mais erreur lors de l'envoi de l'email de vérification", success: false });
      }
      return res.status(200).send({ message: "Lien de confirmation envoyé ✅", success: true });
    });

  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).send({ success: false, message: err.issues.map(e => e.message) });
    }
    res.status(500).send({ message: 'Une erreur est survenue', success: false });
  }
});
\`\`\`

---

### 2. **Confirmation de l’email**

\`\`\`js
router.get('/confirm-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupération de l'utilisateur
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).send({ message: "Lien invalide ou expiré ❌", success: false });
    }

    // Vérifie si déjà confirmé
    if (user.accountVerified) {
      return res.status(200).send({ message: "Votre compte est déjà vérifié ✅", success: true });
    }

    // Active le compte
    user.accountVerified = true;
    await user.save();

    return res.status(200).send({ success: true, message: "Compte vérifié avec succès ✅" });

  } catch (err) {
    return res.status(400).send({ message: "Une erreur est survenue", success: false });
  }
});
\`\`\`

---

## 🛠️ Modèle utilisateur

\`\`\`js
accountVerified: {
  type: Boolean,
  default: false
}
\`\`\`

---

## ✅ Résultat attendu

1. L’utilisateur s’inscrit → reçoit un **email de confirmation**.
2. Il clique sur le lien → son **compte est activé**.
3. Tant qu’il n’a pas confirmé son email → \`accountVerified = false\`.

---

## 📌 Variables d’environnement nécessaires

\`\`\`env
JWT_SECRET=ton_secret_jwt
FRONTEND_URL=http://localhost:3000
EMAIL_CLIENT=ton_email@gmail.com
PASSWORD_CLIENT=mot_de_passe_application
\`\`\`

---

## 📧 Exemple d’email envoyé

- Sujet : **Vérification du compte – 9ralibre**
- Contenu : lien de confirmation valable **1 heure**.
- Style HTML avec bouton personnalisé.

---

## 🔒 Sécurité

- Token JWT avec **expiration de 1h**.
- Champ \`type: "verifyEmail"\` pour éviter les confusions avec d’autres tokens.
- Empêche la connexion d’un compte non vérifié.

---
