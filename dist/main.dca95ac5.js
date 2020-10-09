// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
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

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
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
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var canvas = document.getElementById('canvas');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
var ctx = canvas.getContext('2d');
var brush = document.getElementById("brush");
var eraser = document.getElementById("eraser");
var clear = false;
var activeColor = 'black';
var aColorBtn = document.getElementsByClassName("color-item");
var reSetCanvas = document.getElementById("clear");
ctx.lineWidth = 10;
ctx.lineCap = 'round';
setCanvasBg('white');
listenToUser(canvas);
getColor();

function setCanvasBg(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
}

function getColor() {
  for (var i = 0; i < aColorBtn.length; i++) {
    aColorBtn[i].onclick = function () {
      for (var _i = 0; _i < aColorBtn.length; _i++) {
        aColorBtn[_i].classList.remove("active");

        this.classList.add("active");
        activeColor = this.style.backgroundColor;
        ctx.fillStyle = activeColor;
        ctx.strokeStyle = activeColor;
      }
    };
  }
}

function drawCircle(x, y, radius) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  if (clear) {
    ctx.clip();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function listenToUser(canvas) {
  var painting = false;
  var lastPoint = {
    x: undefined,
    y: undefined
  };

  if (document.body.ontouchstart !== undefined) {
    canvas.ontouchstart = function (e) {
      painting = true;
      var x = e.touches[0].clientX;
      var y = e.touches[0].clientY;
      lastPoint = {
        "x": x,
        "y": y
      };
      ctx.save();
      drawCircle(x, y, 0);
    };

    canvas.ontouchmove = function (e) {
      if (painting) {
        var x = e.touches[0].clientX;
        var y = e.touches[0].clientY;
        var newPoint = {
          "x": x,
          "y": y
        };
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
        lastPoint = newPoint;
      }
    };

    canvas.ontouchend = function () {
      painting = false;
    };
  } else {
    canvas.onmousedown = function (e) {
      painting = true;
      var x = e.clientX;
      var y = e.clientY;
      lastPoint = {
        "x": x,
        "y": y
      };
      ctx.save();
      drawCircle(x, y, 0);
    };

    canvas.onmousemove = function (e) {
      if (painting) {
        var x = e.clientX;
        var y = e.clientY;
        var newPoint = {
          "x": x,
          "y": y
        };
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y, clear);
        lastPoint = newPoint;
      }
    };

    canvas.onmouseup = function () {
      painting = false;
    };

    canvas.mouseleave = function () {
      painting = false;
    };
  }
}

eraser.onclick = function () {
  clear = true;
  this.classList.add("active");
  brush.classList.remove("active");
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'white';
};

brush.onclick = function () {
  clear = false;
  this.classList.add("active");
  eraser.classList.remove("active");
};

reSetCanvas.onclick = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBg('white');
};
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.dca95ac5.js.map