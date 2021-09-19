const pinModel = require( "../../Models/PinModel");


class UserController
{
    async getPins(req,res) 
    {
        const pins = await pinModel.find({});
        if (!pins)
        {
            res.status(404).send({message:"پینی یافت نشد"});
        }
        res.status(200).send(pins);
    }
}

module.exports = new UserController;