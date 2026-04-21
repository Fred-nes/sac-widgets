(function () {

  var tmpl = document.createElement("template");
  tmpl.innerHTML =
    "<style>" +
    ":host{display:block;width:100%;height:100%;box-sizing:border-box;}" +
    ".card{background:#ffffff;border:1px solid #e5e5e5;border-radius:12px;padding:16px;" +
    "width:100%;height:100%;box-sizing:border-box;cursor:pointer;" +
    "display:flex;flex-direction:column;gap:8px;}" +
    ".card:hover{box-shadow:0 2px 8px rgba(0,0,0,0.08);}" +
    ".header{display:flex;align-items:center;gap:6px;}" +
    ".title{font-size:11px;font-weight:600;color:#6a6d70;letter-spacing:0.04em;text-transform:uppercase;}" +
    ".body{display:flex;align-items:center;justify-content:space-between;gap:12px;}" +
    ".left{display:flex;flex-direction:column;gap:2px;}" +
    ".main-value{font-weight:700;color:#1a1a1a;line-height:1.2;}" +
    ".source{font-size:11px;color:#9a9a9a;}" +
    ".badge{border-radius:20px;padding:4px 14px;font-size:12px;font-weight:600;white-space:nowrap;flex-shrink:0;}" +
    ".nodata{font-size:11px;color:#b0b0b0;font-style:italic;}" +
    "</style>" +
    "<div class='card' id='card'>" +
    "<div class='header'>" +
    "<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>" +
    "<path d='M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-4-4H8z' stroke='#6a6d70' stroke-width='1.5' stroke-linejoin='round'/>" +
    "<path d='M14 2v6h6' stroke='#6a6d70' stroke-width='1.5' stroke-linejoin='round'/>" +
    "<path d='M9 15l2 2 4-4' stroke='#6a6d70' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/>" +
    "</svg>" +
    "<span class='title' id='title'>Strategic Product Fit</span>" +
    "</div>" +
    "<div class='body'>" +
    "<div class='left'>" +
    "<div class='main-value' id='main-value'>–</div>" +
    "<div class='source' id='source'>Internal Strategy Doc (PDF)</div>" +
    "</div>" +
    "<span class='badge' id='badge' style='display:none;'></span>" +
    "</div>" +
    "<div class='nodata' id='nodata' style='display:none;'>Keine Daten</div>" +
    "</div>";

  function StrategicProductFit() {
    var instance = HTMLElement.call(this);
    return instance;
  }

  StrategicProductFit.prototype = Object.create(HTMLElement.prototype);
  StrategicProductFit.prototype.constructor = StrategicProductFit;

  StrategicProductFit.prototype.connectedCallback = function () {
    if (this._init) return;
    this._init = true;
    this._root = this.attachShadow({ mode: "open" });
    this._root.appendChild(tmpl.content.cloneNode(true));

    this._mainValue  = null;
    this._badgeValue = null;
    this._title      = "Strategic Product Fit";
    this._source     = "Internal Strategy Doc (PDF)";
    this._bgColor    = "#ffffff";
    this._fontSize   = 22;

    var self = this;
    this._root.getElementById("card").addEventListener("click", function () {
      self.dispatchEvent(new CustomEvent("onClick", { bubbles: true }));
    });

    this._render();
  };

  StrategicProductFit.prototype.onCustomWidgetBeforeUpdate = function (changed) {};

  StrategicProductFit.prototype._readBinding = function (binding) {
    if (!binding || binding.state === "loading") return;
    if (!binding.data || binding.data.length === 0) { this._showNoData(true); return; }
    var row  = binding.data[0];
    var keys = Object.keys(row);
    var dims = [];

    for (var i = 0; i < keys.length; i++) {
      if (keys[i] === "@MeasureDimension") continue;
      var d = row[keys[i]];
      if (d && (d.description !== undefined || d.id !== undefined)) {
        dims.push(d.description || d.id || "");
      }
    }

    if (dims.length >= 1) { this._mainValue  = dims[0]; }
    if (dims.length >= 2) { this._badgeValue = dims[1]; }
    this._showNoData(false);
  };

  StrategicProductFit.prototype.onCustomWidgetAfterUpdate = function (changed) {
    if (!this._root) return;
    if ("title"         in changed) { this._title   = changed.title; }
    if ("sourceLabel"   in changed) { this._source  = changed.sourceLabel; }
    if ("bgColor"       in changed) { this._bgColor = changed.bgColor; }
    if ("fontSize"      in changed) { this._fontSize = changed.fontSize; }
    if ("myDataBinding" in changed) { this._readBinding(changed.myDataBinding); }
    this._render();
  };

  StrategicProductFit.prototype._getBadgeStyle = function (val) {
    if (!val) return { bg: "#E2E8F0", color: "#4A5568" };
    var v = val.toString().toLowerCase();
    if (v.indexOf("not") !== -1)     return { bg: "#FDECEA", color: "#D93025" };
    if (v.indexOf("partial") !== -1) return { bg: "#FEF3CD", color: "#C77700" };
    if (v.indexOf("match") !== -1)   return { bg: "#DFF5EA", color: "#1E8E3E" };
    return { bg: "#E2E8F0", color: "#4A5568" };
  };

  StrategicProductFit.prototype._render = function () {
    if (!this._root) return;

    this._root.getElementById("title").textContent          = this._title;
    this._root.getElementById("source").textContent         = this._source;
    this._root.getElementById("card").style.backgroundColor = this._bgColor;

    var mv = this._root.getElementById("main-value");
    mv.textContent    = this._mainValue || "–";
    mv.style.fontSize = this._fontSize + "px";
    mv.style.opacity  = this._mainValue ? "1" : "0.3";

    var badge = this._root.getElementById("badge");
    if (this._badgeValue) {
      var s = this._getBadgeStyle(this._badgeValue);
      badge.textContent      = this._badgeValue;
      badge.style.display    = "inline-block";
      badge.style.background = s.bg;
      badge.style.color      = s.color;
    } else {
      badge.style.display = "none";
    }
  };

  StrategicProductFit.prototype._showNoData = function (show) {
    if (!this._root) return;
    this._root.getElementById("nodata").style.display     = show ? "block" : "none";
    this._root.getElementById("main-value").style.opacity = show ? "0.3" : "1";
  };

  customElements.define("com-custom-strategicproductfit", StrategicProductFit);
})();