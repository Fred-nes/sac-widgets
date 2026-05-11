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
    "input[type=color]{width:36px;height:24px;padding:0;border:1px solid #ccc;border-radius:3px;cursor:pointer;}" +
    ".color-row{display:flex;align-items:center;gap:6px;}" +
    ".color-hex{width:72px;padding:3px 6px;border:1px solid #ccc;border-radius:3px;font-size:12px;}" +
    "</style>" +

    "<div class='section'>" +
    "<div class='section-title'>Allgemein</div>" +
    "<div class='row'><label>Titel</label><input type='text' data-prop='title' data-type='string' value='Smart Decision Based Quoting'/></div>" +
    "<div class='row'><label>Waehrungssymbol</label><input type='text' data-prop='currencySymbol' data-type='string' value='\u20AC'/></div>" +
    "</div>" +

    "<div class='section'>" +
    "<div class='section-title'>Karte</div>" +
    "<div class='row'><label>Hintergrund</label><div class='color-row'><input type='color' data-prop='bgColor' data-type='color' value='#f5f6f7'/><input type='text' class='color-hex' data-prop='bgColor' data-type='string' value='#f5f6f7'/></div></div>" +
    "</div>";

  function SmartQuotingInfoStyling() {
    var instance = HTMLElement.call(this);
    return instance;
  }

  SmartQuotingInfoStyling.prototype = Object.create(HTMLElement.prototype);
  SmartQuotingInfoStyling.prototype.constructor = SmartQuotingInfoStyling;

  SmartQuotingInfoStyling.prototype.connectedCallback = function () {
    if (this._init) return;
    this._init = true;
    this._root = this.attachShadow({ mode: "open" });
    this._root.appendChild(tmpl.content.cloneNode(true));
    this._bindEvents();
  };

  SmartQuotingInfoStyling.prototype._bindEvents = function () {
    var self = this;
    var inputs = this._root.querySelectorAll("input");
    for (var i = 0; i < inputs.length; i++) {
      (function (input) {
        var eventType = input.type === "color" ? "input" : "change";
        input.addEventListener(eventType, function () {
          var prop  = input.getAttribute("data-prop");
          var type  = input.getAttribute("data-type");
          var value;
          if (type === "color") {
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

  SmartQuotingInfoStyling.prototype.onCustomWidgetAfterUpdate = function (changed) {
    if (!this._root) return;
    var props = ["title", "currencySymbol", "bgColor"];
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      if (!(prop in changed)) continue;
      var allInputs = this._root.querySelectorAll("[data-prop='" + prop + "']");
      for (var j = 0; j < allInputs.length; j++) {
        allInputs[j].value = changed[prop];
      }
    }
  };

  if (!customElements.get("com-custom-smartquotinginfo-styling")) {
    customElements.define("com-custom-smartquotinginfo-styling", SmartQuotingInfoStyling);
  }

})();
