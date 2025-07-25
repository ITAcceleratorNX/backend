import express from "express";
import passport from "passport";
import {setTokenCookie} from "../../utils/jwt/JwtService.js";

const router = express.Router();

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: process.env.FRONTEND_URL + "/login"
}), (req, res) => {
    const token = req.user.token;
    setTokenCookie(res, token);
    res.redirect(process.env.FRONTEND_URL + '/personal-account');
});

router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            // domain: '.extraspace.kz'
        }).redirect(process.env.FRONTEND_URL + "/login");
    });
});
export default router;
