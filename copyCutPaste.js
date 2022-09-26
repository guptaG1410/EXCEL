let isCtrlKeyPressed;

document.addEventListener("keydown", (e) => {
  isCtrlKeyPressed = e.ctrlKey;
});

document.addEventListener("keyup", (e) => {
  isCtrlKeyPressed = e.ctrlKey;
});

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    handleSelectedCellsOnUI(cell);
  }
}

let selectedRange = []; //selectedRange is an array which contains [srcRow, srcCol] & [endRow, endCol].
// This function would select ranged CELLS.
function handleSelectedCellsOnUI(cell) {
  cell.addEventListener("click", (e) => {
    if (!isCtrlKeyPressed) return;

    if (selectedRange.length >= 2) {
      setDefaultSelectedCell();
      selectedRange = [];
    }

    cell.style.border = "3px solid #107c41";

    let rid = Number(cell.getAttribute("rid"));
    let cid = Number(cell.getAttribute("cid"));
    selectedRange.push([rid, cid]);
  });
}

// This function change border of previous selected cells to its default border.
function setDefaultSelectedCell() {
  for (let i = 0; i < selectedRange.length; i++) {
    let previousSelectedCell = document.querySelector(
      `.cell[rid="${selectedRange[i][0]}"][cid="${selectedRange[i][1]}"]`
    );
    previousSelectedCell.style.border = "1px solid lightgrey";
  }
}

let cutBtn = document.querySelector(".cut");
let copyBtn = document.querySelector(".copy");
let pasteBtn = document.querySelector(".paste");

let copyData = []; //copyData is an array which stores the cells with their props ranging from src to dest.
copyBtn.addEventListener("click", (e) => {
  if (selectedRange.length < 2) return;

  copyData = [];    //This is to refresh copyData with every new copy(click).

  for (let i = selectedRange[0][0]; i <= selectedRange[1][0]; i++) {
    let copyRow = [];
    for (let j = selectedRange[0][1]; j <= selectedRange[1][1]; j++) {
      let cellProp = sheetDB[i][j];
      copyRow.push(cellProp);
    }
    copyData.push(copyRow);
    console.log(copyData);
  }
  setDefaultSelectedCell();
});

pasteBtn.addEventListener("click", (e) => {
  if (selectedRange.length < 2) return;

  let rowDiff = Math.abs(selectedRange[0][0] - selectedRange[1][0]);
  let colDiff = Math.abs(selectedRange[0][1] - selectedRange[1][1]);

  // Targeted Cell
  let [srcRow, srcCol] = decodeAddress(addressBar.value);

  // Here, r -> copyData row & c -> copyData col.
  for (let i = srcRow, r = 0; i <= srcRow + rowDiff; i++, r++) {
    for (let j = srcCol, c = 0; j <= srcCol + colDiff; j++, c++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
      if (!cell) continue;

      // Changes in DB.
      let data = copyData[r][c];
      let cellProp = sheetDB[i][j];

      cellProp.value = data.value;
      cellProp.bold = data.bold;
      cellProp.italic = data.italic;
      cellProp.underline = data.underline;
      cellProp.fontSize = data.fontSize;
      cellProp.fontFamily = data.fontFamily;
      cellProp.fontColor = data.fontColor;
      cellProp.BGColor = data.BGColor;
      cellProp.alignment = data.alignment;

      // Changes on UI.
      cell.click();
    }
  }
});

cutBtn.addEventListener("click", (e) => {
  if (selectedRange.length < 2) return;

  for (let i = selectedRange[0][0]; i <= selectedRange[1][0]; i++) {
    for (let j = selectedRange[0][1]; j <= selectedRange[1][1]; j++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
      if (!cell) continue;

      // Changes in DB.
      let cellProp = sheetDB[i][j];

      cellProp.value = "";
      cellProp.bold = false;
      cellProp.italic = false;
      cellProp.underline = false;
      cellProp.fontSize = 14;
      cellProp.fontFamily = "monospace";
      cellProp.fontColor = "#000000";
      cellProp.BGColor = "#000000";
      cellProp.alignment = "left";
      // Changes on UI.
      cell.click();
    }
  }
  setDefaultSelectedCell();
});
