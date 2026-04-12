const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "GMAIL",
  auth: {
    user: process.env.EMAIL_CLIENT,
    pass: process.env.PASSWORD_CLIENT,
  },
});

async function sendVerificationEmail(user, accountVerifiedUrl) {
  const mailOptions = {
    from: process.env.EMAIL_CLIENT,
    to: user.email,
    subject: "Vérification de votre compte",
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Vérification du compte</title>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f7; margin: 0; padding: 20px;">

  <table align="center" cellpadding="0" cellspacing="0" width="100%" 
         style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <tr>
      <td style="background-color: #FEBA27; padding: 25px; text-align: center;">
        <img src="https://i.postimg.cc/SKgXCDLx/9ralibre.png" 
             alt="logo 9ralibre" 
             width="120" 
             style="display:block; margin:auto; border-radius: 8px;" />
      </td>
    </tr>

    <!-- Title -->
    <tr>
      <td style="padding: 30px 20px; text-align: center; color: #3F3F3F;">
        <h1 style="font-size: 24px; margin-bottom: 15px;">🔐 Vérification du compte</h1>
        <p style="font-size: 16px; line-height: 1.6; margin: 0;">
          Bonjour <strong>${user.nom} ${user.prenom}</strong>, <br><br>
          Merci de vous être inscrit sur <strong>9ralibre</strong> 🎉. <br>
          Veuillez confirmer votre adresse email pour activer votre compte :
        </p>
      </td>
    </tr>

    <!-- Button -->
    <tr>
      <td style="text-align: center; padding: 20px;">
        <a href="${accountVerifiedUrl}" 
           style="background-color: #0ea5e9; color: #ffffff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
          ✅ Confirmer mon adresse email
        </a>
      </td>
    </tr>

    <!-- Info -->
    <tr>
      <td style="padding: 20px; text-align: center; font-size: 14px; color: #666;">
        ⚠️ Ce lien expirera dans <strong>24 heures</strong> pour des raisons de sécurité.
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #999;">
        © ${new Date().getFullYear()} 9ralibre. Tous droits réservés.
      </td>
    </tr>
  </table>

</body>
</html>
`,
  };

  return transporter.sendMail(mailOptions);
}

async function oublierMotdepasse(user, resetLink) {
  const mailOptions = {
    from: process.env.EMAIL_CLIENT,
    to: user.email,
    subject: "Réinitialisation de votre mot de passe",
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Réinitialisation de mot de passe</title>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f7; margin: 0; padding: 20px;">

  <table align="center" cellpadding="0" cellspacing="0" width="100%" 
        style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">

    <!-- Header -->
    <tr>
      <td style="background-color: #f9fafb; padding: 25px; text-align: center; color: #333;">
        <h1 style="margin: 0; font-size: 22px;">🔑 Réinitialisation de mot de passe</h1>
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding: 30px; color: #333333;">
        <p style="font-size: 18px; margin: 0 0 15px;">Bonjour,</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
          Vous avez demandé à réinitialiser votre mot de passe pour votre compte <strong>9ralibre</strong>.  
          Cliquez sur le bouton ci-dessous pour en choisir un nouveau :
        </p>

        <!-- Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #0ea5e9; color: #ffffff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
            Réinitialiser mon mot de passe
          </a>
        </div>

        <p style="font-size: 14px; color: #666666; margin: 0 0 10px;">
          ⚠️ Ce lien expirera dans <strong>30 minutes</strong> pour des raisons de sécurité.
        </p>
        <p style="font-size: 14px; color: #666666; margin: 0;">
          Si vous n’êtes pas à l’origine de cette demande, ignorez simplement cet email.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #999999;">
        © ${new Date().getFullYear()} 9ralibre. Tous droits réservés.
      </td>
    </tr>
  </table>

</body>
</html>
    `,
  };

  return transporter.sendMail(mailOptions);
}

