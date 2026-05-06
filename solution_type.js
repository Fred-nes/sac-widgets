(function () {

  var tmpl = document.createElement("template");
  tmpl.innerHTML =
    "<style>" +
    ":host{display:block;width:100%;height:100%;box-sizing:border-box;}" +
    ".card{background:#ffffff;border:1px solid #e5e5e5;border-radius:12px;padding:16px;" +
    "width:100%;height:100%;box-sizing:border-box;cursor:pointer;" +
    "display:flex;flex-direction:column;gap:6px;}" +
    ".header{display:flex;align-items:center;gap:6px;}" +
    ".title{font-size:11px;font-weight:600;color:#6a6d70;letter-spacing:0.04em;text-transform:uppercase;}" +
    ".main-value{font-weight:700;color:#1a1a1a;line-height:1.2;}" +
    ".sub-value{font-size:13px;color:#4a4a4a;font-weight:400;}" +
    ".source{font-size:11px;color:#9a9a9a;margin-top:auto;}" +
    ".badge{border-radius:20px;padding:4px 14px;font-size:12px;font-weight:600;white-space:nowrap;display:inline-block;margin-top:4px;}" +
    ".nodata{font-size:11px;color:#b0b0b0;font-style:italic;}" +
    "</style>" +
    "<div class='card' id='card'>" +
    "<div class='header'>" +
    "<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>" +
    "<path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' stroke='#6a6d70' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/>" +
    "</svg>" +
    "<span class='title' id='title'>Solution Type</span>" +
    "</div>" +
    "<div class='main-value' id='main-value'>-</div>" +
    "<div class='sub-value' id='sub-value'></div>" +
    "<div><span class='badge' id='badge' style='display:none;'></span></div>" +
    "<div class='source' id='source' style='display:none;'></div>" +
    "<div class='nodata' id='nodata' style='display:none;'>Keine Daten</div>" +
    "</div>";

  function SolutionType() {
    var instance = HTMLElement.call(this);
    return instance;
  }

  SolutionType.prototype = Object.create(HTMLElement.prototype);
  SolutionType.prototype.constructor = SolutionType;

  SolutionType.prototype.connectedCallback = function () {
    if (this._init) return;
    this._init = true;
    this._root = this.attachShadow({ mode: "open" });
    this._root.appendChild(tmpl.content.cloneNode(true));

    this._mainValue         = null;
    this._subValue          = null;
    this._title             = "Solution Type";
    this._bgColor           = "#ffffff";
    this._fontSize          = 22;
    this._borderColor       = "#e5e5e5";
    this._showBorder        = true;
    this._borderRadius      = 12;
    this._titleColor        = "#6a6d70";
    this._valueColor        = "#1a1a1a";
    this._subValueColor     = "#4a4a4a";
    this._sourceLabel       = "";
    this._sourceColor       = "#9a9a9a";
    this._showSource        = false;
    this._noDataText        = "Keine Daten";
    this._highBg            = "#FDECEA";
    this._highColor         = "#D93025";
    this._lowBg             = "#DFF5EA";
    this._lowColor          = "#1E8E3E";
    this._defaultBadgeBg    = "#E6F1FB";
    this._defaultBadgeColor = "#185FA5";

    var self = this;
    this._root.getElementById("card").addEventListener("click", function () {
      self.dispatchEvent(new CustomEvent("onClick", { bubbles: true }));
    });

    this._render();
  };

  SolutionType.prototype.onCustomWidgetBeforeUpdate = function (changed) {};

  SolutionType.prototype._readBinding = function (binding) {
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
    if (dims.length >= 1) { this._mainValue = dims[0]; }
    if (dims.length >= 2) { this._subValue  = dims[1]; }
    this._showNoData(false);
  };

  SolutionType.prototype.onCustomWidgetAfterUpdate = function (changed) {
    if (!this._root) return;
    if ("title"            in changed) this._title             = changed.title;
    if ("bgColor"          in changed) this._bgColor           = changed.bgColor;
    if ("fontSize"         in changed) this._fontSize          = changed.fontSize;
    if ("borderColor"      in changed) this._borderColor       = changed.borderColor;
    if ("showBorder"       in changed) this._showBorder        = changed.showBorder === "true";
    if ("borderRadius"     in changed) this._borderRadius      = changed.borderRadius;
    if ("titleColor"       in changed) this._titleColor        = changed.titleColor;
    if ("valueColor"       in changed) this._valueColor        = changed.valueColor;
    if ("subValueColor"    in changed) this._subValueColor     = changed.subValueColor;
    if ("sourceLabel"      in changed) this._sourceLabel       = changed.sourceLabel;
    if ("sourceColor"      in changed) this._sourceColor       = changed.sourceColor;
    if ("showSource"       in changed) this._showSource        = changed.showSource === "true";
    if ("noDataText"       in changed) this._noDataText        = changed.noDataText;
    if ("highBg"           in changed) this._highBg            = changed.highBg;
    if ("highColor"        in changed) this._highColor         = changed.highColor;
    if ("lowBg"            in changed) this._lowBg             = changed.lowBg;
    if ("lowColor"         in changed) this._lowColor          = changed.lowColor;
    if ("defaultBadgeBg"   in changed) this._defaultBadgeBg    = changed.defaultBadgeBg;
    if ("defaultBadgeColor" in changed) this._defaultBadgeColor = changed.defaultBadgeColor;
    if ("myDataBinding"    in changed) { this._readBinding(changed.myDataBinding); }
    this._render();
  };

  SolutionType.prototype._getBadgeStyle = function (val) {
    if (!val) return null;
    var v = val.toString().toLowerCase();
    if (v.indexOf("high") !== -1) return { bg: this._highBg,         color: this._highColor };
    if (v.indexOf("low")  !== -1) return { bg: this._lowBg,          color: this._lowColor };
    return { bg: this._defaultBadgeBg, color: this._defaultBadgeColor };
  };

  SolutionType.prototype._render = function () {
    if (!this._root) return;

    var card   = this._root.getElementById("card");
    var title  = this._root.getElementById("title");
    var mv     = this._root.getElementById("main-value");
    var sv     = this._root.getElementById("sub-value");
    var badge  = this._root.getElementById("badge");
    var src    = this._root.getElementById("source");
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

    sv.textContent = this._subValue || "";
    sv.style.color = this._subValueColor;

    src.textContent   = this._sourceLabel;
    src.style.color   = this._sourceColor;
    src.style.display = (this._showSource && this._sourceLabel) ? "block" : "none";

    nodata.textContent = this._noDataText;

    if (this._subValue) {
      var s = this._getBadgeStyle(this._subValue);
      if (s) {
        badge.textContent      = this._subValue;
        badge.style.display    = "inline-block";
        badge.style.background = s.bg;
        badge.style.color      = s.color;
      } else {
        badge.style.display = "none";
      }
    } else {
      badge.style.display = "none";
    }
  };

  SolutionType.prototype._showNoData = function (show) {
    if (!this._root) return;
    this._root.getElementById("nodata").style.display     = show ? "block" : "none";
    this._root.getElementById("main-value").style.opacity = show ? "0.3" : "1";
  };

  if (!customElements.get("com-custom-solutiontype")) {
    customElements.define("com-custom-solutiontype", SolutionType);
  }

})();
