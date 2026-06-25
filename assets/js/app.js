(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const elements = {
    root: document.documentElement,
    themeToggle: $("#themeToggle"),
    form: $("#barcodeForm"),
    format: $("#format"),
    formatHelp: $("#formatHelp"),
    value: $("#barcodeValue"),
    validation: $("#validationMessage"),
    statusPill: $("#statusPill"),
    barcode: $("#barcode"),
    heroBarcode: $("#heroBarcode"),
    previewStage: $("#previewStage"),
    sampleButton: $("#sampleButton"),
    metaFormat: $("#metaFormat"),
    metaValue: $("#metaValue"),
    downloadSvg: $("#downloadSvg"),
    downloadPng: $("#downloadPng"),
    copySvg: $("#copySvg"),
    printBarcode: $("#printBarcode"),
    batchInput: $("#batchInput"),
    generateBatch: $("#generateBatch"),
    clearBatch: $("#clearBatch"),
    controls: {
      barWidth: $("#barWidth"),
      barHeight: $("#barHeight"),
      barMargin: $("#barMargin"),
      fontSize: $("#fontSize"),
      lineColor: $("#lineColor"),
      backgroundColor: $("#backgroundColor"),
      displayValue: $("#displayValue")
    }
  };

  const EAN_L = {
    0: "0001101", 1: "0011001", 2: "0010011", 3: "0111101", 4: "0100011",
    5: "0110001", 6: "0101111", 7: "0111011", 8: "0110111", 9: "0001011"
  };
  const EAN_G = {
    0: "0100111", 1: "0110011", 2: "0011011", 3: "0100001", 4: "0011101",
    5: "0111001", 6: "0000101", 7: "0010001", 8: "0001001", 9: "0010111"
  };
  const EAN_R = {
    0: "1110010", 1: "1100110", 2: "1101100", 3: "1000010", 4: "1011100",
    5: "1001110", 6: "1010000", 7: "1000100", 8: "1001000", 9: "1110100"
  };
  const EAN13_PARITY = {
    0: "LLLLLL", 1: "LLGLGG", 2: "LLGGLG", 3: "LLGGGL", 4: "LGLLGG",
    5: "LGGLLG", 6: "LGGGLL", 7: "LGLGLG", 8: "LGLGGL", 9: "LGGLGL"
  };

  const ITF_PATTERNS = {
    0: "nnwwn", 1: "wnnnw", 2: "nwnnw", 3: "wwnnn", 4: "nnwnw",
    5: "wnwnn", 6: "nwwnn", 7: "nnnww", 8: "wnnwn", 9: "nwnwn"
  };

  const CODE39 = {
    "0": "nnnwwnwnn", "1": "wnnwnnnnw", "2": "nnwwnnnnw", "3": "wnwwnnnnn", "4": "nnnwwnnnw",
    "5": "wnnwwnnnn", "6": "nnwwwnnnn", "7": "nnnwnnwnw", "8": "wnnwnnwnn", "9": "nnwwnnwnn",
    "A": "wnnnnwnnw", "B": "nnwnnwnnw", "C": "wnwnnwnnn", "D": "nnnnwwnnw", "E": "wnnnwwnnn",
    "F": "nnwnwwnnn", "G": "nnnnnwwnw", "H": "wnnnnwwnn", "I": "nnwnnwwnn", "J": "nnnnwwwnn",
    "K": "wnnnnnnww", "L": "nnwnnnnww", "M": "wnwnnnnwn", "N": "nnnnwnnww", "O": "wnnnwnnwn",
    "P": "nnwnwnnwn", "Q": "nnnnnnwww", "R": "wnnnnnwwn", "S": "nnwnnnwwn", "T": "nnnnwnwwn",
    "U": "wwnnnnnnw", "V": "nwwnnnnnw", "W": "wwwnnnnnn", "X": "nwnnwnnnw", "Y": "wwnnwnnnn",
    "Z": "nwwnwnnnn", "-": "nwnnnnwnw", ".": "wwnnnnwnn", " ": "nwwnnnwnn", "$": "nwnwnwnnn",
    "/": "nwnwnnnwn", "+": "nwnnnwnwn", "%": "nnnwnwnwn", "*": "nwnnwnwnn"
  };

  const CODE128_PATTERNS = [
    "212222","222122","222221","121223","121322","131222","122213","122312","132212","221213",
    "221312","231212","112232","122132","122231","113222","123122","123221","223211","221132",
    "221231","213212","223112","312131","311222","321122","321221","312212","322112","322211",
    "212123","212321","232121","111323","131123","131321","112313","132113","132311","211313",
    "231113","231311","112133","112331","132131","113123","113321","133121","313121","211331",
    "231131","213113","213311","213131","311123","311321","331121","312113","312311","332111",
    "314111","221411","431111","111224","111422","121124","121421","141122","141221","112214",
    "112412","122114","122411","142112","142211","241211","221114","413111","241112","134111",
    "111242","121142","121241","114212","124112","124211","411212","421112","421211","212141",
    "214121","412121","111143","111341","131141","114113","114311","411113","411311","113141",
    "114131","311141","411131","211412","211214","211232","2331112"
  ];

  const formatInfo = {
    EAN13: {
      label: "EAN-13",
      help: "ใส่เลข 12 หลักเพื่อให้ระบบเติม check digit หรือใส่ 13 หลักเพื่อตรวจสอบความถูกต้อง",
      sample: "885123456789",
      normalize: value => normalizeGtin(value, 12, "EAN-13"),
      encode: value => encodeEan13(value)
    },
    EAN8: {
      label: "EAN-8",
      help: "ใส่เลข 7 หลักเพื่อให้ระบบเติม check digit หรือใส่ 8 หลักเพื่อตรวจสอบความถูกต้อง",
      sample: "1234567",
      normalize: value => normalizeGtin(value, 7, "EAN-8"),
      encode: value => encodeEan8(value)
    },
    UPC: {
      label: "UPC-A",
      help: "ใส่เลข 11 หลักเพื่อให้ระบบเติม check digit หรือใส่ 12 หลักเพื่อตรวจสอบความถูกต้อง",
      sample: "04210000526",
      normalize: value => normalizeGtin(value, 11, "UPC-A"),
      encode: value => encodeEan13(`0${value}`)
    },
    CODE128: {
      label: "CODE128",
      help: "รองรับตัวอักษร ตัวเลข และสัญลักษณ์ ASCII เหมาะกับ SKU ภายในร้านหรือคลังสินค้า",
      sample: "SKU-TH-0001",
      normalize: value => {
        const trimmed = String(value || "").trim();
        if (!trimmed) throw new Error("กรุณาใส่รหัสสินค้า");
        if (/[^\x20-\x7E]/.test(trimmed)) throw new Error("CODE128 รองรับข้อความ ASCII เท่านั้น เช่น SKU-TH-0001");
        return { value: trimmed, message: "พร้อมสร้าง CODE128" };
      },
      encode: value => encodeCode128B(value)
    },
    CODE39: {
      label: "CODE39",
      help: "รองรับ A-Z, 0-9, เว้นวรรค และสัญลักษณ์ - . $ / + % ระบบจะแปลงเป็นตัวพิมพ์ใหญ่",
      sample: "ITEM-2026",
      normalize: value => {
        const normalized = String(value || "").trim().toUpperCase();
        if (!normalized) throw new Error("กรุณาใส่รหัสสินค้า");
        if (!/^[0-9A-Z .\-$\/+%]+$/.test(normalized)) throw new Error("CODE39 รองรับเฉพาะ A-Z, 0-9, เว้นวรรค และ - . $ / + %");
        return { value: normalized, message: "พร้อมสร้าง CODE39" };
      },
      encode: value => encodeCode39(value)
    },
    ITF14: {
      label: "ITF-14",
      help: "ใส่เลข 13 หลักเพื่อให้ระบบเติม check digit หรือใส่ 14 หลักเพื่อตรวจสอบความถูกต้อง",
      sample: "1001234567890",
      normalize: value => normalizeGtin(value, 13, "ITF-14"),
      encode: value => encodeItf(value, true)
    },
    ITF: {
      label: "ITF",
      help: "Interleaved 2 of 5 ต้องเป็นตัวเลขจำนวนหลักคู่ เช่น 12345678",
      sample: "12345678",
      normalize: value => {
        const digits = onlyDigits(value);
        if (!digits) throw new Error("กรุณาใส่ตัวเลข");
        if (digits.length % 2 !== 0) throw new Error("ITF ต้องมีจำนวนหลักเป็นเลขคู่");
        return { value: digits, message: "พร้อมสร้าง ITF" };
      },
      encode: value => encodeItf(value, false)
    }
  };

  function onlyDigits(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function computeGtinCheckDigit(valueWithoutCheckDigit) {
    const digits = onlyDigits(valueWithoutCheckDigit);
    let sum = 0;
    let weight = 3;
    for (let index = digits.length - 1; index >= 0; index -= 1) {
      sum += Number(digits[index]) * weight;
      weight = weight === 3 ? 1 : 3;
    }
    return String((10 - (sum % 10)) % 10);
  }

  function normalizeGtin(rawValue, baseLength, label) {
    const digits = onlyDigits(rawValue);
    const fullLength = baseLength + 1;
    if (![baseLength, fullLength].includes(digits.length)) {
      throw new Error(`${label} ต้องเป็นตัวเลข ${baseLength} หรือ ${fullLength} หลัก`);
    }
    const body = digits.slice(0, baseLength);
    const checkDigit = computeGtinCheckDigit(body);
    if (digits.length === baseLength) {
      return { value: body + checkDigit, message: `เติม check digit ให้แล้ว: ${checkDigit}` };
    }
    if (digits.at(-1) !== checkDigit) throw new Error(`check digit ไม่ถูกต้อง ควรเป็น ${checkDigit}`);
    return { value: digits, message: "check digit ถูกต้อง" };
  }

  function bitsToRuns(bits) {
    const modules = [];
    let current = bits[0];
    let width = 0;
    for (const bit of bits) {
      if (bit === current) width += 1;
      else {
        modules.push({ bar: current === "1", width });
        current = bit;
        width = 1;
      }
    }
    modules.push({ bar: current === "1", width });
    return modules;
  }

  function encodeEan13(digits) {
    const first = digits[0];
    const parity = EAN13_PARITY[first];
    let bits = "101";
    for (let i = 1; i <= 6; i += 1) {
      const digit = digits[i];
      bits += parity[i - 1] === "L" ? EAN_L[digit] : EAN_G[digit];
    }
    bits += "01010";
    for (let i = 7; i <= 12; i += 1) bits += EAN_R[digits[i]];
    bits += "101";
    return { modules: bitsToRuns(bits), text: digits, quietModules: 10 };
  }

  function encodeEan8(digits) {
    let bits = "101";
    for (let i = 0; i < 4; i += 1) bits += EAN_L[digits[i]];
    bits += "01010";
    for (let i = 4; i < 8; i += 1) bits += EAN_R[digits[i]];
    bits += "101";
    return { modules: bitsToRuns(bits), text: digits, quietModules: 8 };
  }

  function encodeItf(digits, bearerBox = false) {
    const modules = [
      { bar: true, width: 1 }, { bar: false, width: 1 }, { bar: true, width: 1 }, { bar: false, width: 1 }
    ];
    for (let i = 0; i < digits.length; i += 2) {
      const bars = ITF_PATTERNS[digits[i]];
      const spaces = ITF_PATTERNS[digits[i + 1]];
      for (let j = 0; j < 5; j += 1) {
        modules.push({ bar: true, width: bars[j] === "w" ? 3 : 1 });
        modules.push({ bar: false, width: spaces[j] === "w" ? 3 : 1 });
      }
    }
    modules.push({ bar: true, width: 3 }, { bar: false, width: 1 }, { bar: true, width: 1 });
    return { modules, text: digits, quietModules: 10, bearerBox };
  }

  function encodeCode39(value) {
    const text = `*${value}*`;
    const modules = [];
    for (const char of text) {
      const pattern = CODE39[char];
      for (let i = 0; i < pattern.length; i += 1) {
        modules.push({ bar: i % 2 === 0, width: pattern[i] === "w" ? 3 : 1 });
      }
      modules.push({ bar: false, width: 1 });
    }
    modules.pop();
    return { modules, text: value, quietModules: 10 };
  }

  function encodeCode128B(value) {
    const codes = [104];
    for (const char of value) codes.push(char.charCodeAt(0) - 32);
    let checksum = codes[0];
    for (let i = 1; i < codes.length; i += 1) checksum += codes[i] * i;
    codes.push(checksum % 103, 106);

    const modules = [];
    codes.forEach(code => {
      const pattern = CODE128_PATTERNS[code];
      for (let i = 0; i < pattern.length; i += 1) {
        modules.push({ bar: i % 2 === 0, width: Number(pattern[i]) });
      }
    });
    return { modules, text: value, quietModules: 10 };
  }

  function getOptions() {
    return {
      format: elements.format.value,
      width: Number(elements.controls.barWidth.value),
      height: Number(elements.controls.barHeight.value),
      margin: Number(elements.controls.barMargin.value),
      fontSize: Number(elements.controls.fontSize.value),
      lineColor: elements.controls.lineColor.value,
      background: elements.controls.backgroundColor.value,
      displayValue: elements.controls.displayValue.checked
    };
  }

  function setOutputValues() {
    $$('input[type="range"]').forEach(input => {
      const output = document.getElementById(`${input.id}Value`);
      if (output) output.value = input.value;
    });
  }

  function setStatus(type, message) {
    elements.validation.textContent = message;
    elements.validation.classList.toggle("is-error", type === "error");
    elements.validation.classList.toggle("is-success", type === "success");
    elements.statusPill.textContent = type === "error" ? "Check input" : "Ready";
    elements.statusPill.classList.toggle("is-error", type === "error");
  }

  function normalizeCurrentValue() {
    return formatInfo[elements.format.value].normalize(elements.value.value);
  }

  function clearSvg(svg) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
  }

  function svgEl(name, attrs = {}) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }

  function drawSvgBarcode(svg, encoded, options) {
    clearSvg(svg);
    const moduleWidth = options.width;
    const barHeight = options.height;
    const textHeight = options.displayValue ? options.fontSize + 12 : 0;
    const quiet = (encoded.quietModules || 10) * moduleWidth;
    const contentWidth = encoded.modules.reduce((sum, item) => sum + item.width * moduleWidth, 0);
    const width = contentWidth + quiet * 2 + options.margin * 2;
    const height = barHeight + textHeight + options.margin * 2 + (encoded.bearerBox ? moduleWidth * 6 : 0);
    const barTop = options.margin + (encoded.bearerBox ? moduleWidth * 3 : 0);
    let x = options.margin + quiet;

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", `${formatInfo[options.format].label} ${encoded.text}`);
    svg.append(svgEl("rect", { x: 0, y: 0, width, height, fill: options.background }));

    if (encoded.bearerBox) {
      svg.append(svgEl("rect", {
        x: options.margin + quiet - moduleWidth * 4,
        y: options.margin,
        width: contentWidth + moduleWidth * 8,
        height: barHeight + moduleWidth * 6,
        fill: "none",
        stroke: options.lineColor,
        "stroke-width": moduleWidth * 2
      }));
    }

    encoded.modules.forEach(item => {
      const w = item.width * moduleWidth;
      if (item.bar) {
        svg.append(svgEl("rect", { x, y: barTop, width: w, height: barHeight, fill: options.lineColor }));
      }
      x += w;
    });

    if (options.displayValue) {
      svg.append(svgEl("text", {
        x: width / 2,
        y: barTop + barHeight + options.fontSize + 5,
        "text-anchor": "middle",
        "font-family": "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        "font-size": options.fontSize,
        fill: options.lineColor
      })).textContent = encoded.text;
    }
  }

  function renderBarcode(target = elements.barcode, rawValue = elements.value.value, options = getOptions()) {
    const current = formatInfo[options.format];
    const normalized = current.normalize(rawValue);
    const encoded = current.encode(normalized.value);
    drawSvgBarcode(target, encoded, options);
    return normalized;
  }

  function updateBarcode() {
    setOutputValues();
    const current = formatInfo[elements.format.value];
    elements.formatHelp.textContent = current.help;

    try {
      const normalized = renderBarcode();
      setStatus("success", normalized.message);
      elements.metaFormat.textContent = current.label;
      elements.metaValue.textContent = normalized.value;
      [elements.downloadSvg, elements.downloadPng, elements.copySvg, elements.printBarcode].forEach(btn => { btn.disabled = false; });
    } catch (error) {
      clearSvg(elements.barcode);
      setStatus("error", error.message || "สร้างบาร์โค้ดไม่ได้");
      elements.metaFormat.textContent = current.label;
      elements.metaValue.textContent = "-";
      [elements.downloadSvg, elements.downloadPng, elements.copySvg, elements.printBarcode].forEach(btn => { btn.disabled = true; });
    }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function safeFilename(value) {
    return String(value || "barcode").trim().replace(/[^a-z0-9_-]+/gi, "_").replace(/^[_-]+|[_-]+$/g, "").slice(0, 31) || "barcode";
  }

  function getSerializedSvg() {
    const clone = elements.barcode.cloneNode(true);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    return new XMLSerializer().serializeToString(clone);
  }

  function downloadSvg() {
    const normalized = normalizeCurrentValue();
    downloadBlob(new Blob([getSerializedSvg()], { type: "image/svg+xml;charset=utf-8" }), `${safeFilename(normalized.value)}.svg`);
  }

  function downloadPng() {
    const normalized = normalizeCurrentValue();
    const svg = getSerializedSvg();
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      const scale = 3;
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(image.width * scale);
      canvas.height = Math.ceil(image.height * scale);
      const context = canvas.getContext("2d");
      context.fillStyle = elements.controls.backgroundColor.value;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(pngBlob => downloadBlob(pngBlob, `${safeFilename(normalized.value)}.png`), "image/png");
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      setStatus("error", "แปลงเป็น PNG ไม่สำเร็จ ลองดาวน์โหลด SVG แทน");
    };
    image.src = url;
  }

  async function copySvg() {
    try {
      await navigator.clipboard.writeText(getSerializedSvg());
      setStatus("success", "คัดลอก SVG แล้ว");
    } catch {
      setStatus("error", "เบราว์เซอร์ไม่อนุญาตให้คัดลอกอัตโนมัติ");
    }
  }

  function renderHeroBarcode() {
    const options = { format: "CODE128", width: 2, height: 96, margin: 12, fontSize: 18, lineColor: "#111827", background: "#ffffff", displayValue: true };
    const normalized = formatInfo.CODE128.normalize("SKU-TH-0001");
    drawSvgBarcode(elements.heroBarcode, formatInfo.CODE128.encode(normalized.value), options);
  }

  function generateBatch() {
    elements.batchResult.innerHTML = "";
    const options = getOptions();
    const items = elements.batchInput.value.split(/\r?\n/).map(line => line.trim()).filter(Boolean).slice(0, 100);
    if (!items.length) {
      elements.batchResult.innerHTML = '<p class="batch-error">กรุณาใส่อย่างน้อย 1 รหัส</p>';
      return;
    }
    items.forEach(item => {
      const card = document.createElement("article");
      card.className = "batch-item";
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const caption = document.createElement("strong");
      try {
        const normalized = renderBarcode(svg, item, options);
        caption.textContent = normalized.value;
      } catch (error) {
        card.classList.add("batch-error");
        caption.textContent = `${item}: ${error.message}`;
      }
      card.append(svg, caption);
      elements.batchResult.append(card);
    });
  }

  function setTheme(theme) {
    elements.root.dataset.theme = theme;
    localStorage.setItem("barcode-studio-theme", theme);
  }

  function initTheme() {
    const saved = localStorage.getItem("barcode-studio-theme");
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    setTheme(saved || (prefersDark ? "dark" : "light"));
  }

  function bindEvents() {
    elements.form.addEventListener("input", updateBarcode);
    elements.form.addEventListener("change", updateBarcode);
    elements.format.addEventListener("change", () => {
      elements.value.value = formatInfo[elements.format.value].sample;
      updateBarcode();
      generateBatch();
    });
    elements.sampleButton.addEventListener("click", () => {
      elements.value.value = formatInfo[elements.format.value].sample;
      updateBarcode();
      elements.value.focus();
    });
    elements.downloadSvg.addEventListener("click", downloadSvg);
    elements.downloadPng.addEventListener("click", downloadPng);
    elements.copySvg.addEventListener("click", copySvg);
    elements.printBarcode.addEventListener("click", () => window.print());
    elements.generateBatch.addEventListener("click", generateBatch);
    elements.clearBatch.addEventListener("click", () => {
      elements.batchInput.value = "";
      elements.batchResult.innerHTML = "";
    });
    elements.themeToggle.addEventListener("click", () => setTheme(elements.root.dataset.theme === "dark" ? "light" : "dark"));
  }

  function init() {
    initTheme();
    bindEvents();
    renderHeroBarcode();
    updateBarcode();
    generateBatch();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
