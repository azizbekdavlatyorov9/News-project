const joi = require("joi");

module.exports = function(data){
    const schema = joi.object({
        name:joi.string().min(2).max(30).required()
    })
    return schema.validate(data);
}