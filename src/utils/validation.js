const validator = require("validator");

const validateSignUPData = (req) => {
    const data = req.body;

    const ALLOWED_FIELDS = [
        "firstName",
        "lastName",
        "emailId",
        "password",
        "age",
        "gender",
        "photoUrl",
        "skills",
        "about"
    ];

    // check allowed fields
    const isAllowed = Object.keys(data).every((key) =>
        ALLOWED_FIELDS.includes(key)
    );

    if (!isAllowed) {
        throw new Error("Some fields are not allowed");
    }
    if (!validator.isStrongPassword(data?.password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
        throw new Error(
            "Password must contain uppercase, lowercase, number, and special character"
        );
    }

    // skills length check
    if (data?.skills && data.skills.length > 15) {
        throw new Error("Skills cannot be more than 15");
    }
};

module.exports = { validateSignUPData };