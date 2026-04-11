const {z} = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Identifiant invalide" });

const addCoursSchema = z.object({
    matiere: objectId,
    semestre: z.enum(["Premier Semestre", "Deuxième Semestre","Non renseigné"],
    ({ message: "Semestre invalide" }) ),
    type: z.enum(["Cours", "Exercice", "Examen", "Examen National", "Examen Régional"],
    ({ message: "Type invalide" })),
    filiere: z.string().min(2, "Filière requise"),
    title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
});

const visibilityEnum = z.enum(["Public", "Private"], {
  message: "Visibilité invalide",
});

const addVideoSchema = z.object({
  title: z.string().min(3, "Titre trop court"),
  description: z.string().optional(),
  videoUrl: z.string().url("URL vidéo invalide"),
  thumbnail: z.string().url("Thumbnail invalide").optional(),
  matiere: objectId,
  niveaux: objectId,
  filiere: z.string().min(2, "Filière requise"),
  visibility: visibilityEnum.optional(),
});

const updateVideoSchema = addVideoSchema.partial();


const questionSchema = z.object({
  question: z.string().min(1, "Question vide"),
  options: z.array(z.string().min(1)).min(2, "Minimum 2 réponses"),
  correctAnswer: z.number({
    required_error: "Choisir une bonne réponse",
  }),
}).refine(
  (data) =>
    data.correctAnswer >= 0 &&
    data.correctAnswer < data.options.length,
  {
    message: "Réponse correcte invalide",
    path: ["correctAnswer"],
  }
);

// =======================
// ✅ ADD QUIZ
// =======================
const addQuizSchema = z.object({
  text: z.string().min(3, "Titre requis"),
  matiere: objectId,
  filiere: z.string().min(2, "Filière requise"),
  questions: z
    .array(questionSchema)
    .min(5, "Minimum 5 questions requises"), // 🔥 ICI
});




const registerSchema = z.object({
  nom: z.string().min(2, "Nom requis"),
  prenom: z.string().min(2, "Prénom requis"),
  email: z.string().email("Email invalide"),

  niveaux: z.string().min(1, "Niveau requis"),

  password: z
    .string()
    .min(8, "Le mot de passe doit contenir minimum 8 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Le mot de passe doit contenir majuscule, minuscule, chiffre et caractère spécial"
    ),
});


const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
});




module.exports = {addCoursSchema,addVideoSchema,updateVideoSchema,addQuizSchema,registerSchema,loginSchema}

