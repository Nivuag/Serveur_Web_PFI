const usersRepository = require('../models/usersRepository');
const newsRepository = require('../models/NewsPostsRepository');
const Repository = require('../models/Repository');
const utilities = require("../utilities");
const Cache = require('../getRequestsCacheManager');
const News = require('../models/NewsPost');
const NewsPost = require('../models/NewsPost');
module.exports = 
// : Bunch of stuffs needs to be updated
class NewspostsController extends require('./Controller') {
    constructor(req, res){
        super(req, res, false /* needAuthorization */);
        this.newsRepository = new newsRepository(req,true,this.params);
    }

    head() {
        console.log("ETag: " + this.newsRepository.ETag);
        this.response.JSON(null, this.newsRepository.ETag);
    }
    get(id){
        // if we have no parameter, expose the list of possible query strings
        if (this.params === null) { 
            if(!isNaN(id)) {
                this.response.JSON(this.newsRepository.get(id));
            }
            else  
                this.response.JSON( this.newsRepository.getAll(), 
                                    this.newsRepository.ETag);
        }
        else {
             this.response.JSON(this.newsRepository.getAll(), this.newsRepository.ETag);
        }
    }
    // TODO : 
    // Check if image null 
    // If not , add image to Images
    // Get the image's new ID
    // Give it to news
    // Maybe create a function in imagesRepository that allows to add images with only their ImageData. 
    //  They'll have a negative UserId to indicate that they do not belong to anyone
    //      this would allow the addition of comments and articles with images without changing the existing code too much
    //  Objects that use images contains an Id to the image, so, if they get deleted, they can delete the image linked to them.
    //  Order of deletions would be something like : Images -> Articles / comments / Images(The ones posted by themselves) -> User 

    // PAS Testé avec image

    //news = {Id,Created,LastUpdate,Title,Content,UserId,GUID,ImageData} 

    post(news){  
        if (this.requestActionAuthorized()) {
            let newNews = this.newsRepository.add(news);
            if(newNews)
                this.response.created(newNews);
            else
                this.response.unprocessable();
        } else 
            this.response.unAuthorized();
    }
    //TODO
    // Pas testé avec image
    put(news){
        if (this.requestActionAuthorized()) {
            
            //Maybe Bug
            let ImageData =  news["ImageData"];
        
            delete news["ImageData"];

            if(News.valid(news)){
                news["ImageData"] = ImageData;
                if (this.newsRepository.update(news))
                {
                    Cache.clear("newsPosts");
                    this.response.ok();
                }
                else
                this.response.notFound();
            }
            else 
                this.response.unprocessable();

        }
        else
            this.response.unAuthorized();
    }
    //TODO
    // Pas Testé
    remove(id){
        if (this.requestActionAuthorized()) {
            if (this.newsRepository.remove(id))
                this.response.accepted();
            else
                this.response.notFound();
        } else
            this.response.unAuthorized();
    }
    //TODO
    createImageObject(ImageData,Id=0){
        return {"Id":Id,"Title":"","Description":"","Shared":false,"Created":0,"GUID":0,"UserId":-1,"ImageData":ImageData};
    }
}
