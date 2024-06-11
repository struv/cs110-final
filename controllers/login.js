// Controller handler to handle functionality in home page

async function getLogin(request, response) {
    response.render('login');
}

 

module.exports = {
    getLogin
};
