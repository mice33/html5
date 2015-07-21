define(['cMessageCenter', 'UIScroll'], function(MessageCenter, UIScroll){
  return {
    initialize: function($super, options) {
      $super(options);
      this.isPad = ($(window).width() >= 850 || $(window).height() >= 850);
      this.currentAlpha = 0;
      this.horizontal = ($(window).width() >= 850);      
      if (this.isPad) {
        this.childViewport = $('<DIV class="child-viewport"></DIV>').insertAfter(this.viewport).css({width: '64%', float:'right'});
        //this.viewport.css({width: '35%', float:'left'});
        if (/iP(ad|hone|od)/.test(navigator.userAgent)) {
          window.addEventListener('orientationchange', _.bind(function(e) {
            this.horizontal = (Math.abs(window.orientation) == 90);
            this._setViewLayout();
          }, this));
        } else {
          var __getCurrentAlpha = this.__getCurrentAlpha = _.bind(this._getCurrentAlpha, this);
          setInterval(function() {
            window.addEventListener('deviceorientation', __getCurrentAlpha);
          }, 400)
        }
      }
      MessageCenter.subscribe('moveView', function(){
        if (this.horizontal && ((this._mainCurview && _.isString(this._mainCurview.config.subViewUrl)) || this.targetViewport[0] == this.childViewport[0])) {
          var shownViews = _.filter(this.views, function(view){
            return view.$el.css('display') != 'none';
          });
          if (shownViews.length >= 1) {
            _.each(shownViews, _.bind(function(view) {
              if (view.$el.parent()[0] == this.childViewport[0]) {
                view.$el.appendTo(this.viewport);
                if (Lizard.isHybrid) {
                  this.endObserver();
                  window.location.hash = view.$el.attr('page-url');
                } else {
                  history.pushState({url: view.$el.attr('page-url'), text: view.text, options: {pushState: true}}, document.title, view.$el.attr('page-url'));
                }
              } else {
                view.$el.appendTo(this.childViewport);  
              }
            }, this))
          }
        }
      }, this);
      
      var oldSet = this.headerView.constructor.prototype.set, oldShow = this.headerView.constructor.prototype.show, self = this;
      this.headerView.constructor.prototype.set = function () {
        if (self.targetViewport == self.viewport) {
          oldSet.apply(this, arguments);
        } 
      }
      this.headerView.constructor.prototype.show = function () {
        if (self.targetViewport == self.viewport) {
          oldShow.apply(this, arguments);
        }         
      };      
    },
    
    _setViewLayout: function() {
      if (this.horizontal && ((this._mainCurview && _.isString(this._mainCurview.config.subViewUrl)) || this.targetViewport == this.childViewport)) {
        this.childViewport.css({display: 'block'});
        this.viewport.css({width: '35%', float: 'left'});
      } else {
        this.childViewport.css({display: 'none'});
        this.viewport.css({width: '100%'});
      }
      var horizontal = this.horizontal;
      _.each(this.views, function(view){
        view.horizontal = horizontal;
      });   
    },
    
    goTo: function($super, url, opt) {      
      this.targetViewport = this.viewport;
      if (this.isPad && this.horizontal) {
        if (opt && _.isObject(opt.notify)) {
          if (this.views[opt.notify.name] && _.isFunction(this.views[opt.notify.name][opt.notify.method])) {
            this.views[opt.notify.name][opt.notify.method].apply(this.views[opt.notify.name], opt.notify.params);
            return;
          }  
        }
        if (opt && opt.renderChild) {
          this.targetViewport = this.childViewport;
          this._setViewLayout();
        } else if (opt && _.isString(opt.subViewUrl)) {
          this._subViewUrl = opt.subViewUrl;
          MessageCenter.subscribe('switchview', this._showSubView, this);
        }   
      }
      $super(url, opt);      
    },
    
    _showSubView: function() {
      MessageCenter.unsubscribe('switchview', this._showSubView);
      setTimeout(_.bind(function(){
        this.goTo(this._subViewUrl, {renderChild: 1});
        delete this._subViewUrl;
      }, this), 600);
    },
    
    loadView: function ($super, url, html, options) {
      this.currentUrl = url;
      $super(url, html, options);
    },
    
    _getCurrentAlpha: function(e) {
      window.removeEventListener('deviceorientation', this.__getCurrentAlpha);
      if (Math.abs(this.currentAlpha - e.alpha) < 10 || Math.abs(this.currentAlpha - e.alpha - 360) < 10) {
        this.horizontal = $(window).width() > $(window).height()
        this._setViewLayout();
      }  
      this.currentAlpha = e.alpha;
    },
    
    showView: function($super, data) {
      this.targetViewport = this.viewport;
      $super(data);
    },
    
    switchView: function($super, inView, outView) {
      $super(inView, outView);
      /***Pad ISCROLL BEGIN***/
      if (inView && inView._onWidnowScroll) {        
        if (inView.__iscrollObj) {
          inView.__iscrollObj.off('scrollEnd', inView._onWidnowScroll);
        } else {
          $(window).unbind('scroll', this._onWidnowScroll);
          inView.__iscrollObj = new UIScroll({
           scrollbars: false,          
           scrollType: 'y',          
           wrapper: inView.$el.parent(),
           bounceTime: 200,
           scroller: inView.$el
          });
          var _oldFunc= inView.addScrollListener;
          inView.addScrollListener = function() {
            _oldFunc.apply(inView, arguments);
            $(window).unbind('scroll', this._onWidnowScroll);
          }
          _oldFunc = inView.removeScrollListener;
          inView.removeScrollListener = function() {
            _oldFunc.apply(inView, arguments);
            inView.__iscrollObj.off('scrollEnd', inView._onWidnowScroll);
          }
        }
        inView.__iscrollObj.on('scrollEnd', inView._onWidnowScroll);        
      }
      /***Pad ISCROLL END***/
      if (outView && outView.$el.parent()[0] != inView.$el.parent()[0]) {
        inView && inView.$el && _.each(inView.$el.parent().children(), function(view){
          (view != inView.$el[0]) && $(view).hide();
        });
        if (this.targetViewport == this.childViewport) {
          outView && outView.$el && _.each(outView.$el.parent().children(), function(view){
             (view == outView.$el[0]) && setTimeout(function(){outView.show()}, 30);
          });
        }         
      }
      if (this.isPad && this.horizontal) {
        if (_.isString(inView.config.subViewUrl) && _.isUndefined(this._subViewUrl)) {
          this.goTo(inView.config.subViewUrl, {renderChild: 1});
        }
        if (inView.$el.parent()[0] == this.viewport[0]) {
          this._mainCurview = inView;
          this._setViewLayout();        
        }     
      }       
    },

    _loadViewByOptions: function($super, url, html, opt)
    {
      if (this.targetViewport == this.viewport) {
        $super(url, html, opt);
      } else {
        this.loadView(url, html, {pushState: true});    
      }
    },
    
    judgeForward: function ($super, url) { 
      return this.currentUrl == url;
    }
  }
});