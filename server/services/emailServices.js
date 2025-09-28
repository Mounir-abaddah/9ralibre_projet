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

module.exports = { sendVerificationEmail, oublierMotdepasse };
