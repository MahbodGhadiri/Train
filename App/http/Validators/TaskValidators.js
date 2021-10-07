const joi = require ("joi");

const setTaskValidator = (data)=>{
    const schema = joi.object({
        title:joi.string().required().min(3).max(30),
        task:joi.string().required().min(5).max(100),
        subjectTag: joi.string().required().min(2).max(12),
        executors: joi.array().required(),
        assignedBy: joi.string().required(), //! object id
        startDate:joi.date().required(),
        finishDate:joi.date().required()
    })
    return schema.validate(data);
}

module.exports = {setTaskValidator}