class Solver
{
    static FIND_SOLUTION = Symbol("search");
    static SOLVE = Symbol("solve");
    static REMOVE = Symbol("remove");
    
    /**
     * Returns list of naked single candidates of false if didn't found any.
     * @param  {Array.<Array.<Cell>>} cells - Cells of sudoku.
     * @returns {Array.<CandidateObj> | false} [CandidateObj,...] or false.
     */
    static findNakedSingle(cells)
    {
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
     * Returns list of hidden single candidates of false if didn't found any.
     * @param  {Array.<House>} rows - Rows of sudoku.
     * @param  {Array.<House>} columns - Columns of sudoku.
     * @param  {Array.<House>} blocks - Blocks of sudoku.
     * @returns {Array.<CandidateObj> | false} [CandidateObj,...] or false.
     */
    static findHiddenSingle(rows, columns, blocks)
    {
        let hiddenSingles = [];
        let ids = []; // list of id od cells already found
        let cells = [];
        for(let houseIndex = 0; houseIndex < 9; houseIndex++)
        {
            for(let i = 0; i < 9; i++)
            {
                cells = rows[houseIndex].findCandidate(i+1);
                if(cells.length == 1 && !ids.includes(cells[0].id))
                {
                    hiddenSingles.push(new CandidateObj(cells[0], i+1));
                    ids.push(cells[0].id);
                }
                cells = columns[houseIndex].findCandidate(i+1);
                if(cells.length == 1 && !ids.includes(cells[0].id))
                {
                    hiddenSingles.push(new CandidateObj(cells[0], i+1));
                    ids.push(cells[0].id);
                }
                cells = blocks[houseIndex].findCandidate(i+1);
                if(cells.length == 1 && !ids.includes(cells[0].id))
                {
                    hiddenSingles.push(new CandidateObj(cells[0], i+1));
                    ids.push(cells[0].id);
                }
            }
        }

        if(hiddenSingles.length == 0) return false;
        else return hiddenSingles;
    }

    /**
     * Returns list of pairs or false if didn't found any.
     * @param  {Array.<House>} rows - Rows of sudoku.
     * @param  {Array.<House>} columns - Columns of sudoku.
     * @param  {Array.<House>} blocks - Blocks of sudoku.
     * @returns {Array.<PairObj> | false} [PairObj,...] or false.
     */
    static findHiddenPairs(rows, columns, blocks)
    {
        let hiddenPairs = [];
        let cells = [];
        // find pairs
        for(let houseIndex = 0; houseIndex < 9; houseIndex++)
        {
            for(let i = 0; i < 9; i++)
            {
                cells = rows[houseIndex].findCandidate(i+1);
                if(cells.length == 2)
                {
                    hiddenPairs.push(new PairObj([cells[0],cells[1]], i+1));
                }
                cells = columns[houseIndex].findCandidate(i+1);
                if(cells.length == 2)
                {
                    hiddenPairs.push(new PairObj([cells[0],cells[1]], i+1));
                }
                cells = blocks[houseIndex].findCandidate(i+1);
                if(cells.length == 2)
                {
                    hiddenPairs.push(new PairObj([cells[0],cells[1]], i+1));
                }
            }
        }
        //remove duplicates
        for(let i = 0; i < hiddenPairs.length-1; i++)
        {
            for(let j = i+1; j < hiddenPairs.length; )
            {
                if(hiddenPairs[i].cell[0] == hiddenPairs[j].cell[0] &&
                    hiddenPairs[i].cell[1] == hiddenPairs[j].cell[1] &&
                    hiddenPairs[i].value == hiddenPairs[j].value)
                {
                    hiddenPairs.splice(j,1);
                }
                else
                {
                    j++;
                }
            }
        }

        if(hiddenPairs.length == 0) return false;
        else return hiddenPairs;
    }

    /**
     * Returns hidden double as list of objects or false if didn't found any.
     * @param  {Array.<House>} blocks - Blocks of sudoku.
     * @returns {Array.<Object> | false} [{pair1: PairObj, pair2: PairObj},...] or false.
     */
    static findHiddenDouble(blocks)
    {
        let hiddenDouble = [];
        blocks.forEach(house=>{
            let pairs = [];
            // find pairs in block
            for(let digit = 1; digit <= 9; digit++)
            {
                let count = house.countCandidate(digit);
                if(count == 2)
                {
                    let cells = house.findCandidate(digit);
                    pairs.push(new PairObj([cells[0], cells[1]], digit));
                }
            }
            if(pairs.length < 2) return;

            // find pairs in the same cells and add them to hiddenDouble if there are other candidates in them
            for(let i = 0; i < pairs.length-1; i++)
            {
                for(let j = i+1; j < pairs.length; j++)
                {
                    if(pairs[i].cell[0] == pairs[j].cell[0] && pairs[i].cell[1] == pairs[j].cell[1])
                    {
                        if(pairs[i].cell[0].candidates.length > 2 || pairs[i].cell[1].candidates.length > 2)
                        {
                            hiddenDouble.push({
                                pair1: pairs[i],
                                pair2: pairs[j]
                            });
                        } 
                    }
                }
            }
        });
        if(hiddenDouble.length > 0) return hiddenDouble;
        else return false;
    }

    /**
     * Returns list of pairs or false.
     * @param  {Array.<Array.<Cell>>} cells - Cells of sudoku.
     * @returns {Array.<PairObj> | flase} [PairObj,...] or false.
     */
    static findTwoDigitCells(cells)
    {
        let twoDigitCells = [];
        cells.forEach(col =>{
            col.forEach(cell =>{
                if(cell.candidates.length == 2)
                    twoDigitCells.push(new PairObj(cell, [cell.candidates[0], cell.candidates[1]]));
            });
        });
        
        if(twoDigitCells.length == 0) return false;
        else return twoDigitCells;
    }
    /**
     * Returns list of objects or false.
     * @param  {Array.<Array.<Cell>>} cells - Cells of sudoku
     * @returns {Array.<Object> | flase} {cell, values[]} or false.
     */
    static findThreeDigitCells(cells)
    {
        let threeDigitCells = [];
        cells.forEach(col =>{
            col.forEach(cell =>{
                if(cell.candidates.length == 3)
                    threeDigitCells.push({cell: cell, values: [cell.candidates[0], cell.candidates[1], cell.candidates[2]]});
            });
        });
        
        if(threeDigitCells.length == 0) return false;
        else return threeDigitCells;
    }
    

    /**
     * Returns list of lists of two PairObj or false.
     * @param  {Array.<Array.<Cell>>} cells - Cells of sudoku.
     * @returns {Array.<Array<PairObj>> | false} [[PairObj, PairObj],...] or false.
     */
    static findTwoPairs(cells)
    {
        let twoDigitCells = Solver.findTwoDigitCells(cells);
        if(!twoDigitCells) return false;

        // find pairs with the same values and house
        let pairs = [];
        for(let i = 0; i < twoDigitCells.length-1; i++)
        {
            for(let j = i+1; j < twoDigitCells.length; j++)
            {
                if(twoDigitCells[i].value[0] == twoDigitCells[j].value[0] &&
                twoDigitCells[i].value[1] == twoDigitCells[j].value[1] &&
                twoDigitCells[i].cell.commonHouse(twoDigitCells[j].cell).length != 0)
                {
                    pairs.push([twoDigitCells[i], twoDigitCells[j]]);
                }
            }
        }
        if(pairs.length == 0) return false;
        else return pairs;
    }

    /**
     * Returns x wings as list of objects or false.
     * @param  {Array.<House>} rows - Rows of sudoku.
     * @param  {Array.<House>} columns - Columns of sudoku.
     * @returns {Array.<XWing> | false} XWing or false.
     */
    static findXWing(rows, columns)
    {
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
     static findFinnedXWing(rows, columns)
     {
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
    static findSashimiXWing(rows, columns)
    {
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
     * Returns object with lists of strong links.
     * @param  {Array.<Array.<Cell>>} cells - Cells of sudoku.
     * @param  {Array.<House>} rows - Rows of sudoku.
     * @param  {Array.<House>} columns - Columns of sudoku.
     * @param  {Array.<House>} blocks - Blocks of sudoku.
     * @returns {Object<Array.<Link>, Array.<Link>>} {LinksFromPairs: [Link,...], LinksFrom2DigitCell: [Link,...]}
     */
    static findAllStrongLinks(cells, rows, columns, blocks)
    {
        let links = {
            LinksFromPairs: [],
            LinksFrom2DigitCell: []
        };
        // create links from Pairs
        let pairs = Solver.findHiddenPairs(rows, columns, blocks);
        pairs.forEach(pair=>{
            links.LinksFromPairs.push(new Link(pair.getCandidateObj(0), pair.getCandidateObj(1)));
        });
        // create links from Cells
        let twoDigitCells = Solver.findTwoDigitCells(cells);
        twoDigitCells.forEach(pair=>{
            links.LinksFrom2DigitCell.push(new Link(pair.getCandidateObj(0), pair.getCandidateObj(1)));
        });

        return links;
    }
}