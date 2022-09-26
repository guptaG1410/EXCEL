// STORAGE -> One more 2-D array to store the rowID & colID of child which forms directed graph.
let colllectedGraphComponent = [];   //It is used to contain all sheetDB.
let graphComponent = [];

// for(let i = 0; i < rows; i++) {
//     let row = [];
//     for(let j = 0; j < cols; j++) {
//         // We'll store rowID & colID like [0, 1] or [2,1] or it could be any indices.
//         row.push([]);
//     }
//     graphComponent.push(row);
// }

// OUR MAIN ALGO STARTS FROM HERE:
// This function is to find whether cycle is present or not.
// True -> cycle is present, False -> not cyclic.
function isCyclePresent(graphComponent) {
    // visited[][] -> to track node/cell dependecy &
    // dfsVisited[][] -> to trace stack flow.
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

    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            if(!visited[i][j]) {
                let isCyclic = dfsCycleDetection(graphComponent, i, j, visited, dfsVisited);
                if(isCyclic)
                    return [i, j];
            }
        }
    }

    return null;

}

// This function detects cycle.
// Initially do : visited[i][j] = true, dfsVisited[i][j] = true;
// While returning do : visited[i][j] = false;
// If visited[i][j] == true, then its already visited so backtrack from there.
// AND if (visited[i][j] == true && dfsVisited[i][j] == true) => cycle is detected, from here return true;
function dfsCycleDetection(graphComponent, srcRow, srcCol, visited, dfsVisited) {
    visited[srcRow][srcCol] = true;
    dfsVisited[srcRow][srcCol] = true;

    for(let child = 0; child < graphComponent[srcRow][srcCol].length; child++) {
        let [nodeRow, nodeCol] = graphComponent[srcRow][srcCol][child];
        if(!visited[nodeRow][nodeCol]) {
            let isCycleDetected = dfsCycleDetection(graphComponent, nodeRow, nodeCol, visited, dfsVisited);
            if(isCycleDetected)
                return true;
        } else if(visited[nodeRow][nodeCol] && dfsVisited[nodeRow][nodeCol]) {
            // Cycle detected.
            return true;
        }   
    }

    dfsVisited[srcRow][srcCol] = false;
    return false;
}

