const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "GMAIL",
  auth: {
    user: process.env.EMAIL_CLIENT,
    pass: process.env.PASSWORD_CLIENT,
  },
});

// ─── Shared layout ────────────────────────────────────────────────────────────
function emailLayout(content) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>9ralibre</title>
</head>
<body style="margin:0; padding:0; background-color:#ffffff; font-family:Arial, Helvetica, sans-serif; color:#333333;">

  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; padding:30px 20px;">

    <!-- Logo -->
    <tr>
      <td style="padding-bottom:30px;">
        <img src="https://res.cloudinary.com/dhwykorkn/image/upload/v1776516235/adubkosh3eofxsx5pe14.png"
             alt="9ralibre" width="120"
             style="display:block;" />
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="font-size:15px; line-height:1.7; color:#333333;">
        ${content}
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding-top:40px; border-top:1px solid #e5e7eb; margin-top:30px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:13px; color:#555555; line-height:1.6;">
              <p style="margin:0;">À bientôt,</p>
              <p style="margin:4px 0 8px;"><strong>L'équipe 9ralibre 🚀</strong></p>
              <p style="margin:0; font-size:12px; color:#6b7280;">📧 contact@9ralibre.com</p>
            </td>
            <td style="text-align:right; vertical-align:bottom;">
              <span style="font-size:12px; color:#9ca3af;">© ${new Date().getFullYear()} 9ralibre</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

  </table>

