const { v4 } = require('uuid')
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const authTransport = {
    sendMail: (options, callback) => {
        sgMail.send(options)
            .then(() => callback(null, { messageId: 'sent' }))
            .catch((error) => callback(error, null));
    }
}

const generateOtp = () => {
    let ans = "";
    for (let i = 0; i < 5; ++i) {
        const num = Math.floor((Math.random() * 10000) % 10);
        ans = ans + num;
    }
    console.log(ans);
    return ans;
}

const generateUserId = () => {
    let str = v4();
    str = parseInt(str.replace('/-/g', ''), 16);
    console.log(str);
    return str;
}

const generateId = () => {
    let str = v4();
    str = parseInt(str.replace('/-/g', ''), 16);
    console.log(str);
    return str;
}

exports.authTransport = authTransport;
exports.generateOtp = generateOtp;
exports.generateUserId = generateUserId;
exports.generateId = generateId;
