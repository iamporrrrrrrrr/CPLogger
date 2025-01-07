import express from 'express'
import passport from 'passport';

const router = express.Router();
const CLIENT_URL = process.env.CLIENT_URL

router.get('/login/failed', (request,response) => {
    return response.status(401).send({message: "not authenticated"})
})

router.get('/login/success', (request,response) => {
    if(request.user) return response.status(200).send({message: "authenticated", user: request.user, cookies: request.cookies})
    return response.status(401).send({message: "not authenticated"})
})

router.get('/logout', (request,response) => {
    request.logout()
    response.redirect(CLIENT_URL)
})

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get("/google/callback", passport.authenticate("google",{
    successRedirect: CLIENT_URL,
    failureRedirect: '/login/failed'
}))

router.get("/github", passport.authenticate("github", { scope: ["profile"] }));

router.get("/github/callback", passport.authenticate("github",{
    successRedirect: CLIENT_URL,
    failureRedirect: '/login/failed'
}))

export default router

