import express from "express";
import passport from "passport";
import {setTokenCookie} from "../../utils/jwt/JwtService.js";

const router = express.Router();

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/'
}), (req, res) => {
    const token = req.user.token;
    setTokenCookie(res, token);
    res.redirect(`/`);
});

router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/');
    });
});
export default router;
