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
    "<div class='row'><label>Titel</label><input type='text' data-prop='title' data-type='string' value='Solution Type'/></div>" +
    "<div class='row'><label>Quellenangabe</label><input type='text' data-prop='sourceLabel' data-type='string' value=''/></div>" +
    "<div class='row'><label>Quelle anzeigen</label><input type='checkbox' data-prop='showSource' data-type='boolean'/></div>" +
    "<div class='row'><label>Kein-Daten Text</label><input type='text' data-prop='noDataText' data-type='string' value='Keine Daten'/></div>" +
    "</div>" +

    "<div class='section'>" +
    "<div class='section-title'>Schrift</div>" +
    "<div class='row'><label>Titelfarbe</label><div class='color-row'><input type='color' data-prop='titleColor' data-type='color' value='#6a6d70'/><input type='text' class='color-hex' data-prop='titleColor' data-type='string' value='#6a6d70'/></div></div>" +
    "<div class='row'><label>Hauptwertfarbe</label><div class='color-row'><input type='color' data-prop='valueColor' data-type='color' value='#1a1a1a'/><input type='text' class='color-hex' data-prop='valueColor' data-type='string' value='#1a1a1a'/></div></div>" +
    "<div class='row'><label>Hauptwert Groesse</label><input type='number' data-prop='fontSize' data-type='number' value='22'/></div>" +
    "<div class='row'><label>Unterwertfarbe</label><div class='color-row'><input type='color' data-prop='subValueColor' data-type='color' value='#4a4a4a'/><input type='text' class='color-hex' data-prop='subValueColor' data-type='string' value='#4a4a4a'/></div></div>" +
    "<div class='row'><label>Quellenfarbe</label><div class='color-row'><input type='color' data-prop='sourceColor' data-type='color' value='#9a9a9a'/><input type='text' class='color-hex' data-prop='sourceColor' data-type='string' value='#9a9a9a'/></div></div>" +
    "</div>" +

    "<div class='section'>" +
    "<div class='section-title'>Badge - High Complexity</div>" +
    "<div class='row'><label>Hintergrund</label><div class='color-row'><input type='color' data-prop='highBg' data-type='color' value='#FDECEA'/><input type='text' class='color-hex' data-prop='highBg' data-type='string' value='#FDECEA'/></div></div>" +
    "<div class='row'><label>Textfarbe</label><div class='color-row'><input type='color' data-prop='highColor' data-type='color' value='#D93025'/><input type='text' class='color-hex' data-prop='highColor' data-type='string' value='#D93025'/></div></div>" +
    "</div>" +

    "<div class='section'>" +
    "<div class='section-title'>Badge - Low Complexity</div>" +
    "<div class='row'><label>Hintergrund</label><div class='color-row'><input type='color' data-prop='lowBg' data-type='color' value='#DFF5EA'/><input type='text' class='color-hex' data-prop='lowBg' data-type='string' value='#DFF5EA'/></div></div>" +
    "<div class='row'><label>Textfarbe</label><div class='color-row'><input type='color' data-prop='lowColor' data-type='color' value='#1E8E3E'/><input type='text' class='color-hex' data-prop='lowColor' data-type='string' value='#1E8E3E'/></div></div>" +
    "</div>" +

    "<div class='section'>" +
    "<div class='section-title'>Badge - Standard</div>" +
    "<div class='row'><label>Hintergrund</label><div class='color-row'><input type='color' data-prop='defaultBadgeBg' data-type='color' value='#E6F1FB'/><input type='text' class='color-hex' data-prop='defaultBadgeBg' data-type='string' value='#E6F1FB'/></div></div>" +
    "<div class='row'><label>Textfarbe</label><div class='color-row'><input type='color' data-prop='defaultBadgeColor' data-type='color' value='#185FA5'/><input type='text' class='color-hex' data-prop='defaultBadgeColor' data-type='string' value='#185FA5'/></div></div>" +
    "</div>" +

    "<div class='section'>" +
    "<div class='section-title'>Karte</div>" +
    "<div class='row'><label>Hintergrund</label><div class='color-row'><input type='color' data-prop='bgColor' data-type='color' value='#ffffff'/><input type='text' class='color-hex' data-prop='bgColor' data-type='string' value='#ffffff'/></div></div>" +
    "<div class='row'><label>Rahmen anzeigen</label><input type='checkbox' data-prop='showBorder' data-type='boolean' checked/></div>" +
    "<div class='row'><label>Rahmenfarbe</label><div class='color-row'><input type='color' data-prop='borderColor' data-type='color' value='#e5e5e5'/><input type='text' class='color-hex' data-prop='borderColor' data-type='string' value='#e5e5e5'/></div></div>" +
    "<div class='row'><label>Eckenradius (px)</label><input type='number' data-prop='borderRadius' data-type='number' value='12'/></div>" +
    "</div>";

  function SolutionTypeStyling() {
    var instance = HTMLElement.call(this);
    return instance;
  }

  SolutionTypeStyling.prototype = Object.create(HTMLElement.prototype);
  SolutionTypeStyling.prototype.constructor = SolutionTypeStyling;

  SolutionTypeStyling.prototype.connectedCallback = function () {
    if (this._init) return;
    this._init = true;
    this._root = this.attachShadow({ mode: "open" });
    this._root.appendChild(tmpl.content.cloneNode(true));
    this._bindEvents();
  };

  SolutionTypeStyling.prototype._bindEvents = function () {
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
            bubbles: true
          }));
        });
      })(inputs[i]);
    }
  };

  SolutionTypeStyling.prototype.onCustomWidgetAfterUpdate = function (changed) {
    if (!this._root) return;
    var props = ["title", "sourceLabel", "showSource", "noDataText",
                 "titleColor", "valueColor", "fontSize", "subValueColor", "sourceColor",
                 "highBg", "highColor", "lowBg", "lowColor",
                 "defaultBadgeBg", "defaultBadgeColor",
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

  if (!customElements.get("com-custom-solutiontype-styling")) {
    customElements.define("com-custom-solutiontype-styling", SolutionTypeStyling);
  }

})();
