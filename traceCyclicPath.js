// We're using PROMISES to make setTimeOut(Time delay) work synchronously.

function colorPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    })
}

async function isCyclePresentTracePath(graphComponent, cycleRowCol) {
    let [srcRow, srcCol] = cycleRowCol;
    let visited = [];
    let dfsVisited = [];

    for(let i = 0; i < rows; i++) {
        let visitedRow = [];
        let dfsVisitedRow = [];
        for(let j = 0; j < cols; j++) {
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    let isCyclic = await dfsCycleDetectionTracePath(graphComponent, srcRow, srcCol, visited, dfsVisited);
    if(isCyclic)
        return Promise.resolve(true);

    return Promise.resolve(false);
}

// Coloring cell for tracking.
async function dfsCycleDetectionTracePath(graphComponent, srcRow, srcCol, visited, dfsVisited) {
    visited[srcRow][srcCol] = true;
    dfsVisited[srcRow][srcCol] = true;

    let cell = document.querySelector(`.cell[rid="${srcRow}"][cid="${srcCol}"]`);
    cell.style.backgroundColor = "lightblue";
    await colorPromise();   //1sec delay

    for(let child = 0; child < graphComponent[srcRow][srcCol].length; child++) {
        let [nodeRow, nodeCol] = graphComponent[srcRow][srcCol][child];
        if(!visited[nodeRow][nodeCol]) {
            let isCycleDetected = await dfsCycleDetectionTracePath(graphComponent, nodeRow, nodeCol, visited, dfsVisited);
            if(isCycleDetected) {
                cell.style.backgroundColor = "transparent";
                await colorPromise();
                return Promise.resolve(true);
            }
        } else if(visited[nodeRow][nodeCol] && dfsVisited[nodeRow][nodeCol]) {
            let cyclicCell = document.querySelector(`.cell[rid="${nodeRow}"][cid="${nodeCol}"]`);
            cyclicCell.style.backgroundColor = "lightcoral";
            await colorPromise();

            cyclicCell.style.backgroundColor = "transparent";
            cell.style.backgroundColor = "transparent";
            await colorPromise();

            return Promise.resolve(true);
        }   
    }

    
    dfsVisited[srcRow][srcCol] = false;
    return Promise.resolve(false);
}