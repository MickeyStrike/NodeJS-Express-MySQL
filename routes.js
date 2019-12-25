const controller = require('./controller')
const express = require('express')
const jwt = require('jsonwebtoken')
const jwtVerif = (req, res, next) => {
    let getToken = req.headers.authorization
    if (getToken) {
        if (getToken.includes('Bearer ')) {
            getToken = getToken.slice(7, getToken.length)
        }
        jwt.verify(getToken, 'Secret', (err, decoded) => {
            if (err) {
                return res.status(200).send({
                    message: 'Token Salah!'
                })
            } else {
                req.decoded = decoded
                next()
            }
        })
    } else {
        return res.status(200).send({
            message: 'Token Not Found!'
        })
    }
}

const router = express.Router()

router.get('/get-all-user', jwtVerif, controller.getAllUser) // need verif
router.get('/get-user/:id', controller.getUserByID) // ambil token di sni
router.get('/get-username-nama', jwtVerif, controller.getNamaUsername) // need verif
router.get('/getUsername/:nama', controller.getUsername)
router.get('/getSemua', controller.getSemua)
router.get('/getNama', controller.getNamaAjah)
router.get('/getDataFromID/:id', controller.getDataFromID)
router.get('/getChallenge', controller.getChallenge)
router.post('/postData', controller.postData)
router.put('/updateData/:idKey', controller.updateData)
router.put('/updateDate/:id', controller.updateDate)
router.delete('/deleteData/:id', controller.deleteData)
router.post('/AddData', jwtVerif, controller.addData) // need verif
router.put('/updateActivities/:id', controller.updateActivities)
module.exports = router