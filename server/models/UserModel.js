const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      default: "",
    },
    prenom: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["Non renseigné", "Etudiant", "Etudiante", "Professeur", "Admin"],
      default: "Non renseigné",
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    providerId:{
      type:Number,
    },
    niveaux: {
      type: String,
      enum: ["Non renseigné", "1AC", "2AC", "3AC", "TC", "1BAC", "2BAC"],
      default: "Non renseigné",
    },
    completeProfile: {
      type: Boolean,
      default: false,
    },
    accountVerified: {
      type: Boolean,
      default: false,
    },
    status:{
      type:String,
      default:"pending",
      enum:['pending','approved','declined']
    },
    blockedUntil: {
      type: Date,
      default: null,
    },
    blockReason: {
      type: String,
      default: "",
    },
    events: [
      {
        Date: {
          type: Date,
          required: true,
        },
        items: [
          {
            type: {
              type: String,
              required: true,
            },
            titre: {
              type: String,
              required: true,
            },
            Description: {
              type: String,
              required: false,
            },
          },
        ],
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    savedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    savedCours: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cours" }]
  },
  {
    timestamps: true,
  },
);

const UserModels = mongoose.model("User", UserSchema);

module.exports = UserModels;
