// services/emailService.js
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
      <body style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0;">
        <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #FEBA27; padding: 20px; text-align: center; color: #3F3F3F; font-size: 24px; font-weight: bold;">
              🔐 Vérification du compte
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; color: #333333;">
              <p style="font-size: 18px;">Bonjour ${user.nom} ${user.prenom},</p>
              <p style="font-size: 16px; line-height: 1.5;">
                Merci de vous être inscrit sur <strong>9ralibre</strong> 🎉.<br>
                Afin d'activer votre compte, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${accountVerifiedUrl}" 
                  style="background-color: #0ea5e9; color: #ffffff; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
                  Confirmer mon adresse email
                </a>
              </div>
              <p style="font-size: 14px; color: #666666;">
                ⚠️ Ce lien expirera dans 24 heures pour des raisons de sécurité.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #999999;">
              © ${new Date().getFullYear()} 9ralibre. Tous droits réservés.
            </td>
          </tr>
        </table>
      </body>
      </html>`
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
                        <body style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0; height: 100vh; display: flex; align-items: center;">
                        <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            <tr>
                            <td style="background-color: #FEBA27; padding: 20px; text-align: center; color: #3F3F3F; font-size: 24px; font-weight: bold;">
                                🔐 Réinitialisation de mot de passe
                            </td>
                            </tr>
                            <tr>
                            <td style="padding: 30px; color: #333333;">
                                <p style="font-size: 18px;">Bonjour,</p>
                                <p style="font-size: 16px; line-height: 1.5;">
                                Vous avez demandé à réinitialiser votre mot de passe.  
                                Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :
                                </p>
                                <div style="text-align: center; margin: 30px 0;">
                                <a href="${resetLink}" 
                                    style="background-color: #0ea5e9; color: #ffffff; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
                                    Réinitialiser mon mot de passe
                                </a>
                                </div>
                                <p style="font-size: 14px; color: #666666;">
                                ⚠️ Ce lien expirera dans 30 minutes pour des raisons de sécurité.
                                </p>
                                <p style="font-size: 14px; color: #666666;">
                                Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.
                                </p>
                            </td>
                            </tr>
                            <tr>
                            <td style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #999999;">
                                © ${new Date().getFullYear()} 9ralibre. Tous droits réservés.
                            </td>
                            </tr>
                        </table>
                        </body>

                        </html>`
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail , oublierMotdepasse };
