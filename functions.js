/* global CustomFunctions */

// ---------- Vietnamese currency-to-words conversion (same logic as taskpane.html) ----------
const DIGITS = ["không","một","hai","ba","bốn","năm","sáu","bảy","tám","chín"];
const GROUP_UNITS = ["", "ngàn", "triệu", "tỷ", "ngàn tỷ", "triệu tỷ", "tỷ tỷ"];

function readThreeDigitBlock(n, isLeadingBlock) {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const t = Math.floor(r / 10);
  const u = r % 10;
  const parts = [];

  if (h > 0) {
    parts.push(DIGITS[h] + " trăm");
  } else if (!isLeadingBlock && r > 0) {
    parts.push("không trăm");
  }

  if (t === 0) {
    if (u > 0) {
      if (h > 0 || !isLeadingBlock) {
        parts.push("linh " + DIGITS[u]);
      } else {
        parts.push(DIGITS[u]);
      }
    }
  } else if (t === 1) {
    parts.push("mười");
    if (u === 5) parts.push("lăm");
    else if (u > 0) parts.push(DIGITS[u]);
  } else {
    parts.push(DIGITS[t] + " mươi");
    if (u === 1) parts.push("mốt");
    else if (u === 5) parts.push("lăm");
    else if (u === 4) parts.push("tư");
    else if (u > 0) parts.push(DIGITS[u]);
  }

  return parts.join(" ");
}

function readInteger(numStr) {
  numStr = numStr.replace(/^0+(?=\d)/, "");
  if (numStr === "0" || numStr === "") return "không";

  const groups = [];
  let s = numStr;
  while (s.length > 0) {
    const start = Math.max(0, s.length - 3);
    groups.unshift(parseInt(s.slice(start), 10));
    s = s.slice(0, start);
  }

  const totalGroups = groups.length;
  const words = [];

  for (let i = 0; i < totalGroups; i++) {
    const groupValue = groups[i];
    const groupIndexFromRight = totalGroups - 1 - i;
    const isLeadingBlock = i === 0;

    if (groupValue === 0) continue;

    const blockText = readThreeDigitBlock(groupValue, isLeadingBlock);
    words.push(blockText + (GROUP_UNITS[groupIndexFromRight] ? " " + GROUP_UNITS[groupIndexFromRight] : ""));
  }

  return words.join(" ").replace(/\s+/g, " ").trim();
}

function capitalizeFirst(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function currencyToWords(value) {
  let str = String(value).trim();
  str = str.replace(/[đĐ]|VND|vnd/g, "").trim();
  str = str.replace(/[.,\s]/g, "");
  let negative = false;
  if (str.startsWith("-")) {
    negative = true;
    str = str.slice(1);
  }
  if (str === "" || !/^\d+$/.test(str)) {
    return "#GIA_TRI_KHONG_HOP_LE";
  }
  const words = readInteger(str);
  let result = capitalizeFirst(words) + " đồng chẵn";
  if (negative) result = "Âm " + result.charAt(0).toLowerCase() + result.slice(1);
  return result;
}
// ---------- end conversion logic ----------

/**
 * Chuyen doi so tien sang chu tieng Viet.
 * @customfunction
 * @param {any} amount So tien can chuyen doi (co the la gia tri hoac ket qua cong thuc)
 * @returns {string} Chuoi chu tieng Viet, vi du "Sau tram ba muoi ngan dong chan"
 */
function VN(amount) {
  if (amount === null || amount === undefined || amount === "") {
    return "";
  }
  return currencyToWords(amount);
}

CustomFunctions.associate("VN", VN);
