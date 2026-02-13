# 💬 Real-Time Messagerie API -- Socket.IO + Express + MongoDB

Backend d'une application de messagerie en temps réel utilisant :

-   Node.js
-   Express.js
-   MongoDB avec Mongoose
-   Socket.IO
-   JWT + Passport
-   Architecture MERN

------------------------------------------------------------------------

# 🚀 Installation du projet

## 1️⃣ Cloner le projet

``` bash
git clone https://github.com/ton-username/ton-repository.git
cd ton-repository
```

------------------------------------------------------------------------

## 2️⃣ Installer les dépendances

``` bash
npm install
```

### 📦 Dépendances principales

``` bash
npm install express mongoose cors dotenv passport cookie-parser socket.io
```

Si tu n'as pas nodemon :

``` bash
npm install --save-dev nodemon
```

------------------------------------------------------------------------

## 3️⃣ Configurer le fichier .env

Créer un fichier `.env` à la racine du projet :

``` env
PORT=5000
MONGO_URI=mongodb://localhost:27017/nom_de_ta_db
FRONTEND_URL=http://localhost:5173
JWT_SECRET=ton_secret
```

------------------------------------------------------------------------

## 4️⃣ Lancer le serveur

``` bash
npm run dev
```

ou

``` bash
node server.js
```

------------------------------------------------------------------------

# 🧠 Architecture du projet

## 📁 Structure

    config/
    models/
    routes/
    middlewares/
    uploads/
    server.js

------------------------------------------------------------------------

# 🔌 Configuration Socket.IO

``` js
const httpServer = createServer(app);

const io = new Server(httpServer,{
    cors:{
        origin:process.env.FRONTEND_URL,
        credentials:true
    }
});
```

------------------------------------------------------------------------

# 📡 Fonctionnement des Sockets

## ✅ Connexion utilisateur

``` js
io.on("connection", (socket) => {
    console.log("Un utilisateur est connecté : ", socket.id);
});
```

------------------------------------------------------------------------

## 🏠 Rejoindre une conversation (Room)

``` js
socket.on("joinRoom", (conversationId) => {
    socket.join(conversationId);
});
```

Chaque conversation possède son propre `conversationId`. Cela permet
d'envoyer les messages uniquement aux membres concernés.

------------------------------------------------------------------------

## ✉️ Envoyer un message en temps réel

``` js
socket.on("sendMessage", ({ conversationId, message }) => {
    socket.to(conversationId).emit("receiveMessage", message);
});
```

-   Le message est sauvegardé en base via API REST
-   Puis envoyé en temps réel via Socket.IO

------------------------------------------------------------------------

## ❌ Déconnexion

``` js
socket.on("disconnect", () => {
    console.log("Utilisateur déconnecté : ", socket.id);
});
```

------------------------------------------------------------------------

# 🗄️ Modèles MongoDB

## Conversation Model

-   members : tableau d'utilisateurs
-   timestamps activés

## Message Model

-   conversationId
-   sender
-   text
-   readBy (gestion des messages lus)
-   timestamps activés

------------------------------------------------------------------------

# 🔐 Sécurité

-   Authentification JWT
-   Middleware Passport
-   Accès protégé aux routes

------------------------------------------------------------------------

# ✅ Fonctionnalités implémentées

-   Création automatique de conversation
-   Liste des conversations triées par dernière activité
-   Compteur de messages non lus
-   Marquage des messages comme lus
-   Messagerie temps réel avec rooms Socket.IO

------------------------------------------------------------------------

# 👨‍💻 Auteur

Projet développé dans le cadre d'un apprentissage MERN Stack +
Socket.IO.
