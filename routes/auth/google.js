import express from "express";
import passport from "passport";

const router = express.Router();

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Callback после входа
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/');
});

// Выход
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/');
    });
});
export default router;
