const { z } = require("zod");

const registerShema = z.object({
  nom: z.string()
    .min(2, "le nom doit contenir minimum 2 caractères")
    .regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ]+$/, "le nom ne doit contenir que des lettres"),
  
  prenom: z.string()
    .min(2, "le prénom doit contenir minimum 2 caractères")
    .regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ]+$/, "le prénom ne doit contenir que des lettres"),
  
  type: z.enum(["Etudiant", "Etudiante"]),

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

module.exports = { registerShema ,loginSchema ,messageOUblierSchema };
