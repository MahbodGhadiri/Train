const winston = require('winston');

module.exports = (error, req, res, next) => {
    console.log(error);
    winston.error(error.message, error);
    if (req.accepts('html')){
      return res.status(500).render("500page")
    }
    else return res.status(500).send({message:"سرور دچار خطا شد "});
  };