async function repliesCommentaire(
  user,
  userReplies, 
  videoTitle,
  commentsText,
  replyText,
  videoLink
) {
  const mailOptions = {
    from: process.env.EMAIL_CLIENT,
    to: user.email,
    subject: "Nouvelle réponse 💬",
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Nouvelle réponse</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin:0; padding:0; background:#f4f6f8; font-family:Arial; }
    .container { max-width:600px; margin:40px auto; background:#fff; border-radius:8px; overflow:hidden; }
    .header { background:#2563eb; color:#fff; padding:20px; text-align:center; }
    .content { padding:24px; color:#333; }
    .comment-box { background:#f1f5f9; padding:15px; border-left:4px solid #2563eb; margin:16px 0; }
    .reply-box { background:#ecfeff; padding:15px; border-left:4px solid #06b6d4; margin:16px 0; }
    .button { display:inline-block; margin-top:20px; padding:12px 20px; background:#2563eb; color:#fff; text-decoration:none; border-radius:6px; }
    .footer { text-align:center; font-size:12px; color:#6b7280; padding:16px; background:#f9fafb; }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>Nouvelle réponse 💬</h1>
    </div>

    <div class="content">
      <h2>Bonjour ${user.nom},</h2>

      <p>
        <strong>${userReplies.nom}</strong> a répondu à votre commentaire sur la vidéo :
        <strong>${videoTitle}</strong>
      </p>

      <p><strong>Votre commentaire :</strong></p>
      <div class="comment-box">
        ${commentsText}
      </div>

      <p><strong>Réponse :</strong></p>
      <div class="reply-box">
        ${replyText}
      </div>

      <a href="${videoLink}" class="button">
        Voir la discussion
      </a>
    </div>

    <div class="footer">
      <p>
        Vous recevez cet email parce que vous avez commenté une vidéo.<br />
        © ${new Date().getFullYear()} Votre plateforme éducative
      </p>
    </div>
  </div>
</body>
</html>`
  };

  return transporter.sendMail(mailOptions);
}

async function likeCommentaire(
  commentOwner,
  likedByUser, 
  videoTitle,
  commentText,
  videoLink
) {
  const mailOptions = {
    from: process.env.EMAIL_CLIENT,
    to: commentOwner.email,
    subject: "Nouveau like ❤️",
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Nouveau like</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin:0; padding:0; background:#f4f6f8; font-family:Arial; }
    .container { max-width:600px; margin:40px auto; background:#fff; border-radius:8px; overflow:hidden; }
    .header { background:#ef4444; color:#fff; padding:20px; text-align:center; }
    .content { padding:24px; color:#333; }
    .comment-box { background:#f1f5f9; padding:15px; border-left:4px solid #ef4444; margin:16px 0; }
    .button { display:inline-block; margin-top:20px; padding:12px 20px; background:#ef4444; color:#fff; text-decoration:none; border-radius:6px; }
    .footer { text-align:center; font-size:12px; color:#6b7280; padding:16px; background:#f9fafb; }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>Nouveau like ❤️</h1>
    </div>

    <div class="content">
      <h2>Bonjour ${commentOwner.nom},</h2>

      <p>
        <strong>${likedByUser.nom}</strong> a aimé votre commentaire sur la vidéo :
        <strong>${videoTitle}</strong>
      </p>

      <p><strong>Votre commentaire :</strong></p>
      <div class="comment-box">
        ${commentText}
      </div>

      <a href="${videoLink}" class="button">
        Voir la vidéo
      </a>
    </div>

    <div class="footer">
      <p>
        Vous recevez cet email parce que quelqu’un a aimé votre commentaire.<br />
        © ${new Date().getFullYear()} Votre plateforme éducative
      </p>
    </div>
  </div>
</body>
</html>`
  };

  return transporter.sendMail(mailOptions);
}

async function oublierMotdepasseProfesseur(user, resetLink) {
  const mailOptions = {
    from: process.env.EMAIL_CLIENT,
    to: user.email,
    subject: "Réinitialisation de votre mot de passe",
    html: `
      <div style="font-family: Arial, sans-serif; background:#f4f4f7; padding:20px;">
        <div style="max-width:500px; margin:auto; background:#fff; padding:25px; border-radius:8px; text-align:center;">
          
          <h2 style="color:#333;">Réinitialisation du mot de passe</h2>

          <p style="color:#555; font-size:14px;">
            Bonjour ${user.prenom || ""},
          </p>

          <p style="color:#555; font-size:14px; line-height:1.6;">
            Une demande de réinitialisation de mot de passe a été effectuée pour votre compte professeur.
          </p>

          <a href="${resetLink}" 
             style="display:inline-block; margin:20px 0; padding:12px 25px; background:#0ea5e9; color:#fff; text-decoration:none; border-radius:5px; font-weight:bold;">
            Réinitialiser mon mot de passe
          </a>

          <p style="font-size:12px; color:#777;">
            Ce lien est valable pendant 30 minutes.
          </p>

          <p style="font-size:12px; color:#999;">
            Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.
          </p>

        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}




module.exports = { sendVerificationEmail, oublierMotdepasse , repliesCommentaire , likeCommentaire ,oublierMotdepasseProfesseur  };
