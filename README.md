# 📘 Cours Component — Explication Complète

Ce document README.md explique **tout le fonctionnement** du composant `Cours` :
- les hooks utilisés (`useEffect`, `useRef`, `useCallback`, etc.)
- les filtres
- la pagination
- le search avec `useDebounce`
- la logique de synchronisation URL ↔ filtres
- l'utilisation des API

Ce README est conçu pour être **clair**, **simple**, et **pédagogique**.

---

# 🔥 1. Introduction

Le composant **Cours** permet d'afficher :
- une liste de cours par niveau (ex : `2BAC`)
- avec filtres : matière, semestre, type, filière
- une recherche avec `useDebounce`
- une pagination
- une synchronisation automatique avec l'URL

Il utilise plusieurs hooks React avancés :
- `useState`
- `useEffect`
- `useRef`
- `useCallback`
- et des hooks custom : `useDebounce`, `useCoursFilter`

---

# 🧠 2. Les Interfaces Typescript

```ts
interface Matiere {
  _id: string;
  nom: string;
  niveaux: string;
}

interface Cours {
  _id: string;
  title: string;
  semestre: string;
  type: string;
  professeur: string;
  filière: string;
  pdfUrl: string;
  matiere: Matiere;
}
```

Elles servent à définir la structure reçue depuis l'API.

---

# ⚙️ 3. Les States importants

### 📌 `loading`
Indique si les cours sont en train d'être récupérés.

### 📌 `cours`
La liste des cours reçus depuis l'API.

### 📌 `search`
Le texte que tape l'utilisateur.

### 📌 `debounceSearch`
Version "ralentie" du search (réduire les requêtes API).

### 📌 `currentPage`
La page actuelle pour la pagination.

### 📌 `totalCours`
Nombre total de cours retournés par l'API.

### 📌 `isInitialMount`
Boîte secrète (useRef) pour savoir si c'est le premier rendu.

---

# ⏳ 4. `useDebounce`

`useDebounce(search, 500)` attend **500 ms** après que l'utilisateur arrête de taper.

Cela évite :
- 20 requêtes API pendant que l’utilisateur tape
- et réduit la charge

---

# 🎒 5. `useRef(true)` pour détecter le premier rendu

```ts
const isInitialMount = useRef(true);
```

### But :
Empêcher que la page se réinitialise à la page 1 **au premier chargement**.

Dans l'effet suivant :

```ts
useEffect(() => {
  if (isInitialMount.current) {
    isInitialMount.current = false;
    return;
  }
  setCurrentPage(1);
}, [matiere, semestre, type, filiere, debounceSearch]);
```

### Fonctionnement :
- 1ère fois → `isInitialMount.current === true` → ne rien faire
- Après → repasser à page 1 quand un filtre change

---

# 🌐 6. Requête API pour récupérer les cours

```ts
useEffect(() => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const params = new URLSearchParams();

  params.append('page', currentPage.toString());
  params.append('limit', itemsPerPage.toString());

  if (matiere) params.append('matiere', matiere);
  if (semestre) params.append('semestre', semestre);
  if (type) params.append('type', type);
  if (filiere) params.append('filiere', filiere);
  if (debounceSearch.trim() !== '') params.append('search', debounceSearch.trim());

  const getAllCours = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/cours/getCours/${niveaux}?${params.toString()}`, { withCredentials: true });
      if (res.data.success) {
        setCours(res.data.cours);
        setTotalCours(res.data.totalCours);
      }
    } catch (err) {
      console.log(err);
      setCours([]);
      setTotalCours(0);
    } finally {
      setLoading(false);
    }
  };

  getAllCours();
}, [currentPage, debounceSearch, filiere, matiere, niveaux, search, semestre, type]);
```

### Fonction :
- Chaque fois que **currentPage** ou un filtre change → appel API
- Récupère les cours filtrés
- Met à jour l’état

---

# 🔄 7. Synchronisation URL ↔ Filtres

## 📌 A → B : Filtres → URL

```ts
useEffect(() => {
  const params: Record<string, string> = {};
  if (matiere) params.matiere = matiere;
  if (semestre) params.semestre = semestre;
  if (type) params.type = type;
  if (filiere) params.filiere = filiere;
  if (debounceSearch.trim() !== '') params.search = debounceSearch.trim();
  if (currentPage > 1) params.page = currentPage.toString();
  setSearchParams(params);
}, [matiere, semestre, type, setSearchParams, search, filiere, currentPage, debounceSearch]);
```

### 🔍 Exemple :
```
?matiere=SVT&type=Cours&page=2&search=energie
```

---

## 📌 B → A : URL → Filtres

```ts
useEffect(() => {
  const m = searchParams.get("matiere");
  const s = searchParams.get('semestre');
  const t = searchParams.get('type');
  const f = searchParams.get('filiere');
  const q = searchParams.get('search');
  const p = searchParams.get('page');

  setMatiere(m);
  setSemestre(s);
  setType(t);
  setFiliere(f);
  setSearch(q || '');
  setCurrentPage(p ? parseInt(p) : 1);
}, [searchParams, setMatiere, setSemestre, setType, setFiliere]);
```

### Fonctionnement :
Quand quelqu’un partage le lien → les filtres se mettent automatiquement.

---

# ♻️ 8. useCallback : Réinitialiser les filtres

```ts
const handleResetAll = useCallback(() => {
  resetAll();
  setSearch('');
  setCurrentPage(1);
}, [resetAll]);
```

### Pourquoi `useCallback` ?
- Pour éviter de recréer la fonction à chaque rendu
- Pour performance

---

# 🎨 9. Affichage UI des cours

Chaque carte (`Card`) affiche :
- le professeur
- la matière
- le type de cours
- le semestre
- un bouton pour ouvrir le PDF

---

# 🧩 10. Filtres Matière / Semestre / Type / Filière

Passés au composant :

```tsx
<Matiere
  niveaux={niveaux}
  items={optionsCollege}
  selectedMatiere={matiere}
  selectedSemestre={semestre}
  selectedType={type}
  selectedFiliere={filiere}
  onChangeMatiere={setMatiere}
  onChangeSemestre={setSemestre}
  onChangeType={setType}
  onChangeFiliere={setFiliere}
/>
```

---

# 📄 11. Pagination

```tsx
<Pagination
  itemsPerPage={itemsPerPage}
  currentPage={currentPage}
  totalItems={totalCours}
  onPageChange={(page) => setCurrentPage(page)}
/>
```

### La pagination :
- aide à ne pas charger 10000 cours en même temps

---

# 🧑‍🏫 12. Icône professeur

Composant simple SVG.

```tsx
export const IconeProfesseur = () => {
  return (
    <svg ...>
      ...
    </svg>
  );
};
```

---

# 🎯 Résumé général

| Fonction | Rôle |
|---------|------|
| `useState` | Gérer les valeurs changées par l’utilisateur |
| `useRef(true)` | Savoir si c’est le premier rendu |
| `useCallback` | Mémoriser une fonction |
| `useEffect` | Requête API, mettre URL à jour, lire URL |
| `useDebounce` | Ralentir la recherche |
| `useCoursFilter` | Stocker filtres globalement |
| `axios` | Appeler l’API |

---

Si tu veux, je peux te faire :
- une version **simplifiée**
- un schéma **dessiné**
- ou un **diagramme complet** du fonctionnement !

