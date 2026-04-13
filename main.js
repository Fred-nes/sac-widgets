/**
 * SAC Custom Widget – Customer Win Rate Donut
 * Tag: com-custom-winrate-donut
 *
 * Data Binding:
 *   myDataBinding → feeds: measures (1 Measure, 0-100), dimensions (optional)
 *   SAC liest den ersten Measure-Wert aus und setzt ihn automatisch als winRate.
 *
 * Properties (auch manuell im Builder setzbar):
 *   winRate     {float}   0–100, default 38
 *   label       {string}  Titeltext
 *   sourceLabel {string}  Quellenangabe
 *   color       {string}  Hex-Farbe für den gefüllten Bogen
 *
 * Method:
 *   setWinRate(value) – Wert per Script setzen
 *
 * Event:
 *   onClick – beim Klick auf das Widget
 *
 * Fixes vs. v1.0.0:
 *   [1] ResultSet: getData() statt .data[], kompatibel mit SAC Widget SDK 2.x
 *   [2] Measure-Erkennung: Metadata-basiert, Dimension-Keys werden explizit ausgeschlossen
 *   [3] Decimal-Heuristik entfernt — Modell muss 0-100 liefern (dokumentiert)
 *   [4] onCustomWidgetResize: Donut und Schriftgröße passen sich an Widget-Größe an
 */

