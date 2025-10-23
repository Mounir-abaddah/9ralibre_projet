const { z } = require("zod");

const registerShema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string()
    .min(8, "le mot de passe doit contenir minimum 8 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
    ),
});

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court" ),
});

const messageOUblierSchema = z.object({
  email:z.string().email("Email invalid")
})

const passwordResetShema = z.object({
  password: z.string()
    .min(8, "le mot de passe doit contenir minimum 8 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
    )
});

const completeProfileShema = z.object({
  nom: z.string()
    .min(2, "le nom doit contenir minimum 2 caractères")
    .regex(/^(?!.* {2})(?!.*'')[A-Za-zÀ-ÖØ-öø-ÿ]+([ '][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/, "le nom ne doit contenir que des lettres"),
  
  prenom: z.string()
    .min(2, "le prénom doit contenir minimum 2 caractères")
    .regex(/^(?!.* {2})(?!.*'')[A-Za-zÀ-ÖØ-öø-ÿ]+([ '][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/, "le prénom ne doit contenir que des lettres"),
  
  role:z.enum(['Non renseigné','Etudiant','Etudiante']),

  niveaux:z.enum(['1AC','2AC','3AC','TC','1BAC','2BAC']),

  password: z.string()
    .min(8, "le mot de passe doit contenir minimum 8 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
    ).optional()
});

const EventsShema = z.object({
  Date:z.string().transform(val=>new Date(val)).refine(val => !isNaN(val.getTime()),{message:"Date invalide"}),
  type:z.array(z.string().regex(/^[a-zA-ZÀ-ÿ0-9\s'’.,;:!?()/ -]{1,100}$/,{message:"Le type contient des caractères non autorisés"}).min(3,"Le type doit contenir au moins 3 caractères")),
  titre:z.string().regex(/^[a-zA-ZÀ-ÿ0-9\s'’.,;:!?()/ -]{1,100}$/,{message:"Le titre contient des caractères non autorisés"}).min(3,"Le titre doit contenir au moins 3 caractères"),
  Description:z.string().regex(/^[a-zA-ZÀ-ÿ0-9\s'’.,;:!?()/ -]{1,100}$/,{message:"La description contient des caractères non autorisés"}).max(100,"La description est trop longue").optional(),
})

module.exports = { registerShema ,loginSchema ,messageOUblierSchema,passwordResetShema , completeProfileShema , EventsShema};
