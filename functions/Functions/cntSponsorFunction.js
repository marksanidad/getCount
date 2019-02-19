const countDB = require('../Database/countDB')
const orgCount = require('../Functions/cntOrganizerFunction')

var spnsrData = {
    camfilter: 0,
    contacts: 0,
    material: 0,
    pagevisit: 0,
}

var noData = "No Data Count!"
var categoryArray = ["camfilter", "pagevisit", "material"];

let getSponsorCount = (req, callback) => {
    countDB.getDataCount(req, (err, res) => {
        if (err) {
            throw err;
        }
        else if (Object.keys(res).includes("analytics") === false) {
            return callback(false, noData)
        }
        else {  
            getSponsorContacts(req, (err) => {
                if (err) throw err;
            })
            
            categoryArray.forEach(element => {
                orgCount.getExistCategory(res, element, (exist, dataCount) => {
                    if (element === "camfilter" && exist === true) {
                        spnsrData.camfilter = 0;
                        spnsrData.camfilter = dataCount.totalCount;
                        console.log("camfilter", dataCount.totalCount)
                    }
                    else if (element === "material" && exist === true) {
                        spnsrData.material = 0;
                        if (dataCount.sponsor === null || dataCount.sponsor === undefined ||
                            dataCount.sponsor[req.id] === null || dataCount.sponsor[req.id] === undefined) {
                            spnsrData.material = 0;
                        }
                        else {
                            spnsrData.material = dataCount.sponsor[req.id].count;
                            console.log("material", req.id, dataCount.sponsor[req.id].count);
                        }
                    }
                    else if (element === "pagevisit" && exist === true) {
                        spnsrData.pagevisit = 0;
                        if (dataCount.partner === null || dataCount.partner === undefined ||
                            dataCount.partner[req.id] === null || dataCount.partner[req.id] === undefined) {
                            spnsrData.pagevisit = 0;
                        }
                        else {
                            spnsrData.pagevisit = dataCount.partner[req.id].count;
                            console.log("pagevisit", req.sponsorid, dataCount.partner[req.id].count);
                        }
                    }
                })
            })

            return callback(false, spnsrData);
        }
    })
}

let getSponsorContacts = (req, callback) => {
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
                    spnsrData.contacts = dataCount.count;
                    console.log("contacts", dataCount.count)
                }
                else {
                    spnsrData.contacts = 0
                }
            })
        }
    })
    return callback(false);
}

module.exports = {
    getSponsorCount: getSponsorCount,
}