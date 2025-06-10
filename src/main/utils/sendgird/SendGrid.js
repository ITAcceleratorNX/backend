import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const fromEmail = process.env.SENDGRID_EMAIL;
export async function sendVerificationCode(email, code) {
    const msg = {
        to: email,
        from: fromEmail,
        subject: 'Ваш код подтверждения',
        text: `Ваш код подтверждения: ${code}`,
    };
    await sgMail.send(msg);
}
