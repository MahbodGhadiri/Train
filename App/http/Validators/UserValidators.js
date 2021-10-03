const joi = require ("joi");

const deleteAccountValidator=(data)=> //This Block looks kinda dumb
{
    const schema = joi.object({
        password:joi.string().required().min(8).max(30)
    })
    return schema.validate(data);
}
const setCustomTaskValidator=(data)=>
{
    const schema = joi.object(
    {
        title: joi.string().min(3).max(30).required(),
        task: joi.string().min(10).max(100).required(),
        subjectTag: joi.string().min(3).max(30).required(),
        startDate: joi.date().required(),
        finishDate: joi.date().required()
    })
    return schema.validate(data);
}
const changeInfoValidator=(data)=>{
    const schema = joi.object({
        name: joi.string().required().min(3).max(30),
        phoneNumber: joi.string().required().length(11).pattern(/^[0-9]+$/),
        ability: joi.string().min(3).max(10),
        avatarURL: joi.string().max(40)
    })
    return schema.validate(data);
}

module.exports=
{
    deleteAccountValidator,
    setCustomTaskValidator,
    changeInfoValidator
};