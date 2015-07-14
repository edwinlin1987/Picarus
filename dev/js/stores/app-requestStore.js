var AppDispatcher = require("../dispatchers/app-dispatcher");
var AppConstants = require("../constants/app-constants");
var assign = require("react/lib/Object.assign");
var EventEmitter = require('events').EventEmitter;


//  all or most recent photo requests
var _request = {};

var _receiveRequest = function(data) {
  console.log('requestStore.js data: ', data);
  _request = data;
};

var _receivePhoto = function(photoData) {
  console.log('received photo data: ', photoData);
  _request.photos.push(photoData);
};

var RequestStore = assign({},EventEmitter.prototype, {
  // getAllComments: function() {
  //   return _commentList;
  // },

  // getComment: function(id) {
  //   return _commentList[id];
  // },

  getPhotos: function() {
    return _request.photos;
  },

  getId: function () {
    return _request.id;
  },

  getUsername: function () {
    return _request.user.username;
  },

  getTags: function () {
    return _request.tags; // [{tagname: 'dogs'}, {}, {} ]
  },

  getText: function () {
    return _request.text;
  },

  emitChange: function() {
    this.emit('change');
  },

  addChangeListener: function(callback) {
    this.on('change', callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener('change', callback);
  }
});

RequestStore.dispatchToken = AppDispatcher.register(function(action) {
  
  switch(action.type) {

    case AppConstants.RECEIVE_REQUEST:
      _receiveRequest(action.data.data);
      RequestStore.emitChange();
      break;

    case AppConstants.UPDATE_REQUEST:
    console.log('checking if getId: ', RequestStore.getId(), action.data.request_id);
      if (RequestStore.getId() === +action.data.request_id){
        _receivePhoto(action.data);
        RequestStore.emitChange();        
      }
      break;

    default:
  }
});


module.exports = RequestStore;

