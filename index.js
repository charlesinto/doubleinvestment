const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { validateRegistrationParams,validateUserLoginParams, hashPassword, executeQuey, assignToken, comparePasswordandHashPassword } = require('./helper');
require('dotenv').config()

const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

const router = express.Router();


app.post('/api/v1/auth/user/registration', validateRegistrationParams,
async (req, res) => {
    try{
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
        const result1 = await executeQuey('select * from users where userName = $1;', [userName]);
        if(result1.rows.length > 0){
            return res.status(400).send({message: 'Username already exists'})
        }
        await executeQuey('insert into users(fullName, email, password, accountName, accountNumber, investMentAmount, userName, phoneNumber, bankName)values($1,$2,$3,$4,$5,$6,$7,$8,$9)',[
            fullName, email, hashedPassword, accountName, accountNumber,investMentAmount, userName, phoneNumber, bankName
        ])
        const token = assignToken({userName,fullName,email})
        res.status(201).send({message: 'Operation succesful', token,
        data:{
            fullName,email, userName, phoneNumber
        }})
    }catch(error){
        console.error(error);
        res.status(500).send({error})
    }
    // 
})

app.post('/api/v1/user/login',validateUserLoginParams, async (req, res) => {
    const {userName, password} = req.body;
    try{
        const result = await executeQuey('select * from users where userName =$1', [userName]);
        if(result.rowCount === 0){
            return res.status(404).send({message: 'No such username'})
        }
        const hashedPassword = result.rows[0].password;
        if(comparePasswordandHashPassword(password, hashedPassword)){
            const {userName, fullName, email, phoneNumber} = result.rows[0];
            const token = assignToken({userName,fullName,email})
            return res.status(200).send({message: 'Operation succesful', token,
            data:{
                fullName,email, userName, phoneNumber
            }})
        }
        return res.status(400).send({message:'wrong password'})
    }catch(error){
        console.error(error);
        res.status(500).send({error})
    }
} )



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('app is listening on port: ', PORT)
})