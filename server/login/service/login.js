const Users = require('./../../models/users');
const jwt = require('jsonwebtoken');

const adminLogin = async (req, res) => {
    const credentials = req.body;
    const { email, password } = credentials;

    try {
        const cfg = { email, password };
        const user = await Users.findOne(cfg);

        if (user) {
            const token = jwt.sign({ 
                id: user._id,
                email: user.email,
                admin: user.admin
            }, 'mailer123');

            return res.status(200).json({ success: true, token });
        }

        return res.status(200).json({ success: false });

    } catch (error) {
        return res.status(500).json({ success: true });
    }

    
};
    
module.exports = {
    adminLogin,
}; 
