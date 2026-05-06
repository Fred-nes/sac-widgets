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
    ".color-row{display:flex;align-items:center;gap:6px;}" +
    ".color-hex{width:72px;padding:3px 6px;border:1px solid #ccc;border-radius:3px;font-size:12px;}" +
    "</style>" +

    "<div class='section'>" +
    "<div class='section-title'>Allgemein</div>" +
    "<div class='row'><label>Titel</label><input type='text' data-prop='widgetTitle' data-type='string' value='Central KPI: Strategic Fit Score'/></div>" +
    "<div class='row'><label>Summary Text</label><input type='text' data-prop='summaryText' data-type='string' value=''/></div>" +
    "<div class='row'><label>Hintergrund</label><div class='color-row'><input type='color' data-prop='bgColor' data-type='color' value='#ffffff'/><input type='text' class='color-hex' data-prop='bgColor' data-type='string' value='#ffffff'/></div></div>" +
    "</div>" +

    "<div class='section'>" +
    "<div class='section-title'>Titel</div>" +
    "<div class='row'><label>Farbe</label><div class='color-row'><input type='color' data-prop='titleColor' data-type='color' value='#1A3053'/><input type='text' class='color-hex' data-prop='titleColor' data-type='string' value='#1A3053'/></div></div>" +
    "<div class='row'><label>Schriftgroesse (px)</label><input type='number' data-prop='titleFontSize' data-type='number' value='13'/></div>" +
    "</div>" +

    "<div class='section'>" +
    "<div class='section-title'>Gauge</div>" +
    "<div class='row'><label>Hintergrundbogen</label><div class='color-row'><input type='color' data-prop='trackColor' data-type='color' value='#E2E8F0'/><input type='text' class='color-hex' data-prop='trackColor' data-type='string' value='#E2E8F0'/></div></div>" +
    "<div class='row'><label>Verlauf Start</label><div class='color-row'><input type='color' data-prop='arcColorStart' data-type='color' value='#2B7DE9'/><input type='text' class='color-hex' data-prop='arcColorStart' data-type='string' value='#2B7DE9'/></div></div>" +
    "<div class='row'><label>Verlauf Ende</label><div class='color-row'><input type='color' data-prop='arcColorEnd' data-type='color' value='#25AE6E'/><input type='text' class='color-hex' data-prop='arcColorEnd' data-type='string' value='#25AE6E'/></div></div>" +
    "<div class='row'><label>Zeiger Farbe</label><div class='color-row'><input type='color' data-prop='tickColor' data-type='color' value='#111827'/><input type='text' class='color-hex' data-prop='tickColor' data-type='string' value='#111827'/></div></div>" +
    "</div>" +

    "<div class='section'>" +
    "<div class='section-title'>Score</div>" +
    "<div class='row'><label>Farbe</label><div class='color-row'><input type='color' data-prop='scoreColor' data-type='color' value='#1A3053'/><input type='text' class='color-hex' data-prop='scoreColor' data-type='string' value='#1A3053'/></div></div>" +
    "<div class='row'><label>Schriftgroesse (px)</label><input type='number' data-prop='scoreFontSize' data-type='number' value='44'/></div>" +
    "</div>" +

    "<div class='section'>" +
    "<div class='section-title'>Schwellen</div>" +
    "<div class='row'><label>LOW unter (%)</label><input type='number' data-prop='lowThreshold' data-type='number' value='40'/></div>" +
    "<div class='row'><label>HIGH ab (%)</label><input type='number' data-prop='highThreshold' data-type='number' value='70'/></div>" +
    "</div>";

  function StrategicFitStyling() {
    var instance = HTMLElement.call(this);
    return instance;
  }

  StrategicFitStyling.prototype = Object.create(HTMLElement.prototype);
  StrategicFitStyling.prototype.constructor = StrategicFitStyling;

  StrategicFitStyling.prototype.connectedCallback = function () {
    if (this._init) { return; }
    this._init = true;
    this._root = this.attachShadow({ mode: "open" });
    this._root.appendChild(tmpl.content.cloneNode(true));
    this._bindEvents();
  };

  StrategicFitStyling.prototype._bindEvents = function () {
    var self = this;
    var inputs = this._root.querySelectorAll("input");
    for (var i = 0; i < inputs.length; i++) {
      (function (input) {
        var eventType = input.type === "color" ? "input" : "change";
        input.addEventListener(eventType, function () {
          var prop = input.getAttribute("data-prop");
          var type = input.getAttribute("data-type");
          var value;
          if (type === "number") {
            value = parseFloat(input.value);
          } else if (type === "color") {
            value = input.value;
            var hexInputs = self._root.querySelectorAll("input[type=text][data-prop='" + prop + "']");
            for (var j = 0; j < hexInputs.length; j++) { hexInputs[j].value = value; }
          } else {
            value = input.value;
            var colorInputs = self._root.querySelectorAll("input[type=color][data-prop='" + prop + "']");
            if (colorInputs.length > 0 && /^#[0-9a-fA-F]{6}$/.test(value)) {
              for (var k = 0; k < colorInputs.length; k++) { colorInputs[k].value = value; }
            }
          }
          var properties = {};
          properties[prop] = value;
          self.dispatchEvent(new CustomEvent("propertiesChanged", {
            detail: { properties: properties },
            bubbles: true
          }));
        });
      })(inputs[i]);
    }
  };

  StrategicFitStyling.prototype.onCustomWidgetAfterUpdate = function (changed) {
    if (!this._root) { return; }
    var props = ["widgetTitle", "summaryText", "bgColor", "titleColor", "titleFontSize",
                 "trackColor", "arcColorStart", "arcColorEnd", "tickColor",
                 "scoreColor", "scoreFontSize", "lowThreshold", "highThreshold"];
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      if (!(prop in changed)) { continue; }
      var allInputs = this._root.querySelectorAll("[data-prop='" + prop + "']");
      for (var j = 0; j < allInputs.length; j++) {
        allInputs[j].value = changed[prop];
      }
    }
  };

  if (!customElements.get("com-custom-strategicfit-styling")) {
    customElements.define("com-custom-strategicfit-styling", StrategicFitStyling);
  }

})();
