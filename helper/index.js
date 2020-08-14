const pool = require('../database')
const joi = require('@hapi/joi')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

module.exports ={
    executeQuey: (sql, params = []) => {
        return new Promise((resolve, reject) => {
                pool.query(sql, params, (err, result) => {
                    
                    if(err) return reject(err)

                    resolve(result)
                })
        })
    },
    validateRegistrationParams: (req, res, next) => {
        const userCreationSchema = joi.object({
            fullName: joi.string().required(),
            phoneNumber: joi.number().required(),
            password: joi.string().required(),
            email: joi.string().email().required(),
            accountName: joi.string().required(),
            bankName: joi.string().required(),
            accountNumber: joi.number().required(),
            investMentAmount: joi.number().required(),
            userName: joi.string().required()
        });
        try{
            const {error} = userCreationSchema.validate(req.body);
    
            if(error){
                console.error(req.body);
                console.error(error);
                return res.status(400).send(error);
            }
            
                
            
            return next();
        }catch(error){
            return res.status(500).send(error);
        }
    },
    hashPassword: (password = '') => {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        return hash;
    },
    comparePasswordandHashPassword: (password, hashPassword) => {
        return bcrypt.compareSync(password, hashPassword); 
    },
    assignToken: (data ={}, secretKey = 'doubleinvestisacapm') => {
        return jwt.sign(data, secretKey, { algorithm: 'RS256'});
    },
    verifyToken: (token, secretKey = 'doubleinvestisacapm') => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secretKey, { algorithms: ['RS256'] }, function (err, payload) {
                if(err) return reject(err)
                resolve(payload)
             });
        })
    }
}