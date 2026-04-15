/**
 * SAC Custom Widget – Customer Win Rate Donut
 * Tag: com-custom-winrate-donut
 *
 * ES5-kompatibel: kein const/let/for-of (SAC strict mode Fix)
 */

(function () {
  var template = document.createElement("template");
  template.innerHTML =
    '<style>' +
    ':host {' +
    '  display: block;' +
    '  font-family: "72", "72full", Arial, Helvetica, sans-serif;' +
    '  box-sizing: border-box;' +
    '  width: 100%;' +
    '  height: 100%;' +
    '}' +
    '.card {' +
    '  background: #ffffff;' +
    '  border: 1px solid #e5e5e5;' +
    '  border-radius: 12px;' +
    '  padding: 16px;' +
    '  display: flex;' +
    '  flex-direction: column;' +
    '  align-items: flex-start;' +
    '  gap: 8px;' +
    '  width: 100%;' +
    '  height: 100%;' +
    '  box-sizing: border-box;' +
    '  cursor: pointer;' +
    '  transition: box-shadow 0.15s ease;' +
    '}' +
    '.card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }' +
    '.title {' +
    '  font-size: 11px;' +
    '  font-weight: 600;' +
    '  color: #6a6d70;' +
    '  letter-spacing: 0.04em;' +
    '  text-transform: uppercase;' +
    '  display: flex;' +
    '  align-items: center;' +
    '  gap: 5px;' +
    '}' +
    '.body {' +
    '  display: flex;' +
    '  align-items: center;' +
    '  gap: 14px;' +
    '  width: 100%;' +
    '}' +
    '.big-num {' +
    '  font-size: 28px;' +
    '  font-weight: 700;' +
    '  color: #1a1a1a;' +
    '  line-height: 1;' +
    '  min-width: 56px;' +
    '}' +
    '.donut-wrap {' +
    '  position: relative;' +
    '  width: 56px;' +
    '  height: 56px;' +
    '  flex-shrink: 0;' +
    '}' +
    '.donut-wrap svg { width: 56px; height: 56px; }' +
    '.arc-bg { fill: none; stroke: #e8e8e8; stroke-width: 9; }' +
    '.arc-fill {' +
    '  fill: none;' +
    '  stroke-width: 9;' +
    '  stroke-linecap: round;' +
    '  transform-origin: center;' +
    '  transform: rotate(-90deg);' +
    '  transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1);' +
    '}' +
    '.source {' +
    '  font-size: 10px;' +
    '  color: #9a9a9a;' +
    '  margin-top: auto;' +
    '}' +
    '.no-data {' +
    '  font-size: 11px;' +
    '  color: #b0b0b0;' +
    '  font-style: italic;' +
    '  margin-top: 4px;' +
    '}' +
    '<\/style>' +
    '<div class="card" id="card">' +
    '  <div class="title">' +
    '    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">' +
    '      <path d="M8 2l1.5 3.2 3.5.5-2.5 2.4.6 3.5L8 10.1l-3.1 1.5.6-3.5L3 5.7l3.5-.5z"' +
    '        stroke="#6a6d70" stroke-width="1.3" stroke-linejoin="round"/>' +
    '    <\/svg>' +
    '    <span id="title-text">Customer Win Rate<\/span>' +
    '  <\/div>' +
    '  <div class="body">' +
    '    <div class="big-num" id="num-text">38%<\/div>' +
    '    <div class="donut-wrap">' +
    '      <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">' +
    '        <circle class="arc-bg" cx="28" cy="28" r="21"/>' +
    '        <circle class="arc-fill" id="arc" cx="28" cy="28" r="21"' +
    '          stroke="#185FA5"' +
    '          stroke-dasharray="131.95"' +
    '          stroke-dashoffset="81.81"/>' +
    '      <\/svg>' +
    '    <\/div>' +
    '  <\/div>' +
    '  <div class="source" id="source-text">SAP Sales Cloud<\/div>' +
    '  <div class="no-data" id="no-data-msg" style="display:none;">Kein Datensatz verknüpft<\/div>' +
    '<\/div>';

  var WinRateDonut = (function () {
    function WinRateDonut() {
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      this._winRate = 38;
      this._label = "Customer Win Rate";
      this._sourceLabel = "SAP Sales Cloud";
      this._color = "#185FA5";

      var self = this;
      this._shadowRoot.getElementById("card").addEventListener("click", function () {
        self.dispatchEvent(new CustomEvent("onClick", { bubbles: true }));
      });
    }

    WinRateDonut.prototype = Object.create(HTMLElement.prototype);
    WinRateDonut.prototype.constructor = WinRateDonut;

    WinRateDonut.prototype.onCustomWidgetBeforeUpdate = function (oChangedProperties) {};

    WinRateDonut.prototype.onCustomWidgetAfterUpdate = function (oChangedProperties) {
      if ("winRate"     in oChangedProperties) this.winRate     = oChangedProperties.winRate;
      if ("label"       in oChangedProperties) this.label       = oChangedProperties.label;
      if ("sourceLabel" in oChangedProperties) this.sourceLabel = oChangedProperties.sourceLabel;
      if ("color"       in oChangedProperties) this.color       = oChangedProperties.color;
    };

    WinRateDonut.prototype.onCustomWidgetDataChanged = function () {
      try {
        var binding = this.dataBinding && this.dataBinding.myDataBinding;
        if (!binding) return;

        var resultSet = binding.getResultSet();
        if (!resultSet || !resultSet.data || resultSet.data.length === 0) {
          this._showNoData(true);
          return;
        }

        var firstRow = resultSet.data[0];
        var keys = Object.keys(firstRow);
        var value = null;

        for (var i = 0; i < keys.length; i++) {
          var k = keys[i];
          var raw = firstRow[k] && firstRow[k].raw !== undefined
            ? firstRow[k].raw
            : firstRow[k];
          var num = parseFloat(raw);
          if (!isNaN(num)) { value = num; break; }
        }

        if (value !== null) {
          this._showNoData(false);
          if (value > 0 && value <= 1) value = value * 100;
          this.winRate = value;
        } else {
          this._showNoData(true);
        }
      } catch (e) {
        console.error("WinRateDonut: Fehler beim Lesen des Data Bindings", e);
      }
    };

    Object.defineProperty(WinRateDonut.prototype, "winRate", {
      get: function () { return this._winRate; },
      set: function (val) {
        var v = Math.min(100, Math.max(0, parseFloat(val) || 0));
        this._winRate = v;
        this._shadowRoot.getElementById("num-text").textContent = Math.round(v) + "%";
        this._updateArc(v);
      }
    });

    Object.defineProperty(WinRateDonut.prototype, "label", {
      get: function () { return this._label; },
      set: function (val) {
        this._label = val;
        this._shadowRoot.getElementById("title-text").textContent = val;
      }
    });

    Object.defineProperty(WinRateDonut.prototype, "sourceLabel", {
      get: function () { return this._sourceLabel; },
      set: function (val) {
        this._sourceLabel = val;
        this._shadowRoot.getElementById("source-text").textContent = val;
      }
    });

    Object.defineProperty(WinRateDonut.prototype, "color", {
      get: function () { return this._color; },
      set: function (val) {
        this._color = val;
        this._shadowRoot.getElementById("arc").style.stroke = val;
      }
    });

    WinRateDonut.prototype.setWinRate = function (value) { this.winRate = value; };

    WinRateDonut.prototype._updateArc = function (percent) {
      var arc = this._shadowRoot.getElementById("arc");
      var circumference = 2 * Math.PI * 21;
      var offset = circumference * (1 - percent / 100);
      arc.style.strokeDasharray  = circumference.toFixed(2);
      arc.style.strokeDashoffset = offset.toFixed(2);
    };

    WinRateDonut.prototype._showNoData = function (show) {
      this._shadowRoot.getElementById("no-data-msg").style.display = show ? "block" : "none";
      this._shadowRoot.getElementById("num-text").style.opacity    = show ? "0.3" : "1";
    };

    return WinRateDonut;
  })();

  customElements.define("com-custom-winrate-donut", WinRateDonut);
})();
