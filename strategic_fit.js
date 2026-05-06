(function () {
  var PI = Math.PI;

  function hexToRgb(hex) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  }

  function rgbToHex(r, g, b) {
    return "#" +
      ("0" + Math.round(r).toString(16)).slice(-2) +
      ("0" + Math.round(g).toString(16)).slice(-2) +
      ("0" + Math.round(b).toString(16)).slice(-2);
  }

  function interpolateColor(colorStart, colorEnd, t) {
    var c1 = hexToRgb(colorStart);
    var c2 = hexToRgb(colorEnd);
    return rgbToHex(
      c1[0] + (c2[0] - c1[0]) * t,
      c1[1] + (c2[1] - c1[1]) * t,
      c1[2] + (c2[2] - c1[2]) * t
    );
  }

  function getRating(score, low, high) {
    if (score < low)  { return "LOW"; }
    if (score < high) { return "MEDIUM"; }
    return "HIGH";
  }

  function buildHTML(score, opts) {
    var r         = 80;
    var cx        = 110;
    var cy        = 110;
    var total     = PI * r;
    var fill      = (score / 100) * total;
    var dashArray = fill.toFixed(2) + " " + (total + 20).toFixed(2);
    var arcColor  = interpolateColor(opts.arcColorStart, opts.arcColorEnd, score / 100);
    var rating    = getRating(score, opts.lowThr, opts.highThr);

    var ratingBg, ratingFg;
    if (rating === "LOW") {
      ratingBg = "#FDECEA"; ratingFg = "#D93025";
    } else if (rating === "MEDIUM") {
      ratingBg = "#FEF3CD"; ratingFg = "#C77700";
    } else {
      ratingBg = "#DFF5EA"; ratingFg = "#1E8E3E";
    }

    var t    = score / 100;
    var cosT = Math.cos(t * PI);
    var sinT = Math.sin(t * PI);
    var mx   = cx - r * cosT;
    var my   = cy - r * sinT;
    var t1x  = (mx + 5 * cosT).toFixed(1);
    var t1y  = (my + 5 * sinT).toFixed(1);
    var t2x  = (mx - 8 * cosT).toFixed(1);
    var t2y  = (my - 8 * sinT).toFixed(1);

    var html = "";
    html += "<style>";
    html += "* { box-sizing: border-box; font-family: '72', '72full', Arial, sans-serif; margin: 0; padding: 0; }";
    html += ".w { padding: 14px 16px; width: 100%; height: 100%; overflow: hidden; background: " + opts.bgColor + "; }";
    html += ".t { font-size: " + opts.titleFontSize + "px; font-weight: 600; color: " + opts.titleColor + "; margin-bottom: 4px; line-height: 1.4; }";
    html += ".bd { text-align: center; margin-top: 2px; margin-bottom: 6px; }";
    html += ".bg { border-radius: 12px; padding: 3px 14px; font-size: 11px; font-weight: 700; letter-spacing: 0.6px; display: inline-block; }";
    html += ".sm { font-size: 11px; color: #4A5568; line-height: 1.55; }";
    html += "</style>";
    html += "<div class='w'>";
    html += "<div class='t'>" + opts.widgetTitle + "</div>";
    html += "<svg viewBox='0 0 220 118' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-height:122px;display:block;'>";
    html += "<path d='M 30 110 A 80 80 0 0 1 190 110' fill='none' stroke='" + opts.trackColor + "' stroke-width='20' stroke-linecap='round'/>";
    html += "<path d='M 30 110 A 80 80 0 0 1 190 110' fill='none' stroke='" + arcColor + "' stroke-width='20' stroke-linecap='round' stroke-dasharray='" + dashArray + "'/>";
    html += "<line x1='" + t1x + "' y1='" + t1y + "' x2='" + t2x + "' y2='" + t2y + "' stroke='" + opts.tickColor + "' stroke-width='3' stroke-linecap='round'/>";
    html += "<text x='110' y='88' text-anchor='middle' font-family=\"'72',Arial,sans-serif\" font-size='" + opts.scoreFontSize + "' font-weight='700' fill='" + opts.scoreColor + "'>" + Math.round(score) + "</text>";
    html += "<text x='110' y='108' text-anchor='middle' font-family=\"'72',Arial,sans-serif\" font-size='12' fill='#8A9BBE'>/ 100</text>";
    html += "</svg>";
    html += "<div class='bd'>";
    html += "<span class='bg' style='background:" + ratingBg + ";color:" + ratingFg + ";'>" + rating + "</span>";
    html += "</div>";
    if (opts.summaryText) {
      html += "<div class='sm'><strong>Summary:</strong> " + opts.summaryText + "</div>";
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
    if (this._initialized) { return; }
    this._score         = 0;
    this._widgetTitle   = "Central KPI: Strategic Fit Score";
    this._summaryText   = "";
    this._lowThr        = 40;
    this._highThr       = 70;
    this._bgColor       = "#ffffff";
    this._trackColor    = "#E2E8F0";
    this._arcColorStart = "#2B7DE9";
    this._arcColorEnd   = "#25AE6E";
    this._tickColor     = "#111827";
    this._scoreColor    = "#1A3053";
    this._scoreFontSize = 44;
    this._titleColor    = "#1A3053";
    this._titleFontSize = 13;
    this._initialized   = true;
  };

  StrategicFitGauge.prototype.connectedCallback = function () {
    this._initDefaults();
    this._root = this.shadowRoot || this.attachShadow({ mode: "open" });
    this._render();
  };

  StrategicFitGauge.prototype._render = function () {
    if (!this._root) { return; }
    var html = buildHTML(this._score || 0, {
      widgetTitle:   this._widgetTitle,
      summaryText:   this._summaryText,
      lowThr:        this._lowThr,
      highThr:       this._highThr,
      bgColor:       this._bgColor,
      trackColor:    this._trackColor,
      arcColorStart: this._arcColorStart,
      arcColorEnd:   this._arcColorEnd,
      tickColor:     this._tickColor,
      scoreColor:    this._scoreColor,
      scoreFontSize: this._scoreFontSize,
      titleColor:    this._titleColor,
      titleFontSize: this._titleFontSize
    });
    this._root.innerHTML = "";
    this._root.innerHTML = html;
  };

  StrategicFitGauge.prototype.onCustomWidgetAfterUpdate = function (changed) {
    this._initDefaults();

    if ("widgetTitle"   in changed) this._widgetTitle   = changed.widgetTitle;
    if ("summaryText"   in changed) this._summaryText   = changed.summaryText;
    if ("lowThreshold"  in changed) this._lowThr        = parseFloat(changed.lowThreshold)  || 40;
    if ("highThreshold" in changed) this._highThr       = parseFloat(changed.highThreshold) || 70;
    if ("bgColor"       in changed) this._bgColor       = changed.bgColor;
    if ("trackColor"    in changed) this._trackColor    = changed.trackColor;
    if ("arcColorStart" in changed) this._arcColorStart = changed.arcColorStart;
    if ("arcColorEnd"   in changed) this._arcColorEnd   = changed.arcColorEnd;
    if ("tickColor"     in changed) this._tickColor     = changed.tickColor;
    if ("scoreColor"    in changed) this._scoreColor    = changed.scoreColor;
    if ("scoreFontSize" in changed) this._scoreFontSize = changed.scoreFontSize;
    if ("titleColor"    in changed) this._titleColor    = changed.titleColor;
    if ("titleFontSize" in changed) this._titleFontSize = changed.titleFontSize;

    if ("myDataBinding" in changed) {
      var bd = changed.myDataBinding;
      if (bd && bd.state === "success" && bd.data && bd.data.length > 0) {
        var row  = bd.data[0];
        var keys = Object.keys(row);
        for (var i = 0; i < keys.length; i++) {
          var cell = row[keys[i]];
          var val  = parseFloat(
            cell.rawValue !== undefined ? cell.rawValue :
            cell.raw      !== undefined ? cell.raw      : cell
          );
          if (!isNaN(val)) { this._score = val; break; }
        }
      }
    }

    this._render();
  };

  if (!customElements.get("com-custom-strategicfit")) {
    customElements.define("com-custom-strategicfit", StrategicFitGauge);
  }

})();
