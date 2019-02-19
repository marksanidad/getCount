const admin = require('firebase-admin');

let getDataCount = (req, callback) => {
    admin.database().ref('/GANAPP/' + req.event).once('value', data => {
		let test = data.val();
		return callback(false, test)
	})
}

let getDataAttenddeeCount = (req, callback) => {
	admin.database().ref('users/attendee/' + req.userid).once('value', data => {
		let test = data.val();
		console.log("test",test)
		if (test === null || test === undefined) {
			return callback(true, null, {message: "userid does not exists!"})
		}
		else {
			return callback(false, test, {message: "userid exists"})
		}
	})
}

module.exports = {
    getDataCount: getDataCount,
    getDataAttenddeeCount: getDataAttenddeeCount
}