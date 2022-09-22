for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    cell.addEventListener("blur", (e) => {
      let [activeCell, cellProp] = getActiveCell(addressBar.value);
      let enteredData = activeCell.innerText;

      if (enteredData == cellProp.value) return;

      cellProp.value = enteredData;
      // CASE : where data modifies then remove Parent-child relation, empty formula and update children with new modified value.
      removeChildFromParent(cellProp.formula);
      cellProp.formula = "";
      updateChildrenCells(addressBar.value);
    });
  }
}

let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", (e) => {
  let inputFormula = formulaBar.value;
  if (e.key == "Enter" && inputFormula) {
    // CASE: where formula changes then break old Parent-child relation, evaluate new formula and new parent-child relation.
    let address = addressBar.value;
    let [cell, cellProp] = getActiveCell(address);
    if (inputFormula != cellProp.formula)
      removeChildFromParent(cellProp.formula);

    // Before evaluating the formula we need to add the child cell to the parent(again) but in the directed graph.
    addChildToGraphComponent(inputFormula, address);
    // After adding, we'd check if cycle is present or not, then we'll evaluate the formula.
    let isCyclic = isCyclePresent(graphComponent);
    if (isCyclic) {
      alert(
        "Cycle has been found | Your formula is cyclic. Kindly give it a look 😃😄!!! "
      );
      // Now remove dependency.
      removeChildFromGraphComponent(inputFormula, address);
      return;
    }

    let evaluatedVal = evaluateFormula(inputFormula);

    // Now, update CELL UI AND CELLPROP
    setUIAndCellProp(evaluatedVal, inputFormula, address);
    addChildToParent(inputFormula);
    console.log(sheetDB);
    updateChildrenCells(address);
  }
});

// This function is to add child to the graph component.
function addChildToGraphComponent(formula, childAddress) {
  let [childRowID, childColID] = decodeAddress(childAddress);
  let encodedFormula = formula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiVal = encodedFormula[i].charCodeAt(0);
    if (asciiVal >= 65 && asciiVal <= 90) {
      let [parentRowID, parentColID] = decodeAddress(encodedFormula[i]);
      graphComponent[parentRowID][parentColID].push([childRowID, childColID]);
    }
  }
}

// This function is to remove child from the graph component.
function removeChildFromGraphComponent(formula, childAddress) {
  // let [childRowID, childColID] = decodeAddress(childAddress);
  let encodedFormula = formula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiVal = encodedFormula[i].charCodeAt(0);
    if (asciiVal >= 65 && asciiVal <= 90) {
      let [parentRowID, parentColID] = decodeAddress(encodedFormula[i]);
      graphComponent[parentRowID][parentColID].pop();
    }
  }
}

// This function is to update the new child/children cell to the Parent.
function updateChildrenCells(parentAddress) {
  let [parentCell, parentCellProp] = getActiveCell(parentAddress);
  let children = parentCellProp.children;

  for (let i = 0; i < children.length; i++) {
    let childAddress = children[i];
    let [childCell, childCellProp] = getActiveCell(childAddress);
    let childFormula = childCellProp.formula;

    let evaluatedVal = evaluateFormula(childFormula);
    setUIAndCellProp(evaluatedVal, childFormula, childAddress);
    updateChildrenCells(childAddress);
  }
}

// This function is to add child cell to the parent cell.
function addChildToParent(formula) {
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiVal = encodedFormula[i].charCodeAt(0);
    if (asciiVal >= 65 && asciiVal <= 90) {
      let [parentCell, parentCellProp] = getActiveCell(encodedFormula[i]);
      parentCellProp.children.push(childAddress);
    }
  }
}

// This function is to remove child/children cell from the parent cell.
function removeChildFromParent(formula) {
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiVal = encodedFormula[i].charCodeAt(0);
    if (asciiVal >= 65 && asciiVal <= 90) {
      let [parentCell, parentCellProp] = getActiveCell(encodedFormula[i]);
      let idx = parentCellProp.children.indexOf(childAddress);
      parentCellProp.children.splice(idx, 1);
    }
  }
}

// This function is to evaluate the formula written in formual bar.
function evaluateFormula(formula) {
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiVal = encodedFormula[i].charCodeAt(0);
    if (asciiVal >= 65 && asciiVal <= 90) {
      let [cell, cellProp] = getActiveCell(encodedFormula[i]);
      encodedFormula[i] = cellProp.value;
    }
  }
  let decodedFormula = encodedFormula.join(" ");
  return eval(decodedFormula);
}

// This function is to set EVALUATED FORMULA to the CELL UI and CELL PROPS
function setUIAndCellProp(evaluatedVal, formula, address) {
  let [cell, cellProp] = getActiveCell(address);

  // CELL UI :
  cell.innerText = evaluatedVal;
  // CELL PROP :
  cellProp.value = evaluatedVal;
  cellProp.formula = formula;
}
