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
            categoryArray.forEach(element => {
                orgCount.getExistCategory(res, element, (exist, dataCount) => {
                    if (element === "material" && exist === true) {
                        spkData.material = 0;
                        if (dataCount.speaker === null || dataCount.speaker === undefined) {
                            spkData.material = 0;
                        }
                        else {
                            spkData.material = dataCount.speaker[req.speakerid].count;
                            console.log("material", dataCount.speaker[req.speakerid].count);
                        }
                    }
                    else if (element === "pagevisit" && exist === true) {
                        spkData.pagevisit = 0;
                        if (dataCount.expert === null || dataCount.expert === undefined) {
                            spkData.pagevisit = 0;
                        }
                        else {
                            spkData.pagevisit = dataCount.expert[req.speakerid].count;
                        }
                    }
                    else if (element === "rate" && exist === true) {
                        spkData.rateSpeaker = 0;
                        if (dataCount.speaker === null || dataCount.speaker === undefined) {
                            spkData.rateSpeaker = 0;
                        }
                        else {
                            var agendaArray = Object.keys(dataCount.speaker);
                            console.log("array", agendaArray)
                        }
                    }
                })
            })
        }
    })
    return callback(false, spkData);
}

module.exports = {
    getSpeakerCount: getSpeakerCount
}