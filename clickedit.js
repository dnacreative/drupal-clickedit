/*jslint browser: true, devel: true, eqeq: false, white: true, indent: 2 */
(function ($) {
  "use strict";

  // https://stackoverflow.com/a/498995/552405
  if (!String.prototype.trim) {
    String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
    String.prototype.ltrim=function(){return this.replace(/^\s+/,'');};
    String.prototype.rtrim=function(){return this.replace(/\s+$/,'');};
    String.prototype.fulltrim=function(){return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');};
  }

  var list = [];

  var hideAll = function () {
    var key;
    for (key in list) {
      list[key].hide();
    }
  };

  var resetAll = function () {
    var key;
    for (key in list) {
      list[key].reset();
    }
  };

  var catchKey = function (keyCode, callback) {
    $(document).on("keyup", function (event) {
      if (keyCode === event.keyCode || keyCode === event.which) {
        event.stopPropagation();
        event.preventDefault();
        callback();
        return false;
      }
    });
  };

  var ClickEdit = function (element) {
    var self = this;

    this.element = $(element);
    this.value = this.element.val();
    this.originalValue = this.value.trim();
    this.label = $("<span class=\"clickedit-label\"></span>");
    this.label.html(this.value);
    this.element.after(this.label);

    this.label.on("click", function (event) {
      event.stopPropagation();
      self.show();
      return false;
    });

    this.hide();
  };

  ClickEdit.prototype.reset = function () {
    this.element.hide();
    this.element.val(this.value);
    this.label.html(this.value);
    this.label.show();
  };

  ClickEdit.prototype.show = function() {
    hideAll();
    this.label.hide();
    this.element.show();
  };

  ClickEdit.prototype.hide = function() {
    this.value = this.element.val().trim();
    if (this.value !== this.originalValue) {
      this.label.addClass("clickedit-modified");
    } else {
      this.label.removeClass("clickedit-modified");
    }
    this.element.hide();
    this.label.html(this.value);
    this.label.show();
  };

  Drupal.behaviors.ClickEdit = {
    attach: function (context) {
      $(context).find(".clickedit").once("clickedit", function () {
        if (this.nodeName && "input" === this.nodeName.toLowerCase() && this.type) {
          switch (this.type) {
            case "text":
            case "select":
              list.push(new ClickEdit(this));
              break;
            // Else cannot proceed, sorry.
          }
        }
      });

      if (list.length) {
        catchKey(27, hideAll /* resetAll */);
        catchKey(13, hideAll);
      }
    }
  };
}(jQuery));
