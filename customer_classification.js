(function () {

  var tmpl = document.createElement("template");
  tmpl.innerHTML =
    "<style>" +
    ":host{display:block;width:100%;height:100%;box-sizing:border-box;}" +
    ".card{background:#ffffff;border:1px solid #e5e5e5;border-radius:12px;padding:16px;" +
    "width:100%;height:100%;box-sizing:border-box;cursor:pointer;" +
    "display:flex;flex-direction:column;gap:8px;position:relative;}" +
    ".header{display:flex;align-items:center;gap:6px;}" +
    ".title{font-size:11px;font-weight:600;color:#6a6d70;letter-spacing:0.04em;text-transform:uppercase;}" +
    ".body{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;}" +
    ".main-value{font-weight:700;color:#1a1a1a;line-height:1.2;}" +
    ".source{font-size:11px;color:#9a9a9a;margin-top:2px;}" +
    ".badge{border-radius:20px;padding:4px 14px;font-size:12px;font-weight:700;white-space:nowrap;align-self:center;}" +
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
    "<div class='main-value' id='main-value'>-</div>" +
    "<div class='source' id='source'>SAP Sales Cloud</div>" +
    "</div>" +
    "<span class='badge' id='badge' style='display:none;'></span>" +
    "</div>" +
    "<div class='nodata' id='nodata' style='display:none;'>Keine Daten</div>" +
    "</div>";

  function CustomerClassification() {
    var instance = HTMLElement.call(this);
    return instance;
  }

  CustomerClassification.prototype = Object.create(HTMLElement.prototype);
  CustomerClassification.prototype.constructor = CustomerClassification;


  CustomerClassification.prototype._initDefaults = function () {
    if (this._initialized) return;
    this._initialized      = true;
    this._mainValue        = null;
    this._badgeValue       = null;
    this._title            = "Customer Classification";
    this._source           = "SAP Sales Cloud";
    this._bgColor          = "#ffffff";
    this._fontSize         = 28;
    this._borderColor      = "#e5e5e5";
    this._showBorder       = true;
    this._borderRadius     = 12;
    this._titleColor       = "#6a6d70";
    this._valueColor       = "#1a1a1a";
    this._sourceColor      = "#9a9a9a";
    this._showSource       = true;
    this._noDataText       = "Keine Daten";
    this._goldBg           = "#FEF3CD";
    this._goldColor        = "#C77700";
    this._silverBg         = "#E8EAED";
    this._silverColor      = "#5F6B7A";
    this._bronzeBg         = "#F5E6DA";
    this._bronzeColor      = "#8B4513";
    this._defaultBadgeBg   = "#E6F1FB";
    this._defaultBadgeColor = "#185FA5";
  };

  CustomerClassification.prototype.connectedCallback = function () {
    if (this._init) return;
    this._init = true;
    this._initDefaults();
    this._root = this.attachShadow({ mode: "open" });
    this._root.appendChild(tmpl.content.cloneNode(true));

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
    this._initDefaults();

    if ("title"              in changed) this._title             = changed.title;
    if ("sourceLabel"        in changed) this._source            = changed.sourceLabel;
    if ("bgColor"            in changed) this._bgColor           = changed.bgColor;
    if ("fontSize"           in changed) this._fontSize          = changed.fontSize;
    if ("borderColor"        in changed) this._borderColor       = changed.borderColor;
    if ("showBorder"         in changed) this._showBorder        = changed.showBorder === "true";
    if ("borderRadius"       in changed) this._borderRadius      = changed.borderRadius;
    if ("titleColor"         in changed) this._titleColor        = changed.titleColor;
    if ("valueColor"         in changed) this._valueColor        = changed.valueColor;
    if ("sourceColor"        in changed) this._sourceColor       = changed.sourceColor;
    if ("showSource"         in changed) this._showSource        = changed.showSource === "true";
    if ("noDataText"         in changed) this._noDataText        = changed.noDataText;
    if ("goldBg"             in changed) this._goldBg            = changed.goldBg;
    if ("goldColor"          in changed) this._goldColor         = changed.goldColor;
    if ("silverBg"           in changed) this._silverBg          = changed.silverBg;
    if ("silverColor"        in changed) this._silverColor       = changed.silverColor;
    if ("bronzeBg"           in changed) this._bronzeBg          = changed.bronzeBg;
    if ("bronzeColor"        in changed) this._bronzeColor       = changed.bronzeColor;
    if ("defaultBadgeBg"     in changed) this._defaultBadgeBg    = changed.defaultBadgeBg;
    if ("defaultBadgeColor"  in changed) this._defaultBadgeColor = changed.defaultBadgeColor;

    if ("myDataBinding" in changed) {
      var bd = changed.myDataBinding;
      if (bd && bd.state === "success" && bd.data && bd.data.length > 0) {
        var row  = bd.data[0];
        var keys = Object.keys(row);
        var classVal = null;
        var tierVal  = null;
        for (var i = 0; i < keys.length; i++) {
          if (keys[i] === "@MeasureDimension") continue;
          var cell = row[keys[i]];
          if (!cell) continue;
          var label = cell.description || cell.id || null;
          if (!label) continue;
          var lowerLabel = label.toString().toLowerCase();
          if (lowerLabel === "gold" || lowerLabel === "silver" || lowerLabel === "bronze") {
            tierVal = label;
          } else {
            classVal = label;
          }
        }
        if (classVal !== null) this._mainValue  = classVal;
        if (tierVal  !== null) this._badgeValue = tierVal;
      }
    }

    this._render();
  };

  CustomerClassification.prototype._getBadgeStyle = function (val) {
    if (!val) return { bg: this._defaultBadgeBg, color: this._defaultBadgeColor };
    var v = val.toString().toLowerCase();
    if (v === "gold")   return { bg: this._goldBg,   color: this._goldColor };
    if (v === "silver") return { bg: this._silverBg, color: this._silverColor };
    if (v === "bronze") return { bg: this._bronzeBg, color: this._bronzeColor };
    return { bg: this._defaultBadgeBg, color: this._defaultBadgeColor };
  };

  CustomerClassification.prototype._render = function () {
    if (!this._root) return;

    var card  = this._root.getElementById("card");
    var title = this._root.getElementById("title");
    var mv    = this._root.getElementById("main-value");
    var src   = this._root.getElementById("source");
    var badge = this._root.getElementById("badge");
    var nodata = this._root.getElementById("nodata");

    // Card
    card.style.backgroundColor = this._bgColor;
    card.style.borderRadius    = this._borderRadius + "px";
    card.style.border = this._showBorder
      ? "1px solid " + this._borderColor
      : "none";

    // Title
    title.textContent  = this._title;
    title.style.color  = this._titleColor;

    // Main value
    mv.textContent    = this._mainValue || "-";
    mv.style.fontSize = this._fontSize + "px";
    mv.style.color    = this._valueColor;
    mv.style.opacity  = this._mainValue ? "1" : "0.3";

    // Source
    src.textContent   = this._source;
    src.style.color   = this._sourceColor;
    src.style.display = this._showSource ? "block" : "none";

    // Badge
    if (this._badgeValue) {
      var s = this._getBadgeStyle(this._badgeValue);
      badge.textContent      = this._badgeValue;
      badge.style.display    = "inline-block";
      badge.style.background = s.bg;
      badge.style.color      = s.color;
    } else {
      badge.style.display = "none";
    }

    // No data
    nodata.textContent = this._noDataText;
    nodata.style.display = (!this._mainValue && !this._badgeValue) ? "block" : "none";
  };

  if (!customElements.get("com-custom-customerclassification")) {
    customElements.define("com-custom-customerclassification", CustomerClassification);
  }

})();
