# 📡 Chat Temps Réel avec Socket.IO

## 🧠 Description

Ce projet implémente un système de chat en temps réel utilisant
**Socket.IO** avec :

-   Frontend : React + Socket.IO Client
-   Backend : Node.js + Express + Socket.IO Server

Fonctionnalités principales :

-   ✅ Envoi et réception de messages en temps réel
-   ✅ Statut En ligne / Hors ligne
-   ✅ Système de confirmation "Vu" (✓✓)
-   ✅ Gestion des rooms par conversation
-   ✅ Synchronisation automatique des utilisateurs connectés

------------------------------------------------------------------------

# ⚙️ Architecture Socket

Le système fonctionne avec :

-   Des événements personnalisés (custom events)
-   Des rooms (salons privés)
-   Une Map des utilisateurs connectés
-   Une communication bidirectionnelle client ↔ serveur

------------------------------------------------------------------------

# 🖥️ Backend -- Fonctionnement Socket.IO

## Initialisation du serveur

``` js
const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
});
```

Le serveur HTTP est créé puis Socket.IO est attaché dessus. Le CORS
autorise le frontend à se connecter.

------------------------------------------------------------------------

# 👥 Gestion des utilisateurs en ligne

``` js
const onlineUsers = new Map();
```

Structure :

userId → socketId

------------------------------------------------------------------------

## 1️⃣ User Online

``` js
socket.on("user:online", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("users:online", Array.from(onlineUsers.keys()));
});
```

Quand un utilisateur se connecte :

-   Il envoie son userId
-   On l'enregistre dans la Map
-   On broadcast la liste des users connectés

Cela permet d'afficher : 🟢 En ligne\
🔴 Hors ligne

------------------------------------------------------------------------

# 💬 Gestion des conversations (Rooms)

## Rejoindre une conversation

``` js
socket.on("conversation:join", (conversationId) => {
    socket.join(conversationId);
});
```

Chaque conversation est une room privée. Seuls les membres de la room
reçoivent les messages.

------------------------------------------------------------------------

## Quitter une conversation

``` js
socket.on("conversation:leave", (conversationId) => {
    socket.leave(conversationId);
});
```

------------------------------------------------------------------------

# ✉️ Envoi et Réception des messages

## Envoi côté client

1.  Message sauvegardé en base via HTTP
2.  Message envoyé via socket

``` js
socket.emit("message:send", newMessage);
```

------------------------------------------------------------------------

## Réception côté serveur

``` js
socket.on("message:send", (message) => {
    socket.to(message.conversationId)
          .emit("message:receive", message);
});
```

Explication :

-   On envoie le message
-   Seulement aux autres membres de la room
-   Pas à l'expéditeur

------------------------------------------------------------------------

# 👁️ Système "Vu"

## Quand un message est lu

``` js
socket.emit("message:seen", {
  conversationId,
  userId
});
```

## Côté serveur

``` js
socket.on("message:seen", ({ conversationId, userId }) => {
    socket.to(conversationId)
          .emit("message:seen:update", { conversationId, userId });
});
```

Cela met à jour le statut :

✓ Envoyé\
✓✓ Vu

------------------------------------------------------------------------

# 🔌 Déconnexion

``` js
socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
            onlineUsers.delete(userId);
            break;
        }
    }
    io.emit("users:online", Array.from(onlineUsers.keys()));
});
```

Quand un utilisateur se déconnecte :

-   On le supprime de la Map
-   On met à jour la liste globale

------------------------------------------------------------------------

# 🚀 Résumé du Flux Temps Réel

Connexion → user:online\
Rejoindre conversation → conversation:join\
Envoyer message → message:send\
Recevoir message → message:receive\
Message lu → message:seen\
Mise à jour vu → message:seen:update\
Déconnexion → mise à jour users:online

------------------------------------------------------------------------

# 🏁 Conclusion

Cette implémentation permet :

-   Une communication instantanée
-   Une gestion propre des utilisateurs connectés
-   Une séparation claire entre sauvegarde BDD (HTTP) et temps réel
    (Socket)
-   Un système proche de WhatsApp en comportement

------------------------------------------------------------------------

Auteur : Mounir
