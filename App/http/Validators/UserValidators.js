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

module.exports=
{
    deleteAccountValidator,
    setCustomTaskValidator
};