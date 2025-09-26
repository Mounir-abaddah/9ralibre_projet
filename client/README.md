# VerificationEmail Component

## 📌 Description

Le composant `VerificationEmail` est une page React qui permet à un utilisateur de **vérifier son email** après l'inscription.

Fonctionnalités principales :
- Vérifie le token de confirmation envoyé par email via une requête à l'API.
- Affiche le statut de la vérification (en cours, succès, échec).
- Redirige automatiquement l'utilisateur vers la page de connexion après un délai de 5 secondes si la vérification est réussie.
- Affiche un **compte à rebours** avant la redirection.

---

## ⚡ Installation

1. Assurez-vous d'avoir un projet React configuré avec `react-router-dom` et `axios`.
2. Installer `react-hot-toast` pour afficher les notifications :

```bash
npm install react-hot-toast
```

ou

```bash
yarn add react-hot-toast
```

---

## 🛠 Utilisation

### Création du composant

Créez un fichier `VerificationEmail.jsx` et collez le code suivant :

```tsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const VerificationEmail = () => {
  document.title = "Confirmation de votre compte | 9ralibre";
  const navigate = useNavigate();
  const { token } = useParams(); // Récupère le token depuis l’URL
  const apiUrl = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState<boolean>(true); // Indique si la requête est en cours
  const [verified, setVerified] = useState<boolean>(false); // Indique si l’email est validé
  const [countdown, setCountdown] = useState<number>(5); // Compte à rebours avant redirection

  // Vérifie l’email via l’API
  useEffect(() => {
    const handleValidationEmail = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/confirm-email/${token}`);
        if (response.data.success) {
          setVerified(true);
        }
      } catch (error) {
        if (error && axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Lien invalide ou expiré");
        }
      } finally {
        setLoading(false);
      }
    };

    handleValidationEmail();
  }, [apiUrl, token]);

  // Lance le compte à rebours et redirige
  useEffect(() => {
    if (verified) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const timeout = setTimeout(() => {
        navigate('/connexion');
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [verified, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {loading ? (
        <p>⏳ Vérification en cours...</p>
      ) : verified ? (
        <p>
          ✅ Votre email a été vérifié avec succès !
          <br />
          ⏳ Redirection dans {countdown} seconde{countdown > 1 ? 's' : ''}...
        </p>
      ) : (
        <p>❌ Impossible de vérifier votre email.</p>
      )}
    </div>
  );
};

export default VerificationEmail;
```

### Ajouter la route dans `App.jsx`

```jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VerificationEmail from './VerificationEmail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/confirm-email/:token" element={<VerificationEmail />} />
      </Routes>
    </Router>
  );
}
```

---

## 🔧 Comportement

- **Loading** : affiche `⏳ Vérification en cours...` pendant la requête.
- **Success** : affiche `✅ Votre email a été vérifié avec succès !` et lance un compte à rebours de 5 secondes avant la redirection.
- **Erreur** : affiche `❌ Impossible de vérifier votre email.` si le token est invalide ou expiré.

---

## 📝 Personnalisation

- Modifier le titre de la page :
```js
document.title = "Confirmation de votre compte | VotreSite";
```
- Modifier la durée du compte à rebours ou la route de redirection :
```js
const [countdown, setCountdown] = useState(5);
navigate('/connexion');
```

---

## ⚙️ Dépendances

- React
- react-router-dom
- axios
- react-hot-toast

---

## 💡 Exemple d'utilisation

```jsx
const navigate = useNavigate();
navigate('/connexion'); // Redirection après vérification réussie
```

