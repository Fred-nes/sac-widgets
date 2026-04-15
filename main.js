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
    ".kpi{font-weight:700;color:#1a1a1a;line-height:1;}" +
    ".lbl{font-size:13px;color:#6a6d70;}" +
    ".nodata{font-size:12px;color:#b0b0b0;font-style:italic;}" +
    "</style>" +
    "<div class='card' id='card'>" +
    "<div class='donut-wrap'>" +
    "<svg id='svg' viewBox='0 0 80 80' width='80' height='80'>" +
    "<circle id='arc-bg' cx='40' cy='40' r='30' fill='none' stroke='#e0e0e0' stroke-width='10'/>" +
    "<circle id='arc-fill' cx='40' cy='40' r='30' fill='none' stroke='#185FA5' stroke-width='10'" +
    " stroke-linecap='round' stroke-dasharray='188.5' stroke-dashoffset='116'" +
    " transform='rotate(-90 40 40)'" +
    " style='transition:stroke-dashoffset 0.7s ease,stroke 0.3s ease;'/>" +
    "</svg>" +
    "</div>" +
    "<div class='info'>" +
    "<div class='kpi' id='kpi'>38%</div>" +
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

    this._rate    = 38;
    this._title   = "Opportunity Win Rate";
    this._arcColor      = "#185FA5";
    this._bgColor       = "#ffffff";
    this._fontSize      = 32;
    this._threshold     = 30;
    this._thresholdColor = "#e53935";

    var self = this;
    this._root.getElementById("card").addEventListener("click", function () {
      self.dispatchEvent(new CustomEvent("onClick", { bubbles: true }));
    });

    this._render();
  };

  WinRateDonut.prototype.onCustomWidgetDataChanged = function () {
  console.log("=== DATA CHANGED CALLED ===");
  if (!this._root) { console.log("NO ROOT"); return; }
  try {
    console.log("dataBinding object:", this.dataBinding);
    var binding = this.dataBinding && this.dataBinding.myDataBinding;
    console.log("binding:", binding);
    if (!binding) { console.log("NO BINDING"); return; }
    var rs = binding.getResultSet();
    console.log("resultSet:", JSON.stringify(rs));
    if (!rs || !rs.data || rs.data.length === 0) { this._showNoData(true); return; }
    var row  = rs.data[0];
    var keys = Object.keys(row);
    var val  = null;
    for (var i = 0; i < keys.length; i++) {
      var cell = row[keys[i]];
      var raw  = (cell && cell.raw !== undefined) ? cell.raw : cell;
      var n    = parseFloat(raw);
      if (!isNaN(n)) { val = n; break; }
    }
    if (val === null) { this._showNoData(true); return; }
    if (val > 0 && val <= 1) val = val * 100;
    this._rate = Math.min(100, Math.max(0, val));
    this._showNoData(false);
    this._render();
  } catch (e) {
    console.error("WinRateDonut data error", e);
  }
};

  WinRateDonut.prototype.onCustomWidgetAfterUpdate = function (changed) {
    if (!this._root) return;
    if ("title"          in changed) { this._title          = changed.title;          this._root.getElementById("lbl").textContent = changed.title; }
    if ("arcColor"       in changed) { this._arcColor       = changed.arcColor;       }
    if ("bgColor"        in changed) { this._bgColor        = changed.bgColor;        this._root.getElementById("card").style.backgroundColor = changed.bgColor; }
    if ("fontSize"       in changed) { this._fontSize       = changed.fontSize;       this._root.getElementById("kpi").style.fontSize = changed.fontSize + "px"; }
    if ("threshold"      in changed) { this._threshold      = changed.threshold;      }
    if ("thresholdColor" in changed) { this._thresholdColor = changed.thresholdColor; }
    this._render();
  };

  WinRateDonut.prototype.onCustomWidgetDataChanged = function () {
  console.log("=== DATA CHANGED CALLED ===");
  if (!this._root) { console.log("NO ROOT"); return; }
  try {
    console.log("dataBinding object:", this.dataBinding);
    var binding = this.dataBinding && this.dataBinding.myDataBinding;
    console.log("binding:", binding);
    if (!binding) { console.log("NO BINDING"); return; }
    var rs = binding.getResultSet();
    console.log("resultSet:", JSON.stringify(rs));
    if (!rs || !rs.data || rs.data.length === 0) { this._showNoData(true); return; }
    var row  = rs.data[0];
    var keys = Object.keys(row);
    var val  = null;
    for (var i = 0; i < keys.length; i++) {
      var cell = row[keys[i]];
      var raw  = (cell && cell.raw !== undefined) ? cell.raw : cell;
      var n    = parseFloat(raw);
      if (!isNaN(n)) { val = n; break; }
    }
    if (val === null) { this._showNoData(true); return; }
    if (val > 0 && val <= 1) val = val * 100;
    this._rate = Math.min(100, Math.max(0, val));
    this._showNoData(false);
    this._render();
  } catch (e) {
    console.error("WinRateDonut data error", e);
  }
};

  WinRateDonut.prototype._render = function () {
    if (!this._root) return;
    var rate  = this._rate;
    var color = (rate < this._threshold) ? this._thresholdColor : this._arcColor;
    var circ  = 2 * Math.PI * 30;
    var offset = circ * (1 - rate / 100);
    var arc = this._root.getElementById("arc-fill");
    arc.setAttribute("stroke-dasharray",  circ.toFixed(2));
    arc.setAttribute("stroke-dashoffset", offset.toFixed(2));
    arc.setAttribute("stroke", color);
    this._root.getElementById("kpi").textContent = Math.round(rate) + "%";
    this._root.getElementById("kpi").style.fontSize = this._fontSize + "px";
    this._root.getElementById("kpi").style.color = color;
    this._root.getElementById("lbl").textContent = this._title;
    this._root.getElementById("card").style.backgroundColor = this._bgColor;
  };

  WinRateDonut.prototype._showNoData = function (show) {
    if (!this._root) return;
    this._root.getElementById("nodata").style.display = show ? "block" : "none";
    this._root.getElementById("kpi").style.opacity    = show ? "0.3" : "1";
  };

  customElements.define("com-custom-winrate-donut", WinRateDonut);
})();
