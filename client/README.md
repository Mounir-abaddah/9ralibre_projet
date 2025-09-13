# Ce que j’ai appris aujourd’hui

Aujourd’hui j’ai appris plusieurs notions importantes en JavaScript et React.

**1. test() vs match()**

- `test()` : retourne un boolean (`true` ou `false`)  
  Exemple : `/na/.test("banane"); // true`  

- `match()` : retourne un tableau avec les résultats trouvés, ou `null` si rien n’est trouvé  
  Exemple : `"banane".match(/na/g); // ["na", "na"]`  
  `"banane".match(/z/g);  // null`  

**2. .trim()**

- Supprime seulement les espaces au début et à la fin :  
  Exemple : `"   fff   ".trim(); // "fff"`  

- Pour enlever tous les espaces (y compris au milieu) :  
  Exemple : `"ff fff".replace(/\s+/g, ""); // "fffff"`  

**3. .Erreur TypeScript avec disabled dans React :**


disabled={isDisabled || Loading} 
Impossible d'assigner le type 'string | boolean' au type 'boolean | undefined'.

Explication : 
- La propriété `disabled` attend un boolean (true/false). 
- Si isDisabled contient une string (ex : "erreur"), TypeScript se plaint.

Solution : 
- Transformer toutes les chaînes en boolean avec `!!` :

const isDisabled =
  !nom.trim() ||
  !prenom.trim() ||
  !email.trim() ||
  !!ErrNom ||
  !!ErrPrenom ||
  !!ErrEmail;

<button disabled={isDisabled || Loading}>
  Inscrivez-vous
</button>

## 4. Composant `Input` réutilisable

Pour éviter la répétition des classes dans les formulaires, nous avons créé un composant `Input` réutilisable.

### ✅ Props du composant `Input`

| Prop         | Type                                     | Description |
| ------------ | --------------------------------------- | ----------- |
| `id`         | `string`                                 | Identifiant unique de l’input (lié au label) |
| `label`      | `string`                                 | Texte du label affiché au-dessus de l’input |
| `type`       | `"text"` \| `"email"` \| `"password"`   | Type de l’input HTML (`text`, `email`, `password`). Par défaut `"text"` |
| `value`      | `string`                                 | Valeur de l’input (state du formulaire) |
| `placeholder`| `string` (optionnel)                     | Texte affiché quand l’input est vide |
| `error`      | `string` (optionnel)                     | Message d’erreur à afficher sous l’input |
| `icon`       | `"mail"` \| `"lock"` (optionnel)        | Icone affichée à gauche de l’input |
| `onChange`   | `(value: string) => void`                | Fonction appelée à chaque changement de valeur |
| `onFocus`    | `() => void` (optionnel)                 | Fonction appelée quand l’input reçoit le focus |

### 🔹 Exemple d’utilisation

```tsx
<Input
  id="email"
  label="Email"
  type="email"
  value={email}
  placeholder="Entrez votre email"
  icon="mail"
  onChange={setEmail}
  onFocus={() => setErrEmail("")}
  error={ErrEmail}
/>

<Input
  id="password"
  label="Mot de passe"
  type="password"
  value={password}
  placeholder="Votre mot de passe"
  icon="lock"
  onChange={setPassword}
  onFocus={() => setErrPassword("")}
  error={ErrPassword}
/>


**Résumé rapide :**  
- `test()` → oui/non (boolean)  
- `match()` → résultat trouvé (array ou null)  
- `.trim()` → enlève les espaces début/fin (pas au milieu)  
- `disabled` sur un bouton → basé sur la validation du formulaire  
- Pour éviter l’erreur TypeScript, utiliser `!!` pour convertir les strings en boolean



