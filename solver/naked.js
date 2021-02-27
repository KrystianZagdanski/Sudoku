 /**
 * Take House object and number of digits per cell and return cells with x candidates in them
 * @param {House} aHouse - Row, Colum or Block
 * @param {number} x - Number of candidates per cell
 * @returns {Array.<Cell>}
 */
Solver.findXDigitCells = (aHouse, x)=>{
    let XDigitCells = [];
    aHouse.cells.forEach(cell =>{
        if(cell.candidates.length == x)
            XDigitCells.push(cell);
    });
    return XDigitCells;
}

/**
 * Returns list of naked single candidates of false if didn't found any.
 * @param  {Array.<Array.<Cell>>} cells - Cells of sudoku.
 * @returns {Array.<CandidateObj> | false} [CandidateObj,...] or false.
 */
Solver.findNakedSingle = (cells)=>{
    let nakedSingles = [];
    cells.forEach(col =>{
        col.forEach(cell =>{
            if(cell.candidates.length == 1)
                nakedSingles.push(new CandidateObj(cell, cell.candidates[0]));
        });
    });
    
    if(nakedSingles.length == 0) return false;
    else return nakedSingles;
}

/**
 * Take House object and return list of cells creating pair
 * @param {House} aHouse - House object
 * @returns {Array.<Array.<Cell>>} 2d array with Cell objects
 */
Solver.findNakedPairs = (aHouse)=>{
    let twoDigitCells = Solver.findXDigitCells(aHouse, 2);
    let nakedPairs = [];
    for(let i = 0; i < twoDigitCells.length-1; i++)
    {
        for(let j = i+1; j < twoDigitCells.length; j++)
        {
            if(twoDigitCells[i].haveSameCandidatesAs(twoDigitCells[j]))
            {
                nakedPairs.push([twoDigitCells[i], twoDigitCells[j]]);
            }
        }
    }
    return nakedPairs;
}

/**
 * Take House object and return list of cells creating triple
 * @param {House} aHouse - House object
 * @returns {Array.<Array.<Cell>>} 2d array with Cell objects
 */
Solver.findNakedTriples = (aHouse)=>{
    let threeDigitCells = Solver.findXDigitCells(aHouse, 3);
    let nakedTriples = [];
    let temp = [];
    for(let i = 0; i < threeDigitCells.length-2; i++)
    {
        temp = [];
        for(let j = i+1; j < threeDigitCells.length; j++)
        {
            if(threeDigitCells[i].haveSameCandidatesAs(threeDigitCells[j]))
            {
                temp.push(threeDigitCells[j]);
            }
            if(temp.length == 2)
            {
                nakedTriples.push([threeDigitCells[i], temp[0], temp[1]]);
                break;
            }
        }
    }
    return nakedTriples;
}

/**
 * Take House object and return list of cells creating quad
 * @param {House} aHouse - House object
 * @returns {Array.<Array.<Cell>>} 2d array with Cell objects
 */
Solver.findNakedQuads = (aHouse)=>{
    let fourDigitCells = Solver.findXDigitCells(aHouse, 4);
    let nakedQuads = [];
    let temp = [];
    for(let i = 0; i < fourDigitCells.length-3; i++)
    {
        temp = [];
        for(let j = i+1; j < fourDigitCells.length; j++)
        {
            if(fourDigitCells[i].haveSameCandidatesAs(fourDigitCells[j]))
            {
                temp.push(fourDigitCells[j]);
            }
            if(temp.length == 3)
            {
                nakedQuads.push([fourDigitCells[i], temp[0], temp[1], temp[2]]);
                break;
            }
        }
    }
    return nakedQuads;
}

/**
 * Take list of House objects and return object with naked pairs, triples and quads
 * @param {Array.<House>} aHouseArr - List of House objects
 * @returns {Object.<Array.<Array>>} {pairs[cells[2],...], triples[cells[3],...], quads[cells[4],...]}
 */
Solver.findNaked = (aHouseArr)=>{
    let naked = {
        pairs: [],
        triples: [],
        quads: []
    };
    let temp;
    for(let i = 0; i < aHouseArr.length; i++)
    {
        temp = Solver.findNakedPairs(aHouseArr[i]);
        if(temp.length > 0)
            naked.pairs = naked.pairs.concat(temp);
        temp = Solver.findNakedTriples(aHouseArr[i]);
        if(temp.length > 0)
            naked.triples = naked.triples.concat(temp);
        temp = Solver.findNakedQuads(aHouseArr[i]);
        if(temp.length > 0)
            naked.quads = naked.quads.concat(temp);
    }
    return naked;
}

/**
 * Take cells of multiple and house of multiple and return list of candidates to eliminate
 * @param {Array.<Cell>} nakedCells - Multiple of cells
 * @param {House} aHouse - A House object of a multiple
 * @returns {Array.<CandidateObj>} [CandidateObj, ...]
 */
Solver.findEliminatedByNaked = (nakedCells, aHouse)=>{
    let candidatesForElimination = [];
    let nakedCandidates = nakedCells[0].candidates;
    aHouse.cells.forEach(cell=>{
        for(let i = 0; i < nakedCells.length; i++)
        {
            if(cell == nakedCells[i])
                return;
        }
        for(let i = 0; i < nakedCandidates.length; i++)
        {
            if(cell.candidates.includes(nakedCandidates[i]))
            {
                candidatesForElimination.push(new CandidateObj(cell, nakedCandidates[i]));
            }
        }
    });
    return candidatesForElimination;
}