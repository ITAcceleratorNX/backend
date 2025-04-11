import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendVerificationCode(email, code) {
    const msg = {
        to: email,
        from: 'noreply@yourdomain.com',
        subject: 'Ваш код подтверждения',
        text: `Ваш код подтверждения: ${code}`,
    };
    await sgMail.send(msg);
}
