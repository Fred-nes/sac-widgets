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
    "<div class='row'><label>Titel</label><input type='text' data-prop='title' data-type='string' value='Predicted Margin'/></div>" +
    "<div class='row'><label>Quellenangabe</label><input type='text' data-prop='sourceLabel' data-type='string' value='S/4HANA &amp; Margin Tool'/></div>" +
    "<div class='row'><label>Quelle anzeigen</label><input type='checkbox' data-prop='showSource' data-type='boolean' checked/></div>" +
    "<div class='row'><label>Kein-Daten Text</label><input type='text' data-prop='noDataText' data-type='string' value='Keine Daten'/></div>" +
    "</div>" +

    "<div class='section'>" +
    "<div class='section-title'>Schwellenwert</div>" +
    "<div class='row'><label>Schwellenwert (%)</label><input type='number' data-prop='threshold' data-type='number' value='20'/></div>" +
    "</div>" +

    "<div class='section'>" +
    "<div class='section-title'>Schrift</div>" +
    "<div class='row'><label>Titelfarbe</label><div class='color-row'><input type='color' data-prop='titleColor' data-type='color' value='#6a6d70'/><input type='text' class='color-hex' data-prop='titleColor' data-type='string' value='#6a6d70'/></div></div>" +
    "<div class='row'><label>Wertfarbe</label><div class='color-row'><input type='color' data-prop='valueColor' data-type='color' value='#1a1a1a'/><input type='text' class='color-hex' data-prop='valueColor' data-type='string' value='#1a1a1a'/></div></div>" +
    "<div class='row'><label>Schriftgroesse (px)</label><input type='number' data-prop='fontSize' data-type='number' value='36'/></div>" +
    "<div class='row'><label>Quellenfarbe</label><div class='color-row'><input type='color' data-prop='sourceColor' data-type='color' value='#9a9a9a'/><input type='text' class='color-hex' data-prop='sourceColor' data-type='string' value='#9a9a9a'/></div></div>" +
    "</div>" +

    "<div class='section'>" +
    "<div class='section-title'>Badge - Above Threshold</div>" +
    "<div class='row'><label>Text</label><input type='text' data-prop='aboveLabel' data-type='string' value='Above Threshold'/></div>" +
    "<div class='row'><label>Hintergrund</label><div class='color-row'><input type='color' data-prop='aboveBg' data-type='color' value='#DFF5EA'/><input type='text' class='color-hex' data-prop='aboveBg' data-type='string' value='#DFF5EA'/></div></div>" +
    "<div class='row'><label>Textfarbe</label><div class='color-row'><input type='color' data-prop='aboveColor' data-type='color' value='#1E8E3E'/><input type='text' class='color-hex' data-prop='aboveColor' data-type='string' value='#1E8E3E'/></div></div>" +
    "</div>" +

    "<div class='section'>" +
    "<div class='section-title'>Badge - Below Threshold</div>" +
    "<div class='row'><label>Text</label><input type='text' data-prop='belowLabel' data-type='string' value='Below Threshold'/></div>" +
    "<div class='row'><label>Hintergrund</label><div class='color-row'><input type='color' data-prop='belowBg' data-type='color' value='#FDECEA'/><input type='text' class='color-hex' data-prop='belowBg' data-type='string' value='#FDECEA'/></div></div>" +
    "<div class='row'><label>Textfarbe</label><div class='color-row'><input type='color' data-prop='belowColor' data-type='color' value='#D93025'/><input type='text' class='color-hex' data-prop='belowColor' data-type='string' value='#D93025'/></div></div>" +
    "</div>" +

    "<div class='section'>" +
    "<div class='section-title'>Karte</div>" +
    "<div class='row'><label>Hintergrund</label><div class='color-row'><input type='color' data-prop='bgColor' data-type='color' value='#ffffff'/><input type='text' class='color-hex' data-prop='bgColor' data-type='string' value='#ffffff'/></div></div>" +
    "<div class='row'><label>Rahmen anzeigen</label><input type='checkbox' data-prop='showBorder' data-type='boolean' checked/></div>" +
    "<div class='row'><label>Rahmenfarbe</label><div class='color-row'><input type='color' data-prop='borderColor' data-type='color' value='#e5e5e5'/><input type='text' class='color-hex' data-prop='borderColor' data-type='string' value='#e5e5e5'/></div></div>" +
    "<div class='row'><label>Eckenradius (px)</label><input type='number' data-prop='borderRadius' data-type='number' value='12'/></div>" +
    "</div>";

  function PredictedMarginStyling() {
    var instance = HTMLElement.call(this);
    return instance;
  }

  PredictedMarginStyling.prototype = Object.create(HTMLElement.prototype);
  PredictedMarginStyling.prototype.constructor = PredictedMarginStyling;

  PredictedMarginStyling.prototype.connectedCallback = function () {
    if (this._init) return;
    this._init = true;
    this._root = this.attachShadow({ mode: "open" });
    this._root.appendChild(tmpl.content.cloneNode(true));
    this._bindEvents();
  };

  PredictedMarginStyling.prototype._bindEvents = function () {
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
            bubbles: true,
            composed: true
          }));
        });
      })(inputs[i]);
    }
  };

  PredictedMarginStyling.prototype.onCustomWidgetAfterUpdate = function (changed) {
    if (!this._root) return;
    var props = ["title", "sourceLabel", "showSource", "noDataText", "threshold",
                 "titleColor", "valueColor", "fontSize", "sourceColor",
                 "aboveLabel", "aboveBg", "aboveColor",
                 "belowLabel", "belowBg", "belowColor",
                 "bgColor", "showBorder", "borderColor", "borderRadius"];
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      if (!(prop in changed)) continue;
      var allInputs = this._root.querySelectorAll("[data-prop='" + prop + "']");
      for (var j = 0; j < allInputs.length; j++) {
        var input = allInputs[j];
        if (input.type === "checkbox") {
          input.checked = changed[prop] === "true";
        } else {
          input.value = changed[prop];
        }
      }
    }
  };

  if (!customElements.get("com-custom-predictedmargin-styling")) {
    customElements.define("com-custom-predictedmargin-styling", PredictedMarginStyling);
  }

})();
