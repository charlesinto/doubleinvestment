const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { validateRegistrationParams, hashPassword, executeQuey } = require('./helper');


const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

const router = express.Router();


app.post('/v1/auth/user/registration', validateRegistrationParams,
async (req, res) => {
    const {fullName,
        phoneNumber,
        password,
        email,
        accountName,
        bankName,
        accountNumber,
        userName,
        investMentAmount} = req.body;

    const hashedPassword = hashPassword(password);
    const result1 = executeQuey('select * from users where userName = ?', [userName]);
    res.status(200).send({result1})
    // await executeQuey('insert into users(fullName, email, password, accountName, accountNumber, investMentAmount)')
})



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('app is listening on port: ', PORT)
})