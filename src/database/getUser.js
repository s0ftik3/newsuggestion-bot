const User = require('./models/User');

module.exports = async (id) => {

    const user = await User.find({ id: id })
    .then(response => {

        if (response.length > 0) {

            return response[0];

        } else {

            return false;

        }

    })
    .catch(err => {

        console.error(err);

    });

    return user;

}