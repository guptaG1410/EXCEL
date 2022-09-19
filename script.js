let rows = 100;
let cols = 26;

let rowCont = document.querySelector(".address-row-cont");
let colCont = document.querySelector(".address-col-cont");
let cellsCont = document.querySelector(".cells-cont");
let addressBar = document.querySelector(".address-bar");

// CREATING ADDRESSING ROWS
for (let i = 0; i < rows; i++) {
  let row = document.createElement("div");
  row.setAttribute("class", "address-row");
  row.innerText = i + 1;
  rowCont.appendChild(row);
}

// CREATING ADDRESSING COLUMNS
for (let i = 0; i < cols; i++) {
  let column = document.createElement("div");
  column.setAttribute("class", "address-col");
  column.innerText = String.fromCharCode(65 + i);
  colCont.appendChild(column);
}

// CREATING CELLS OF THE GRID.
for (let i = 0; i < rows; i++) {
  let row = document.createElement("div");
  row.setAttribute("class", "row");
  for (let j = 0; j < cols; j++) {
    let cell = document.createElement("div");
    cell.setAttribute("class", "cell");
    cell.setAttribute("contenteditable", "true");
    row.appendChild(cell);
    displayAddBar(cell, i, j);
  }
  cellsCont.appendChild(row);
}

// ADDRESSING A CELL (IMPLEMENTING ADDRESS BAR)
function displayAddBar(cell, i, j) {
  cell.addEventListener("click", (e) => {
    let rowID = i + 1;
    let colID = String.fromCharCode(65 + j);
    addressBar.value = `${colID}${rowID}`;
  });
}
