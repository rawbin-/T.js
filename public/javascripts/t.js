// Generated by CoffeeScript 1.4.0
(function() {
  var FIRST_FIELD_PATTERN, FIRST_NO_PROCESS_PATTERN, T, Template, VERSION, hasFunction, isArray, isEmpty, isObject, isTemplate, merge, normalize, parseStyles, prepareOutput, processAttributes, processCssClasses, processFirst, processStyles, render, renderAttributes, renderRest,
    __hasProp = {}.hasOwnProperty,
    __slice = [].slice;

  VERSION = "0.5.0";

  isArray = function(o) {
    return o instanceof Array;
  };

  isObject = function(o) {
    return o !== null && typeof o === "object" && (!(o instanceof Array));
  };

  isTemplate = function(o) {
    return o !== null && typeof o === "object" && o.isTjsTemplate;
  };

  isEmpty = function(o) {
    var key;
    if (!o) {
      return true;
    }
    for (key in o) {
      if (!__hasProp.call(o, key)) continue;
      return false;
    }
    return true;
  };

  hasFunction = function(o) {
    var item, key, value, _i, _len;
    if (typeof o === 'function') {
      return true;
    }
    if (isTemplate(o)) {
      return true;
    }
    if (isArray(o)) {
      for (_i = 0, _len = o.length; _i < _len; _i++) {
        item = o[_i];
        if (hasFunction(item)) {
          return true;
        }
      }
    } else if (isObject(o)) {
      for (key in o) {
        if (!__hasProp.call(o, key)) continue;
        value = o[key];
        if (hasFunction(value)) {
          return true;
        }
      }
    }
  };

  merge = function(o1, o2) {
    var key, value;
    if (!o2) {
      return o1;
    }
    if (!o1) {
      return o2;
    }
    for (key in o2) {
      if (!__hasProp.call(o2, key)) continue;
      value = o2[key];
      o1[key] = value;
    }
    return o1;
  };

  FIRST_NO_PROCESS_PATTERN = /^<.*/;

  FIRST_FIELD_PATTERN = /^([^#.]+)?(#([^.]+))?(.(.*))?$/;

  processFirst = function(items) {
    var attrs, classes, first, i, id, matches, part, parts, rest, tag;
    first = items[0];
    if (isArray(first)) {
      return items;
    }
    if (typeof first !== 'string') {
      throw "Invalid first argument " + first;
    }
    if (first.match(FIRST_NO_PROCESS_PATTERN)) {
      return items;
    }
    parts = first.split(' ');
    if (parts.length > 1) {
      i = parts.length - 1;
      rest = items.slice(1);
      while (i >= 0) {
        part = parts[i];
        rest.unshift(part);
        rest = [processFirst(rest)];
        i--;
      }
      return rest[0];
    }
    if (matches = first.match(FIRST_FIELD_PATTERN)) {
      tag = matches[1];
      id = matches[3];
      classes = matches[5];
      if (id || classes) {
        attrs = {};
        if (id) {
          attrs.id = id;
        }
        if (classes) {
          attrs["class"] = classes.replace('.', ' ');
        }
        items.splice(0, 1, tag, attrs);
      }
    }
    return items;
  };

  normalize = function(items) {
    var first, i, item, _i, _ref;
    if (!isArray(items)) {
      return items;
    }
    for (i = _i = _ref = items.length - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
      item = normalize(items[i]);
      if (isArray(item)) {
        first = item[0];
        if (first === '') {
          item.shift();
          items.splice.apply(items, [i, 1].concat(__slice.call(item)));
        } else if (isArray(first)) {
          items.splice.apply(items, [i, 1].concat(__slice.call(item)));
        }
      } else if (typeof item === 'undefined' || item === null || item === '') {

      } else {
        items[i] = item;
      }
    }
    return items;
  };

  parseStyles = function(str) {
    var name, part, styles, value, _i, _len, _ref, _ref1;
    styles = {};
    _ref = str.split(';');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      _ref1 = part.split(':'), name = _ref1[0], value = _ref1[1];
      if (name && value) {
        styles[name.trim()] = value.trim();
      }
    }
    return styles;
  };

  processStyles = function(attrs) {
    var style;
    style = attrs.style;
    if (typeof style === 'string') {
      attrs.style = parseStyles(style);
    } else if (isObject(style && !isEmpty(style))) {
      attrs.style = style;
    }
    return attrs;
  };

  processCssClasses = function(attrs, newAttrs) {
    if (attrs["class"]) {
      if (newAttrs["class"]) {
        newAttrs["class"] = attrs["class"] + ' ' + newAttrs["class"];
      } else {
        newAttrs["class"] = attrs["class"];
      }
    }
    return newAttrs;
  };

  processAttributes = function(items) {
    var attrs, i, item, newStyles, styles, _i, _j, _len, _ref;
    if (isArray(items)) {
      attrs = {};
      items = processFirst(items);
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if (isArray(item)) {
          processAttributes(item);
        } else if (isObject(item)) {
          processStyles(item);
          styles = attrs.style;
          newStyles = item.style;
          processCssClasses(attrs, item);
          attrs = merge(attrs, item);
          styles = merge(styles, newStyles);
          if (!isEmpty(styles)) {
            attrs.style = styles;
          }
        }
      }
      for (i = _j = _ref = items.length - 1; _ref <= 0 ? _j <= 0 : _j >= 0; i = _ref <= 0 ? ++_j : --_j) {
        if (isObject(items[i])) {
          items.splice(i, 1);
        }
      }
      if (!isEmpty(attrs)) {
        items.splice(1, 0, attrs);
      }
    }
    return items;
  };

  prepareOutput = function() {
    var data, item, key, output, template, value, _i, _len, _results;
    template = arguments[0], data = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (typeof template === 'function') {
      return prepareOutput.apply(null, [template.apply(null, data)].concat(__slice.call(data)));
    } else if (isTemplate(template)) {
      return template.process.apply(template, data);
    } else if (isArray(template)) {
      if (hasFunction(template)) {
        _results = [];
        for (_i = 0, _len = template.length; _i < _len; _i++) {
          item = template[_i];
          _results.push(prepareOutput(item, data));
        }
        return _results;
      } else {
        return template;
      }
    } else if (isObject(template)) {
      if (hasFunction(template)) {
        output = {};
        for (key in template) {
          if (!__hasProp.call(template, key)) continue;
          value = template[key];
          output[key] = prepareOutput(value, data);
        }
        return output;
      } else {
        return template;
      }
    } else {
      return template;
    }
  };

  renderAttributes = function(attributes) {
    var key, name, result, s, style, styles, value;
    result = "";
    for (key in attributes) {
      if (!__hasProp.call(attributes, key)) continue;
      value = attributes[key];
      if (key === "style") {
        styles = attributes.style;
        if (isObject(styles)) {
          s = "";
          for (name in styles) {
            if (!__hasProp.call(styles, name)) continue;
            style = styles[name];
            s += name + ":" + style + ";";
          }
          result += " style=\"" + s + "\"";
        } else {
          result += " style=\"" + styles + "\"";
        }
      } else {
        result += " " + key + "=\"" + value + "\"";
      }
    }
    return result;
  };

  renderRest = function(input) {
    var item;
    return ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = input.length; _i < _len; _i++) {
        item = input[_i];
        _results.push(render(item));
      }
      return _results;
    })()).join('');
  };

  render = function(input) {
    var first, item, result, second;
    if (typeof input === 'undefined' || input === null) {
      return '';
    }
    if (!isArray(input)) {
      return '' + input;
    }
    if (input.length === 0) {
      return '';
    }
    first = input.shift();
    if (isArray(first)) {
      return render(first) + ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = input.length; _i < _len; _i++) {
          item = input[_i];
          _results.push(render(item));
        }
        return _results;
      })()).join('');
    }
    if (first === "") {
      return renderRest(input);
    }
    if (input.length === 0) {
      if (first === 'script') {
        return "<" + first + "></" + first + ">";
      } else {
        return "<" + first + "/>";
      }
    }
    result = "<" + first;
    second = input.shift();
    if (isObject(second)) {
      result += renderAttributes(second);
      if (input.length === 0) {
        if (first === 'script') {
          result += "></" + first + ">";
        } else {
          result += "/>";
        }
        return result;
      } else {
        result += ">";
      }
    } else {
      result += ">";
      result += render(second);
      if (input.length === 0) {
        result += "</" + first + ">";
        return result;
      }
    }
    if (input.length > 0) {
      result += renderRest(input);
      result += "</" + first + ">";
    }
    return result;
  };

  Template = function(template, name) {
    this.template = template;
    this.name = name;
    return this.isTjsTemplate = true;
  };

  Template.prototype.process = function() {
    var data, output;
    data = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    output = prepareOutput.apply(null, [this.template].concat(__slice.call(data)));
    output = normalize(output);
    if (isArray(output) && output.length === 0) {
      return output;
    }
    return processAttributes(output);
  };

  Template.prototype.render = function() {
    var data, output;
    data = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    output = this.process.apply(this, data);
    return render(output);
  };

  Template.prototype.prepare = function(includes) {
    var key, value, _ref;
    this.includes = includes;
    _ref = this.includes;
    for (key in _ref) {
      if (!__hasProp.call(_ref, key)) continue;
      value = _ref[key];
      if (!isTemplate(value)) {
        this.includes[key] = new Template(value);
      }
    }
    this.process = function(data) {
      var oldIncludes;
      try {
        if (T.internal.includes) {
          oldIncludes = T.internal.includes;
        }
        if (includes) {
          T.internal.includes = includes;
        }
        return Template.prototype.process.call(this, data);
      } finally {
        if (oldIncludes) {
          T.internal.includes = oldIncludes;
        } else {
          delete T.internal.includes;
        }
      }
    };
    return this;
  };

  T = function() {
    var data, t, template;
    template = arguments[0], data = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    t = T.use(template);
    if (data.length === 0) {
      return t;
    } else {
      return t.process.apply(t, data);
    }
  };

  T.process = function() {
    var data, template, _ref;
    template = arguments[0], data = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return (_ref = new Template(template)).process.apply(_ref, data);
  };

  T.render = function() {
    var data, template, _ref;
    template = arguments[0], data = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return (_ref = new Template(template)).render.apply(_ref, data);
  };

  T.include = function(name, data) {
    return function() {
      var _ref;
      return (_ref = T.internal.includes) != null ? _ref[name].process(data) : void 0;
    };
  };

  T.templates = {};

  T.define = T.def = function(name, template) {
    return T.templates[name] = new Template(template, name);
  };

  T.redefine = T.redef = function(name, template) {
    var newTemplate, oldTemplate, wrapper;
    oldTemplate = T.use(name);
    newTemplate = new Template(template);
    wrapper = function(data) {
      var backup;
      try {
        if (T.original) {
          backup = T.internal.original;
        }
        T.internal.original = oldTemplate;
        return newTemplate.process(data);
      } finally {
        if (backup) {
          T.internal.original = backup;
        } else {
          delete T.internal.original;
        }
      }
    };
    return T.templates[name] = new Template(wrapper, name);
  };

  T.wrapped = function(data) {
    return T.internal.original.process(data);
  };

  T.use = function(name) {
    return T.templates[name];
  };

  T.escape = function(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  };

  T.unescape = function(str) {
    return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'");
  };

  T.internal = {
    normalize: normalize,
    processFirst: processFirst,
    parseStyles: parseStyles,
    processStyles: processStyles,
    processAttributes: processAttributes,
    render: render,
    thisRef: this
  };

  T.VERSION = VERSION;

  T.noConflict = function() {
    if (T.oldT) {
      T.internal.thisRef.T = T.oldT;
    } else {
      delete T.internal.thisRef.T;
    }
    return T;
  };

  if (this.T) {
    T.oldT = this.T;
  }

  this.T = T;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = T;
  }

}).call(this);
