(function () {

  var tmpl = document.createElement("template");
  tmpl.innerHTML =
    "<style>" +
    ":host{display:block;width:100%;height:100%;box-sizing:border-box;}" +
    ".card{display:flex;align-items:center;justify-content:center;gap:20px;" +
    "padding:20px;border-radius:12px;border:1px solid #e0e0e0;" +
    "width:100%;height:100%;box-sizing:border-box;cursor:pointer;}" +
    ".donut-wrap{flex-shrink:0;}" +
    ".info{display:flex;flex-direction:column;gap:4px;}" +
    ".kpi{font-weight:700;line-height:1;}" +
    ".lbl{font-size:13px;color:#6a6d70;}" +
    ".nodata{font-size:12px;color:#b0b0b0;font-style:italic;}" +
    "</style>" +
    "<div class='card' id='card'>" +
    "<div class='donut-wrap'>" +
    "<svg viewBox='0 0 80 80' width='80' height='80'>" +
    "<circle cx='40' cy='40' r='30' fill='none' stroke='#e0e0e0' stroke-width='10'/>" +
    "<circle id='arc-fill' cx='40' cy='40' r='30' fill='none' stroke='#185FA5' stroke-width='10'" +
    " stroke-linecap='round' stroke-dasharray='188.5' stroke-dashoffset='188.5'" +
    " transform='rotate(-90 40 40)'" +
    " style='transition:stroke-dashoffset 0.7s ease,stroke 0.3s ease;'/>" +
    "</svg>" +
    "</div>" +
    "<div class='info'>" +
    "<div class='kpi' id='kpi'>–</div>" +
    "<div class='lbl' id='lbl'>Opportunity Win Rate</div>" +
    "<div class='nodata' id='nodata' style='display:none;'>Keine Daten</div>" +
    "</div>" +
    "</div>";

  function WinRateDonut() {
    var instance = HTMLElement.call(this);
    return instance;
  }

  WinRateDonut.prototype = Object.create(HTMLElement.prototype);
  WinRateDonut.prototype.constructor = WinRateDonut;

  WinRateDonut.prototype.connectedCallback = function () {
    if (this._init) return;
    this._init = true;
    this._root = this.attachShadow({ mode: "open" });
    this._root.appendChild(tmpl.content.cloneNode(true));

    this._rate           = null;
    this._title          = "Opportunity Win Rate";
    this._arcColor       = "#185FA5";
    this._bgColor        = "#ffffff";
    this._fontSize       = 32;
    this._threshold      = 30;
    this._thresholdColor = "#e53935";

    var self = this;
    this._root.getElementById("card").addEventListener("click", function () {
      self.dispatchEvent(new CustomEvent("onClick", { bubbles: true }));
    });

    this._render();
  };

  WinRateDonut.prototype.onCustomWidgetBeforeUpdate = function (changed) {};

  WinRateDonut.prototype._readBinding = function (binding) {
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
    this._rate = Math.min(100, Math.max(0, val));
    this._showNoData(false);
  };

  WinRateDonut.prototype.onCustomWidgetAfterUpdate = function (changed) {
    if (!this._root) return;
    if ("title"          in changed) { this._title          = changed.title; }
    if ("arcColor"       in changed) { this._arcColor       = changed.arcColor; }
    if ("bgColor"        in changed) { this._bgColor        = changed.bgColor; }
    if ("fontSize"       in changed) { this._fontSize       = changed.fontSize; }
    if ("threshold"      in changed) { this._threshold      = changed.threshold; }
    if ("thresholdColor" in changed) { this._thresholdColor = changed.thresholdColor; }
    if ("myDataBinding"  in changed) { this._readBinding(changed.myDataBinding); }
    this._render();
  };

  WinRateDonut.prototype.onCustomWidgetDataChanged = function () {
    if (!this._root) return;
    try {
      var binding = this.dataBinding && this.dataBinding.myDataBinding;
      if (binding) { this._readBinding(binding); this._render(); return; }
      var b2 = this.dataBindings && this.dataBindings.getDataBinding("myDataBinding");
      if (!b2) return;
      var ds = b2.getDataSource();
      if (!ds || !ds.getResultSetData) return;
      var rs = ds.getResultSetData();
      if (rs && rs.then) {
        var self = this;
        rs.then(function (data) {
          if (!data || !data.length) { self._showNoData(true); self._render(); return; }
          self._readBinding({ state: "success", data: data });
          self._render();
        });
      } else {
        if (!rs || !rs.length) { this._showNoData(true); }
        else { this._readBinding({ state: "success", data: rs }); }
        this._render();
      }
    } catch (e) {
      console.error("WinRateDonut data error", e);
    }
  };

  WinRateDonut.prototype._render = function () {
    if (!this._root) return;
    var rate  = this._rate;
    var color = (rate !== null && rate < this._threshold) ? this._thresholdColor : this._arcColor;
    var circ  = 2 * Math.PI * 30;
    var arc   = this._root.getElementById("arc-fill");

    if (rate === null) {
      arc.setAttribute("stroke-dasharray",  circ.toFixed(2));
      arc.setAttribute("stroke-dashoffset", circ.toFixed(2));
      arc.setAttribute("stroke", "#e0e0e0");
      this._root.getElementById("kpi").textContent = "–";
      this._root.getElementById("kpi").style.color = "#b0b0b0";
    } else {
      var offset = circ * (1 - rate / 100);
      arc.setAttribute("stroke-dasharray",  circ.toFixed(2));
      arc.setAttribute("stroke-dashoffset", offset.toFixed(2));
      arc.setAttribute("stroke", color);
      this._root.getElementById("kpi").textContent = Math.round(rate) + "%";
      this._root.getElementById("kpi").style.color = color;
    }

    this._root.getElementById("kpi").style.fontSize         = this._fontSize + "px";
    this._root.getElementById("lbl").textContent            = this._title;
    this._root.getElementById("card").style.backgroundColor = this._bgColor;
  };

  WinRateDonut.prototype._showNoData = function (show) {
    if (!this._root) return;
    this._root.getElementById("nodata").style.display = show ? "block" : "none";
    this._root.getElementById("kpi").style.opacity    = show ? "0.3" : "1";
  };

  customElements.define("com-custom-winrate-donut", WinRateDonut);
})();
