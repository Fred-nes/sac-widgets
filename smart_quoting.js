(function () {

  var tmpl = document.createElement("template");
  tmpl.innerHTML =
    "<style>" +
    ":host{display:block;width:100%;height:100%;box-sizing:border-box;}" +
    ".card{background:#f5f6f7;border:1px solid #e0e0e0;border-radius:12px;padding:16px 20px;" +
    "width:100%;height:100%;box-sizing:border-box;" +
    "display:flex;flex-direction:column;gap:12px;}" +
    ".title{font-size:14px;font-weight:700;color:#1a1a1a;}" +
    ".row{display:flex;align-items:flex-start;width:100%;}" +
    ".col{display:flex;flex-direction:column;gap:3px;flex:1;min-width:0;}" +
    ".col-label{font-size:11px;color:#6a6d70;}" +
    ".col-value{font-size:13px;font-weight:600;color:#1a1a1a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}" +
    "</style>" +
    "<div class='card' id='card'>" +
    "<div class='title' id='title'>Smart Decision Based Quoting</div>" +
    "<div class='row'>" +
    "<div class='col'><div class='col-label'>Account</div><div class='col-value' id='v0'>–</div></div>" +
    "<div class='col'><div class='col-label'>Opportunity</div><div class='col-value' id='v1'>–</div></div>" +
    "<div class='col'><div class='col-label'>Status</div><div class='col-value' id='v2'>–</div></div>" +
    "<div class='col'><div class='col-label'>Owner</div><div class='col-value' id='v3'>–</div></div>" +
    "</div>" +
    "</div>";

  function SmartQuotingInfo() {
    var instance = HTMLElement.call(this);
    return instance;
  }

  SmartQuotingInfo.prototype = Object.create(HTMLElement.prototype);
  SmartQuotingInfo.prototype.constructor = SmartQuotingInfo;

  SmartQuotingInfo.prototype.connectedCallback = function () {
    if (this._init) return;
    this._init = true;
    this._root = this.attachShadow({ mode: "open" });
    this._root.appendChild(tmpl.content.cloneNode(true));
    this._dims    = [];
    this._title   = "Smart Decision Based Quoting";
    this._bgColor = "#f5f6f7";
    this._render();
  };

  SmartQuotingInfo.prototype.onCustomWidgetBeforeUpdate = function (changed) {};

  SmartQuotingInfo.prototype._readBinding = function (binding) {
    if (!binding) return;
    if (!binding.data || binding.data.length === 0) return;
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
    this._dims = dims;
  };

  SmartQuotingInfo.prototype.onCustomWidgetAfterUpdate = function (changed) {
    if (!this._root) return;
    if ("title"         in changed) { this._title   = changed.title; }
    if ("bgColor"       in changed) { this._bgColor = changed.bgColor; }
    if ("myDataBinding" in changed) {
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

  SmartQuotingInfo.prototype._render = function () {
    if (!this._root) return;
    this._root.getElementById("title").textContent          = this._title;
    this._root.getElementById("card").style.backgroundColor = this._bgColor;
    for (var i = 0; i < 4; i++) {
      this._root.getElementById("v" + i).textContent = this._dims[i] || "–";
    }
  };

  customElements.define("com-custom-smartquotinginfo", SmartQuotingInfo);
})();
