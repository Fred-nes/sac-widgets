(function () {

  var tmpl = document.createElement("template");
  tmpl.innerHTML =
    "<style>" +
    ":host{display:block;width:100%;height:100%;box-sizing:border-box;}" +
    ".card{background:#ffffff;border:1px solid #e5e5e5;border-radius:12px;padding:16px;" +
    "width:100%;height:100%;box-sizing:border-box;" +
    "display:flex;flex-direction:column;gap:8px;}" +
    ".card:hover{box-shadow:0 2px 8px rgba(0,0,0,0.08);}" +
    ".title{font-size:11px;font-weight:600;color:#6a6d70;letter-spacing:0.04em;text-transform:uppercase;}" +
    ".value{font-weight:700;color:#1a1a1a;line-height:1;}" +
    ".source{font-size:11px;color:#9a9a9a;margin-top:auto;}" +
    "</style>" +
    "<div class='card' id='card'>" +
    "<div class='title' id='title'>Estimated Value</div>" +
    "<div class='value' id='value'>–</div>" +
    "<div class='source' id='source'>SAP Sales Cloud</div>" +
    "</div>";

  function SmartQuotingValue() {
    var instance = HTMLElement.call(this); // Kommentar
    return instance;
  }

  SmartQuotingValue.prototype = Object.create(HTMLElement.prototype);
  SmartQuotingValue.prototype.constructor = SmartQuotingValue;

  SmartQuotingValue.prototype.connectedCallback = function () {
    if (this._init) return;
    this._init = true;
    this._root = this.attachShadow({ mode: "open" });
    this._root.appendChild(tmpl.content.cloneNode(true));
    this._value          = null;
    this._title          = "Estimated Value";
    this._source         = "SAP Sales Cloud";
    this._bgColor        = "#ffffff";
    this._fontSize       = 32;
    this._currencySymbol = "\u20AC";
    this._render();
  };

  SmartQuotingValue.prototype.onCustomWidgetBeforeUpdate = function (changed) {};

  SmartQuotingValue.prototype._readBinding = function (binding) {
    if (!binding) return;
    if (!binding.data || binding.data.length === 0) return;
    var row  = binding.data[0];
    var cell = row["@MeasureDimension"];
    if (cell && cell.rawValue !== undefined) {
      var val = parseFloat(cell.rawValue);
      if (!isNaN(val)) { this._value = val; }
    }
  };

  SmartQuotingValue.prototype.onCustomWidgetAfterUpdate = function (changed) {
    if (!this._root) return;
    if ("title"          in changed) { this._title          = changed.title; }
    if ("sourceLabel"    in changed) { this._source         = changed.sourceLabel; }
    if ("bgColor"        in changed) { this._bgColor        = changed.bgColor; }
    if ("fontSize"       in changed) { this._fontSize       = changed.fontSize; }
    if ("currencySymbol" in changed) { this._currencySymbol = changed.currencySymbol; }
    if ("myDataBinding"  in changed) {
      var binding = changed.myDataBinding;
      if (binding && binding.data && binding.data.length > 0) {
        this._readBinding(binding);
      } else {
        var self = this;
        try {
          var ds = this.dataBindings.getDataBinding("myDataBinding").getDataSource();
          ds.getResultSetData().then(function(d) {
            if (d && d.length > 0) {
              self._readBinding({ data: d });
              self._render();
            }
          });
        } catch(e) {}
      }
    }
    this._render();
  };

  SmartQuotingValue.prototype._formatCurrency = function (val) {
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

  SmartQuotingValue.prototype._render = function () {
    if (!this._root) return;
    this._root.getElementById("title").textContent          = this._title;
    this._root.getElementById("source").textContent         = this._source;
    this._root.getElementById("card").style.backgroundColor = this._bgColor;
    var v = this._root.getElementById("value");
    v.style.fontSize = this._fontSize + "px";
    v.textContent    = this._value !== null ? this._formatCurrency(this._value) : "–";
  };

  customElements.define("com-custom-smartquotingvalue", SmartQuotingValue);
})();
