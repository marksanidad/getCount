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

let getExistCategory =  (res, category, callback) => {
    if (category === "camfilter" || category === "contacts"
        || category === "pagevisit" || category === "material"
        || category === "rate") {
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

let getExistUserCategory = (res, category, event, callback) => {
    if (Object.keys(res).includes('analytics') === false
        || Object.keys(res.analytics).includes(event) === false
        || Object.keys(res.analytics[event]).includes(category) === false) {
        console.log("exist", undefined, false)
        return callback(false)
    }
    else {
        result = res.analytics[event][category]
        console.log("res", result, true)
        return callback(true, result);
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

module.exports = {
    getCountOrganizer: getCountOrganizer,
    getExistCategory: getExistCategory,
    getExistUserCategory: getExistUserCategory,
}