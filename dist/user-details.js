// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"user-details.js":[function(require,module,exports) {
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

//File for d3 graphs code
//see https://bost.ocks.org/mike/bar/
//section coding a chart automatically
// don't forget you need css to see stuff
// need a bundler like parcel to import 
var data = [{
  language: 'SuperCollider',
  count: 13
}, {
  language: 'HCL',
  count: 144
}, {
  language: 'Groovy',
  count: 298
}, {
  language: 'Jupyter Notebook',
  count: 627
}, {
  language: 'CoffeeScript',
  count: 844
}, {
  language: 'Makefile',
  count: 2056
}, {
  language: 'C',
  count: 3972
}, {
  language: 'Processing',
  count: 10744
}, {
  language: 'Elixir',
  count: 17939
}, {
  language: 'Shell',
  count: 33143
}, {
  language: 'Vim script',
  count: 78029
}, {
  language: 'CSS',
  count: 119758
}, {
  language: 'Scala',
  count: 131638
}, {
  language: 'HTML',
  count: 223061
}, {
  language: 'JavaScript',
  count: 317581
}, {
  language: 'Ruby',
  count: 333298
}, //]
{
  language: 'Python',
  count: 6342896
}]; // svg size
//need margin for axes

var margin = 90;
var width = 400;
var height = 400; //TODO max count!!

var maxDataCount = data.reduce(function (prev, curr) {
  return prev.count > curr.count ? prev.count : curr.count;
}); // scale should crate a fn that takes the datum 
// val eg 5, divides it by the doain max then 
// multiples it by the range max

var scl = d3.scaleLinear() // actual data values range
.domain([0, maxDataCount]) // range == width on page?
.range([0, height]); // create container with classname chart

var svg = d3.select("body").append("svg").attr("width", width + 2 * margin).attr("height", height + 2 * margin).attr("class", 'chart'); // .append("g")
// bar width in px
// TODO change this to a fn of the num of langs

var barWidth = 15; //space in between bars

var barSpace = 0.5;
var chartHeight = 400; //TODO change barwidth if there are too many langs for a whole page width

var chartWidth = data.length * barWidth + data.length * barSpace;
d3.select('.chart') // selectall is like a foreach
.selectAll('rect') // so each data point is selected seperately
.data(data).enter().append('rect').attr("class", "bar").attr("width", barWidth) // d === each data obj(elem) in array
// i is its index
.attr("x", function (d, i) {
  return barWidth * i + barSpace * i + margin;
}).attr("y", chartHeight + margin) // tooltips must come before transition idk why
// see http://bl.ocks.org/WilliamQLiu/0aab9d28ab1905ac2c8d
.on('mouseover', function (d) {
  console.log('mouseover' + d.language);
}).on("mouseover", function (d, i) {
  // Create tooltip on mouseover
  var xPosition = barWidth + i * barWidth;
  var yPosition = chartHeight - scl(d.count) / 2 + 90; // Update the tooltip position and value
  // requires addition to html

  d3.select("#tooltip") // nb this really depends on what is on page
  //already for the y position!
  .style("left", xPosition + "px").style("top", yPosition + "px").select("#value").text(d.language + ' ' + d.count + ' bytes');
  d3.select("#tooltip").classed("hidden", false); // Show the tooltip
}).on("mouseout", function () {
  // 'Destroy' tooltip on mouseout
  d3.select("#tooltip").classed("hidden", true); // Hide the tooltip
}) // transition
//starting height
.attr("height", 0).transition().delay(function (d, i) {
  return i * 100;
}) // because starts drawing rect at top
.attr("y", function (d, i) {
  return chartHeight + margin - scl(d.count);
}).attr("height", function (d) {
  return scl(d.count);
});

function myRange(n) {
  return _toConsumableArray(Array(n).keys());
}

var xArray = data.map(function (d) {
  return d.language;
}); // scale and axes
//see http://bl.ocks.org/flunky/1a8b1bb608c06736f1ed4015065cbbb0
//see https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e

var chart = d3.select(".chart");
var x = d3.scaleBand() // .domain(myRange(data.length))
.range([0, chartWidth]);
var y = d3.scaleLinear() // .domain([0,333298])
.range([height, 0]); // Scale the range of the data

x.domain(xArray);
y.domain([0, d3.max(data, function (d) {
  return d.count;
})]); // add axis label

chart.append("g").attr("transform", "translate(" + margin + "," + margin + ")").call(d3.axisLeft(y)); // must do appends in correct order
// see https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
// text title for the x axis

chart.append("text").attr("transform", "translate(" + width / 2 + " ," + (height + margin + 80) + ")").style("text-anchor", "middle").style("font-family", "sans-serif").text("Language");
chart.append("g").attr("transform", "translate(" + margin + "," + (height + margin) + ")").call(d3.axisBottom(x)) // rotate axis lables
// see https://bl.ocks.org/d3noob/3c040800ff6457717cca586ae9547dbf
.selectAll("text").style("text-anchor", "end").style("font-family", "sans-serif").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)"); // text title for the y axis

chart.append("text").attr("transform", "rotate(-90)").attr("y", 0).attr("x", 0 - height / 2 - margin).attr("dy", "1em").style("text-anchor", "middle").style("font-family", "sans-serif").text("Bytes");
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49751" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","user-details.js"], null)
//# sourceMappingURL=/user-details.map