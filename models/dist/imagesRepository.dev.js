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

var utilities = require("../utilities"); // TODO : Adapter Image pour ne pas qu'il est à être afilié à un user 


module.exports =
/*#__PURE__*/
function (_Repository) {
  _inherits(ImagesRepository, _Repository);

  function ImagesRepository(req, params) {
    var _this;

    _classCallCheck(this, ImagesRepository);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ImagesRepository).call(this, 'Images', true));
    _this.users = new Repository('Users');
    _this.req = req;
    _this.params = params;
    return _this;
  }

  _createClass(ImagesRepository, [{
    key: "bindUsernameAndImageURL",
    value: function bindUsernameAndImageURL(image) {
      if (image) {
        var user = this.users.get(image.UserId);
        var username = "unknown";
        var userAvatarURL = "";

        if (user !== null) {
          username = user.Name;
          if (user.AvatarGUID != "") userAvatarURL = "http://" + this.req.headers["host"] + ImageFilesRepository.getImageFileURL(user["AvatarGUID"]);
        }

        var bindedImage = _objectSpread({}, image);

        bindedImage["Username"] = username;
        bindedImage["UserAvatarURL"] = userAvatarURL;

        if (image["GUID"] != "") {
          bindedImage["OriginalURL"] = "http://" + this.req.headers["host"] + ImageFilesRepository.getImageFileURL(image["GUID"]);
          bindedImage["ThumbnailURL"] = "http://" + this.req.headers["host"] + ImageFilesRepository.getThumbnailFileURL(image["GUID"]);
        } else {
          bindedImage["OriginalURL"] = "";
          bindedImage["ThumbnailURL"] = "";
        }

        return bindedImage;
      }

      return null;
    }
  }, {
    key: "bindUseramesAndImageURLS",
    value: function bindUseramesAndImageURLS(images) {
      var bindedImages = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = images[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var image = _step.value;
          bindedImages.push(this.bindUsernameAndImageURL(image));
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
      return bindedImages;
    }
  }, {
    key: "get",
    value: function get(id) {
      return this.bindUsernameAndImageURL(_get(_getPrototypeOf(ImagesRepository.prototype), "get", this).call(this, id));
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return this.bindUseramesAndImageURLS(_get(_getPrototypeOf(ImagesRepository.prototype), "getAll", this).call(this));
    }
  }, {
    key: "add",
    value: function add(image) {
      image["Created"] = utilities.nowInSeconds();

      if (Image.valid(image)) {
        image["GUID"] = ImageFilesRepository.storeImageData("", image["ImageData"]);
        delete image["ImageData"];
        return _get(_getPrototypeOf(ImagesRepository.prototype), "add", this).call(this, image);
      }

      return null;
    }
  }, {
    key: "update",
    value: function update(image) {
      image["Created"] = utilities.nowInSeconds();

      if (Image.valid(image)) {
        var foundImage = _get(_getPrototypeOf(ImagesRepository.prototype), "get", this).call(this, image.Id);

        if (foundImage != null) {
          image["GUID"] = ImageFilesRepository.storeImageData(image["GUID"], image["ImageData"]);
          delete image["ImageData"];
          return _get(_getPrototypeOf(ImagesRepository.prototype), "update", this).call(this, image);
        }
      }

      return false;
    }
  }, {
    key: "remove",
    value: function remove(id) {
      var foundImage = _get(_getPrototypeOf(ImagesRepository.prototype), "get", this).call(this, id);

      if (foundImage) {
        ImageFilesRepository.removeImageFile(foundImage["GUID"]);
        return _get(_getPrototypeOf(ImagesRepository.prototype), "remove", this).call(this, id);
      }

      return false;
    }
  }]);

  return ImagesRepository;
}(Repository);