# Documentation - API getCours

## Route
```
GET /getCours/:niveauxNom
```

## Description
Cette route permet de récupérer tous les cours d'un niveau spécifique avec des filtres optionnels : matière, semestre, type, filière et recherche textuelle.

## Paramètres de l'URL
| Paramètre | Description |
|-----------|-------------|
| `niveauxNom` | Nom du niveau à récupérer (ex: 2BAC, 1BAC) |

## Query Parameters (optionnels)
| Paramètre | Description |
|-----------|-------------|
| `matiere` | Nom de la matière à filtrer (ex: SVT, Maths) |
| `semestre` | Semestre à filtrer (ex: Premier Semestre, Deuxième Semestre) |
| `type` | Type de cours à filtrer (Cours, Exercice, Examen National, Examen Régional) |
| `filiere` | Filière à filtrer (ex: Sciences Économiques) |
| `search` | Mot clé pour rechercher dans le titre, professeur, semestre ou matière |
| `page` | Numéro de la page pour pagination (default: 1) |
| `limit` | Nombre de cours par page (default: 6) |

## Logique de la route
1. **Récupération du niveau** : on cherche dans la collection `Niveaux` le document correspondant au `niveauxNom` pour obtenir son `_id`.
2. **Récupération des matières** : on récupère toutes les matières du niveau. Si `matiere` est précisé, on filtre par son nom. On transforme le résultat en tableau d'IDs (`matiereIds`).
3. **Filtrage des cours** : on crée un `queryObject` avec `matiere: { $in: matiereIds }`. On ajoute ensuite les filtres simples `semestre`, `type` et `filiere` si précisés.
4. **Filtre search** : si `search` est passé, on crée un `RegExp` insensible à la casse et on ajoute un `$or` sur `title`, `professeur`, `semestre` et `matiere`.
5. **Populate** : on utilise `populate` pour remplacer les IDs de `matiere` et `niveaux` par les documents complets.
6. **Pagination** : on utilise `skip` et `limit` pour renvoyer seulement les cours de la page demandée.
7. **Retour JSON** : la réponse contient `success`, `totalCours`, `limit`, `skip`, `totalPages` et le tableau `cours`.

## Exemple d'appel
```
GET /getCours/2BAC?matiere=SVT&semestre=Deuxième%20Semestre&search=Limites&page=1&limit=6
```

## Exemple de réponse
```json
{
  "success": true,
  "totalCours": 1,
  "limit": 6,
  "skip": 0,
  "totalPages": 1,
  "cours": [
    {
      "_id": "6910bb1c196057b691dba070",
      "matiere": {
        "_id": "6905f1f552cd395c8e791695",
        "nom": "SVT",
        "niveaux": {
          "_id": "6908f514a36cd8cd2eaab15b",
          "nom": "2BAC"
        }
      },
      "title": "Limites",
      "semestre": "Deuxième Semestre",
      "type": "Exercice",
      "filière": "Sciences Économiques",
      "professeur": "Larbi abaddah",
      "pdfUrl": "uploads/fonctions.pdf",
      "createdAt": "2025-11-09T16:02:36.073Z",
      "updatedAt": "2025-11-09T16:02:36.073Z"
    }
  ]
}
```

## Notes
- `RegExp` avec le flag `i` est utilisé pour rendre la recherche insensible à la casse.
- `$in` permet de filtrer tous les cours dont le champ `matiere` est dans la liste des IDs filtrés.
- `$or` permet de faire une recherche sur plusieurs champs à la fois, renvoyant les cours qui matchent au moins un champ.
- Les filtres simples (matiere, semestre, type, filière) sont cumulatifs, tous doivent être respectés. 