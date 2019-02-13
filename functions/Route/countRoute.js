const express = require('express');
const apiRoute = express();
const countFunc = require('../Functions/countFunction')
const orgFunc = require('../Functions/cntOrganizerFunction')
const prtcpntFunc = require('../Functions/cntParticipantFunction')
const spnsrFunc = require('../Functions/cntSponsorFunction')
const spkrFunc = require('../Functions/cntSpeakerFunction')

apiRoute.get('/getCount/organizer/:event', (req, res) => {
    orgFunc.getCountOrganizer(req.params, (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error')
        }
        else {
            return res.status(200).send({ result })
        }
    })
})

apiRoute.get('/getCount/participant/:event/:userid', (req, res) => {
    prtcpntFunc.getCountParticipant(req.params, (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error')
        }
        else {
            return res.status(200).send({ result })
        }
    })
})

apiRoute.get('/getCount/sponsor/:event/:sponsorid/:userid', (req, res) => {
    spnsrFunc.getSponsorCount(req.params, (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error')
        }
        else {
            return res.status(200).send({ result })
        }
    })
})

apiRoute.get('/getCount/speaker/:event/:speakerid/:userid', (req, res) => {
    spkrFunc.getSpeakerCount(req.params, (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error')
        }
        else {
            return res.status(200).send({ result })
        }
    })
})

module.exports = apiRoute;