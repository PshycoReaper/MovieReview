const { isNonEmptyString } = require("../../utils/validation.util");


function validateLoginPayload(body = {}) {
    const { email, password } = body;

    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
        return { valid: false };
    }

    return { valid: true, email, password };
}

module.exports = { validateLoginPayload };
