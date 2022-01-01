const joi = require("joi");

const setPinValidator= (data)=>
{
    const schema = joi.object(
    {
        title : joi.string().required().min(3).max(30).messages(
            {
                "any.required":"نوشتن موضوع الزامی است!",
                "string.base":"موضوع نامعتبر است!",
                "string.min":"موضوع باید حداقل سه کارکتر باشد!",
                "string.max":"موضوع باید حداکثر سی کارکتر باشد!"
            }
        ),
        message : joi.string().required().min(3).max(100).messages(
            {
                "any.required":"نوشتن پیام الزامی است!",
                "string.base":"پیام نامعتبر است!",
                "string.min":"پیام باید حداقل سه کارکتر باشد!",
                "string.max":"پیام باید حداکثر صد کارکتر باشد!"
            }
        ),
    })
    return schema.validate(data);
}

module.exports= setPinValidator;