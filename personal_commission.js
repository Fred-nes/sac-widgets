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
    ".title{font-size:11px;font-weight:600;color:#6a6d70;letter-spacing:0.04em;text-transform:uppercase;line-height:1.4;}" +
    ".main-value{font-weight:700;color:#1a1a1a;line-height:1;margin-top:4px;}" +
    ".footer{display:flex;align-items:center;justify-content:space-between;margin-top:auto;}" +
    ".source{font-size:11px;color:#9a9a9a;}" +
    ".lock-icon{opacity:0.35;}" +
    ".nodata{font-size:11px;color:#b0b0b0;font-style:italic;}" +
    "</style>" +
    "<div class='card' id='card'>" +
    "<div class='header'>" +
    "<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>" +
    "<polyline points='22 12 18 12 15 21 9 3 6 12 2 12' stroke='#6a6d70' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/>" +
    "<polyline points='22 8 22 16' stroke='#6a6d70' stroke-width='1.5' stroke-linecap='round'/>" +
    "</svg>" +
    "<span class='title' id='title'>Personal Commission Forecast</span>" +
    "</div>" +
    "<div class='main-value' id='main-value'>–</div>" +
    "<div class='footer'>" +
    "<div class='source' id='source'>CRM (Restricted View)</div>" +
    "<svg class='lock-icon' width='16' height='16' viewBox='0 0 24 24' fill='none'>" +
    "<rect x='3' y='11' width='18' height='11' rx='2' ry='2' stroke='#6a6d70' stroke-width='1.5'/>" +
    "<path d='M7 11V7a5 5 0 0 1 10 0v4' stroke='#6a6d70' stroke-width='1.5' stroke-linecap='round'/>" +
    "</svg>" +
    "</div>" +
    "<div class='nodata' id='nodata' style='display:none;'>Keine Daten</div>" +
    "</div>";

  function PersonalCommission() {
    var instance = HTMLElement.call(this);
    return instance;
  }

  PersonalCommission.prototype = Object.create(HTMLElement.prototype);
  PersonalCommission.prototype.constructor = PersonalCommission;

  PersonalCommission.prototype.connectedCallback = function () {
    if (this._init) return;
    this._init = true;
    this._root = this.attachShadow({ mode: "open" });
    this._root.appendChild(tmpl.content.cloneNode(true));

    this._value          = null;
    this._title          = "Personal Commission Forecast";
    this._source         = "CRM (Restricted View)";
    this._bgColor        = "#ffffff";
    this._fontSize       = 36;
    this._currencySymbol = "\u20AC";

    var self = this;
    this._root.getElementById("card").addEventListener("click", function () {
      self.dispatchEvent(new CustomEvent("onClick", { bubbles: true }));
    });

    this._render();
  };

  PersonalCommission.prototype.onCustomWidgetBeforeUpdate = function (changed) {};

  PersonalCommission.prototype._readBinding = function (binding) {
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
    this._value = val;
    this._showNoData(false);
  };

  PersonalCommission.prototype.onCustomWidgetAfterUpdate = function (changed) {
    if (!this._root) return;
    if ("title"          in changed) { this._title          = changed.title; }
    if ("sourceLabel"    in changed) { this._source         = changed.sourceLabel; }
    if ("bgColor"        in changed) { this._bgColor        = changed.bgColor; }
    if ("fontSize"       in changed) { this._fontSize       = changed.fontSize; }
    if ("currencySymbol" in changed) { this._currencySymbol = changed.currencySymbol; }
    if ("myDataBinding"  in changed) { this._readBinding(changed.myDataBinding); }
    this._render();
  };

  PersonalCommission.prototype._formatCurrency = function (val) {
    var rounded = Math.round(val);
    var str = rounded.toString();
    var result = "";
    var count = 0;
    for (var i = str.length - 1; i >= 0; i--) {
      if (count > 0 && count % 3 === 0) result = "," + result;
      result = str[i] + result;
      count++;
    }
    return this._currencySymbol + result;
  };

  PersonalCommission.prototype._render = function () {
    if (!this._root) return;

    this._root.getElementById("title").textContent          = this._title;
    this._root.getElementById("source").textContent         = this._source;
    this._root.getElementById("card").style.backgroundColor = this._bgColor;

    var mv = this._root.getElementById("main-value");
    mv.style.fontSize = this._fontSize + "px";

    if (this._value !== null) {
      mv.textContent  = this._formatCurrency(this._value);
      mv.style.opacity = "1";
    } else {
      mv.textContent   = "–";
      mv.style.opacity = "0.3";
    }
  };

  PersonalCommission.prototype._showNoData = function (show) {
    if (!this._root) return;
    this._root.getElementById("nodata").style.display     = show ? "block" : "none";
    this._root.getElementById("main-value").style.opacity = show ? "0.3" : "1";
  };

  customElements.define("com-custom-personalcommission", PersonalCommission);
})();