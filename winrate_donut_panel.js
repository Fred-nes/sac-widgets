(function () {

  var tmpl = document.createElement("template");
  tmpl.innerHTML =
    "<style>" +
    ":host{display:block;width:100%;box-sizing:border-box;font-family:sans-serif;font-size:12px;color:#333;}" +
    ".section{padding:12px 16px;border-bottom:1px solid #e8e8e8;}" +
    ".section:last-child{border-bottom:none;}" +
    ".section-title{font-weight:700;font-size:11px;text-transform:uppercase;color:#888;margin-bottom:10px;letter-spacing:0.5px;}" +
    ".row{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}" +
    ".row:last-child{margin-bottom:0;}" +
    "label{color:#555;font-size:12px;flex:1;}" +
    "input[type=text]{width:90px;padding:3px 6px;border:1px solid #ccc;border-radius:3px;font-size:12px;}" +
    "input[type=number]{width:60px;padding:3px 6px;border:1px solid #ccc;border-radius:3px;font-size:12px;}" +
    "input[type=color]{width:36px;height:24px;padding:0;border:1px solid #ccc;border-radius:3px;cursor:pointer;}" +
    "input[type=checkbox]{width:16px;height:16px;cursor:pointer;}" +
    ".color-row{display:flex;align-items:center;gap:6px;}" +
    ".color-hex{width:72px;padding:3px 6px;border:1px solid #ccc;border-radius:3px;font-size:12px;}" +
    "</style>" +

    "<div class='section'>" +
    "<div class='section-title'>Allgemein</div>" +
    "<div class='row'><label>Titel</label><input type='text' data-prop='title' data-type='string' value='Opportunity Win Rate'/></div>" +
    "<div class='row'><label>Kein-Daten Text</label><input type='text' data-prop='noDataText' data-type='string' value='Keine Daten'/></div>" +
    "</div>" +

    "<div class='section'>" +
    "<div class='section-title'>KPI Zahl</div>" +
    "<div class='row'><label>Schriftgroesse (px)</label><input type='number' data-prop='fontSize' data-type='number' value='32'/></div>" +
    "</div>" +

    "<div class='section'>" +
    "<div class='section-title'>Donut</div>" +
    "<div class='row'><label>Bogenfarbe</label><div class='color-row'><input type='color' data-prop='arcColor' data-type='color' value='#185FA5'/><input type='text' class='color-hex' data-prop='arcColor' data-type='string' value='#185FA5'/></div></div>" +
    "<div class='row'><label>Hintergrundbogen</label><div class='color-row'><input type='color' data-prop='trackColor' data-type='color' value='#e0e0e0'/><input type='text' class='color-hex' data-prop='trackColor' data-type='string' value='#e0e0e0'/></div></div>" +
    "<div class='row'><label>Ringbreite (px)</label><input type='number' data-prop='strokeWidth' data-type='number' value='10'/></div>" +
    "<div class='row'><label>Donut Groesse (px)</label><input type='number' data-prop='donutSize' data-type='number' value='80'/></div>" +
    "<div class='row'><label>Schwellenwert (%)</label><input type='number' data-prop='threshold' data-type='number' value='30'/></div>" +
    "<div class='row'><label>Schwellenfarbe</label><div class='color-row'><input type='color' data-prop='thresholdColor' data-type='color' value='#e53935'/><input type='text' class='color-hex' data-prop='thresholdColor' data-type='string' value='#e53935'/></div></div>" +
    "</div>" +

    "<div class='section'>" +
    "<div class='section-title'>Beschriftung</div>" +
    "<div class='row'><label>Schriftfarbe</label><div class='color-row'><input type='color' data-prop='labelColor' data-type='color' value='#6a6d70'/><input type='text' class='color-hex' data-prop='labelColor' data-type='string' value='#6a6d70'/></div></div>" +
    "<div class='row'><label>Schriftgroesse (px)</label><input type='number' data-prop='labelFontSize' data-type='number' value='13'/></div>" +
    "<div class='row'><label>Anzeigen</label><input type='checkbox' data-prop='showLabel' data-type='boolean' checked/></div>" +
    "</div>" +

    "<div class='section'>" +
    "<div class='section-title'>Karte</div>" +
    "<div class='row'><label>Hintergrund</label><div class='color-row'><input type='color' data-prop='bgColor' data-type='color' value='#ffffff'/><input type='text' class='color-hex' data-prop='bgColor' data-type='string' value='#ffffff'/></div></div>" +
    "<div class='row'><label>Rahmenfarbe</label><div class='color-row'><input type='color' data-prop='borderColor' data-type='color' value='#e0e0e0'/><input type='text' class='color-hex' data-prop='borderColor' data-type='string' value='#e0e0e0'/></div></div>" +
    "<div class='row'><label>Rahmen anzeigen</label><input type='checkbox' data-prop='showBorder' data-type='boolean' checked/></div>" +
    "<div class='row'><label>Eckenradius (px)</label><input type='number' data-prop='borderRadius' data-type='number' value='12'/></div>" +
    "</div>";

  function WinRateDonutStyling() {
    var instance = HTMLElement.call(this);
    return instance;
  }

  WinRateDonutStyling.prototype = Object.create(HTMLElement.prototype);
  WinRateDonutStyling.prototype.constructor = WinRateDonutStyling;

  WinRateDonutStyling.prototype.connectedCallback = function () {
    if (this._init) return;
    this._init = true;
    this._root = this.attachShadow({ mode: "open" });
    this._root.appendChild(tmpl.content.cloneNode(true));
    this._bindEvents();
  };

  WinRateDonutStyling.prototype._bindEvents = function () {
    var self = this;
    var inputs = this._root.querySelectorAll("input");
    for (var i = 0; i < inputs.length; i++) {
      (function (input) {
        var eventType = input.type === "color" ? "input" : "change";
        input.addEventListener(eventType, function () {
          var prop = input.getAttribute("data-prop");
          var type = input.getAttribute("data-type");
          var value;

          if (type === "boolean") {
            value = input.checked ? "true" : "false";
          } else if (type === "number") {
            value = parseFloat(input.value);
          } else if (type === "color") {
            value = input.value;
            // sync to hex text field
            var hexInputs = self._root.querySelectorAll("input[type=text][data-prop='" + prop + "']");
            for (var j = 0; j < hexInputs.length; j++) {
              hexInputs[j].value = value;
            }
          } else {
            value = input.value;
            // sync color picker if this is a hex text field paired with a color input
            var colorInputs = self._root.querySelectorAll("input[type=color][data-prop='" + prop + "']");
            if (colorInputs.length > 0 && /^#[0-9a-fA-F]{6}$/.test(value)) {
              for (var k = 0; k < colorInputs.length; k++) {
                colorInputs[k].value = value;
              }
            }
          }

          var properties = {};
          properties[prop] = value;
          self.dispatchEvent(new CustomEvent("propertiesChanged", {
            detail: { properties: properties },
            bubbles: true,
            composed: true
          }));
        });
      })(inputs[i]);
    }
  };

  WinRateDonutStyling.prototype.onCustomWidgetAfterUpdate = function (changed) {
    if (!this._root) return;
    var colorProps = ["arcColor", "trackColor", "thresholdColor", "labelColor", "bgColor", "borderColor"];
    var props = ["title", "noDataText", "fontSize", "arcColor", "trackColor", "strokeWidth",
                 "donutSize", "threshold", "thresholdColor", "labelColor", "labelFontSize",
                 "showLabel", "bgColor", "borderColor", "showBorder", "borderRadius"];

    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      if (!(prop in changed)) continue;
      var val = changed[prop];
      var allInputs = this._root.querySelectorAll("[data-prop='" + prop + "']");
      for (var j = 0; j < allInputs.length; j++) {
        var input = allInputs[j];
        if (input.type === "checkbox") {
          input.checked = val === "true";
        } else {
          input.value = val;
        }
      }
    }
  };

  if (!customElements.get("com-custom-winrate-donut-styling")) {
    customElements.define("com-custom-winrate-donut-styling", WinRateDonutStyling);
  }

})();