</body>
</html>`;
}

// ─── Shared button ─────────────────────────────────────────────────────────────
function emailButton(href, label) {
  return `
    <table cellpadding="0" cellspacing="0" style="margin:28px 0;">
      <tr>
        <td>
          <a href="${href}"
            style="display:inline-block; background-color:#0ea5e9; color:#ffffff;
                    padding:13px 28px; border-radius:6px; text-decoration:none;
                    font-size:15px; font-weight:bold;">
            ${label}
          </a>
        </td>
      </tr>
    </table>`;
}

// ─── Quote box ─────────────────────────────────────────────────────────────────
function quoteBox(text, color = "#0ea5e9") {
  return `<div style="background:#f8fafc; border-left:4px solid ${color}; padding:12px 16px; margin:16px 0; font-size:14px; color:#555555; border-radius:0 4px 4px 0;">
    ${text}
  </div>`;
}

// ─── 1. Vérification du compte ─────────────────────────────────────────────────
async function sendVerificationEmail(user, accountVerifiedUrl) {
  const content = `
    <p>Bonjour <strong>${user.nom} ${user.prenom}</strong>,</p>
    <p>Merci de vous être inscrit sur <strong>9ralibre</strong> 🎉</p>
    <p>Veuillez confirmer votre adresse email pour activer votre compte :</p>
    ${emailButton(accountVerifiedUrl, "✅ Confirmer mon adresse email")}
    <p style="font-size:13px; color:#6b7280;">⚠️ Ce lien expirera dans <strong>24 heures</strong> pour des raisons de sécurité.</p>
  `;

  return transporter.sendMail({
    from: process.env.EMAIL_CLIENT,
    to: user.email,
    subject: "Vérification de votre compte",
    html: emailLayout(content),
  });
}

// ─── 2. Mot de passe oublié (étudiant) ────────────────────────────────────────
async function oublierMotdepasse(user, resetLink) {
  const content = `
    <p>Bonjour <strong>${user.nom} ${user.prenom}</strong>,</p>
    <p>Nous venons de recevoir une demande de changement de mot de passe de votre part.</p>
    <p>Si vous êtes bien à l'origine de cette demande, cliquez ci-dessous. Pour des raisons de sécurité, ce lien ne sera actif que <strong>24h</strong> 👇</p>
    ${emailButton(resetLink, "Réinitialiser mon mot de passe")}
    <p style="font-size:13px; color:#6b7280;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
  `;

  return transporter.sendMail({
    from: process.env.EMAIL_CLIENT,
    to: user.email,
    subject: "Réinitialisation de votre mot de passe",
    html: emailLayout(content),
  });
}

// ─── 3. Mot de passe oublié (professeur) ──────────────────────────────────────
async function oublierMotdepasseProfesseur(user, resetLink) {
  const content = `
    <p>Bonjour <strong>${user.prenom || ""}</strong>,</p>
    <p>Nous venons de recevoir une demande de changement de mot de passe pour votre compte professeur.</p>
    <p>Si vous êtes bien à l'origine de cette demande, cliquez ci-dessous. Ce lien est valable pendant <strong>30 minutes</strong> 👇</p>
    ${emailButton(resetLink, "Réinitialiser mon mot de passe")}
    <p style="font-size:13px; color:#6b7280;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
  `;

  return transporter.sendMail({
    from: process.env.EMAIL_CLIENT,
    to: user.email,
    subject: "Réinitialisation de votre mot de passe",
    html: emailLayout(content),
  });
}

// ─── 4. Réponse à un commentaire ──────────────────────────────────────────────
async function repliesCommentaire(user, userReplies, videoTitle, commentsText, replyText, videoLink) {
  const content = `
    <p>Bonjour <strong>${user.nom}</strong>,</p>
    <p><strong>${userReplies.nom}</strong> a répondu à votre commentaire sur la vidéo : <strong>${videoTitle}</strong></p>
    <p style="margin-bottom:4px; font-size:13px; color:#6b7280;">Votre commentaire :</p>
    ${quoteBox(commentsText, "#0ea5e9")}
    <p style="margin-bottom:4px; font-size:13px; color:#6b7280;">Réponse :</p>
    ${quoteBox(replyText, "#06b6d4")}
    ${emailButton(videoLink, "Voir la discussion 💬")}
    <p style="font-size:13px; color:#6b7280;">Vous recevez cet email parce que vous avez commenté une vidéo.</p>
  `;

  return transporter.sendMail({
    from: process.env.EMAIL_CLIENT,
    to: user.email,
    subject: "Nouvelle réponse 💬",
    html: emailLayout(content),
  });
}

// ─── 5. Like sur un commentaire ───────────────────────────────────────────────
async function likeCommentaire(commentOwner, likedByUser, videoTitle, commentText, videoLink) {
  const content = `
    <p>Bonjour <strong>${commentOwner.nom}</strong>,</p>
    <p><strong>${likedByUser.nom}</strong> a aimé votre commentaire sur la vidéo : <strong>${videoTitle}</strong></p>
    <p style="margin-bottom:4px; font-size:13px; color:#6b7280;">Votre commentaire :</p>
    ${quoteBox(commentText, "#ef4444")}
    ${emailButton(videoLink, "Voir la vidéo ❤️")}
    <p style="font-size:13px; color:#6b7280;">Vous recevez cet email parce que quelqu'un a aimé votre commentaire.</p>
  `;

  return transporter.sendMail({
    from: process.env.EMAIL_CLIENT,
    to: commentOwner.email,
    subject: "Nouveau like ❤️",
    html: emailLayout(content),
  });
}

// ─── 6. Compte bloqué ─────────────────────────────────────────────────────────
async function sendBlockedAccountEmail(user, blockedUntil, reason = "") {
  const content = `
    <p>Bonjour <strong>${user.prenom || ""} ${user.nom || ""}</strong>,</p>
    <p>Votre compte sur <strong>9ralibre</strong> est temporairement bloqué.</p>
    <p><strong>Date de fin du blocage :</strong> ${new Date(blockedUntil).toLocaleString("fr-FR")}</p>
    ${reason ? `<p><strong>Raison :</strong> ${reason}</p>` : ""}
    <p style="font-size:13px; color:#6b7280;">Si vous pensez qu'il s'agit d'une erreur, contactez l'administration.</p>
  `;

  return transporter.sendMail({
    from: process.env.EMAIL_CLIENT,
    to: user.email,
    subject: "Votre compte 9ralibre a été temporairement bloqué",
    html: emailLayout(content),
  });
}

module.exports = {
  sendVerificationEmail,
  oublierMotdepasse,
  repliesCommentaire,
  likeCommentaire,
  oublierMotdepasseProfesseur,
  sendBlockedAccountEmail,
};