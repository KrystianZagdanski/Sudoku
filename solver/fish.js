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
 * Returns x wings as list of objects or false.
 * @param  {Array.<House>} rows - Rows of sudoku.
 * @param  {Array.<House>} columns - Columns of sudoku.
 * @returns {Array.<XWing> | false} XWing or false.
 */
Solver.findXWing = (rows, columns)=>{
    let xWings = [];
    let xWingCandidates = [[],[],[],[],[],[],[],[],[]];
    let candidates;
    
    // find Pairs that might be part of x wing
    for(let i = 0; i < 9; i++)
    {
        for(let digit = 1; digit <= 9; digit++)
        {
            // add pairs to xWingCandidates list excluding pairs in the same block (they should be solved by diferent method)
            candidates = rows[i].findCandidate(digit);
            if(candidates.length == 2 && !candidates[0].commonHouse(candidates[1]).includes("block"))
            {
                xWingCandidates[digit-1].push(new PairObj([candidates[0], candidates[1]], digit));
            }
            candidates = columns[i].findCandidate(digit);
            if(candidates.length == 2 && !candidates[0].commonHouse(candidates[1]).includes("block"))
            {
                xWingCandidates[digit-1].push(new PairObj([candidates[0], candidates[1]], digit));
            }
        }
    }
    // find x wing
    xWingCandidates.forEach(PairList=>{
        if(PairList.length < 2) return;
        
        for(let i = 0; i < PairList.length-1; i++)
        {
            for(let j = i+1; j < PairList.length; j++)
            {
                let oryginalHouse = PairList[i].cell[0].commonHouse(PairList[i].cell[1]);
                let comHouse1 = PairList[i].cell[0].commonHouse(PairList[j].cell[0]);
                let comHouse2 = PairList[i].cell[1].commonHouse(PairList[j].cell[1]);
                if(oryginalHouse.includes("row") && comHouse1.includes("column") && comHouse2.includes("column"))
                {
                    let xWingCells = [PairList[i].cell[0], PairList[i].cell[1], PairList[j].cell[0], PairList[j].cell[1]];
                    xWings.push(new XWing(PairList[i].value, xWingCells, "row"));
                }
                if(oryginalHouse.includes("column") && comHouse1.includes("row") && comHouse2.includes("row"))
                {
                    let xWingCells = [PairList[i].cell[0], PairList[i].cell[1], PairList[j].cell[0], PairList[j].cell[1]];
                    xWings.push(new XWing(PairList[i].value, xWingCells, "column"));
                }
            }
        }
    });
    if(xWings.length == 0) return false;
    else return xWings;
}

 /**
 * Returns finned X-wings as list of objects or false.
 * @param  {Array.<House>} rows - Rows of sudoku.
 * @param  {Array.<House>} columns - Columns of sudoku.
 * @returns {Array.<XWing> | false} XWing or false.
 */
Solver.findFinnedXWing = (rows, columns)=>{
    let xWings = [];
    let xWingCandidatesInRow = [[],[],[],[],[],[],[],[],[]];
    let xWingCandidatesInColumn = [[],[],[],[],[],[],[],[],[]];
    let candidates;
    
    // find candidates that might be part of x wing
    for(let i = 0; i < 9; i++)
    {
        for(let digit = 1; digit <= 9; digit++)
        {
            // add Pairs to xWingCandidates list
            candidates = rows[i].findCandidate(digit);
            if(candidates.length == 2 && !candidates[0].commonHouse(candidates[1]).includes("block"))
        {
            xWingCandidatesInRow[digit-1].push(new PairObj([candidates[0], candidates[1]], digit));
        }
        candidates = columns[i].findCandidate(digit);
        if(candidates.length == 2 && !candidates[0].commonHouse(candidates[1]).includes("block"))
        {
            xWingCandidatesInColumn[digit-1].push(new PairObj([candidates[0], candidates[1]], digit));
        }
        }
    }
    // find finned x wing with candidates in rows 
    xWingCandidatesInRow.forEach(PairList=>{
    if(PairList.length == 0) return;
    
    PairList.forEach(aPair=>{
        // find matching pair to cemplete x wing
        aPair.cell[0].column.findCandidate(aPair.value).forEach(cell=>{
            let candidatesForSecoundPair = cell.row.findCandidate(aPair.value);
            if(candidatesForSecoundPair.length < 3 || candidatesForSecoundPair.length > 4) return;
            let pairCells = [];
            let fins = [];
            candidatesForSecoundPair.forEach(cFSP=>{
                if(cFSP.commonHouse(aPair.cell[0]).includes("column") || cFSP.commonHouse(aPair.cell[1]).includes("column"))
                {
                    pairCells.push(cFSP);
                }
                else
                {
                    fins.push(cFSP);
                }
            });
            if(pairCells.length < 2 || fins.length == 0) return;
            // make sure both fins are in the same block as only one of the cells in pair 
            if( !(fins[0].commonHouse(pairCells[0]).includes("block") || fins[0].commonHouse(pairCells[1]).includes("block")) ) return;
            if(fins.length == 2)
            {
                if(!fins[0].commonHouse(fins[1]).includes("block")) return;
            }
            let xWingCells = [aPair.cell[0], aPair.cell[1], pairCells[0], pairCells[1]];
            xWings.push(new XWing(aPair.value, xWingCells, "row", fins));
        });
        
    });
    });
    // find finned x wing with candidates in columns 
    xWingCandidatesInColumn.forEach(PairList=>{
    if(PairList.length == 0) return;
    
    PairList.forEach(aPair=>{
        // find matching pair to cemplete x wing
        aPair.cell[0].row.findCandidate(aPair.value).forEach(cell=>{
            let candidatesForSecoundPair = cell.column.findCandidate(aPair.value);
            if(candidatesForSecoundPair.length < 3 || candidatesForSecoundPair.length > 4) return;
            let pairCells = [];
            let fins = [];
            candidatesForSecoundPair.forEach(cFSP=>{
                if(cFSP.commonHouse(aPair.cell[0]).includes("row") || cFSP.commonHouse(aPair.cell[1]).includes("row"))
                {
                    pairCells.push(cFSP);
                }
                else
                {
                    fins.push(cFSP);
                }
            });
            if(pairCells.length != 2 || fins.length == 0) return;
            // make sure both fins are in the same block as only one of the cells in pair
            if( !(fins[0].commonHouse(pairCells[0]).includes("block") || fins[0].commonHouse(pairCells[1]).includes("block")) ) return;
            if(fins.length == 2)
            {
                if(!fins[0].commonHouse(fins[1]).includes("block")) return;
            }
            let xWingCells = [aPair.cell[0], aPair.cell[1], pairCells[0], pairCells[1]];
            xWings.push(new XWing(aPair.value, xWingCells, "column", fins));
        });
        
    });
    });
    if(xWings.length == 0) return false;
    else return xWings;
}

