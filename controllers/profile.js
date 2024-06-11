const User = require('../models/user.js');

async function getProfile(request, response) {
    try {
        let userID = await request.session.passport.user;
        let actual = await User.findById(userID).lean();
        response.render('profile', {firstName: actual.firstName, lastName: actual.lastName, aboutMe: actual.aboutMe, errors: ""});

    } catch (err) {
        console.log(err);
    }
}


module.exports = {
    getProfile
};
