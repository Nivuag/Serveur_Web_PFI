module.exports = 
class NewsPost{
    constructor(Title,Content,UserId,GUID)
    {
        this.Id = 0;
        this.Created = 0;
        this.LastUpdate= 0;
        this.Title = Title !== undefined ? Content : "";
        this.Content = Content !== undefined ? Content : "";
        this.UserId = UserId !== undefined? UserId : 0;
        this.GUID = GUID !== undefined ? GUID : "";
    }

    static valid(instance) {
        const Validator = new require('./validator');
        let validator = new Validator();
        validator.addField('Id','integer');
        validator.addField('Title','string');
        validator.addField('Content','string');
        validator.addField('Created','integer');
        validator.addField('LastUpdate','integer');
        validator.addField('UserId','integer');
        return validator.test(instance);
    }
}