(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      :host {
        display: block;
        font-family: "72", "72full", Arial, Helvetica, sans-serif;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
      }
      .card {
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 12px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        cursor: pointer;
        transition: box-shadow 0.15s ease;
      }
      .card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
      .title {
        font-size: 11px;
        font-weight: 600;
        color: #6a6d70;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .body {
        display: flex;
        align-items: center;
        gap: 14px;
        width: 100%;
      }
      /* [4] Font-Größe via CSS-Variable, gesetzt durch onCustomWidgetResize */
      .big-num {
        font-size: var(--wr-num-size, 28px);
        font-weight: 700;
        color: #1a1a1a;
        line-height: 1;
        min-width: 48px;
        transition: font-size 0.2s ease;
      }
      /* [4] Donut-Größe via CSS-Variable, gesetzt durch onCustomWidgetResize */
      .donut-wrap {
        position: relative;
        width: var(--wr-donut-size, 56px);
        height: var(--wr-donut-size, 56px);
        flex-shrink: 0;
        transition: width 0.2s ease, height 0.2s ease;
      }
      .donut-wrap svg { width: 100%; height: 100%; }
      .arc-bg { fill: none; stroke: #e8e8e8; stroke-width: 9; }
      .arc-fill {
        fill: none;
        stroke-width: 9;
        stroke-linecap: round;
        transform-origin: center;
        transform: rotate(-90deg);
        transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .source {
        font-size: 10px;
        color: #9a9a9a;
        margin-top: auto;
      }
      .no-data {
        font-size: 11px;
        color: #b0b0b0;
        font-style: italic;
        margin-top: 4px;
      }
    </style>

    <div class="card" id="card">
      <div class="title">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M8 2l1.5 3.2 3.5.5-2.5 2.4.6 3.5L8 10.1l-3.1 1.5.6-3.5L3 5.7l3.5-.5z"
            stroke="#6a6d70" stroke-width="1.3" stroke-linejoin="round"/>
        </svg>
        <span id="title-text">Customer Win Rate</span>
      </div>
      <div class="body">
        <div class="big-num" id="num-text">38%</div>
        <div class="donut-wrap">
          <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
            <circle class="arc-bg" cx="28" cy="28" r="21"/>
            <circle class="arc-fill" id="arc" cx="28" cy="28" r="21"
              stroke="#185FA5"
              stroke-dasharray="131.95"
              stroke-dashoffset="81.81"/>
          </svg>
        </div>
      </div>
      <div class="source" id="source-text">SAP Sales Cloud</div>
      <div class="no-data" id="no-data-msg" style="display:none;">Kein Datensatz verknüpft</div>
    </div>
  `;

  class WinRateDonut extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      this._winRate = 38;
      this._label = "Customer Win Rate";
      this._sourceLabel = "SAP Sales Cloud";
      this._color = "#185FA5";

      this._shadowRoot.getElementById("card").addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("onClick", { bubbles: true }));
      });
    }

    /* ─── SAC Lifecycle ─── */

    onCustomWidgetBeforeUpdate(oChangedProperties) {}

    onCustomWidgetAfterUpdate(oChangedProperties) {
      if ("winRate"     in oChangedProperties) this.winRate     = oChangedProperties.winRate;
      if ("label"       in oChangedProperties) this.label       = oChangedProperties.label;
      if ("sourceLabel" in oChangedProperties) this.sourceLabel = oChangedProperties.sourceLabel;
      if ("color"       in oChangedProperties) this.color       = oChangedProperties.color;
    }

    /**
     * [4] SAC ruft diese Methode bei jeder Größenänderung im Builder auf.
     * Donut-Größe und Schrift skalieren stufenlos mit der Widget-Breite.
     */
    onCustomWidgetResize(width, height) {
      const card = this._shadowRoot.getElementById("card");
      // Donut: 20–80px, ca. 25% der Widget-Breite
      const donutPx = Math.min(80, Math.max(20, Math.round(width * 0.25)));
      // Zahl: 16–32px, ca. 12% der Widget-Breite
      const numPx   = Math.min(32, Math.max(16, Math.round(width * 0.12)));
      card.style.setProperty("--wr-donut-size", `${donutPx}px`);
      card.style.setProperty("--wr-num-size",   `${numPx}px`);
    }

    /**
     * [1] + [2] + [3]: Data Binding lesen
     *
     * [1] getData() statt .data[]:
     *     SAC SDK 2.x liefert Zeilen über getData(), nicht als .data-Property.
     *     Fallback auf .data für ältere SDK-Versionen vorhanden.
     *
     * [2] Measure-Key via Metadata:
     *     getMetadata() liefert welche Feed-IDs Measures sind.
     *     Dimension-Keys werden explizit ausgeschlossen, damit numerische Dim-Werte
     *     (z.B. Jahr "2024", Org-ID "1010") nicht fälschlich als Win Rate gelesen werden.
     *     Fallback: erster nicht-Dimension-Key mit numerischem Wert.
     *
     * [3] Decimal-Heuristik entfernt:
     *     Der Wert wird 1:1 übernommen. Das Analytics Model muss den Measure
     *     als 0–100 konfigurieren, nicht als 0–1.
     *     Grund: 1% (0.01 dezimal) und 100% (1.0 dezimal) sind mit einer
     *     einfachen Schwelle (value <= 1) nicht unterscheidbar.
     */
    onCustomWidgetDataChanged() {
    console.log("WinRateDonut: onCustomWidgetDataChanged aufgerufen");
    try {
    const binding = this.dataBindings?.getDataBinding("myDataBinding");
    console.log("WinRateDonut: binding =", binding);

    const resultSet = binding?.getResultSet();
    console.log("WinRateDonut: resultSet =", resultSet);
    console.log("WinRateDonut: resultSet keys =", resultSet ? Object.keys(resultSet)

        // [1] Zeilenarray holen
        let rows;
        if (typeof resultSet.getData === "function") {
          rows = resultSet.getData();
        } else if (Array.isArray(resultSet.data)) {
          rows = resultSet.data;
        }

        if (!rows || rows.length === 0) { this._showNoData(true); return; }

        // [2a] Dimension- und Measure-IDs aus Metadata lesen
        let dimensionIds = new Set();
        let measureIds   = [];
        if (typeof resultSet.getMetadata === "function") {
          const meta = resultSet.getMetadata();
          const dimFeed = meta?.feeds?.dimensions;
          if (Array.isArray(dimFeed)) {
            dimFeed.forEach(d => dimensionIds.add(typeof d === "string" ? d : (d?.id ?? "")));
          }
          const mFeed = meta?.feeds?.measures;
          if (Array.isArray(mFeed)) {
            measureIds = mFeed.map(m => typeof m === "string" ? m : (m?.id ?? ""));
          }
        }

        const firstRow = rows[0];
        let value = null;

        // [2b] Bekannte Measure-IDs zuerst probieren
        for (const id of measureIds) {
          const cell = firstRow[id] ?? firstRow[id.toLowerCase()];
          if (cell === undefined || cell === null) continue;
          // SAC liefert cells als Objekt {rawValue, formattedValue} oder direkt als Zahl
          const raw = (typeof cell === "object") ? (cell.rawValue ?? cell.raw ?? cell.value) : cell;
          const num = parseFloat(raw);
          if (!isNaN(num)) { value = num; break; }
        }

        // [2c] Fallback: erster Key der kein Dimension-Key ist
        if (value === null) {
          for (const k of Object.keys(firstRow)) {
            if (dimensionIds.has(k)) continue;
            const cell = firstRow[k];
            const raw  = (typeof cell === "object" && cell !== null)
              ? (cell.rawValue ?? cell.raw ?? cell.value)
              : cell;
            const num  = parseFloat(raw);
            if (!isNaN(num)) { value = num; break; }
          }
        }

        if (value !== null) {
          this._showNoData(false);
          this.winRate = value; // [3] kein * 100 — Model liefert 0-100
        } else {
          this._showNoData(true);
        }
      } catch (e) {
        console.error("WinRateDonut: Fehler beim Lesen des Data Bindings", e);
        this._showNoData(true); // Fehler sichtbar machen, nicht lautlos schlucken
      }
    }

    /* ─── Properties ─── */

    get winRate() { return this._winRate; }
    set winRate(val) {
      const v = Math.min(100, Math.max(0, parseFloat(val) || 0));
      this._winRate = v;
      this._shadowRoot.getElementById("num-text").textContent = Math.round(v) + "%";
      this._updateArc(v);
    }

    get label() { return this._label; }
    set label(val) {
      this._label = val;
      this._shadowRoot.getElementById("title-text").textContent = val;
    }

    get sourceLabel() { return this._sourceLabel; }
    set sourceLabel(val) {
      this._sourceLabel = val;
      this._shadowRoot.getElementById("source-text").textContent = val;
    }

    get color() { return this._color; }
    set color(val) {
      this._color = val;
      this._shadowRoot.getElementById("arc").style.stroke = val;
    }

    /* ─── Method ─── */

    setWinRate(value) { this.winRate = value; }

    /* ─── Intern ─── */

    _updateArc(percent) {
      const arc = this._shadowRoot.getElementById("arc");
      const circumference = 2 * Math.PI * 21; // r=21 → ~131.95
      const offset = circumference * (1 - percent / 100);
      arc.style.strokeDasharray  = circumference.toFixed(2);
      arc.style.strokeDashoffset = offset.toFixed(2);
    }

    _showNoData(show) {
      this._shadowRoot.getElementById("no-data-msg").style.display = show ? "block" : "none";
      this._shadowRoot.getElementById("num-text").style.opacity    = show ? "0.3" : "1";
    }
  }

  customElements.define("com-custom-winrate-donut", WinRateDonut);
})();
