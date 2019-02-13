const countDB = require('../Database/countDB')

var data = {
    camfilter: 0,
    contacts: 0,
    material: 0,
    pagevisit: 0,
    poll: 0,
    question: 0,
    rateSpeaker: 0,
    rateSession: 0,
};
var userData = {
    camfilter: 0,
    contacts: 0,
    material: 0,
    pagevisit: 0,
    poll: 0,
    question: 0,
    rateSpeaker: 0,
    rateSession: 0,
}

var noData = "No Data Count!"
var categoryArray = ["camfilter", "pagevisit", "material", "contacts", "pollList", "question", "rate"];

let getCountOrganizer = (req, callback) => {
    countDB.getDataCount(req, (err, res) => {
        if (err) {
            throw err
        }
        else if (Object.keys(res).includes("analytics") === false) {
            return callback(false, noData)
        }
        else {
            categoryArray.forEach(element => {
                getExistCategory(res, element, (exist, dataCount) => {
                    if ((element === "camfilter" || element === "contacts"
                        || element === "pagevisit" || element === "material") && exist === true) {
                        data[element] = dataCount.totalCount;
                        console.log(element, dataCount.totalCount);
                    }
                    else if (element === "question" && exist === true) {
                        getQuestionCount(dataCount, (err) => {
                            if (err) throw err;
                        })
                    }
                    else if (element === "pollList" && exist === true) {
                        getPollCount(dataCount, (err) => {
                            if (err) throw err;
                        })
                    }
                    else if (element === "rate" && exist === true) {
                        getRateCount(dataCount, (err) => {
                            if (err) throw err;
                        })
                    }
                })
            });
            return callback(false, data);
        }
    })
}

let getExistCategory = (res, category, callback) => {
    if (category === "camfilter" || category === "contacts"
        || category === "pagevisit" || category === "material" || category === "rate") {
        if (Object.keys(res).includes('analytics') === false
            || Object.keys(res.analytics).includes(category) === false) {
            console.log("exist", undefined, false)
            return callback(false)
        }
        else {
            result = res.analytics[category]
            console.log("res", result, true)
            return callback(true, result);
        }
    }
    else if (category === "pollList" || category === "question") {
        if (Object.keys(res).includes(category) === false) {
            console.log("exist", undefined, false)
            return callback(false)
        }
        else {
            result = res[category]
            console.log("res", result, true)
            return callback(true, result);
        }
    }
}

let getQuestionCount = (res, callback) => {
    var agendaArray = [];
    data.question = 0;

    Object.keys(res).forEach(agenda => {
        agendaArray.push(agenda);
    })

    agendaArray.forEach(element => {
        var finalcount = Object.keys(res[element]).length + data.question
        data.question = finalcount;
        console.log("qcount", finalcount)
    })

    return callback(false);
}

let getPollCount = (req, callback) => {
    var pollArray = [];
    data.poll = 0;

    Object.keys(req).forEach(poll => {
        pollArray.push(poll);
    })

    pollArray.forEach(element => {
        var optionArray = [];

        Object.keys(req[element].options).forEach(option => {
            optionArray.push(option);
        })

        optionArray.forEach(opt => {
            var initcount = data.poll + req[element].options[opt].responseCount;
            data.poll = initcount;
            console.log("init", initcount)
        })
    });

    return callback(false);
}

let getRateCount = (req, callback) => {
    data.rateSession = 0;
    data.rateSpeaker = 0;

    console.log("rate", req.speaker.totalCount, req.session.totalCount)
    data.rateSpeaker = req.speaker.totalCount;
    data.rateSession = req.session.totalCount;

    return callback(false);
}

