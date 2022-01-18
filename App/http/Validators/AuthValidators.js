const joi = require ("joi");

const registerValidator = (data)=>
{
    const schema= joi.object({
        name: joi.string().required().min(5).max(30).messages(
            {
                "any.required":"نوشتن نام الزامی است!",
                "string.base":"اسم نامعتبر است!",
                "string.min":"اسم باید حداقل پنج کارکتر باشد!",
                "string.max":"اسم باید حداکثر پنجاه کارکتر باشد!"
            }
        ),
        email: joi.string().required().max(50).email().messages(
            {
                "any.required":"نوشتن ایمیل الزامی است!",
                "string.base":"ایمیل نامعتبر است!",
                "string.max":"ایمیل باید حداکثر پنجاه کارکتر باشد!",
                "string.email":"ایمیل نامعتبر است!"
            }
        ),
        phoneNumber: joi.string().required().length(11).pattern(/^[0-9]+$/).messages(
            {
                "any.required":"نوشتن شماره الزامی است!",
                "string.base":"شماره نامعتبر است!",
                "string.length":"شماره باید یازده کارکتر باشد!",
                "string.pattern.base":"شماره وارد شده نامعتبر است!",
            }
        ),
        password : joi.string().required().min(8).max(32).messages(
            {
                "any.required":"نوشتن رمز الزامی است!",
                "string.base":"رمز نامعتبر است!",
                "string.min":"رمز باید حداقل هشت کارکتر باشد!",
                "string.max":"رمز باید حداکثر سی و دو کارکتر باشد!"
            }
        ),
        ability: joi.arary().min(1).max(3).items(
            joi.string().min(3).max(10)
            .messages(
            {
                "string.base":"توانایی نامعتبر است!",
                "string.min":"توانایی باید حداقل سه کارکتر باشد!",
                "string.max":"توانایی باید حداکثر ده کارکتر باشد!"
            }
            )
        ).messages(
            {
                "array.min":"حداقل باید یک توانایی انتخاب شود!",
                "array.max":"حداکثر امکان انتخاب سه توانایی است!",
                "array.requires":"فرمت توانایی ها نامناسب است!"
            }
        ),
        avatarURL: joi.string().max(40)
    })
    return schema.validate(data);
}

const loginValidator = (data)=>
{
    const schema = joi.object({
        email: joi.string().required().max(30).email().messages(
            {
                "any.required":"نوشتن ایمیل الزامی است!",
                "string.base":"ایمیل نامعتبر است!",
                "string.max":"ایمیل باید حداکثر سی کارکتر باشد!",
                "string.email":"ایمیل نامعتبر است!"
            }
        ),
        password : joi.string().required().min(8).max(30).messages(
            {
                "any.required":"نوشتن رمز الزامی است!",
                "string.base":"رمز نامعتبر است!",
                "string.min":"رمز باید حداقل هشت کارکتر باشد!",
                "string.max":"رمز باید حداکثر سی و دو کارکتر باشد!"
            }
        ),
    })
    return schema.validate(data);
}

const changePasswordValidator = (data)=>
{
    const schema = joi.object({
        oldPassword: joi.string().required().min(8).max(32).messages(
            {
                "any.required":"نوشتن رمز قدیمی الزامی است!",
                "string.base":"رمز قدیمی نامعتبر است!",
                "string.min":"رمز قدیمی باید حداقل هشت کارکتر باشد!",
                "string.max":"رمز قدیمی باید حداکثر سی و دو کارکتر باشد!"
            }
        ),
        newPassword: joi.string().required().min(8).max(32).messages(
            {
                "any.required":"نوشتن رمز جدید الزامی است!",
                "string.base":"رمز جدید نامعتبر است!",
                "string.min":"رمز جدید باید حداقل هشت کارکتر باشد!",
                "string.max":"رمز جدید باید حداکثر سی و دو کارکتر باشد!"
            }
        ),
    })
    return schema.validate(data);
}

const forgotPasswordUsingEmailValidator = (email)=>
{
    const schema = joi.string().required().max(30).email().messages(
        {
            "any.required":"نوشتن ایمیل الزامی است!",
            "string.base":"ایمیل نامعتبر است!",
            "string.max":"ایمیل باید حداکثر سی کارکتر باشد!",
            "string.email":"ایمیل نامعتبر است!"
        }
    );
    return schema.validate(email);
}

const resetPasswordValidator = (data)=>
{
    const schema = joi.object(
    {
        password: joi.string().required().min(8).max(32).messages(
            {
                "any.required":"نوشتن رمز الزامی است!",
                "string.base":"رمز نامعتبر است!",
                "string.min":"رمز باید حداقل هشت کارکتر باشد!",
                "string.max":"رمز باید حداکثر سی و دو کارکتر باشد!"
            }
        ),
    });
    return schema.validate(data);
}
module.exports={registerValidator,loginValidator,changePasswordValidator,forgotPasswordUsingEmailValidator,resetPasswordValidator};