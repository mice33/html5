define(['UIImageSlider', 'cUserStore', 'cUtilDate'], function (UIImageSlider, UserStore, cDate) { 
  var userStore = new UserStore, userId = userStore.getUserId();
  return _.inherit(UIImageSlider, {
    itemLoad: function() {
      var data = this.datamodel.data[this.getIndex()];
      var tempVal = {UserId: userId, PageId: this.pageId, PositionId: data.positionId, AdId: data.adId, DateTime: cDate.getServerDate()};
      var values = [];
      _.each(tempVal, function(value, key){
        values.push(key + '=' + value);
      });   
      window.__bfi.push(["_tracklog","AdClick", values.join('&')]);
    }        
  })
})


