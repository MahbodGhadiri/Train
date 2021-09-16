const joi = require ("joi");

const registerValidator = (data)=>
{
    const schema= joi.object({
        name: joi.string().required().min(3).max(30),
        email: joi.string().required().max(50).email(),
        phoneNumber: joi.string().required().length(11).pattern(/^[0-9]+$/),
        password : joi.string().required().min(6).max(20),
        ability: joi.string().min(3).max(10),
        avatarURL: joi.string().max(40)

    })
    return schema.validate(data);
}

const loginValidator = (data)=>
{
    const schema = joi.object({
    email: joi.string().required().min(7).max(30).email(),
    password : joi.string().required().min(6).max(20)
    })
    return schema.validate(data);
}
module.exports={registerValidator,loginValidator};