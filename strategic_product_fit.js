(function () {

  var tmpl = document.createElement("template");
  tmpl.innerHTML =
    "<style>" +
    ":host{display:block;width:100%;height:100%;box-sizing:border-box;}" +
    ".card{background:#ffffff;border:1px solid #e5e5e5;border-radius:12px;padding:16px;" +
    "width:100%;height:100%;box-sizing:border-box;cursor:pointer;" +
    "display:flex;flex-direction:column;gap:8px;}" +
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
    "<div class='main-value' id='main-value'>-</div>" +
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

    this._mainValue        = null;
    this._badgeValue       = null;
    this._title            = "Strategic Product Fit";
    this._source           = "Internal Strategy Doc (PDF)";
    this._bgColor          = "#ffffff";
    this._fontSize         = 22;
    this._borderColor      = "#e5e5e5";
    this._showBorder       = true;
    this._borderRadius     = 12;
    this._titleColor       = "#6a6d70";
    this._valueColor       = "#1a1a1a";
    this._sourceColor      = "#9a9a9a";
    this._showSource       = true;
    this._noDataText       = "Keine Daten";
    this._notMatchBg       = "#FDECEA";
    this._notMatchColor    = "#D93025";
    this._partialMatchBg   = "#FEF3CD";
    this._partialMatchColor = "#C77700";
    this._matchBg          = "#DFF5EA";
    this._matchColor       = "#1E8E3E";
    this._defaultBadgeBg   = "#E2E8F0";
    this._defaultBadgeColor = "#4A5568";

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
    if ("title"            in changed) this._title             = changed.title;
    if ("sourceLabel"      in changed) this._source            = changed.sourceLabel;
    if ("bgColor"          in changed) this._bgColor           = changed.bgColor;
    if ("fontSize"         in changed) this._fontSize          = changed.fontSize;
    if ("borderColor"      in changed) this._borderColor       = changed.borderColor;
    if ("showBorder"       in changed) this._showBorder        = changed.showBorder === "true";
    if ("borderRadius"     in changed) this._borderRadius      = changed.borderRadius;
    if ("titleColor"       in changed) this._titleColor        = changed.titleColor;
    if ("valueColor"       in changed) this._valueColor        = changed.valueColor;
    if ("sourceColor"      in changed) this._sourceColor       = changed.sourceColor;
    if ("showSource"       in changed) this._showSource        = changed.showSource === "true";
    if ("noDataText"       in changed) this._noDataText        = changed.noDataText;
    if ("notMatchBg"       in changed) this._notMatchBg        = changed.notMatchBg;
    if ("notMatchColor"    in changed) this._notMatchColor     = changed.notMatchColor;
    if ("partialMatchBg"   in changed) this._partialMatchBg    = changed.partialMatchBg;
    if ("partialMatchColor" in changed) this._partialMatchColor = changed.partialMatchColor;
    if ("matchBg"          in changed) this._matchBg           = changed.matchBg;
    if ("matchColor"       in changed) this._matchColor        = changed.matchColor;
    if ("defaultBadgeBg"   in changed) this._defaultBadgeBg    = changed.defaultBadgeBg;
    if ("defaultBadgeColor" in changed) this._defaultBadgeColor = changed.defaultBadgeColor;
    if ("myDataBinding"    in changed) { this._readBinding(changed.myDataBinding); }
    this._render();
  };

  StrategicProductFit.prototype._getBadgeStyle = function (val) {
    if (!val) return { bg: this._defaultBadgeBg, color: this._defaultBadgeColor };
    var v = val.toString().toLowerCase();
    if (v.indexOf("not") !== -1)     return { bg: this._notMatchBg,     color: this._notMatchColor };
    if (v.indexOf("partial") !== -1) return { bg: this._partialMatchBg, color: this._partialMatchColor };
    if (v.indexOf("match") !== -1)   return { bg: this._matchBg,        color: this._matchColor };
    return { bg: this._defaultBadgeBg, color: this._defaultBadgeColor };
  };

  StrategicProductFit.prototype._render = function () {
    if (!this._root) return;

    var card   = this._root.getElementById("card");
    var title  = this._root.getElementById("title");
    var mv     = this._root.getElementById("main-value");
    var src    = this._root.getElementById("source");
    var badge  = this._root.getElementById("badge");
    var nodata = this._root.getElementById("nodata");

    card.style.backgroundColor = this._bgColor;
    card.style.borderRadius    = this._borderRadius + "px";
    card.style.border = this._showBorder
      ? "1px solid " + this._borderColor
      : "none";

    title.textContent = this._title;
    title.style.color = this._titleColor;

    mv.textContent    = this._mainValue || "-";
    mv.style.fontSize = this._fontSize + "px";
    mv.style.color    = this._valueColor;
    mv.style.opacity  = this._mainValue ? "1" : "0.3";

    src.textContent   = this._source;
    src.style.color   = this._sourceColor;
    src.style.display = this._showSource ? "block" : "none";

    nodata.textContent = this._noDataText;

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

  if (!customElements.get("com-custom-strategicproductfit")) {
    customElements.define("com-custom-strategicproductfit", StrategicProductFit);
  }

})();
