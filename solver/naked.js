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
 * @param {Array.<House>} aHouseArr 
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
        // naked.pairs[i] = Solver.findNakedPairs(aHouseArr[i]);
        // naked.triples[i] = Solver.findNakedTriples(aHouseArr[i]);
        // naked.quads[i] = Solver.findNakedQuads(aHouseArr[i]);
        temp = Solver.findNakedPairs(aHouseArr[i]);
        if(temp.length > 0)
            naked.pairs.push({id: i, cells: temp});
        temp = Solver.findNakedTriples(aHouseArr[i]);
        if(temp.length > 0)
            naked.triples.push({id: i, cells: temp});
        temp = Solver.findNakedQuads(aHouseArr[i]);
        if(temp.length > 0)
            naked.quads.push({id: i, cells: temp});
    }
    return naked;
}