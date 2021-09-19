const joi = require("joi");

const setPinValidator= (data)=>
{
    const schema = joi.object(
    {
        title : joi.string().required().min(3).max(30),
        message : joi.string().required().min(3).max(100)
    })
    return schema.validate(data);
}

module.exports= setPinValidator;