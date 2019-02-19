const express = require('express');
const apiRoute = express();
const orgFunc = require('../Functions/cntOrganizerFunction')
const prtcpntFunc = require('../Functions/cntParticipantFunction')
const spnsrFunc = require('../Functions/cntSponsorFunction')
const spkrFunc = require('../Functions/cntSpeakerFunction')
const organizerFunc = require('../Functions/Organizer/cntOrganizer')

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

apiRoute.get('/getCount/:user/:event/:id/:userid', (req, res) => {
    if (req.params.user === "sponsor") {
        spnsrFunc.getSponsorCount(req.params, (err, result) => {
            if (err) {
                return res.status(500).send('Internal Server Error')
            }
            else {
                return res.status(200).send({ result })
            }
        })
    }
    else if (req.params.user === "speaker") {
        spkrFunc.getSpeakerCount(req.params, (err, result) => {
            if (err) {
                return res.status(500).send('Internal Server Error')
            }
            else {
                return res.status(200).send({ result })
            }
        })
    }
})

apiRoute.get('/getCount/organizer/:event/:category', (req, res) => {
    organizerFunc.getOrgCount(req.params, (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error')
        }
        else {
            return res.status(200).send({ result })
        }
    })
})

module.exports = apiRoute;