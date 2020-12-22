/**
 * Take 2d list of candidates for Fish and returns list of id's.
 * @param {Array.<Cell>} aCellArr- List of cells. 
 * @param {"row" | "column"} fishOpositType - Oposite house to the house of fish.
 * @returns {Array.<number>} [houseId,...]
 */
Solver.getFishEliminationHouses = (aCellArr, fishOpositType)=>{
    let lines = [];

    aCellArr.forEach(cell=>{
        if(!lines.includes(cell[fishOpositType]))
            lines.push(cell[fishOpositType]);
    });
    return lines;
}

/**
 * Take list of House objects and return list of Fish objects.
 * @param {Array.<House>} aHouseArr - Rows or columns
 * @returns {Array.<Fish>} [Fish,...] 
 */
Solver.findSwordfish = (aHouseArr)=>{
    let swordFishes = [];
    let fishCells = [[],[],[],[],[],[],[],[],[]];
    let type = aHouseArr[0].type;
    let opositType = type == "row"? "column": "row";

    aHouseArr.forEach(house => {
        for(let digit = 1; digit <= 9; digit++)
        {
            let cells = house.findCandidate(digit);
            if(cells.length > 0 && cells.length <=3)
                fishCells[digit-1].push(cells);
        }
    });

    for(let digit = 1; digit <= 9; digit++)
    {
        let digitCells = fishCells[digit-1];
        if(digitCells.length < 3)
            continue;
        
        for(let i = 0; i < digitCells.length-2; i++)
        {
            for(let j = i+1; j < digitCells.length-1; j++)
            {
                for(let k = j+1; k < digitCells.length; k++)
                {
                    let cells = digitCells[i].concat(digitCells[j],digitCells[k]);
                    let elimHouses = Solver.getFishEliminationHouses(cells, opositType);
                    if(elimHouses.length == 3)
                    {
                        swordFishes.push(new Fish(digit, cells, type, elimHouses));
                    }
                }
            }
        }
    }

    return swordFishes;
};

/**
 * Take list of House objects and return list of Fish objects.
 * @param {Array.<House>} aHouseArr - Rows or columns
 * @returns {Array.<Fish>} [Fish,...] 
 */
Solver.findJellyfish = (aHouseArr)=>{
    let jellyFishes = [];
    let fishCells = [[],[],[],[],[],[],[],[],[]];
    let type = aHouseArr[0].type;
    let opositType = type == "row"? "column": "row";

    aHouseArr.forEach(house => {
        for(let digit = 1; digit <= 9; digit++)
        {
            let cells = house.findCandidate(digit);
            if(cells.length > 0 && cells.length <=4)
                fishCells[digit-1].push(cells);
        }
    });

    for(let digit = 1; digit <= 9; digit++)
    {
        let digitCells = fishCells[digit-1];
        if(digitCells.length < 4)
            continue;
        
        for(let i = 0; i < digitCells.length-2; i++)
        {
            for(let j = i+1; j < digitCells.length-1; j++)
            {
                for(let k = j+1; k < digitCells.length; k++)
                {
                    for(let l = k+1; l < digitCells.length; l++)
                    {
                        let cells = digitCells[i].concat(digitCells[j],digitCells[k],digitCells[l]);
                        let elimHouses = Solver.getFishEliminationHouses(cells, opositType);
                        if(elimHouses.length == 4)
                        {
                            jellyFishes.push(new Fish(digit, cells, type, elimHouses));
                        }
                    }
                }
            }
        }
    }

    return jellyFishes;
};

/**
 * Takes Fish and return list of candidates that can be eliminated by it.
 * @param {Fish} aFish - A Fish object
 * @returns {Array.<CandidateObj>} [CandidateObj, ...] 
 */
Solver.findEliminatedByFish = (aFish)=>{
    let candidatesForElimination = [];
    aFish.eliminationHouses.forEach(house=>{
        house.cells.forEach(cell=>{
            if(!aFish.cells.includes(cell) && cell.candidates.includes(aFish.value))
                candidatesForElimination.push(new CandidateObj(cell, aFish.value));
        });
    });

    return candidatesForElimination;
}