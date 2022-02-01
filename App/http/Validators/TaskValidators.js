const joi = require ("joi");
joi.objectId=require("joi-objectid")(joi)

const setTaskValidator = (data)=>{
    const schema = joi.object({
        title:joi.string().required().min(3).max(30).messages(
            {
                "any.required":"نوشتن موضوع الزامی است!",
                "string.base":"موضوع نامعتبر است!",
                "string.min":"موضوع باید حداقل سه کارکتر باشد!",
                "string.max":"موضوع باید حداکثر سی کارکتر باشد!"
            }
        ),
        task:joi.string().required().min(5).max(100).messages(
            {
                "any.required":"نوشتن توضیحات الزامی است!",
                "string.base":"توضیحات نامعتبر است!",
                "string.min":"توضیحات باید حداقل پنچ کارکتر باشد!",
                "string.max":"توضیحات باید حداکثر صد کارکتر باشد!"
            }
        ),
        subjectTag: joi.string().required().min(3).max(30).messages(
            {
                "any.required":"نوشتن تگ الزامی است!",
                "string.base":"تگ نامعتبر است!",
                "string.min":"تگ باید حداقل سه کارکتر باشد!",
                "string.max":"تگ باید حداکثر سی کارکتر باشد!"
            }
        ),
        executors: joi.array().required(),
        assignedBy: joi.object(
            {
                _id: joi.string(), //! object id
                name: joi.string().required().min(3).max(30)
            }
        ).required(), 
        startDate:joi.date().required().messages(
            {
                "any.required":"نوشتن تاریخ شروع الزامی است!",
                "date.base":"فرمت تاریخ شروع صحیح نیست"
            }
        ),
        finishDate:joi.date().required().messages(
            {
                "any.required":"نوشتن تاریخ پایان الزامی است!",
                "date.base":"فرمت تاریخ شروع صحیح نیست"
            }
        ),
    })
    return schema.validate(data);
}
const taskIdValidator= (data)=>
{
    const schema = joi.objectId()
    return schema.validate(data);
}

module.exports = {
    setTaskValidator,
    taskIdValidator
}