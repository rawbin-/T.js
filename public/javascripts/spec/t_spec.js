// Generated by CoffeeScript 1.4.0
(function() {
  var THIS;

  THIS = this;

  describe("T.internal.processFirst", function() {
    it("should parse div#this.class1.class2.class3", function() {
      var input, result;
      input = ['div#this.class1.class2.class3', 'text'];
      result = [
        'div', {
          id: 'this',
          'class': 'class1 class2 class3'
        }, 'text'
      ];
      return expect(T.internal.processFirst(input)).toEqual(result);
    });
    it("should parse div#this", function() {
      var input, result;
      input = ['div#this', 'text'];
      result = [
        'div', {
          id: 'this'
        }, 'text'
      ];
      return expect(T.internal.processFirst(input)).toEqual(result);
    });
    it("should parse #this", function() {
      var input, result;
      input = ['#this', 'text'];
      result = [
        'div', {
          id: 'this'
        }, 'text'
      ];
      return expect(T.internal.processFirst(input)).toEqual(result);
    });
    it("should parse 'div#this div.child'", function() {
      var input, result;
      input = ['div#this div.child', 'text'];
      result = [
        'div', {
          id: 'this'
        }, [
          'div', {
            "class": 'child'
          }, 'text'
        ]
      ];
      return expect(T.internal.processFirst(input)).toEqual(result);
    });
    it("should parse '.tb-item.refresh a.toggle-opacity'", function() {
      var input, result;
      input = ['.tb-item.refresh a.toggle-opacity', 'text'];
      result = [
        'div', {
          "class": 'tb-item refresh'
        }, [
          'a', {
            "class": 'toggle-opacity'
          }, 'text'
        ]
      ];
      return expect(T.internal.processFirst(input)).toEqual(result);
    });
    it("should return as is if first starts with '<'", function() {
      var input, result;
      input = ['<!DOCTYPE html>', '...'];
      result = input;
      return expect(T.internal.processFirst(input)).toEqual(result);
    });
    return it("should return as is if first is an array", function() {
      var input, result;
      input = [[], '...'];
      result = input;
      return expect(T.internal.processFirst(input)).toEqual(result);
    });
  });

  describe("T.internal.normalize", function() {
    it("should normalize array", function() {
      var input, result;
      input = ['div', ['', 'text']];
      result = ['div', 'text'];
      return expect(T.internal.normalize(input)).toEqual(result);
    });
    it("should normalize array if first item is an array", function() {
      var input, result;
      input = ['div', [['div'], 'text']];
      result = ['div', ['div'], 'text'];
      return expect(T.internal.normalize(input)).toEqual(result);
    });
    return it("should normalize array recursively", function() {
      var input, result;
      input = ['div', ['', 'text', ['', 'text2']]];
      result = ['div', 'text', 'text2'];
      return expect(T.internal.normalize(input)).toEqual(result);
    });
  });

  describe("T.internal.parseStyles", function() {
    return it("should parse styles", function() {
      var input, result;
      input = "a:a-value;b:b-value;";
      result = {
        a: 'a-value',
        b: 'b-value'
      };
      return expect(T.internal.parseStyles(input)).toEqual(result);
    });
  });

  describe("T.internal.processStyles", function() {
    it("should work", function() {
      var input, result;
      input = {
        style: 'a:a-value;b:b-value;'
      };
      result = {
        style: {
          a: 'a-value',
          b: 'b-value'
        }
      };
      return expect(T.internal.processStyles(input)).toEqual(result);
    });
    return it("should convert _ in style name to -", function() {
      var input, result;
      input = {
        style: 'a_b:a-value;b:b-value;'
      };
      result = {
        style: {
          'a-b': 'a-value',
          b: 'b-value'
        }
      };
      return expect(T.internal.processStyles(input)).toEqual(result);
    });
  });

  describe("T.internal.processAttributes", function() {
    it("should return empty array as is", function() {
      var input, result;
      input = [];
      result = [];
      return expect(T.internal.processAttributes(input)).toEqual(result);
    });
    it("should merge attributes", function() {
      var input, result;
      input = [
        'div', {
          a: 1
        }, {
          a: 11,
          b: 2
        }
      ];
      result = [
        'div', {
          a: 11,
          b: 2
        }
      ];
      return expect(T.internal.processAttributes(input)).toEqual(result);
    });
    it("should merge attributes and keep other items untouched", function() {
      var input, result;
      input = [
        'div', {
          a: 1
        }, 'first', {
          b: 2
        }, 'second'
      ];
      result = [
        'div', {
          a: 1,
          b: 2
        }, 'first', 'second'
      ];
      return expect(T.internal.processAttributes(input)).toEqual(result);
    });
    it("should merge styles", function() {
      var input, result;
      input = [
        'div', {
          style: 'a:old-a;b:b-value;'
        }, {
          style: 'a:new-a'
        }
      ];
      result = [
        'div', {
          style: {
            a: 'new-a',
            b: 'b-value'
          }
        }
      ];
      return expect(T.internal.processAttributes(input)).toEqual(result);
    });
    return it("should merge css classes", function() {
      var input, result;
      input = [
        'div', {
          "class": 'first second'
        }, {
          "class": 'third'
        }
      ];
      result = [
        'div', {
          "class": 'first second third'
        }
      ];
      return expect(T.internal.processAttributes(input)).toEqual(result);
    });
  });

  describe("T.internal.renderAttributes", function() {
    return it("should work", function() {
      var input, result;
      input = {
        style: {
          top: 10
        }
      };
      result = ' style="top:10px;"';
      return expect(T.internal.renderAttributes(input)).toEqual(result);
    });
  });

  describe("T.internal.renderTags", function() {
    it("should work", function() {
      var input, result;
      input = ['div', 'text'];
      result = T.internal.renderTags(input);
      expect(result.tagName).toEqual('DIV');
      return expect(result.textContent).toEqual('text');
    });
    it("should work with attributes", function() {
      var input, result;
      input = [
        'div', {
          name: 'value'
        }
      ];
      result = T.internal.renderTags(input);
      expect(result.tagName).toEqual('DIV');
      return expect(result.getAttribute('name')).toEqual('value');
    });
    it("should work with styles", function() {
      var input, result;
      input = [
        'div', {
          style: {
            top: '3px'
          }
        }
      ];
      result = T.internal.renderTags(input);
      expect(result.tagName).toEqual('DIV');
      return expect(result.getAttribute('style')).toEqual('top:3px;');
    });
    it("should work with child tags", function() {
      var child, input, result;
      input = ['div', ['span', 'text']];
      result = T.internal.renderTags(input);
      expect(result.tagName).toEqual('DIV');
      child = result.children[0];
      expect(child.tagName).toEqual('SPAN');
      return expect(child.textContent).toEqual('text');
    });
    it("should register event handlers", function() {
      var callback, input, result;
      callback = jasmine.createSpy();
      input = [
        'div', {
          click: callback
        }, 'text'
      ];
      result = T.internal.renderTags(input);
      $(result).click();
      return expect(callback).toHaveBeenCalled();
    });
    it("should invoke renderComplete callback", function() {
      var elem, input, renderCompleteCalled, result;
      elem = null;
      renderCompleteCalled = false;
      input = [
        'div', {
          renderComplete: function(el) {
            elem = el;
            return renderCompleteCalled = true;
          }
        }
      ];
      result = T.internal.renderTags(input);
      expect(elem).toBe(result);
      return expect(renderCompleteCalled).toBe(true);
    });
    it("should invoke all renderComplete callbacks", function() {
      var input, renderCompleteCalled, result;
      renderCompleteCalled = 0;
      input = [
        'div', {
          renderComplete: [
            function(el) {
              return renderCompleteCalled += 1;
            }, function(el) {
              return renderCompleteCalled += 1;
            }
          ]
        }
      ];
      result = T.internal.renderTags(input);
      return expect(renderCompleteCalled).toBe(2);
    });
    return it("should work with child tags", function() {
      var input, result;
      input = [['div', 'a'], ['span', 'b']];
      result = T.internal.renderTags(input);
      expect(result.childNodes[0].tagName).toEqual('DIV');
      expect(result.childNodes[0].textContent).toEqual('a');
      expect(result.childNodes[1].tagName).toEqual('SPAN');
      return expect(result.childNodes[1].textContent).toEqual('b');
    });
  });

  describe("T.process", function() {
    it("should create ready-to-be-rendered data structure from template and data", function() {
      var result, template;
      template = [
        'div#test', {
          "class": 'first second'
        }, {
          "class": 'third'
        }
      ];
      result = [
        'div', {
          id: 'test',
          "class": 'first second third'
        }
      ];
      return expect(T.process(template).tags).toEqual(result);
    });
    it("should work with multiple arguments", function() {
      var result, template;
      template = function(arg1, arg2, arg3) {
        return ["div", arg1, arg2, arg3];
      };
      result = ['div', '1', '2', '3'];
      return expect(T.process(template, '1', '2', '3').tags).toEqual(result);
    });
    it("can be called with different data", function() {
      var template;
      template = function(data) {
        return ['div', data];
      };
      expect(T.process(template, 'test').tags).toEqual(['div', 'test']);
      return expect(T.process(template, 'test1').tags).toEqual(['div', 'test1']);
    });
    it("should invoke postProcess callback", function() {
      var input, result;
      input = [
        'div', {
          postProcess: function(data) {
            return data.push('value');
          }
        }
      ];
      result = T.process(input);
      return expect(result.tags).toEqual(['div', 'value']);
    });
    return it("should invoke all postProcess callbacks", function() {
      var input, result;
      input = [
        'div', {
          postProcess: function(data) {
            return data.push('value1');
          }
        }, {
          postProcess: function(data) {
            return data.push('value2');
          }
        }
      ];
      result = T.process(input);
      return expect(result.tags).toEqual(['div', 'value1', 'value2']);
    });
  });

  describe("T.escape", function() {
    return it("should work", function() {
      return expect(T.escape('<>&<>&')).toEqual('&lt;&gt;&amp;&lt;&gt;&amp;');
    });
  });

  describe("T.unescape", function() {
    return it("should work", function() {
      return expect(T.unescape('&lt;&gt;&amp;&lt;&gt;&amp;')).toEqual('<>&<>&');
    });
  });

  describe("T()", function() {
    it("should work", function() {
      var data, template;
      template = function(data) {
        return ["div", data.name];
      };
      data = {
        name: 'John Doe'
      };
      return expect(T(template, data).tags).toEqual(['div', 'John Doe']);
    });
    it("with multiple arguments should work", function() {
      var result, template;
      template = function(arg1, arg2, arg3) {
        return ["div", arg1, arg2, arg3];
      };
      result = ['div', '1', '2', '3'];
      return expect(T(template, '1', '2', '3').tags).toEqual(result);
    });
    it("toString should work", function() {
      var result, template;
      template = function(arg1, arg2, arg3) {
        return ["div", arg1, arg2, arg3];
      };
      result = '<div>123</div>';
      return expect(T(template, '1', '2', '3').toString()).toEqual(result);
    });
    it("toString should not include generated class name if ignoreCallbacks is true", function() {
      var result, template;
      template = function(arg) {
        return [
          "div", {
            click: function() {}
          }, arg
        ];
      };
      result = '<div>value</div>';
      return expect(T(template, 'value').toString({
        ignoreCallbacks: true
      })).toEqual(result);
    });
    it("include template as partial should work", function() {
      var data, partial, result, template;
      partial = function(data) {
        return ["div", data.name];
      };
      template = function(data) {
        return ["div", T(partial, data.account)];
      };
      data = {
        account: {
          name: 'John Doe'
        }
      };
      result = ['div', ['div', 'John Doe']];
      return expect(T(template, data).tags).toEqual(result);
    });
    return it("complex template should work", function() {
      var accountTemplate, data, profileTemplate, result, template;
      profileTemplate = function(data) {
        return ['div', data.username];
      };
      accountTemplate = function(data) {
        return ['div', data.name, T(profileTemplate, data.profile)];
      };
      template = function(data) {
        return ['div', T(accountTemplate, data.account)];
      };
      result = ['div', ['div', 'John Doe', ['div', 'johndoe']]];
      data = {
        account: {
          name: 'John Doe',
          profile: {
            username: 'johndoe'
          }
        }
      };
      return expect(T(template, data).tags).toEqual(result);
    });
  });

  describe("T.each", function() {
    return it("should work", function() {
      var result, template;
      template = function(item, arg) {
        return ['div', item, arg];
      };
      result = [['div', 'a', 'arg'], ['div', 'b', 'arg']];
      return expect(T.each(template, ['a', 'b'], 'arg').tags).toEqual(result);
    });
  });

  describe("T.each_with_index", function() {
    return it("should work", function() {
      var result, template;
      template = function(item, i, arg) {
        return ['div', item, i, arg];
      };
      result = [['div', 'a', 0, 'arg'], ['div', 'b', 1, 'arg']];
      return expect(T.each_with_index(template, ['a', 'b'], 'arg').tags).toEqual(result);
    });
  });

  describe("T.each_pair", function() {
    return it("should work", function() {
      var result, template;
      template = function(key, value, arg) {
        return ['div', key, value, arg];
      };
      result = [['div', 'a', 'aa', 'arg'], ['div', 'b', 'bb', 'arg']];
      return expect(T.each_pair(template, {
        a: 'aa',
        b: 'bb'
      }, 'arg').tags).toEqual(result);
    });
  });

  describe("prepare/include", function() {
    it("should work", function() {
      var partial, template;
      template = T.template(function(data) {
        return ['div', T.include('title', data)];
      });
      partial = T.template(function(data) {
        return ['div', data.name];
      });
      return expect(template.prepare({
        title: partial
      }).process({
        name: 'John Doe'
      }).tags).toEqual(['div', ['div', 'John Doe']]);
    });
    it("T.prepare should work", function() {
      var layout, partial, template;
      layout = function(data) {
        return ['div', T.include('title', data)];
      };
      partial = function(data) {
        return ['div', data.name];
      };
      template = T.prepare(layout, {
        title: partial
      });
      return expect(template.process({
        name: 'John Doe'
      }).tags).toEqual(['div', ['div', 'John Doe']]);
    });
    it("layout can be reused", function() {
      var layout, template1, template2;
      layout = T.template(function() {
        return ['div', T.include('body')];
      });
      template1 = layout.prepare({
        body: 'Body1'
      });
      template2 = layout.prepare({
        body: 'Body2'
      });
      expect(template1.process().tags).toEqual(['div', 'Body1']);
      return expect(template2.process().tags).toEqual(['div', 'Body2']);
    });
    return it("nested include/prepare should work", function() {
      var result, template1, template2;
      template1 = T.template(function() {
        return ['div', T.include('title')];
      });
      template2 = T.template(function() {
        return [
          'div', template1.prepare({
            title: 'Title'
          }).process(), T.include('body')
        ];
      });
      result = ['div', ['div', 'Title'], 'Body'];
      return expect(template2.prepare({
        body: 'Body'
      }).process().tags).toEqual(result);
    });
  });

  describe("T.noConflict", function() {
    return it("should work", function() {
      var T1;
      T1 = T.noConflict();
      expect(typeof T).toEqual('undefined');
      return THIS.T = T1;
    });
  });

}).call(this);
