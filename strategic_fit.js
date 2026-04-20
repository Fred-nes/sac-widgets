(function () {
  var PI = Math.PI;

  var tmpl = document.createElement("template");
  tmpl.innerHTML =
    "<style>" +
    ":host{display:block;width:100%;height:100%;box-sizing:border-box;}" +
    ".w{padding:14px 16px;width:100%;height:100%;overflow:hidden;background:#ffffff;}" +
    ".t{font-size:13px;font-weight:600;color:#1A3053;margin-bottom:4px;line-height:1.4;}" +
    ".bd{text-align:center;margin-top:2px;margin-bottom:6px;}" +
    ".bg{border-radius:12px;padding:3px 14px;font-size:11px;font-weight:700;letter-spacing:0.6px;display:inline-block;}" +
    ".sm{font-size:11px;color:#4A5568;line-height:1.55;}" +
    "</style>" +
    "<div class='w'>" +
    "<div class='t' id='title'>Central KPI: Strategic Fit Score</div>" +
    "<svg id='svg' viewBox='0 0 220 118' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-height:122px;display:block;'>" +
    "<defs>" +
    "<linearGradient id='sfg1' gradientUnits='userSpaceOnUse' x1='30' y1='110' x2='190' y2='110'>" +
    "<stop offset='0%' stop-color='#2B7DE9'/>" +
    "<stop offset='45%' stop-color='#18A8A5'/>" +
    "<stop offset='100%' stop-color='#25AE6E'/>" +
    "</linearGradient>" +
    "</defs>" +
    "<path d='M 30 110 A 80 80 0 0 0 190 110' fill='none' stroke='#E2E8F0' stroke-width='20' stroke-linecap='round'/>" +
    "<path id='arc' d='M 30 110 A 80 80 0 0 0 190 110' fill='none' stroke='url(#sfg1)' stroke-width='20' stroke-linecap='round' stroke-dasharray='0 999'/>" +
    "<line id='tick' x1='110' y1='30' x2='110' y2='18' stroke='#111827' stroke-width='3' stroke-linecap='round'/>" +
    "<text id='score' x='110' y='88' text-anchor='middle' font-size='44' font-weight='700' fill='#1A3053'>0</text>" +
    "<text x='110' y='108' text-anchor='middle' font-size='12' fill='#8A9BBE'>/ 100</text>" +
    "</svg>" +
    "<div class='bd'><span class='bg' id='badge'>–</span></div>" +
    "<div class='sm' id='summary'></div>" +
    "</div>";

  function StrategicFitGauge() {
    var instance = HTMLElement.call(this);
    return instance;
  }

  StrategicFitGauge.prototype = Object.create(HTMLElement.prototype);
  StrategicFitGauge.prototype.constructor = StrategicFitGauge;

  StrategicFitGauge.prototype.connectedCallback = function () {
    if (this._init) return;
    this._init = true;
    this._root = this.attachShadow({ mode: "open" });
    this._root.appendChild(tmpl.content.cloneNode(true));

    this._score      = 0;
    this._title      = "Central KPI: Strategic Fit Score";
    this._summary    = "";
    this._lowThr     = 40;
    this._highThr    = 70;

    this._render();
  };

  StrategicFitGauge.prototype.onCustomWidgetBeforeUpdate = function (changed) {};

  StrategicFitGauge.prototype.onCustomWidgetAfterUpdate = function (changed) {
    if (!this._root) return;
    if (changed.widgetTitle   !== undefined) { this._title   = changed.widgetTitle; }
    if (changed.summaryText   !== undefined) { this._summary = changed.summaryText; }
    if (changed.lowThreshold  !== undefined) { this._lowThr  = parseFloat(changed.lowThreshold)  || 40; }
    if (changed.highThreshold !== undefined) { this._highThr = parseFloat(changed.highThreshold) || 70; }

    if (changed.myDataBinding) {
      var bd = changed.myDataBinding;
      if (bd.state !== "loading" && bd.data && bd.data.length > 0) {
        var row  = bd.data[0];
        var cell = row["@MeasureDimension"];
        if (cell && cell.rawValue !== undefined) {
          this._score = parseFloat(cell.rawValue) || 0;
        }
      }
    }

    this._render();
  };

  StrategicFitGauge.prototype._render = function () {
    if (!this._root) return;

    var score   = this._score;
    var r       = 80;
    var cx      = 110;
    var cy      = 110;
    var total   = PI * r;
    var fill    = (score / 100) * total;
    var dashArr = fill.toFixed(2) + " " + (total + 20).toFixed(2);

    var t    = score / 100;
    var cosT = Math.cos(t * PI);
    var sinT = Math.sin(t * PI);
    var mx   = cx - r * cosT;
    var my   = cy - r * sinT;
    var t1x  = (mx + 5 * cosT).toFixed(1);
    var t1y  = (my + 5 * sinT).toFixed(1);
    var t2x  = (mx - 8 * cosT).toFixed(1);
    var t2y  = (my - 8 * sinT).toFixed(1);

    var rating, ratingBg, ratingFg;
    if (score < this._lowThr) {
      rating = "LOW"; ratingBg = "#FDECEA"; ratingFg = "#D93025";
    } else if (score < this._highThr) {
      rating = "MEDIUM"; ratingBg = "#FEF3CD"; ratingFg = "#C77700";
    } else {
      rating = "HIGH"; ratingBg = "#DFF5EA"; ratingFg = "#1E8E3E";
    }

    this._root.getElementById("title").textContent                = this._title;
    this._root.getElementById("score").textContent                = Math.round(score);
    this._root.getElementById("arc").setAttribute("stroke-dasharray", dashArr);
    this._root.getElementById("tick").setAttribute("x1", t1x);
    this._root.getElementById("tick").setAttribute("y1", t1y);
    this._root.getElementById("tick").setAttribute("x2", t2x);
    this._root.getElementById("tick").setAttribute("y2", t2y);
    this._root.getElementById("badge").textContent                = rating;
    this._root.getElementById("badge").style.background           = ratingBg;
    this._root.getElementById("badge").style.color                = ratingFg;
    this._root.getElementById("summary").textContent              = this._summary;
  };

  customElements.define("com-custom-strategicfit", StrategicFitGauge);
})();
