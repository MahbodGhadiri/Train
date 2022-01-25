const joi = require ("joi");

const deleteAccountValidator=(data)=> //This Block looks kinda dumb
{
    const schema = joi.object({
        password:joi.string().required().min(8).max(32).messages(
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
const setCustomTaskValidator=(data)=>
{
    const schema = joi.object(
    {
        title: joi.string().min(3).max(30).required().messages(
            {
                "any.required":"نوشتن موضوع الزامی است!",
                "string.base":"موضوع نامعتبر است!",
                "string.min":"موضوع باید حداقل سه کارکتر باشد!",
                "string.max":"موضوع باید حداکثر سی کارکتر باشد!"
            }
        ),
        task: joi.string().min(10).max(100).required().messages(
            {
                "any.required":"نوشتن توضیحات الزامی است!",
                "string.base":"توضیحات نامعتبر است!",
                "string.min":"توضیحات باید حداقل پنچ کارکتر باشد!",
                "string.max":"توضیحات باید حداکثر صد کارکتر باشد!"
            }
        ),
        subjectTag: joi.string().min(3).max(30).required().messages(
            {
                "any.required":"نوشتن تگ الزامی است!",
                "string.base":"تگ نامعتبر است!",
                "string.min":"تگ باید حداقل سه کارکتر باشد!",
                "string.max":"تگ باید حداکثر سی کارکتر باشد!"
            }
        ),
        startDate: joi.date().required().messages(
            {
                "any.required":"نوشتن تاریخ شروع الزامی است!",
                "date.base":"فرمت تاریخ شروع صحیح نیست"
            }
        ),
        finishDate: joi.date().required().messages(
            {
                "any.required":"نوشتن تاریخ پایان الزامی است!",
                "date.base":"فرمت تاریخ شروع صحیح نیست"
            }
        ),
    })
    return schema.validate(data);
}
const changeInfoValidator=(data)=>{
    const schema = joi.object({
        name: joi.string().required().min(3).max(30).messages(
            {
                "any.required":"نوشتن نام الزامی است!",
                "string.base":"اسم نامعتبر است!",
                "string.min":"اسم باید حداقل پنج کارکتر باشد!",
                "string.max":"اسم باید حداکثر پنجاه کارکتر باشد!"
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
        ability: joi.array().min(1).max(3).items(
            joi.string().min(3).max(15)
            .messages(
            {
                "string.base":"توانایی نامعتبر است!",
                "string.min":"توانایی باید حداقل سه کارکتر باشد!",
                "string.max":"توانایی باید حداکثر پانزده کارکتر باشد!"
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

module.exports=
{
    deleteAccountValidator,
    setCustomTaskValidator,
    changeInfoValidator
};