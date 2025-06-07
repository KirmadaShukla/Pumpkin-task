exports.sendToken = (user, statusCode, res) => {
    const token = user.getjwttoken();
    const expiresInMilliseconds = process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000;

    const options = {
        expires: new Date(Date.now() + expiresInMilliseconds),
        httpOnly: true,
    };

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            expiresIn: expiresInMilliseconds
        });
};