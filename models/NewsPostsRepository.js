const Repository = require('./Repository');
const ImageFilesRepository = require('./imageFilesRepository.js');
const Image = require('./images.js');
const utilities = require("../utilities");
const News = require('./NewsPost');
// TODO : Adapter Image pour ne pas qu'il est à être afilié à un user 
module.exports = 
class NewsPostsRepository extends Repository {
    constructor(req, params){
        super('newsPosts',true,params);
        this.users = new Repository('Users');
        this.req = req;
        this.params = params;
    }

    bindNewsPostAndThumbnail(NewsPost){
        if (NewsPost) {
            let user = this.users.get(NewsPost.UserId);
            let username = "unknown";
            let userAvatarURL = "";
            if (user !== null) {
                username = user.Name;
                if (user.AvatarGUID != "")
                    userAvatarURL = "http://" + this.req.headers["host"] + ImageFilesRepository.getImageFileURL(user["AvatarGUID"]);
            } 
            let bindedNewsPost = {...NewsPost};
            bindedNewsPost["Username"] = username;
            bindedNewsPost["UserAvatarURL"] = userAvatarURL;

            if (NewsPost["GUID"] != ""){
                bindedNewsPost["OriginalURL"] = "http://" + this.req.headers["host"] + ImageFilesRepository.getImageFileURL(NewsPost["GUID"]);
                bindedNewsPost["ThumbnailURL"] = "http://" + this.req.headers["host"] + ImageFilesRepository.getThumbnailFileURL(NewsPost["GUID"]);
            } else {
                bindedNewsPost["OriginalURL"] = "";
                bindedNewsPost["ThumbnailURL"] = "";
            }
            return bindedNewsPost;
        }
        return null;
    }

    bindNewsPostsAndThumbnails(NewsPosts){
        let bindedNewsPosts = [];
        for(let NewsPost of NewsPosts) {
            bindedNewsPosts.push(this.bindNewsPostAndThumbnail(NewsPost));
        };
        return bindedNewsPosts;
    }

    get(id) {
        return this.bindNewsPostAndThumbnail(super.get(id));
    }

    getAll() {
        return this.bindNewsPostsAndThumbnails(super.getAll());
    }

    add(news) {
        news["Created"] = utilities.nowInSeconds();
        news["LastUpdate"] = utilities.nowInSeconds();
        let ImageData = news["ImageData"];
        delete news["ImageData"];
        if (News.valid(news)) {
            if(ImageData)
            news["GUID"] = ImageFilesRepository.storeImageData("",ImageData);
            return super.add(news);
        }
        return null;
    }

    update(news) {
        news["LastUpdate"] = utilities.nowInSeconds();
        let ImageData = news["ImageData"];
        delete news["ImageData"];

        if (News.valid(news)) {
            let foundNews = super.get(news.Id);
            if (foundNews) { // Maybe will Bug
                if(ImageData)
                news["GUID"] = ImageFilesRepository.storeImageData(foundNews["GUID"],ImageData);
                else{
                    ImageFilesRepository.removeImageFile(foundNews["GUID"]);
                    news["GUID"] = "";
                }
                return super.update(news);
            }
        }
        return false;
    }

    remove(id){
        let foundNews = super.get(id);
        if (foundNews) {
            if(foundNews["GUID"])
            ImageFilesRepository.removeImageFile(foundNews["GUID"]);
            return super.remove(id);
        }
        return false;
    }
    removeByIndex(indexToDelete){
        if (indexToDelete.length > 0){
            let news  = this.getAll();
            indexToDelete.forEach(index => {
                this.remove(news[index].id)
            });
            this.write();
        }
    }
}