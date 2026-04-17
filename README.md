# Fonctionnalités Admin ajoutées

Ce document résume les changements implémentés pour l'espace admin.

## 1) Connexion admin + redirection

- Nouvelle route backend: `POST /auth/admin/connexion`
- La route `POST /auth/connexion` refuse maintenant les comptes `Admin` (message: utiliser la connexion admin).
- Côté frontend:
  - Page `client/src/pages/auth/Admin/Admin-connexion/AdminConnexion.tsx` connectée à `/auth/admin/connexion`.
  - Redirection de `Home` vers `/admin/dashboard` si l'utilisateur connecté a le rôle admin.

## 2) Accès home/élève bloqué pour admin

- Dans `Home`, si `data.role === "Admin"`, redirection automatique vers l’espace admin.
- Les routes élèves protégées restent déjà inaccessibles aux admins via `ProtectedRoute`.

## 3) Gestion utilisateurs admin (hors comptes Admin)

### Nouvelles données User

- `blockedUntil: Date | null`
- `blockReason: string`
- Rôle `Admin` ajouté dans l'enum `role`.

### Nouvelles routes backend

- `GET /user/admin/users`
  - Retourne tous les utilisateurs sauf les admins.
- `PATCH /user/admin/users/:userId/block`
  - Body: `{ "days": number, "reason": string }`
  - `days > 0`: bloque l'utilisateur jusqu'à `now + days`.
  - `days = 0`: débloque l'utilisateur.

### Règle de blocage appliquée

- Middleware `authMiddleware` vérifie `blockedUntil`.
- Si la date de blocage est future, l'accès API est refusé (`403`).

## 4) Signalement vidéos + commentaires

### Modèle vidéo enrichi

Dans `VideosModel`:

- `reports` au niveau vidéo.
- `reports` au niveau commentaire.

Chaque report contient:

- `user`
- `reason`
- `createdAt`

### Nouvelles routes backend

- `POST /videos/report/:videoId`
  - Body: `{ "reason": "..." }`
- `POST /videos/report-comment/:videoId/:commentsId`
  - Body: `{ "reason": "..." }`

Un utilisateur ne peut signaler qu'une fois la même vidéo / le même commentaire.

## 5) Récupération des signalements dans l'espace admin

- Nouvelle route backend: `GET /user/admin/reports`
- Retourne:
  - `videoReports[]`
  - `commentReports[]`

## 6) Pages admin frontend ajoutées

- `client/src/pages/auth/Admin/Dashboard/AdminDashboard.tsx`
- `client/src/pages/auth/Admin/Users/AdminUsers.tsx`
- `client/src/pages/auth/Admin/Signals/AdminSignals.tsx`

Routes frontend ajoutées:

- `/admin/dashboard`
- `/admin/users`
- `/admin/signals`

## 7) Sécurité admin backend

Dans `UserRoute`, un guard `ensureAdmin` protège les endpoints admin.

---

Si tu veux, je peux faire une 2e passe pour:

- ajouter des boutons "Signaler" dans les composants vidéo/commentaire côté UI élève,
- améliorer le dashboard admin (filtres, pagination, actions sur signalements),
- ajouter des statuts de traitement des signalements (en attente / résolu / rejeté).

## 8) Modération + Appeals (ajouté)

### Backend

- Nouveau modèle: `ModerationLog`
  - actions: `BLOCK`, `UNBLOCK`, `APPEAL_REVIEWED`
- Nouveau modèle: `Appeal`
  - statut: `PENDING`, `APPROVED`, `REJECTED`

Routes ajoutées:

- `GET /user/admin/moderation-logs`
- `GET /user/admin/appeals`
- `PATCH /user/admin/appeals/:appealId/review`
- `POST /auth/appeal` (publique, pour envoyer une demande de déblocage)

Comportement:

- Chaque blocage/déblocage crée une entrée de log de modération.
- Une demande d’appel approuvée débloque automatiquement l’utilisateur.

### Frontend

Pages ajoutées:

- `client/src/pages/auth/Admin/Moderation-log/AdminModerationLog.tsx`
- `client/src/pages/auth/Admin/Appeals/AdminAppeals.tsx`
- `client/src/pages/Appeal/AppealPage.tsx`

Routes frontend:

- `/admin/moderation-log`
- `/admin/appeals`
- `/appeal`

Navigation admin mise à jour pour inclure les deux nouvelles pages.
