"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var utilities = require("../utilities");

var RepositoryCachesManager = require("./repositoryCachesManager.js");

var CollectionFilter = require('./collectionFilter');

var _require = require('uuid'),
    uuidv1 = _require.v1;

var fs = require('fs'); ///////////////////////////////////////////////////////////////////////////
// This class provide CRUD operations on JSON objects collection text file 
// with the assumption that each object have an Id member.
// If the objectsFile does not exist it will be created on demand.
// Warning: no type and data validation is provided
///////////////////////////////////////////////////////////////////////////


var repositoryEtags = {};

var Repository =
/*#__PURE__*/
function () {
  function Repository(objectsName) {
    var cached = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, Repository);

    this.objectsName = objectsName.toLowerCase();
    this.objectsList = null;
    this.objectsFile = "./data/".concat(objectsName, ".json");
    this.initEtag();
    this.cached = cached;
    this.params = params;
  }

  _createClass(Repository, [{
    key: "initEtag",
    value: function initEtag() {
      this.ETag = "";
      if (this.objectsName in repositoryEtags) this.ETag = repositoryEtags[this.objectsName];else this.newETag();
    }
  }, {
    key: "newETag",
    value: function newETag() {
      this.ETag = uuidv1();
      repositoryEtags[this.objectsName] = this.ETag;
    }
  }, {
    key: "objects",
    value: function objects() {
      if (this.objectsList == null) this.read();
      return this.objectsList;
    }
  }, {
    key: "read",
    value: function read() {
      this.objectsList = null;

      if (this.cached) {
        this.objectsList = RepositoryCachesManager.find(this.objectsName);
      }

      if (this.objectsList == null) {
        try {
          // Here we use the synchronus version readFile in order  
          // to avoid concurrency problems
          var rawdata = fs.readFileSync(this.objectsFile); // we assume here that the json data is formatted correctly

          this.objectsList = JSON.parse(rawdata);
          if (this.cached) RepositoryCachesManager.add(this.objectsName, this.objectsList);
        } catch (error) {
          if (error.code === 'ENOENT') {
            // file does not exist, it will be created on demand
            this.objectsList = [];
          }
        }
      }
    }
  }, {
    key: "write",
    value: function write() {
      // Here we use the synchronus version writeFile in order
      // to avoid concurrency problems  
      this.newETag();
      fs.writeFileSync(this.objectsFile, JSON.stringify(this.objects()));

      if (this.cached) {
        RepositoryCachesManager.clear(this.objectsName);
      }
    }
  }, {
    key: "nextId",
    value: function nextId() {
      var maxId = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.objects()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var object = _step.value;

          if (object.Id > maxId) {
            maxId = object.Id;
          }
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

      return maxId + 1;
    }
  }, {
    key: "add",
    value: function add(object) {
      try {
        object.Id = this.nextId();
        this.objects().push(object);
        this.write();
        return object;
      } catch (error) {
        return null;
      }
    }
  }, {
    key: "getAll",
    value: function getAll() {
      if (this.params) {
        var collectionFilter = new CollectionFilter(this.objects(), this.params);
        return collectionFilter.get();
      }

      return this.objects();
    }
  }, {
    key: "get",
    value: function get(id) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.objects()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var object = _step2.value;

          if (object.Id === id) {
            return object;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return null;
    }
  }, {
    key: "remove",
    value: function remove(id) {
      var index = 0;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.objects()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var object = _step3.value;

          if (object.Id === id) {
            this.objects().splice(index, 1);
            this.write();
            return true;
          }

          index++;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return false;
    }
  }, {
    key: "removeByIndex",
    value: function removeByIndex(indexToDelete) {
      if (indexToDelete.length > 0) {
        utilities.deleteByIndex(this.objects(), indexToDelete);
        this.write();
      }
    }
  }, {
    key: "update",
    value: function update(objectToModify) {
      var index = 0;
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.objects()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var object = _step4.value;

          if (object.Id === objectToModify.Id) {
            this.objects()[index] = objectToModify;
            this.write();
            return true;
          }

          index++;
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return false;
    }
  }, {
    key: "findByField",
    value: function findByField(fieldName, value) {
      var index = 0;
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this.objects()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var object = _step5.value;

          try {
            if (object[fieldName] === value) {
              return this.objects()[index];
            }

            index++;
          } catch (error) {
            break;
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return null;
    }
  }]);

  return Repository;
}();

module.exports = Repository;