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
    ".nodata{font-size:11px;color:#b0b0b0;font-style:italic;}" +
    "</style>" +
    "<div class='card' id='card'>" +
    "<div class='title' id='title'>Smart Decision Based Quoting</div>" +
    "<div class='row'>" +
    "<div class='col'><div class='col-label' id='lbl-account'>Account</div><div class='col-value' id='val-account'>\u2013</div></div>" +
    "<div class='col'><div class='col-label' id='lbl-opportunity'>Opportunity</div><div class='col-value' id='val-opportunity'>\u2013</div></div>" +
    "<div class='col'><div class='col-label' id='lbl-estimated'>Estimated Value</div><div class='col-value' id='val-estimated'>\u2013</div></div>" +
    "<div class='col'><div class='col-label' id='lbl-status'>Status</div><div class='col-value' id='val-status'>\u2013</div></div>" +
    "<div class='col'><div class='col-label' id='lbl-owner'>Owner</div><div class='col-value' id='val-owner'>\u2013</div></div>" +
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
    this._dims           = [];
    this._measure        = null;
    this._title          = "Smart Decision Based Quoting";
    this._bgColor        = "#f5f6f7";
    this._borderColor    = "#e0e0e0";
    this._showBorder     = true;
    this._borderRadius   = 12;
    this._titleColor     = "#1a1a1a";
    this._titleFontSize  = 14;
    this._labelColor     = "#6a6d70";
    this._labelFontSize  = 11;
    this._valueColor     = "#1a1a1a";
    this._valueFontSize  = 13;
    this._currencySymbol = "\u20AC";
    this._noDataText     = "Keine Daten";
    this._lblAccount     = "Account";
    this._lblOpportunity = "Opportunity";
    this._lblEstimated   = "Estimated Value";
    this._lblStatus      = "Status";
    this._lblOwner       = "Owner";
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

    // 1. Standard SAC key
    var raw  = null;
    var cell = row["@MeasureDimension"];
    if (cell && cell.rawValue !== null && cell.rawValue !== undefined) {
      raw = cell.rawValue;
    }
    // 2. Named feed key (SAC uses feed ID when multiple dimension feeds exist)
    if (raw === null && row["measures"]) {
      var mc = row["measures"];
      if (mc.rawValue !== null && mc.rawValue !== undefined) { raw = mc.rawValue; }
    }
    // 3. Last resort: any key that isn't a known dimension feed
    var dimKeys = { "account": 1, "opportunity": 1, "status": 1, "owner": 1 };
    if (raw === null) {
      for (var j = 0; j < keys.length; j++) {
        if (dimKeys[keys[j]] || keys[j] === "@MeasureDimension") continue;
        var c = row[keys[j]];
        var r = c && c.rawValue !== null && c.rawValue !== undefined ? c.rawValue : null;
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
    if ("borderColor"    in changed) this._borderColor    = changed.borderColor;
    if ("showBorder"     in changed) this._showBorder     = changed.showBorder === "true";
    if ("borderRadius"   in changed) this._borderRadius   = changed.borderRadius;
    if ("titleColor"     in changed) this._titleColor     = changed.titleColor;
    if ("titleFontSize"  in changed) this._titleFontSize  = changed.titleFontSize;
    if ("labelColor"     in changed) this._labelColor     = changed.labelColor;
    if ("labelFontSize"  in changed) this._labelFontSize  = changed.labelFontSize;
    if ("valueColor"     in changed) this._valueColor     = changed.valueColor;
    if ("valueFontSize"  in changed) this._valueFontSize  = changed.valueFontSize;
    if ("currencySymbol" in changed) this._currencySymbol = changed.currencySymbol;
    if ("noDataText"     in changed) this._noDataText     = changed.noDataText;
    if ("lblAccount"     in changed) this._lblAccount     = changed.lblAccount;
    if ("lblOpportunity" in changed) this._lblOpportunity = changed.lblOpportunity;
    if ("lblEstimated"   in changed) this._lblEstimated   = changed.lblEstimated;
    if ("lblStatus"      in changed) this._lblStatus      = changed.lblStatus;
    if ("lblOwner"       in changed) this._lblOwner       = changed.lblOwner;
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

    var card = this._root.getElementById("card");
    card.style.backgroundColor = this._bgColor;
    card.style.borderRadius    = this._borderRadius + "px";
    card.style.border = this._showBorder
      ? "1px solid " + this._borderColor
      : "none";

    var titleEl = this._root.getElementById("title");
    titleEl.textContent    = this._title;
    titleEl.style.color    = this._titleColor;
    titleEl.style.fontSize = this._titleFontSize + "px";

    var lblIds  = ["lbl-account", "lbl-opportunity", "lbl-estimated", "lbl-status", "lbl-owner"];
    var lblVals = [this._lblAccount, this._lblOpportunity, this._lblEstimated, this._lblStatus, this._lblOwner];
    for (var i = 0; i < lblIds.length; i++) {
      var lbl = this._root.getElementById(lblIds[i]);
      lbl.textContent    = lblVals[i];
      lbl.style.color    = this._labelColor;
      lbl.style.fontSize = this._labelFontSize + "px";
    }

    var valIds = ["val-account", "val-opportunity", "val-status", "val-owner"];
    for (var j = 0; j < valIds.length; j++) {
      var el = this._root.getElementById(valIds[j]);
      el.textContent    = this._dims[j] || "\u2013";
      el.style.color    = this._valueColor;
      el.style.fontSize = this._valueFontSize + "px";
    }

    var ev = this._root.getElementById("val-estimated");
    ev.textContent    = this._measure !== null ? this._formatCurrency(this._measure) : "\u2013";
    ev.style.color    = this._valueColor;
    ev.style.fontSize = this._valueFontSize + "px";

    this._root.getElementById("nodata").textContent = this._noDataText;
  };

  SmartQuotingInfo.prototype._showNoData = function (show) {
    if (!this._root) return;
    this._root.getElementById("nodata").style.display = show ? "block" : "none";
  };

  if (!customElements.get("com-custom-smartquotinginfo")) {
    customElements.define("com-custom-smartquotinginfo", SmartQuotingInfo);
  }

})();
