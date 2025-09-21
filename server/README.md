# 🍪 Cookie vs 📦 Session

Ce document explique simplement la différence entre **cookie** et **session**.

---

## 🍪 Cookie (navigateur)

* C’est **côté client**, dans ton navigateur.
* C’est un petit papier/ticket que ton navigateur garde et renvoie au serveur à chaque requête.
* **Exemple** :

```
Cookie: connect.sid=abc123
```

* Tout seul, le cookie **ne contient pas tes données personnelles**, juste un identifiant.
* Il permet au serveur de savoir que c’est toi, mais il n’y a pas d’information complète dedans.

---

## 📦 Session (serveur)

* C’est **côté serveur** (en mémoire, dans une base de données ou Redis).
* C’est une boîte où le serveur **stocke des informations sur toi** (profil, rôle, login…)
* **Exemple** dans la mémoire du serveur :

```json
{
  "abc123": { "name": "Mounir", "email": "mounir@gmail.com" }
}
```

* Quand tu envoies le cookie `abc123`, le serveur regarde dans sa session et sait qui tu es.

---

## 🔗 Comment ça fonctionne ensemble

1. Tu te connectes → le serveur crée une **session** : `abc123` → `{name: Mounir}`
2. Le serveur envoie un **cookie** `connect.sid=abc123` au navigateur
3. Le navigateur renvoie ce cookie à chaque requête → le serveur retrouve la session → sait que c’est toi

---

## 🔹 Résumé simple

* **Cookie** = ton ticket côté navigateur
* **Session** = la mémoire côté serveur qui garde tes infos
* Ensemble, ils permettent de savoir si un utilisateur est connecté et de garder son état
