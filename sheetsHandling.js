let sheetCont = document.querySelector(".sheets-folder-cont");
let addSheetBtn = document.querySelector(".sheet-add-icon");
addSheetBtn.addEventListener("click", (e) => {
  let sheet = document.createElement("div");
  sheet.setAttribute("class", "sheet-folder");

  let allSheetsFolders = document.querySelectorAll(".sheet-folder");
  sheet.setAttribute("id", allSheetsFolders.length);

  sheet.innerHTML = `
  <div class="sheet-content">Sheet ${allSheetsFolders.length + 1}</div>
  `;

  sheetCont.appendChild(sheet);
  // After appending sheet to the sheetContainer, try to create Database for each sheet separately.
  createSheetDB();
  createGraphComponent();
  handleSheetActiveness(sheet);
  handleSheetRemoval(sheet);
  sheet.click();
});

// Function to create Sheet with cell properities.
function createSheetDB() {
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
  colllectedSheetDB.push(sheetDB);
}

// This to create sheet containing cells with their row & col.
function createGraphComponent() {
  let graphComponent = [];

  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      // We'll store rowID & colID like [0, 1] or [2,1] or it could be any indices.
      row.push([]);
    }
    graphComponent.push(row);
  }
  colllectedGraphComponent.push(graphComponent);
}

// This function is used to manage the sheet activeness like focusing on current Sheet, click first cell by default, mantaining current sheet color, etc.
function handleSheetActiveness(sheet) {
  sheet.addEventListener("click", (e) => {
    let sheetIdx = Number(sheet.getAttribute("id"));
    handleSheetDB(sheetIdx);
    handleSheetProps();
    handleSheetUI(sheet);
  });
}

function handleSheetDB(sheetIdx) {
  sheetDB = colllectedSheetDB[sheetIdx];
  graphComponent = colllectedGraphComponent[sheetIdx];
}

function handleSheetProps() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
      cell.click();
    }
  }
  // // By Default click on first cell via DOM
  let firstCell = document.querySelector(".cell");
  firstCell.click();
}

function handleSheetUI(sheet) {
  let allSheetsFolders = document.querySelectorAll(".sheet-folder");
  for (let i = 0; i < allSheetsFolders.length; i++) {
    allSheetsFolders[i].style.backgroundColor = "transparent";
  }
  sheet.style.backgroundColor = "#717070";
}

// This function is used for deleting a sheet.
function handleSheetRemoval(sheet) {
  sheet.addEventListener("mousedown", (e) => {
    // e.button == 2 {Right Click}, e.button == 1 {scroll} & e.button == 0 {left click}
    if (e.button != 2) return;

    let allSheetsFolders = document.querySelectorAll(".sheet-folder");
    if (allSheetsFolders.length == 1) {
      alert("Atleast one sheet has to be there !!!");
      return;
    }

    let userResponse = confirm(
      "Your sheet will be removed permanently, are you sure?"
    );
    if (!userResponse) return;

    let sheetIdx = Number(sheet.getAttribute("id"));
    // Changing into DB.
    colllectedSheetDB.splice(sheetIdx, 1);
    colllectedGraphComponent.splice(sheetIdx, 1);
    // Changes to UI.
    handleSheetUIRemoval(sheet);

    // By Default show sheet 1 (active)
    sheetDB = colllectedSheetDB[0];
    graphComponent = colllectedGraphComponent[0];
    handleSheetProps();
  });
}

// This Function is used to managing sheets after removing one or many.
function handleSheetUIRemoval(sheet) {
  sheet.remove();
  let allSheetsFolders = document.querySelectorAll(".sheet-folder");
  for (let i = 0; i < allSheetsFolders.length; i++) {
    allSheetsFolders[i].setAttribute("id", i);
    let sheetContent = allSheetsFolders[i].querySelector(".sheet-content");
    sheetContent.innerText = `Sheet ${i + 1}`;
    allSheetsFolders[i].style.backgroundColor = "transparent";
  }

  allSheetsFolders[0].style.backgroundColor = "#717070";
}
