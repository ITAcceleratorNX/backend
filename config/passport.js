import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import passport from 'passport';
import User from '../models/User.js';

import { generateToken } from '../utils/jwt/JwtService.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ where: { email: profile.emails[0].value } });

        if (!user) {
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                role_code: 1,
                last_login: Date.now()
            });
        }

        user.last_login = Date.now();
        await user.save();

        const token = generateToken(user);

        return done(null, { user, token });
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((userWithToken, done) => {
    console.log('serializeUser input:', userWithToken);
    done(null, userWithToken.user.user_id);
});


passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;