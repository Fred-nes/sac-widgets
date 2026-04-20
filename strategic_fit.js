(function () {
  var PI = Math.PI;

  function getRating(score, low, high) {
    if (score < low) { return "LOW"; }
    if (score < high) { return "MEDIUM"; }
    return "HIGH";
  }

  function buildHTML(score, widgetTitle, summaryText, lowThr, highThr) {
    var r = 80;
    var cx = 110;
    var cy = 110;
    var total = PI * r;
    var fill = (score / 100) * total;
    var dashArray = fill.toFixed(2) + " " + (total + 20).toFixed(2);

    var rating = getRating(score, lowThr, highThr);
    var ratingBg, ratingFg;
    if (rating === "LOW") {
      ratingBg = "#FDECEA";
      ratingFg = "#D93025";
    } else if (rating === "MEDIUM") {
      ratingBg = "#FEF3CD";
      ratingFg = "#C77700";
    } else {
      ratingBg = "#DFF5EA";
      ratingFg = "#1E8E3E";
    }

    // Tick marker at score position along the arc
    // Arc: M 30 110 A 80 80 0 0 0 190 110  (upper semicircle, sweep=0)
    // Parametric: t in [0,1], angle = PI*(1-t) in standard coords
    // x = cx - r*cos(t*PI), y = cy - r*sin(t*PI)
    var t = score / 100;
    var cosT = Math.cos(t * PI);
    var sinT = Math.sin(t * PI);
    var mx = cx - r * cosT;
    var my = cy - r * sinT;
    // Inward: 5px toward center, Outward: 8px away from center
    var t1x = (mx + 5 * cosT).toFixed(1);
    var t1y = (my + 5 * sinT).toFixed(1);
    var t2x = (mx - 8 * cosT).toFixed(1);
    var t2y = (my - 8 * sinT).toFixed(1);

    var html = "";
    html += "<style>";
    html += "* { box-sizing: border-box; font-family: '72', '72full', Arial, sans-serif; margin: 0; padding: 0; }";
    html += ".w { padding: 14px 16px; width: 100%; height: 100%; overflow: hidden; background: #ffffff; }";
    html += ".t { font-size: 13px; font-weight: 600; color: #1A3053; margin-bottom: 4px; line-height: 1.4; }";
    html += ".bd { text-align: center; margin-top: 2px; margin-bottom: 6px; }";
    html += ".bg { border-radius: 12px; padding: 3px 14px; font-size: 11px; font-weight: 700; letter-spacing: 0.6px; display: inline-block; }";
    html += ".sm { font-size: 11px; color: #4A5568; line-height: 1.55; }";
    html += "</style>";
    html += "<div class='w'>";
    html += "<div class='t'>" + widgetTitle + "</div>";
    html += "<svg viewBox='0 0 220 118' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-height:122px;display:block;'>";
    html += "<defs>";
    html += "<linearGradient id='sfg1' gradientUnits='userSpaceOnUse' x1='30' y1='110' x2='190' y2='110'>";
    html += "<stop offset='0%' stop-color='#2B7DE9'/>";
    html += "<stop offset='45%' stop-color='#18A8A5'/>";
    html += "<stop offset='100%' stop-color='#25AE6E'/>";
    html += "</linearGradient>";
    html += "</defs>";
    // Background gray arc
    html += "<path d='M 30 110 A 80 80 0 0 0 190 110' fill='none' stroke='#E2E8F0' stroke-width='20' stroke-linecap='round'/>";
    // Colored fill arc
    html += "<path d='M 30 110 A 80 80 0 0 0 190 110' fill='none' stroke='url(#sfg1)' stroke-width='20' stroke-linecap='round' stroke-dasharray='" + dashArray + "'/>";
    // Tick mark at score position
    html += "<line x1='" + t1x + "' y1='" + t1y + "' x2='" + t2x + "' y2='" + t2y + "' stroke='#111827' stroke-width='3' stroke-linecap='round'/>";
    // Score number
    html += "<text x='110' y='88' text-anchor='middle' font-family=\"'72',Arial,sans-serif\" font-size='44' font-weight='700' fill='#1A3053'>" + Math.round(score) + "</text>";
    // /100 label
    html += "<text x='110' y='108' text-anchor='middle' font-family=\"'72',Arial,sans-serif\" font-size='12' fill='#8A9BBE'>/ 100</text>";
    html += "</svg>";
    // Rating badge
    html += "<div class='bd'>";
    html += "<span class='bg' style='background:" + ratingBg + ";color:" + ratingFg + ";'>" + rating + "</span>";
    html += "</div>";
    // Summary text
    if (summaryText) {
      html += "<div class='sm'><strong>Summary:</strong> " + summaryText + "</div>";
    }
    html += "</div>";
    return html;
  }

  function StrategicFitGauge() {
    var instance = HTMLElement.call(this);
    return instance;
  }

  StrategicFitGauge.prototype = Object.create(HTMLElement.prototype);
  StrategicFitGauge.prototype.constructor = StrategicFitGauge;

  StrategicFitGauge.prototype._initDefaults = function () {
    if (!this._initialized) {
      this._score = 0;
      this._widgetTitle = "Central KPI: Strategic Fit Score";
      this._summaryText = "";
      this._lowThr = 40;
      this._highThr = 70;
      this._initialized = true;
    }
  };

  StrategicFitGauge.prototype.connectedCallback = function () {
    this._initDefaults();
    this._root = this.shadowRoot || this.attachShadow({ mode: "open" });
    this._render();
  };

  StrategicFitGauge.prototype._render = function () {
    if (!this._root) { return; }
    this._root.innerHTML = buildHTML(
      this._score || 0,
      this._widgetTitle || "Strategic Fit Score",
      this._summaryText || "",
      this._lowThr !== undefined ? this._lowThr : 40,
      this._highThr !== undefined ? this._highThr : 70
    );
  };

  StrategicFitGauge.prototype.onCustomWidgetAfterUpdate = function (changed) {
    this._initDefaults();

    if (changed.widgetTitle !== undefined) { this._widgetTitle = changed.widgetTitle; }
    if (changed.summaryText !== undefined) { this._summaryText = changed.summaryText; }
    if (changed.lowThreshold !== undefined) { this._lowThr = parseFloat(changed.lowThreshold) || 40; }
    if (changed.highThreshold !== undefined) { this._highThr = parseFloat(changed.highThreshold) || 70; }

    if (changed.myDataBinding) {
      var bd = changed.myDataBinding;
      if (bd.data && bd.data.length > 0) {
        var row = bd.data[0];
        if (row["@MeasureDimension"]) {
          this._score = parseFloat(row["@MeasureDimension"].rawValue) || 0;
        }
      }
    }

    this._render();
  };

  customElements.define("com-custom-strategicfit", StrategicFitGauge);
})();