let getCountParticipant = (req, callback) => {
    countDB.getDataAttenddeeCount(req.userid, (err, res, message) => {
        if (err === true) {
            return callback(true, message);
        }
        else if (Object.keys(res).includes("analytics") === false) {
            return callback(false, noData)
        }
        else {
            for (i = 0; i < categoryArray.length; i++) {
                if (categoryArray[i] === "camfilter" || categoryArray[i] === "contacts"
                    || categoryArray[i] === "material" || categoryArray[i] === "pagevisit"
                    || categoryArray[i] === "rate") {

                    getExistCategory(res, categoryArray[i], (exist, dataCount) => {
                        if (categoryArray[i] === "camfilter" && exist === true) {
                            userData.camfilter = 0;
                            var categoryID = Object.keys(dataCount);

                            categoryID.forEach(element => {
                                var camCount = dataCount[element].count + userData.camfilter;
                                userData.camfilter = camCount
                            })
                        }
                        else if (categoryArray[i] === "contacts" && exist === true) {
                            userData.contacts = 0;
                            userData.contacts = dataCount.count;
                        }
                        else if (categoryArray[i] === "material" && exist === true) {
                            var matcount = dataCount.speaker.count + dataCount.sponsor.count;
                            userData.material = matcount;
                        }
                        else if (categoryArray[i] === "pagevisit" && exist === true) {
                            userData.pagevisit = 0;
                            var exhibitorID = Object.keys(dataCount.exhibitor);
                            var expertID = Object.keys(dataCount.expert);

                            exhibitorID.forEach(element => {
                                var exhibitorCount = dataCount.exhibitor[element].count + userData.pagevisit;
                                userData.pagevisit = exhibitorCount;
                            })

                            expertID.forEach(element => {
                                var expertCount = dataCount.expert[element].count + userData.pagevisit;
                                userData.pagevisit = expertCount;
                            })
                        }
                        else if (categoryArray[i] === "rate" && exist === true) {
                            userData.rateSession = 0;
                            userData.rateSpeaker = 0;
                            if (dataCount.speaker === null || dataCount.speaker === undefined) {
                                userData.rateSpeaker = 0;
                            }
                            else {
                                var spkAgenda = Object.keys(dataCount.speaker);

                                spkAgenda.forEach(element => {
                                    var spkCount = Object.keys(dataCount.speaker[element]).length + userData.rateSpeaker;
                                    userData.rateSpeaker = spkCount;
                                })
                            }

                            if (dataCount.session === null || dataCount.session === undefined) {
                                userData.rateSession = 0;
                            }
                            else {
                                var sesAgenda = Object.keys(dataCount.session);

                                sesAgenda.forEach(element => {
                                    var sesCount = Object.keys(dataCount.session[element]).length + userData.rateSession;
                                    userData.rateSession = sesCount;
                                })
                            }
                        }
                    })
                }

                else if (categoryArray[i] === "pollList" || categoryArray[i] === "question") {
                    if (categoryArray[i] === "question") {
                        getUserQuestion(req, (err, result) => {
                            if (err) throw err;
                        })
                    }
                    else if (categoryArray[i] === "pollList") {
                        getUserPoll(req, (err, result) => {
                            if (err) throw err;
                        })
                    }
                }

            }
            console.log("qf3", userData.question)
            return callback(false, userData);
        }
    })
}

let getUserQuestion = (req, callback) => {
    countDB.getDataCount(req, (err, res) => {
        if (err) {
            throw error;
        }
        else {
            getExistCategory(res, "question", (exist, result) => {
                if (exist === true) {
                    userData.question = 0;
                    var agendaID = Object.keys(result);

                    agendaID.forEach(agenda => {
                        var qID = Object.keys(result[agenda])

                        qID.forEach(element => {
                            if (result[agenda][element].userId === req.userid) {
                                var finalQCount = 1 + userData.question;
                                userData.question = finalQCount;
                                console.log("qcount", finalQCount, agenda, element)
                            }
                        })
                    })
                }
                else {
                    userData.question = 0;
                }
                return callback(false);
            })
        }
    })
}

getUserPoll = (req, callback) => {
    countDB.getDataCount(req, (err, res) => {
        if (err) {
            throw error;
        }
        else {
            getExistCategory(res, "pollList", (exist, result) => {
                if (exist === true) {
                    userData.poll = 0;
                    var pollID = Object.keys(result);

                    pollID.forEach(poll => {
                        var optn = Object.keys(result[poll].options);

                        optn.forEach(option => {
                            var response = Object.keys(result[poll].options[option]);

                            response.forEach(element => {
                                if (element === "responses") {
                                    var responseID = Object.keys(result[poll].options[option].responses);
                                    console.log("response", responseID)

                                    responseID.forEach(id => {
                                        if (id === req.userid) {
                                            var pollCount = 1 + userData.poll;
                                            userData.poll = pollCount
                                        }
                                    })
                                }
                            });
                        })
                    })
                }
            })
            return callback(false)
        }
    })
}

module.exports = {
    getCountOrganizer: getCountOrganizer,
    getCountParticipant: getCountParticipant
}