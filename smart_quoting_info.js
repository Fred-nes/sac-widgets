(function () {

  var tmpl = document.createElement("template");
  tmpl.innerHTML =
    "<style>" +
    ":host{display:block;width:100%;height:100%;box-sizing:border-box;}" +
    ".card{background:#f5f6f7;border:1px solid #e0e0e0;border-radius:12px;padding:16px 20px;" +
    "width:100%;height:100%;box-sizing:border-box;cursor:pointer;" +
    "display:flex;flex-direction:column;gap:12px;}" +
    ".card:hover{box-shadow:0 2px 8px rgba(0,0,0,0.08);}" +
    ".title{font-size:14px;font-weight:700;color:#1a1a1a;}" +
    ".row{display:flex;align-items:flex-start;gap:0;width:100%;}" +
    ".col{display:flex;flex-direction:column;gap:3px;flex:1;min-width:0;}" +
    ".col-label{font-size:11px;color:#6a6d70;font-weight:400;}" +
    ".col-value{font-size:13px;font-weight:600;color:#1a1a1a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}" +
    ".col-value.currency{color:#1a1a1a;}" +
    ".nodata{font-size:11px;color:#b0b0b0;font-style:italic;}" +
    "</style>" +
    "<div class='card' id='card'>" +
    "<div class='title' id='title'>Smart Decision Based Quoting</div>" +
    "<div class='row'>" +
    "<div class='col'>" +
    "<div class='col-label'>Account</div>" +
    "<div class='col-value' id='val-account'>\u2013</div>" +
    "</div>" +
    "<div class='col'>" +
    "<div class='col-label'>Opportunity</div>" +
    "<div class='col-value' id='val-opportunity'>\u2013</div>" +
    "</div>" +
    "<div class='col'>" +
    "<div class='col-label'>Estimated Value</div>" +
    "<div class='col-value currency' id='val-estimated'>\u2013</div>" +
    "</div>" +
    "<div class='col'>" +
    "<div class='col-label'>Status</div>" +
    "<div class='col-value' id='val-status'>\u2013</div>" +
    "</div>" +
    "<div class='col'>" +
    "<div class='col-label'>Owner</div>" +
    "<div class='col-value' id='val-owner'>\u2013</div>" +
    "</div>" +
    "</div>" +
    "<div class='nodata' id='nodata' style='display:none;'>Keine Daten</div>" +
    "</div>";

  function SmartQuotingInfo() {
    var instance = HTMLElement.call(this);
    return instance;
  }

  SmartQuotingInfo.prototype = Object.create(HTMLElement.prototype);
  SmartQuotingInfo.prototype.constructor = SmartQuotingInfo;

  SmartQuotingInfo.prototype._initDefaults = function () {
    if (this._initialized) return;
    this._initialized    = true;
    this._title          = "Smart Decision Based Quoting";
    this._bgColor        = "#f5f6f7";
    this._currencySymbol = "\u20AC";
    this._dims           = [];
    this._measure        = null;
  };

  SmartQuotingInfo.prototype.connectedCallback = function () {
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

  SmartQuotingInfo.prototype.onCustomWidgetBeforeUpdate = function (changed) {};

  SmartQuotingInfo.prototype._readBinding = function (binding) {
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

    var cell = row["@MeasureDimension"];
    var raw  = cell && cell.rawValue !== undefined ? cell.rawValue : null;
    if (raw === null) {
      for (var j = 0; j < keys.length; j++) {
        var c = row[keys[j]];
        var r = c && c.rawValue !== undefined ? c.rawValue : null;
        if (r !== null && !isNaN(parseFloat(r))) { raw = r; break; }
      }
    }

    this._dims    = dims;
    this._measure = raw !== null ? parseFloat(raw) : null;
    this._showNoData(false);
  };

  SmartQuotingInfo.prototype.onCustomWidgetAfterUpdate = function (changed) {
    this._initDefaults();
    if ("title"          in changed) this._title          = changed.title;
    if ("bgColor"        in changed) this._bgColor        = changed.bgColor;
    if ("currencySymbol" in changed) this._currencySymbol = changed.currencySymbol;
    if ("myDataBinding"  in changed) this._readBinding(changed.myDataBinding);
    this._render();
  };

  SmartQuotingInfo.prototype._formatCurrency = function (val) {
    var rounded = Math.round(val);
    var str     = rounded.toString();
    var result  = "";
    var count   = 0;
    for (var i = str.length - 1; i >= 0; i--) {
      if (count > 0 && count % 3 === 0) result = "," + result;
      result = str[i] + result;
      count++;
    }
    return this._currencySymbol + result;
  };

  SmartQuotingInfo.prototype._render = function () {
    if (!this._root) return;

    this._root.getElementById("title").textContent          = this._title;
    this._root.getElementById("card").style.backgroundColor = this._bgColor;

    var ids = ["val-account", "val-opportunity", "val-status", "val-owner"];
    for (var i = 0; i < ids.length; i++) {
      this._root.getElementById(ids[i]).textContent = this._dims[i] || "\u2013";
    }

    var ev = this._root.getElementById("val-estimated");
    ev.textContent = this._measure !== null ? this._formatCurrency(this._measure) : "\u2013";
  };

  SmartQuotingInfo.prototype._showNoData = function (show) {
    if (!this._root) return;
    this._root.getElementById("nodata").style.display = show ? "block" : "none";
  };

  if (!customElements.get("com-custom-smartquotinginfo")) {
    customElements.define("com-custom-smartquotinginfo", SmartQuotingInfo);
  }

})();
