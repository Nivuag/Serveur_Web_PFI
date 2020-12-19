"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Repository = require('./Repository');

var ImageFilesRepository = require('./imageFilesRepository.js');

var Image = require('./images.js');

var utilities = require("../utilities");

var News = require('./NewsPost'); // TODO : Adapter Image pour ne pas qu'il est à être afilié à un user 


module.exports =
/*#__PURE__*/
function (_Repository) {
  _inherits(NewsPostsRepository, _Repository);

  function NewsPostsRepository(req, params) {
    var _this;

    _classCallCheck(this, NewsPostsRepository);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NewsPostsRepository).call(this, 'newsPosts', true));
    _this.users = new Repository('Users');
    _this.req = req;
    _this.params = params;
    return _this;
  }

  _createClass(NewsPostsRepository, [{
    key: "bindNewsPostAndThumbnail",
    value: function bindNewsPostAndThumbnail(NewsPost) {
      if (NewsPost) {
        var user = this.users.get(NewsPost.UserId);
        var username = "unknown";
        var userAvatarURL = "";

        if (user !== null) {
          username = user.Name;
          if (user.AvatarGUID != "") userAvatarURL = "http://" + this.req.headers["host"] + ImageFilesRepository.getImageFileURL(user["AvatarGUID"]);
        }

        var bindedNewsPost = _objectSpread({}, NewsPost);

        bindedNewsPost["Username"] = username;
        bindedNewsPost["UserAvatarURL"] = userAvatarURL;

        if (NewsPost["GUID"] != "") {
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
  }, {
    key: "bindNewsPostsAndThumbnails",
    value: function bindNewsPostsAndThumbnails(NewsPosts) {
      var bindedNewsPosts = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = NewsPosts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var NewsPost = _step.value;
          bindedNewsPosts.push(this.bindNewsPostAndThumbnail(NewsPost));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      ;
      return bindedNewsPosts;
    }
  }, {
    key: "get",
    value: function get(id) {
      return this.bindNewsPostAndThumbnail(_get(_getPrototypeOf(NewsPostsRepository.prototype), "get", this).call(this, id));
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return this.bindNewsPostsAndThumbnails(_get(_getPrototypeOf(NewsPostsRepository.prototype), "getAll", this).call(this));
    }
  }, {
    key: "add",
    value: function add(news) {
      news["Created"] = utilities.nowInSeconds();
      news["LastUpdate"] = utilities.nowInSeconds();
      var ImageData = news["ImageData"];
      delete news["ImageData"];

      if (News.valid(news)) {
        if (ImageData) news["GUID"] = ImageFilesRepository.storeImageData("", ImageData);
        return _get(_getPrototypeOf(NewsPostsRepository.prototype), "add", this).call(this, news);
      }

      return null;
    }
  }, {
    key: "update",
    value: function update(news) {
      news["LastUpdate"] = utilities.nowInSeconds();
      var ImageData = news["ImageData"];
      delete news["ImageData"];

      if (News.valid(news)) {
        var foundNews = _get(_getPrototypeOf(NewsPostsRepository.prototype), "get", this).call(this, news.Id);

        if (foundNews) {
          // Maybe will Bug
          if (ImageData) news["GUID"] = ImageFilesRepository.storeImageData(foundNews["GUID"], ImageData);else {
            ImageFilesRepository.removeImageFile(foundNews["GUID"]);
            news["GUID"] = "";
          }
          return _get(_getPrototypeOf(NewsPostsRepository.prototype), "update", this).call(this, news);
        }
      }

      return false;
    }
  }, {
    key: "remove",
    value: function remove(id) {
      var foundNews = _get(_getPrototypeOf(NewsPostsRepository.prototype), "get", this).call(this, id);

      if (foundNews) {
        if (foundNews["GUID"]) ImageFilesRepository.removeImageFile(foundNews["GUID"]);
        return _get(_getPrototypeOf(NewsPostsRepository.prototype), "remove", this).call(this, id);
      }

      return false;
    }
  }, {
    key: "removeByIndex",
    value: function removeByIndex(indexToDelete) {
      var _this2 = this;

      if (indexToDelete.length > 0) {
        var news = this.getAll();
        indexToDelete.forEach(function (index) {
          _this2.remove(news[index].id);
        });
        this.write();
      }
    }
  }]);

  return NewsPostsRepository;
}(Repository);