const express = require('express');
const apiRoute = express();
const countFunc = require('../Functions/countFunction')

apiRoute.get('/getCount/organizer/:event', (req, res) => {
    countFunc.getCountOrganizer(req.params, (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error')
        }
        else {
            return res.status(200).send({ result })
        }
    })
})

apiRoute.get('/getCount/participant/:event/:userid', (req, res) => {
    countFunc.getCountParticipant(req.params, (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error')
        }
        else {
            return res.status(200).send({ result })
        }
    })
})

module.exports = apiRoute;