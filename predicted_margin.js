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
    ".body{display:flex;align-items:center;justify-content:flex-start;gap:12px;}" +
    ".main-value{font-weight:700;color:#1a1a1a;line-height:1;}" +
    ".footer{display:flex;align-items:center;justify-content:space-between;margin-top:auto;}" +
    ".source{font-size:11px;color:#9a9a9a;}" +
    ".badge{border-radius:20px;padding:4px 14px;font-size:12px;font-weight:600;white-space:nowrap;}" +
    ".nodata{font-size:11px;color:#b0b0b0;font-style:italic;}" +
    "</style>" +
    "<div class='card' id='card'>" +
    "<div class='header'>" +
    "<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>" +
    "<polyline points='22 12 18 12 15 21 9 3 6 12 2 12' stroke='#6a6d70' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/>" +
    "</svg>" +
    "<span class='title' id='title'>Predicted Margin</span>" +
    "</div>" +
    "<div class='body'>" +
    "<div class='main-value' id='main-value'>–</div>" +
    "</div>" +
    "<div class='footer'>" +
    "<div class='source' id='source'>S/4HANA &amp; Margin Tool</div>" +
    "<span class='badge' id='badge' style='display:none;'></span>" +
    "</div>" +
    "<div class='nodata' id='nodata' style='display:none;'>Keine Daten</div>" +
    "</div>";

  function PredictedMargin() {
    var instance = HTMLElement.call(this);
    return instance;
  }

  PredictedMargin.prototype = Object.create(HTMLElement.prototype);
  PredictedMargin.prototype.constructor = PredictedMargin;

  PredictedMargin.prototype.connectedCallback = function () {
    if (this._init) return;
    this._init = true;
    this._root = this.attachShadow({ mode: "open" });
    this._root.appendChild(tmpl.content.cloneNode(true));

    this._value     = null;
    this._title     = "Predicted Margin";
    this._source    = "S/4HANA & Margin Tool";
    this._threshold = 20;
    this._bgColor   = "#ffffff";
    this._fontSize  = 36;

    var self = this;
    this._root.getElementById("card").addEventListener("click", function () {
      self.dispatchEvent(new CustomEvent("onClick", { bubbles: true }));
    });

    this._render();
  };

  PredictedMargin.prototype.onCustomWidgetBeforeUpdate = function (changed) {};

  PredictedMargin.prototype._readBinding = function (binding) {
    if (!binding || binding.state === "loading") return;
    if (!binding.data || binding.data.length === 0) { this._showNoData(true); return; }
    var row  = binding.data[0];
    var cell = row["@MeasureDimension"];
    var raw  = cell && cell.rawValue !== undefined ? cell.rawValue : null;
    if (raw === null) {
      var keys = Object.keys(row);
      for (var i = 0; i < keys.length; i++) {
        var c = row[keys[i]];
        var r = c && c.rawValue !== undefined ? c.rawValue : (c && c.raw !== undefined ? c.raw : c);
        var n = parseFloat(r);
        if (!isNaN(n)) { raw = r; break; }
      }
    }
    var val = parseFloat(raw);
    if (isNaN(val)) { this._showNoData(true); return; }
    if (val > 0 && val <= 1) val = val * 100;
    this._value = Math.round(val * 10) / 10;
    this._showNoData(false);
  };

  PredictedMargin.prototype.onCustomWidgetAfterUpdate = function (changed) {
    if (!this._root) return;
    if ("title"         in changed) { this._title     = changed.title; }
    if ("sourceLabel"   in changed) { this._source    = changed.sourceLabel; }
    if ("threshold"     in changed) { this._threshold = parseFloat(changed.threshold) || 20; }
    if ("bgColor"       in changed) { this._bgColor   = changed.bgColor; }
    if ("fontSize"      in changed) { this._fontSize  = changed.fontSize; }
    if ("myDataBinding" in changed) { this._readBinding(changed.myDataBinding); }
    this._render();
  };

  PredictedMargin.prototype._render = function () {
    if (!this._root) return;

    this._root.getElementById("title").textContent          = this._title;
    this._root.getElementById("source").textContent         = this._source;
    this._root.getElementById("card").style.backgroundColor = this._bgColor;

    var mv = this._root.getElementById("main-value");
    mv.style.fontSize = this._fontSize + "px";

    var badge = this._root.getElementById("badge");

    if (this._value !== null) {
      mv.textContent  = this._value.toFixed(1) + "%";
      mv.style.opacity = "1";

      var above = this._value >= this._threshold;
      badge.textContent      = above ? "Above Threshold" : "Below Threshold";
      badge.style.display    = "inline-block";
      badge.style.background = above ? "#DFF5EA" : "#FDECEA";
      badge.style.color      = above ? "#1E8E3E" : "#D93025";
    } else {
      mv.textContent   = "–";
      mv.style.opacity = "0.3";
      badge.style.display = "none";
    }
  };

  PredictedMargin.prototype._showNoData = function (show) {
    if (!this._root) return;
    this._root.getElementById("nodata").style.display     = show ? "block" : "none";
    this._root.getElementById("main-value").style.opacity = show ? "0.3" : "1";
  };

  customElements.define("com-custom-predictedmargin", PredictedMargin);
})();