/**
 * Returns sashimi X-Wing as list of X-Wing objects.
 * @param  {Array.<House>} rows - Rows of sudoku.
 * @param  {Array.<House>} columns - Columns of sudoku.
 * @returns {Array.<XWing> | false} - XWing or false.
 */
Solver.findSashimiXWing = (rows, columns)=>{
    let xWings = [];
    let h = ["row", "column"];

    // find x-wings for all digits
    for(let digit = 1; digit <= 9; digit++)
    {
        // for row(0) and column(1)
        for(let hi = 0; hi < h.length; hi++)
        {
            let houseType = h[hi];
            let rHouseType;
            if (hi == 0)
                rHouseType = h[1];
            else
                rHouseType = h[0];

            let pairs = []; // [pairObj,...]
            let xWingCandidates = []; // [house0[], house1[],...]

            // for every house find candidates and pairs
            for(let i = 0; i < 9; i++)
            {
                xWingCandidates[i] = [];
                let candidates;
                if (hi == 0)
                    candidates = rows[i].findCandidate(digit);
                else
                    candidates = columns[i].findCandidate(digit);
                
                if(candidates.length == 2 && !candidates[0].commonHouse(candidates[1]).includes("block"))
                {
                    pairs.push(new PairObj([candidates[0], candidates[1]], digit));
                }
                else if(candidates.length == 3)
                {
                    let blocks = 1;
                    for(let c = 0; c < candidates.length-1; c++)
                    {
                        if(!candidates[c].commonHouse(candidates[c+1]).includes("block")) blocks++;
                    }
                    if(blocks == 2)
                    {
                        xWingCandidates[i] = candidates;
                    }
                }
            }
            
            // find sashimi x-wing with 1 fin
            for(let pi = 0; pi < pairs.length; pi++)
            {
                for(let i = 0; i < pairs.length; i++)
                {
                    if(i == pi) continue;

                    let connection1 = pairs[pi].cell[0].commonHouse(pairs[i].cell[0]).includes(rHouseType);
                    let connection2 = pairs[pi].cell[1].commonHouse(pairs[i].cell[1]).includes(rHouseType);
                    if(connection1 || connection2)
                    {
                        // cell of sashimi x-wing without candidate
                        let index = pairs[i].cell[0][houseType].index;
                        if(connection1)
                        {
                            let emptyCell = pairs[pi].cell[1][rHouseType].cells[index];
                            if(emptyCell.commonHouse(pairs[i].cell[1]).includes("block"))
                            {
                                let xWingCells = [pairs[pi].cell[0], pairs[pi].cell[1], pairs[i].cell[0]];
                                xWings.push(new XWing(digit, xWingCells, houseType, [pairs[i].cell[1]], emptyCell));
                            }
                        }
                        else
                        {
                            let emptyCell = pairs[pi].cell[0][rHouseType].cells[index];
                            if(emptyCell.commonHouse(pairs[i].cell[0]).includes("block"))
                            {
                                let xWingCells = [pairs[pi].cell[0], pairs[pi].cell[1], pairs[i].cell[1]];
                                xWings.push(new XWing(digit, xWingCells, houseType, [pairs[i].cell[0]], emptyCell));
                            }
                        }
                        
                    }
                }
            }
            // TODO: find sashimi x-wing with 2 fins
            pairs.forEach(pair=>{
                xWingCandidates.forEach(digits=>{
                    let xWingCells = [];
                    xWingCells.push(pair.cell[0]);
                    xWingCells.push(pair.cell[1]);
                    let fins = [];
                    let emptyCell;
                    for(let ci = 0; ci < digits.length; ci++)
                    {
                        let index = digits[ci][houseType].index;
                        if(digits[ci].commonHouse(pair.cell[0]).includes(rHouseType))
                        {
                            xWingCells.push(digits[ci]);
                            emptyCell = pair.cell[1][rHouseType].cells[index];
                        }
                        else if(digits[ci].commonHouse(pair.cell[1]).includes(rHouseType))
                        {
                            xWingCells.push(digits[ci]);
                            emptyCell = pair.cell[0][rHouseType].cells[index];
                        }
                        else
                        {
                            fins.push(digits[ci]);
                        }
                    }
                    if(fins.length == 2 && fins[0].commonHouse(fins[1]).includes("block") && fins[0].commonHouse(emptyCell).includes("block"))
                    {
                        xWings.push(new XWing(pair.value, xWingCells, houseType, fins, emptyCell));
                    }
                });
            });
            
        }
    }
    if(xWings.length == 0) return false;
    else return xWings;
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