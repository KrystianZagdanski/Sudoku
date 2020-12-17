/**
 * Take row or column and return 2d array with candidates forming line in block.
 * @param {House} aHouse - A House object (row or column)
 * @returns {Array.<Array.<CandidateObj>>} [[CandidateObj, ...], ...]
 */
Solver.findBoxLine = (aHouse)=>{
    if(aHouse.type == "block")
        throw new Error("aHouse must be of a row or column type!");
    let boxLines = [];
    let cellsWithDigit = [];
    for(let i = 1; i <= 9; i++)
    {
        cellsWithDigit = aHouse.findCandidate(i);
        if(cellsWithDigit.length == 2)
        {
            if(cellsWithDigit[0].commonHouse(cellsWithDigit[1]).includes("block"))
            {
                boxLines.push([new CandidateObj(cellsWithDigit[0], i), new CandidateObj(cellsWithDigit[1], i)])
            }
        }
        if(cellsWithDigit.length == 3)
        {
            if(cellsWithDigit[0].commonHouse(cellsWithDigit[1]).includes("block") &&
            cellsWithDigit[0].commonHouse(cellsWithDigit[2]).includes("block"))
            {
                boxLines.push([new CandidateObj(cellsWithDigit[0], i),
                new CandidateObj(cellsWithDigit[1], i),
                new CandidateObj(cellsWithDigit[2], i)]);
            }
        }
    }

    return boxLines;
}

/**
 * Take block and return 2d array with candidates forming Pointing line
 * @param {House} aHouse - A House object (block)
 * @returns {Array.<Array.<CandidateObj>>} [[CandidateObj, ...], ...]
 */
Solver.findPointingLine = (aHouse)=>{
    if(aHouse.type != "block")
        throw new Error("aHouse must be of a block type!");
    let pointingLines = [];
    let cellsWithDigit = [];
    for(let i = 1; i <= 9; i++)
    {
        cellsWithDigit = aHouse.findCandidate(i);
        if(cellsWithDigit.length == 2)
        {
            if(cellsWithDigit[0].commonHouse(cellsWithDigit[1]).includes("row") ||
            cellsWithDigit[0].commonHouse(cellsWithDigit[1]).includes("column"))
            {
                pointingLines.push([new CandidateObj(cellsWithDigit[0], i), new CandidateObj(cellsWithDigit[1], i)])
            }
        }
        if(cellsWithDigit.length == 3)
        {
            if((cellsWithDigit[0].commonHouse(cellsWithDigit[1]).includes("row") &&
            cellsWithDigit[0].commonHouse(cellsWithDigit[2]).includes("row")) ||
            (cellsWithDigit[0].commonHouse(cellsWithDigit[1]).includes("column") &&
            cellsWithDigit[0].commonHouse(cellsWithDigit[2]).includes("column")))
            {
                pointingLines.push([new CandidateObj(cellsWithDigit[0], i),
                new CandidateObj(cellsWithDigit[1], i),
                new CandidateObj(cellsWithDigit[2], i)]);
            }
        }
    }
    return pointingLines;
}

/**
 * Take list of House objects and return 2d array of CandidateObj creating lines eliminating some candidates
 * @param {Array.<House>} aHouseArr - List of a House objects
 * @returns {Array.<Array.<CandidateObj>>} [[CandidateObj, ...], ...]
 */
Solver.findLine = (aHouseArr)=>{
    let eliminatingLines = [];
    let lines;
    aHouseArr.forEach(aHouse => {
        if(aHouse.type != "block")
        {
            lines = Solver.findBoxLine(aHouse);
            lines.forEach(line=>{
                if(line[0].cell.block.countCandidate(line[0].value) > line.length)
                {
                    eliminatingLines.push(line);
                }
            });
        }
        else
        {
            lines = Solver.findPointingLine(aHouse);
            lines.forEach(line=>{
                if(line[0].cell.commonHouse(line[1].cell).includes("row"))
                {
                    if(line[0].cell.row.countCandidate(line[0].value) > line.length)
                    {
                        eliminatingLines.push(line);
                    }
                }
                else
                {
                    if(line[0].cell.column.countCandidate(line[0].value) > line.length)
                    {
                        eliminatingLines.push(line);
                    }
                }
            });
        }
    });
    return eliminatingLines;
}