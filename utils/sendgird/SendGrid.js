import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendVerificationCode(email, code) {
    const msg = {
        to: email,
        from: 'zubanyszarylkasyn@gmail.com',
        subject: 'Ваш код подтверждения',
        text: `Ваш код подтверждения: ${code}`,
    };
    await sgMail.send(msg);
    console.log(code);
}
