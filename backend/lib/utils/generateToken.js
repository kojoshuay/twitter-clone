/////////////////
// this file generates a JSON Web Token (JWT) and sets it as a cookie in the response
/////////////////


import jwt from 'jsonwebtoken'

export const generateTokenAndSetCookie = (userId, res) => {

    //create a token containing the user's id
    //a token is a secure way to represent user info that can be verified by the server
    //signed by a secret key to ensure authenticity
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '15d'
    })

    //set JWT as a cookie
    //a cookie is a small piece of data stored in the user's browswer
    //send back to the server w/ every request, allowing the server to identify the user
    //automatically handled by the browser and come w/ built in security features
    res.cookie("jwt", token, {
        maxAge: 15*24*60*60*1000, //MS
        httpOnly: true, //prevents XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development", //ensures the cookie is only sent over HTTPS
    })
}