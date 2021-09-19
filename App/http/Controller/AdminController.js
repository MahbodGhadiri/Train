const pinModel = require("../../Models/PinModel");
const setPinValidator =require( "../Validators/PinValidators");

class AdminController 
{
    async setPin(req,res)
    {
        const {error}=setPinValidator(req.body);
        if (error){return res.status(400).send({message:error.message})}
        const pin = await pinModel(req.body);
        await pin.save();
        res.status(200).send({message:"پین با موفقیت ذخیره شد"});

    }

    async deletepin(req,res)
    {
        const pinId = req.params;
        await pinModel.findOneAndDelete({_id:pinId},function (err, docs) {
            if (err)
            {console.log(err)}
            else{ res.status(200).send({message:"پین پاک شد"})}
        })
    }

}

module.exports =  new AdminController;