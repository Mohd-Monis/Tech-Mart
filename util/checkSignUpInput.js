const User = require("../models/user");

async function checkUserInput(name, email, password, street, postalCode, city, country) {
    const oldUser = await User.fetch(email );
    if ((oldUser) || !(name.trim()).length || !(street.trim()).length || ((password.trim()).length < 6) || !(postalCode.trim().length) || !city.trim().length || !country.trim().length) {
        return false;
    }
    return true;
}

module.exports = checkUserInput;