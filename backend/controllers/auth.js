const { findUserByEmail, addUser, changePass } = require('../models/user');
const { getProfile, pushActivity } = require('../models/profile')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authTransport, generateOtp, generateUserId } = require('../util/nodemailer')
const { storeOtp, verifyOtp } = require('../models/auth')

const getOtp = async (req, res) => {
    let { email } = req.body;
    email = email.trim().toLowerCase();
    const doc = await findUserByEmail(email);
    if (doc) {
        res.status(409).json("email exists");
    } else {
        const otp = generateOtp();
        const reciever = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "OTP for Signup on ExpenseEase",
            text: `Welcome to ExpenseEase!!
Your One-Time Password (OTP) for completing the verification process is:
${otp}`
        }
        authTransport.sendMail(reciever, async (err, emailRes) => {
            if (err) {
                console.log(err);
                res.status(409).json("email invalid");
            }
            else {
                console.log(emailRes);
                const storeRes = await storeOtp(email, otp);
                if (storeRes === '500') {
                    res.status(409).json("failed");
                }
                res.status(200).json({ otp: otp, email: email });
            }
        })
    }
}

const resendOtp = async (req, res) => {
    // Currently same logic as getOtp 
    let { email } = req.body;
    email = email.trim().toLowerCase();
    const doc = await findUserByEmail(email);
    if (doc) {
        res.status(409).json("email exists");
    } else {
        const otp = generateOtp();
        const reciever = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "OTP for Signup on ExpenseEase",
            text: `Welcome to ExpenseEase!!
Your One-Time Password (OTP) for completing the verification process is:
${otp}`
        }
        authTransport.sendMail(reciever, async (err, emailRes) => {
            if (err) {
                console.log(err);
                res.status(409).json("email invalid");
            }
            else {
                console.log(emailRes);
                const storeRes = await storeOtp(email, otp);
                if (storeRes === '500') {
                    res.status(409).json("failed");
                }
                res.status(200).json({ otp: otp, email: email });
            }
        })
    }
}

const resetResendOtp = async (req, res) => {
    let { email } = req.body;
    email = email.trim().toLowerCase();
    const doc = await findUserByEmail(email);
    if (doc) {
        const otp = generateOtp();
        const reciever = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "OTP for Password Reset on ExpenseEase",
            text: `Welcome to ExpenseEase!!
Your One-Time Password (OTP) to reset your account password is:
${otp}`
        }
        authTransport.sendMail(reciever, async (err, emailRes) => {
            if (err) {
                console.log(err);
                res.status(409).json("email invalid");
            }
            else {
                console.log(emailRes);
                const storeRes = await storeOtp(email, otp);
                if (storeRes === '500') {
                    res.status(409).json("failed");
                }
                res.status(200).json({ otp: otp, email: email });
            }
        })
    } else {
        res.status(409).json("notfound");

    }
}

const checkOtp = async (req, res) => {
    const { email, otp } = req.body;
    const result = await verifyOtp(email, otp);
    if (result === '500') {
        res.status(500).json("failed");
    } else if (result) {
        res.status(200).json("correct");
    } else {
        res.status(200).json("incorrect");
    }
}

const resetCheckOtp = async (req, res) => {
    const { email, otp } = req.body;
    const result = await verifyOtp(email, otp);
    if (result === '500') {
        res.status(500).json("failed");
    } else if (result) {
        res.status(200).json("correct");
    } else {
        res.status(200).json("incorrect");
    }
}

const createAccount = async (req, res) => {
    const { email, username, password } = req.body;
    const userId = generateUserId();
    const newPassword = await bcrypt.hash(password, 12);
    console.log(userId, email, password);
    const result = await addUser(email, newPassword, username, userId);
    if (!result) {
        res.status(500).json("failed");
    } else if (result) {
        res.status(200).json("success");
    }
}

const changePassword = async (req, res) => {
    const { email, password } = req.body;
    const newPassword = await bcrypt.hash(password, 12);
    console.log(email, password);
    const result = await changePass(email, newPassword);
    if (!result) {
        res.status(500).json("failed");
    } else if (result === "notfound") {
        res.status(500).json("notfound");
    } else {
        res.status(200).json("success");

    }
}

const signIn = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.toLowerCase().trim();
        const doc = await findUserByEmail(email);

        if (doc) {
            const result = await bcrypt.compare(password, doc.password);
            if (result) {
                const userData = { email: doc.email, userId: doc.userId, username: doc.username };
                const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "30d" });
                const expiryDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30);
                console.log(token, expiryDate);
                res.cookie('token', token, { expires: expiryDate });
                res.status(200).json("success");
            } else {
                res.status(500).json("password wrong")
            }
        } else {
            res.status(500).json("notfound");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json('failed');
    }
}

const resetGetOtp = async (req, res) => {
    let { email } = req.body;
    email = email.trim().toLowerCase();
    const doc = await findUserByEmail(email);
    if (doc) {
        const otp = generateOtp();
        const reciever = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "OTP for Password Reset on ExpenseEase",
            text: `Welcome to ExpenseEase!!
Your One-Time Password (OTP) to reset your account password is:
${otp}`
        }
        authTransport.sendMail(reciever, async (err, emailRes) => {
            if (err) {
                console.log(err);
                res.status(409).json("email invalid");
            }
            else {
                console.log(emailRes);
                const storeRes = await storeOtp(email, otp);
                if (storeRes === '500') {
                    res.status(409).json("failed");
                }
                res.status(200).json({ otp: otp, email: email });
            }
        })
    } else {
        res.status(409).json("notfound");

    }
}

const getDetails = async (req, res) => {
    try {
        const token = req.cookies?.token;
        console.log(token);
        if (token) {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            const doc = await getProfile(payload.email);
            if (!doc) {
                throw "notfound";
            }
            const now = Date.now();
            if (doc.activity.length != 0) {
                const lastLoggedIn = new Date(parseInt(doc.activity[doc.activity.length - 1]));
                const currDate = new Date(now);
                if (lastLoggedIn.toDateString() != currDate.toDateString()) {
                    const res = await pushActivity(payload.email, `${now}`);
                    if (!res) {
                        throw "activitysavefailed";
                    }
                }
            } else {
                const res = await pushActivity(payload.email, `${now}`);
                if (!res) {
                    throw "activitysavefailed";
                }
            }
            const finalDoc = await getProfile(payload.email);
            if (!finalDoc) {
                throw "notfound";
            }

            res.status(200).json(finalDoc);
        } else {
            throw "notfound";
        }
    } catch (err) {
        console.log(err);
        res.status(200).json("notfound");
    }
}

exports.getOtp = getOtp;
exports.checkOtp = checkOtp;
exports.resendOtp = resendOtp;
exports.createAccount = createAccount;
exports.signIn = signIn;
exports.resetGetOtp = resetGetOtp;
exports.resetResendOtp = resetResendOtp;
exports.resetCheckOtp = resetCheckOtp;
exports.changePassword = changePassword;
exports.getDetails = getDetails;
