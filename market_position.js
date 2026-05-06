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
    ".body{display:flex;align-items:center;justify-content:space-between;gap:12px;}" +
    ".left{display:flex;align-items:flex-start;gap:8px;}" +
    ".accent{width:3px;background:#185FA5;border-radius:2px;align-self:stretch;flex-shrink:0;}" +
    ".main-value{font-weight:700;color:#1a1a1a;line-height:1.3;}" +
    ".icons{display:flex;align-items:center;gap:6px;flex-shrink:0;}" +
    ".footer{display:flex;align-items:center;justify-content:space-between;}" +
    ".source{font-size:11px;color:#9a9a9a;}" +
    ".nodata{font-size:11px;color:#b0b0b0;font-style:italic;}" +
    "</style>" +
    "<div class='card' id='card'>" +
    "<div class='header'>" +
    "<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>" +
    "<path d='M18 20V10M12 20V4M6 20v-6' stroke='#6a6d70' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/>" +
    "</svg>" +
    "<span class='title' id='title'>Market Position (Current/Future)</span>" +
    "</div>" +
    "<div class='body'>" +
    "<div class='left'>" +
    "<div class='accent' id='accent'></div>" +
    "<div class='main-value' id='main-value'>-</div>" +
    "</div>" +
    "<div class='icons' id='icons'>" +
    "<svg width='28' height='28' viewBox='0 0 24 24' fill='none'>" +
    "<path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' stroke='#185FA5' stroke-width='1.5' stroke-linejoin='round' id='icon1'/>" +
    "</svg>" +
    "<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>" +
    "<path d='M8 3l4-2 4 2M4 8l4-2 4 2 4-2 4 2M4 13l4-2 4 2 4-2 4 2M4 18l4-2 4 2 4-2 4 2' stroke='#185FA5' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' id='icon2'/>" +
    "</svg>" +
    "<svg width='20' height='20' viewBox='0 0 24 24' fill='none'>" +
    "<polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' stroke='#185FA5' stroke-width='1.5' stroke-linejoin='round' id='icon3'/>" +
    "</svg>" +
    "</div>" +
    "</div>" +
    "<div class='footer'>" +
    "<div class='source' id='source'>External Intelligence</div>" +
    "</div>" +
    "<div class='nodata' id='nodata' style='display:none;'>Keine Daten</div>" +
    "</div>";

  function MarketPosition() {
    var instance = HTMLElement.call(this);
    return instance;
  }

  MarketPosition.prototype = Object.create(HTMLElement.prototype);
  MarketPosition.prototype.constructor = MarketPosition;

  MarketPosition.prototype.connectedCallback = function () {
    if (this._init) return;
    this._init = true;
    this._root = this.attachShadow({ mode: "open" });
    this._root.appendChild(tmpl.content.cloneNode(true));

    this._value        = null;
    this._title        = "Market Position (Current/Future)";
    this._source       = "External Intelligence";
    this._bgColor      = "#ffffff";
    this._fontSize     = 20;
    this._borderColor  = "#e5e5e5";
    this._showBorder   = true;
    this._borderRadius = 12;
    this._titleColor   = "#6a6d70";
    this._valueColor   = "#1a1a1a";
    this._sourceColor  = "#9a9a9a";
    this._showSource   = true;
    this._accentColor  = "#185FA5";
    this._noDataText   = "Keine Daten";

    var self = this;
    this._root.getElementById("card").addEventListener("click", function () {
      self.dispatchEvent(new CustomEvent("onClick", { bubbles: true }));
    });

    this._render();
  };

  MarketPosition.prototype.onCustomWidgetBeforeUpdate = function (changed) {};

  MarketPosition.prototype._readBinding = function (binding) {
    if (!binding || binding.state === "loading") return;
    if (!binding.data || binding.data.length === 0) { this._showNoData(true); return; }
    var row  = binding.data[0];
    var keys = Object.keys(row);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] === "@MeasureDimension") continue;
      var d = row[keys[i]];
      if (d && (d.description !== undefined || d.id !== undefined)) {
        this._value = d.description || d.id || null;
        this._showNoData(false);
        return;
      }
    }
    this._showNoData(true);
  };

  MarketPosition.prototype.onCustomWidgetAfterUpdate = function (changed) {
    if (!this._root) return;
    if ("title"        in changed) this._title        = changed.title;
    if ("sourceLabel"  in changed) this._source       = changed.sourceLabel;
    if ("bgColor"      in changed) this._bgColor      = changed.bgColor;
    if ("fontSize"     in changed) this._fontSize     = changed.fontSize;
    if ("borderColor"  in changed) this._borderColor  = changed.borderColor;
    if ("showBorder"   in changed) this._showBorder   = changed.showBorder === "true";
    if ("borderRadius" in changed) this._borderRadius = changed.borderRadius;
    if ("titleColor"   in changed) this._titleColor   = changed.titleColor;
    if ("valueColor"   in changed) this._valueColor   = changed.valueColor;
    if ("sourceColor"  in changed) this._sourceColor  = changed.sourceColor;
    if ("showSource"   in changed) this._showSource   = changed.showSource === "true";
    if ("accentColor"  in changed) this._accentColor  = changed.accentColor;
    if ("noDataText"   in changed) this._noDataText   = changed.noDataText;
    if ("myDataBinding" in changed) { this._readBinding(changed.myDataBinding); }
    this._render();
  };

  MarketPosition.prototype._render = function () {
    if (!this._root) return;

    var card   = this._root.getElementById("card");
    var title  = this._root.getElementById("title");
    var mv     = this._root.getElementById("main-value");
    var src    = this._root.getElementById("source");
    var accent = this._root.getElementById("accent");
    var nodata = this._root.getElementById("nodata");

    card.style.backgroundColor = this._bgColor;
    card.style.borderRadius    = this._borderRadius + "px";
    card.style.border = this._showBorder
      ? "1px solid " + this._borderColor
      : "none";

    title.textContent = this._title;
    title.style.color = this._titleColor;

    mv.textContent    = this._value || "-";
    mv.style.fontSize = this._fontSize + "px";
    mv.style.color    = this._valueColor;
    mv.style.opacity  = this._value ? "1" : "0.3";

    src.textContent   = this._source;
    src.style.color   = this._sourceColor;
    src.style.display = this._showSource ? "block" : "none";

    accent.style.background = this._accentColor;

    var iconPaths = ["icon1", "icon2", "icon3"];
    for (var i = 0; i < iconPaths.length; i++) {
      var el = this._root.getElementById(iconPaths[i]);
      if (el) el.setAttribute("stroke", this._accentColor);
    }

    nodata.textContent = this._noDataText;
  };

  MarketPosition.prototype._showNoData = function (show) {
    if (!this._root) return;
    this._root.getElementById("nodata").style.display     = show ? "block" : "none";
    this._root.getElementById("main-value").style.opacity = show ? "0.3" : "1";
  };

  if (!customElements.get("com-custom-marketposition")) {
    customElements.define("com-custom-marketposition", MarketPosition);
  }

})();
