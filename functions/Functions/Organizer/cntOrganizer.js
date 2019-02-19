const countDB = require('../../Database/countDB')
const orgCount = require('../cntOrganizerFunction')

let getOrgCount = (req, callback) => {
    countDB.getDataCount(req, (err, res) => {
        if (err) {
            throw err
        }
        else if (Object.keys(res).includes("analytics") === false) {
            return callback(false, "No " + req.category + " count!")
        }
        else {
            orgCount.getExistCategory(res, req.category , (exist, dataCount) => {
                if (exist === true) {
                    return callback(false, dataCount);
                }
            })
        }
    })
}

module.exports = {
    getOrgCount: getOrgCount,
}
