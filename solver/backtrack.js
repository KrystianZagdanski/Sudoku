const OK = true;
const BAD = false;

/**
 * Returns first correct value
 * @param {Array<Cell>} aCellArr 
 * @param {number} [i]
 * @returns {CandidateObj}
 */
Solver.backTrack = (aCellArr, i = 0)=>{
    let cellArr = [];
    if(i == 0)
    {
        aCellArr.forEach(cell => {
            if(cell.value == null)
                cellArr.push(cell.copy());
        });
        if(cellArr.length == 0)
            return false;
    }
    else if(i == aCellArr.length)
    {
        return OK;
    }
    else
    {
        cellArr = aCellArr;
    }

    let index = i;
    let cell = cellArr[index];
    let ci = 0;
    let result = false;
    if(cell.candidates.length == 0)
    {
        return BAD;
    }

    do
    {
        //set value and remove it from other cells
        cell.value = cell.candidates[ci];
        let remCanCells = [];
        for(let c = index+1; c < cellArr.length; c++)
        {
            if(cellArr[c].commonHouse(cell).length > 0 && cellArr[c].candidates.includes(cell.value))
            {
                cellArr[c].removeCandidate(cell.value);
                remCanCells.push(cellArr[c]);
            }
        }
        result = Solver.backTrack(cellArr, index+1);
        if(result == BAD)
        {
            remCanCells.forEach(c=>{
                c.addCandidates(cell.value);
            });
            cell.value = null;
        }
        ci += 1;

    }while(!result && ci < cell.candidates.length)
    
    if(index == 0)
    {
        let solvedCell = aCellArr.find(c=>{return c.id == cell.id});
        return new CandidateObj(solvedCell, cell.value);
    }
    else
        return result;
}