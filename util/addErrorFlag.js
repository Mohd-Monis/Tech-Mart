const { FindCursor } = require("mongodb");

async function addErrorFlag(req, data, action) {
    req.session.input = {
        ...data
    }
    await req.session.save(action);
}

async function flushError(req) {
    await addErrorFlag(req, {
        hasError: false,
        name: '',
        email: '',
        city : '',
        country: '',
        street: '',
        

    })
}
module.exports = {
    addErrorFlag: addErrorFlag,
    flushError: flushError
}
