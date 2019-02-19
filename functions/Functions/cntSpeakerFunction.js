const countDB = require('../Database/countDB')
const orgCount = require('../Functions/cntOrganizerFunction')

var spkData = {
    contacts: 0,
    material: 0,
    pagevisit: 0,
    poll: 0,
    question: 0,
    rateSpeaker: 0,
}

var noData = "No Data Count!"
var categoryArray = ["pagevisit", "material", "pollList", "question", "rate"];

let getSpeakerCount = (req, callback) => {
    countDB.getDataCount(req, (err, res) => {
        if (err) {
            throw err;
        }
        else if (Object.keys(res).includes("analytics") === false) {
            return callback(false, noData)
        }
        else {
            getSpeakerContacts(req, (err) => {
                if (err) throw err;
            })

            categoryArray.forEach(element => {
                orgCount.getExistCategory(res, element, (exist, dataCount) => {
                    if (element === "material" && exist === true) {
                        spkData.material = 0;
                        if (dataCount.speaker === null || dataCount.speaker === undefined) {
                            spkData.material = 0;
                        }
                        else {
                            spkData.material = dataCount.speaker[req.id].count;
                            console.log("material", dataCount.speaker[req.id].count);
                        }
                    }
                    else if (element === "pagevisit" && exist === true) {
                        spkData.pagevisit = 0;
                        if (dataCount.expert === null || dataCount.expert === undefined) {
                            spkData.pagevisit = 0;
                        }
                        else {
                            spkData.pagevisit = dataCount.expert[req.id].count;
                        }
                    }
                    else if (element === "rate" && exist === true) {
                        spkData.rateSpeaker = 0;
                        if (dataCount.speaker === null || dataCount.speaker === undefined) {
                            spkData.rateSpeaker = 0;
                        }
                        else {
                            var agendaArray = Object.keys(dataCount.speaker);

                            agendaArray.forEach(element => {
                                if (dataCount.speaker[element][req.id] === null
                                    || dataCount.speaker[element][req.id] === undefined) {
                                    console.log(element, null)
                                }
                                else {
                                    var spkCount = dataCount.speaker[element][req.id].count + spkData.rateSpeaker;
                                    spkData.rateSpeaker = spkCount;
                                    console.log("rate", spkCount);
                                }
                            })
                        }
                    }
                    else if (element === "question" && exist === true) {
                        spkData.question = 0;
                        var sessionArray = Object.keys(dataCount)

                        sessionArray.forEach(id => {
                            var qid = Object.keys(dataCount[id])

                            qid.forEach(element => {
                                if (dataCount[id][element].speakerId === req.id) {
                                    var qCount = 1 + spkData.question;
                                    spkData.question = qCount;
                                    console.log("question", qCount);
                                }
                            })
                        })
                    }
                    else if (element === "pollList" && exist === true) {
                        spkData.poll = 0;
                        var pollArray = Object.keys(dataCount);

                        pollArray.forEach(element => {
                            if (dataCount[element].speakerId === req.id) {
                                var pollCount = 1 + spkData.poll;
                                spkData.poll = pollCount;
                                console.log("poll", pollCount);
                            }
                        })
                    }
                })
            })
        }
    })
    return callback(false, spkData);
}

let getSpeakerContacts = (req, callback) => {
    countDB.getDataAttenddeeCount(req, (err, res, message) => {
        if (err === true) {
            return callback(true, message);
        }
        else if (Object.keys(res).includes("analytics") === false) {
            return callback(false, noData)
        }
        else {
            orgCount.getExistUserCategory(res, "contacts", req.event, (exist, dataCount) => {
                if(exist === true) {
                    spkData.contacts = dataCount.count;
                    console.log("contacts", dataCount.count)
                }
                else {
                    spkData.contacts = 0
                }
            })
        }
    })
    return callback(false);
}

module.exports = {
    getSpeakerCount: getSpeakerCount
}