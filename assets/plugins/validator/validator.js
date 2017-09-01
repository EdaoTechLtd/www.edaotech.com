(function($) {
  var defaults = {
    selector: 'input[required]',
    triggers: ['blur'],
    validations: ['required'],
    messages: {
      required: 'This field is required',
      base: 'Field is invalid'
    },
    tooltip: {
      placement: 'right',
      html: true,
      trigger: 'manual',
      container: 'body'
    },
    highlight: {
      className: 'has-error',
      attachTo: '.form-group',
      active: true
    }
  };

  var validationMethods = {
    required: function($el) {
      if ($el.data('select2') !== undefined) {
        return !!$el.select2('val');
      } else {
        return !!$el.val();
      }
    }
  };

  var cachedOptions = {};
  var uniqueIds = [];

  var generateUniqueId = function() {
    var uid;
    do {
      uid = Math.floor(Math.random() * 1000000000);
    } while ($.inArray(uid, uniqueIds) !== -1);
    uniqueIds.push(uid);
    return uid;
  };

  var getAttached = function($item, options) {
    var $attached;
    if (options.highlight.active === true) {
      if (options.highlight.attachTo === 'self') {
        $attached = $item;
      } else {
        $attached = $item.closest(options.highlight.attachTo);
      }
    }
    return $attached;
  };

  var showError = function($item, validation, options) {
    var msg;

    $attached = getAttached($item, options);
    if ($attached) {
      $attached.addClass(options.highlight.className);
    }

    if (options.tooltip) {
      if (typeof validation === 'object') {
        msg = validation.message;
      } else if (options.messages[validation]) {
        msg = options.messages[validation];
      }
      if (msg === undefined) {
        msg = options.messages.base;
      }
      if (msg === undefined) {
        msg = '';
      }
      var tooltipOptions = $.extend(options.tooltip, {title: msg});
      if ($item.data('select2') !== undefined) {
        $item.select2('container').tooltip(tooltipOptions).tooltip('show');
      } else {
        $item.tooltip(tooltipOptions).tooltip('show');
      }
    }
  };

  var hideError = function($item, options) {
    $attached = getAttached($item, options);
    if ($attached) {
      $attached.removeClass(options.highlight.className);
    }

    if (options.tooltip) {
      if ($item.data("select2") !== undefined) {
        $item.select2('container').tooltip('destroy');
      } else {
        $item.tooltip('destroy');
      }
    }
  };

  var checkValidations = function($item, options, silent) {
    var valid;
    for (var i = 0, len = options.validations.length; i < len; i++) {
      var validation = options.validations[i];
      if (validationMethods[validation]) {
        valid = validationMethods[validation]($item);
        if (!valid) {
          if (!silent) showError($item, validation, options);
          break;
        }
      } else if (typeof validation === 'object') {
        valid = validation.validator($item);
        if (!valid) {
          if (!silent) showError($item, validation, options);
          break;
        }
      }
    }
    if (valid === true) {
      if (!silent) hideError($item, options);
    }
    return valid;
  };

  var checkAllValidations = function(selectorUid, $element, silent) {
    var elementOptions = getOptionsForElement(selectorUid), error_count = 0;

    if (!$.isArray(elementOptions)) {
      $element.find(elementOptions.selector).each(function() {
        valid = checkValidations($(this), elementOptions, silent);
        if (!valid) error_count++;
      });
    } else {
      for (var i = 0, len = elementOptions.length; i < len; i++) {
        var itemOptions = elementOptions[i];
        $element.find(itemOptions.selector).each(function() {
          valid = checkValidations($(this), itemOptions, silent);
          if (!valid) error_count++;
        });
      }
    }

    return error_count;
  };

  var setupTooltips = function($element, options) {
    if (!options.tooltip) return;
    var tooltipOptions = $.extend(options.tooltip, {title: ''});
    $element.find(options.selector).each(function() {
      var $item = $(this);
      if ($item.data('select2') !== undefined) {
        $item.select2('container').tooltip(tooltipOptions);
      } else {
        $item.tooltip(tooltipOptions);
      }
    });
  };

  var setupValidations = function(selectorUid, $element, options) {
    setupTooltips($element, options);
    if (options.triggers) {
      $element.on(options.triggers.join(' '), options.selector, $.proxy(function(selectorUid, e) {
        var $item = $(e.currentTarget), $delegate = $(e.delegateTarget), delegateOptions = getOptionsForElement(selectorUid);
        for (var i = 0, len = delegateOptions.length; i < len; i++) {
          var itemOptions = delegateOptions[i];
          if ($.inArray($item[0], $delegate.find(itemOptions.selector)) != -1) {
            checkValidations($item, itemOptions);
            break;
          }
        }
      }, null, selectorUid));
    }
  };

  var getOptionsForElement = function(selectorUid) {
    return cachedOptions[selectorUid];
  };

  var methods = {
    init: function(baseOptions) {
      baseOptions = baseOptions || [];
      if (!$.isArray(baseOptions)) {
        $.error('Options must be an array of items.');
      }
      var selector = this.selector, uid = generateUniqueId(), selectorUid = selector + uid;
      this.each(function() {
        $(this).data('validator-uid', uid);
        var $element = $(this);
        if (!baseOptions.length) {
          cachedOptions[selectorUid] = [defaults];
          setupValidations(selectorUid, $element, defaults);
        } else {
          var allSettings = [];
          for (var i = 0, len = baseOptions.length; i < len; i++) {
            var clonedDefaults = $.extend({}, defaults);
            var settings = $.extend(true, {}, clonedDefaults, baseOptions[i]);
            allSettings.push(settings);
            setupValidations(selectorUid, $element, settings);
          }
          cachedOptions[selectorUid] = allSettings;
        }
      });
    },
    check: function(silent) {
      var silent = silent || false, valid, error_count = 0, selector = this.selector;
      this.each(function() {
        var uid = $(this).data('validator-uid');
        var $element = $(this);
        error_count += checkAllValidations(selector + uid, $element, silent);
      });
      return error_count;
    },
    hasErrors: function(silent) {
      var silent = silent || false, valid, error_count = 0, selector = this.selector;
      this.each(function() {
        var uid = $(this).data('validator-uid');
        var $element = $(this);
        error_count += checkAllValidations(selector + uid, $element, silent);
      });
      return error_count > 0;
    },
    reset: function() {
      var selector = this.selector;
      this.each(function() {
        var uid = $(this).data('validator-uid');
        var $element = $(this), elementOptions = getOptionsForElement(selector + uid);
        if (!$.isArray(elementOptions)) {
          $element.find(elementOptions.selector).each(function() {
            hideError($(this), elementOptions);
          });
        } else {
          for (var i = 0, len = elementOptions.length; i < len; i++) {
            var itemOptions = elementOptions[i];
            $element.find(itemOptions.selector).each(function() {
              hideError($(this), itemOptions);
            });
          }
        }
      });
    }
  };
  $.fn.validate = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.validate');
    }
  };
})(jQuery);
