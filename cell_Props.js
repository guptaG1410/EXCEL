// STORAGE
let sheetDB = [];

for (let i = 0; i < rows; i++) {
  let sheetRow = [];
  for (let j = 0; j < cols; j++) {
    let cellProps = {
      bold: false,
      italic: false,
      underline: false,
      alignment: "left",
      fontFamily: "arial",
      fontSize: "14",
      fontColor: "#000000",
      BGColor: "#000000",
      value: "",
      formula: "",
      children: [],
    };
    sheetRow.push(cellProps);
  }
  sheetDB.push(sheetRow);
}

// Selectors for cell properties
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let BGColor = document.querySelector(".BGColor-prop");

// IMPLEMENTING TWO-WAY BINDING.
// Attaching Property Listeners.
// Adding Bold Property:
bold.addEventListener("click", (e) => {
  let [cell, cellProp] = getActiveCell(addressBar.value);

  // Modification of a cell
  cellProp.bold = !cellProp.bold; //Data change
  cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; //UI change
  bold.style.backgroundColor = cellProp.bold ? "#9dabab" : "#cdcfcf"; //UI Change
});

// Adding Italic Property:
italic.addEventListener("click", (e) => {
  let [cell, cellProp] = getActiveCell(addressBar.value);

  // Modification of a cell
  cellProp.italic = !cellProp.italic;
  cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
  italic.style.backgroundColor = cellProp.italic ? "#9dabab" : "#cdcfcf";
});

// Adding Underlined Property:
underline.addEventListener("click", (e) => {
  let [cell, cellProp] = getActiveCell(addressBar.value);

  // Modification of a cell
  cellProp.underline = !cellProp.underline;
  cell.style.textDecoration = cellProp.underline ? "underline" : "none";
  underline.style.backgroundColor = cellProp.underline ? "#9dabab" : "#cdcfcf";
});

// Adding Alignment Property:
alignment.forEach((alignEle) => {
  alignEle.addEventListener("click", (e) => {
    let [cell, cellProp] = getActiveCell(addressBar.value);

    // Modification of a cell
    let alignValue = e.currentTarget.classList[0];
    cellProp.alignment = alignValue;
    cell.style.textAlign = cellProp.alignment;

    switch (alignValue) {
      case "left":
        leftAlign.style.backgroundColor = "#9dabab";
        centerAlign.style.backgroundColor = "#cdcfcf";
        rightAlign.style.backgroundColor = "#cdcfcf";
        break;

      case "center":
        leftAlign.style.backgroundColor = "#cdcfcf";
        centerAlign.style.backgroundColor = "#9dabab";
        rightAlign.style.backgroundColor = "#cdcfcf";
        break;

      case "right":
        leftAlign.style.backgroundColor = "#cdcfcf";
        centerAlign.style.backgroundColor = "#cdcfcf";
        rightAlign.style.backgroundColor = "#9dabab";
        break;
    }
  });
});

// Adding Font Size Property:
fontSize.addEventListener("change", (e) => {
  let [cell, cellProp] = getActiveCell(addressBar.value);

  // Modification of a cell
  cellProp.fontSize = fontSize.value;
  cell.style.fontSize = cellProp.fontSize + "px";
  fontSize.value = cellProp.fontSize;
});

// Adding Font Family Property:
fontFamily.addEventListener("change", (e) => {
  let [cell, cellProp] = getActiveCell(addressBar.value);

  // Modification of a cell
  cellProp.fontFamily = fontFamily.value;
  cell.style.fontFamily = cellProp.fontFamily;
  fontFamily.value = cellProp.fontFamily;
});

// Adding Font Color Property:
fontColor.addEventListener("change", (e) => {
  let [cell, cellProp] = getActiveCell(addressBar.value);

  //Modification of a cell
  cellProp.fontColor = fontColor.value;
  cell.style.color = cellProp.fontColor;
  fontColor.value = cellProp.fontColor;
});

// Adding Background Color Property:
BGColor.addEventListener("change", (e) => {
  let [cell, cellProp] = getActiveCell(addressBar.value);

  // Modification of a cell
  cellProp.BGColor = BGColor.value;
  cell.style.backgroundColor = cellProp.BGColor;
  BGColor.value = cellProp.BGColor;
});

// Attaching Cell Properties to all cells. So that each cell has different properties and don't affect other cells.
let allCells = document.querySelectorAll(".cell");
for (let i = 0; i < allCells.length; i++) {
  addListenerToAttachCellProps(allCells[i]);
}

function addListenerToAttachCellProps(cell) {
  cell.addEventListener("click", (e) => {
    let [rIdx, cIdx] = decodeAddress(addressBar.value);
    let cellProp = sheetDB[rIdx][cIdx];

    // Applying cell properties:
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; //UI change
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";
    cell.style.fontSize = cellProp.fontSize + "px";
    cell.style.fontFamily = cellProp.fontFamily;
    cell.style.color = cellProp.fontColor;
    cell.style.backgroundColor = cellProp.BGColor == "#000000" ? "transparent" : cellProp.BGColor;
    cell.style.textAlign = cellProp.alignment;

    //Applying Cell Properties to UI:
    bold.style.backgroundColor = cellProp.bold ? "#9dabab" : "#cdcfcf"; //UI Change
    italic.style.backgroundColor = cellProp.italic ? "#9dabab" : "#cdcfcf";
    underline.style.backgroundColor = cellProp.underline
      ? "#9dabab"
      : "#cdcfcf";
    fontSize.value = cellProp.fontSize;
    fontFamily.value = cellProp.fontFamily;
    fontColor.value = cellProp.fontColor;
    BGColor.value = cellProp.BGColor;

    switch (cellProp.alignment) {
      case "left":
        leftAlign.style.backgroundColor = "#9dabab";
        centerAlign.style.backgroundColor = "#cdcfcf";
        rightAlign.style.backgroundColor = "#cdcfcf";
        break;

      case "center":
        leftAlign.style.backgroundColor = "#cdcfcf";
        centerAlign.style.backgroundColor = "#9dabab";
        rightAlign.style.backgroundColor = "#cdcfcf";
        break;

      case "right":
        leftAlign.style.backgroundColor = "#cdcfcf";
        centerAlign.style.backgroundColor = "#cdcfcf";
        rightAlign.style.backgroundColor = "#9dabab";
        break;
    }

    let formulaBar = document.querySelector(".formula-bar");
    formulaBar.value = cellProp.formula;
    cell.value = cellProp.value;
  });
}

function getActiveCell(address) {
  let [rIdx, cIdx] = decodeAddress(address);
  // With the help of rIdx & cIdx, we can Access cell & storage object.
  let cell = document.querySelector(`.cell[rid="${rIdx}"][cid="${cIdx}"]`);
  let cellProp = sheetDB[rIdx][cIdx];
  return [cell, cellProp];
}

function decodeAddress(address) {
  // Address -> "A1" is at index =[0][0]
  //  where A = cIdx, 1 = rIdx
  let rIdx = Number(address.slice(1)) - 1; // "1" -> 1 -> 0
  let cIdx = Number(address.charCodeAt(0)) - 65; //"A" -> 65 -> 0

  return [rIdx, cIdx];
}
