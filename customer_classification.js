(function () {

  var tmpl = document.createElement("template");
  tmpl.innerHTML =
    "<style>" +
    ":host{display:block;width:100%;height:100%;box-sizing:border-box;}" +
    ".card{background:#ffffff;border:1px solid #e5e5e5;border-radius:12px;padding:16px;" +
    "width:100%;height:100%;box-sizing:border-box;cursor:pointer;" +
    "display:flex;flex-direction:column;gap:8px;position:relative;}" +
    ".card:hover{box-shadow:0 2px 8px rgba(0,0,0,0.08);}" +
    ".header{display:flex;align-items:center;gap:6px;}" +
    ".title{font-size:11px;font-weight:600;color:#6a6d70;letter-spacing:0.04em;text-transform:uppercase;}" +
    ".body{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;}" +
    ".main-value{font-weight:700;color:#1a1a1a;line-height:1.2;}" +
    ".source{font-size:11px;color:#9a9a9a;margin-top:2px;}" +
    ".badge{border-radius:20px;padding:4px 14px;font-size:12px;font-weight:700;white-space:nowrap;align-self:center;}" +
    ".edit-icon{position:absolute;bottom:12px;right:12px;opacity:0.3;}" +
    ".nodata{font-size:11px;color:#b0b0b0;font-style:italic;}" +
    "</style>" +
    "<div class='card' id='card'>" +
    "<div class='header'>" +
    "<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>" +
    "<path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' stroke='#6a6d70' stroke-width='1.5' stroke-linecap='round'/>" +
    "<circle cx='9' cy='7' r='4' stroke='#6a6d70' stroke-width='1.5'/>" +
    "<path d='M23 21v-2a4 4 0 0 0-3-3.87' stroke='#6a6d70' stroke-width='1.5' stroke-linecap='round'/>" +
    "<path d='M16 3.13a4 4 0 0 1 0 7.75' stroke='#6a6d70' stroke-width='1.5' stroke-linecap='round'/>" +
    "</svg>" +
    "<span class='title' id='title'>Customer Classification</span>" +
    "</div>" +
    "<div class='body'>" +
    "<div>" +
    "<div class='main-value' id='main-value'>–</div>" +
    "<div class='source' id='source'>SAP Sales Cloud</div>" +
    "</div>" +
    "<span class='badge' id='badge' style='display:none;'></span>" +
    "</div>" +
    "<div class='nodata' id='nodata' style='display:none;'>Keine Daten</div>" +
    "<svg class='edit-icon' width='14' height='14' viewBox='0 0 24 24' fill='none'>" +
    "<path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' stroke='#6a6d70' stroke-width='1.5' stroke-linecap='round'/>" +
    "<path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' stroke='#6a6d70' stroke-width='1.5' stroke-linecap='round'/>" +
    "</svg>" +
    "</div>";

  function CustomerClassification() {
    var instance = HTMLElement.call(this);
    return instance;
  }

  CustomerClassification.prototype = Object.create(HTMLElement.prototype);
  CustomerClassification.prototype.constructor = CustomerClassification;

  CustomerClassification.prototype.connectedCallback = function () {
    if (this._init) return;
    this._init = true;
    this._root = this.attachShadow({ mode: "open" });
    this._root.appendChild(tmpl.content.cloneNode(true));

    this._mainValue  = null;
    this._badgeValue = null;
    this._title      = "Customer Classification";
    this._source     = "SAP Sales Cloud";
    this._bgColor    = "#ffffff";
    this._fontSize   = 28;

    var self = this;
    this._root.getElementById("card").addEventListener("click", function () {
      self.dispatchEvent(new CustomEvent("onClick", { bubbles: true }));
    });

    this._render();
  };

  CustomerClassification.prototype.onCustomWidgetBeforeUpdate = function (changed) {};

  CustomerClassification.prototype._readDimension = function (binding) {
    if (!binding || binding.state === "loading") return null;
    if (!binding.data || binding.data.length === 0) return null;
    var row  = binding.data[0];
    var keys = Object.keys(row);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] === "@MeasureDimension") continue;
      var d = row[keys[i]];
      if (d && (d.description !== undefined || d.id !== undefined)) {
        return d.description || d.id || null;
      }
    }
    return null;
  };

  CustomerClassification.prototype.onCustomWidgetAfterUpdate = function (changed) {
    if (!this._root) return;
    if ("title"                in changed) { this._title   = changed.title; }
    if ("sourceLabel"          in changed) { this._source  = changed.sourceLabel; }
    if ("bgColor"              in changed) { this._bgColor = changed.bgColor; }
    if ("fontSize"             in changed) { this._fontSize = changed.fontSize; }
    if ("classificationBinding" in changed) {
      var v = this._readDimension(changed.classificationBinding);
      if (v !== null) this._mainValue = v;
    }
    if ("tierBinding" in changed) {
      var t = this._readDimension(changed.tierBinding);
      if (t !== null) this._badgeValue = t;
    }
    this._render();
  };

  CustomerClassification.prototype._getBadgeStyle = function (val) {
    if (!val) return { bg: "#E2E8F0", color: "#4A5568" };
    var v = val.toString().toLowerCase();
    if (v === "gold")   return { bg: "#FEF3CD", color: "#C77700" };
    if (v === "silver") return { bg: "#E8EAED", color: "#5F6B7A" };
    if (v === "bronze") return { bg: "#F5E6DA", color: "#8B4513" };
    return { bg: "#E6F1FB", color: "#185FA5" };
  };

  CustomerClassification.prototype._render = function () {
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

  CustomerClassification.prototype._showNoData = function (show) {
    if (!this._root) return;
    this._root.getElementById("nodata").style.display     = show ? "block" : "none";
    this._root.getElementById("main-value").style.opacity = show ? "0.3" : "1";
  };

  customElements.define("com-custom-customerclassification", CustomerClassification);
})();
