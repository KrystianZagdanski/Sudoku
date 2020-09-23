/*
    Active parts of solver
*/
//#region methods + solutions

/**
 * Solve cells with candidates from Solver.solutions.
 */
Solver.solveCells = ()=>{
    if(Solver.solutions.length == 0) return;
    
    Solver.solutions.forEach(cObj=>{cObj.setAsSolution()});
    Solver.solutions = [];
}
/**
 * Remove candidates from cells.
 */
Solver.removeCandidates = ()=>{
    if(Solver.candidatesToRemove.length == 0) return;

    Solver.candidatesToRemove.forEach(cObj=>{cObj.remove()});
    Solver.candidatesToRemove = [];
}

/**
 * Fill all posible candidates in every cell.
 * @param  {Array.<Array.<Cell>>} cells - Cells of sudoku.
 */
Solver.fillAllCandidates = (cells)=>{
    cells.forEach(col =>{
        col.forEach(cell =>{
            if(cell.value) return;
            for(let d = 1; d <= 9; d++)
            {
                if(cell.row.valueInHouse(d)) continue;
                if(cell.column.valueInHouse(d)) continue;
                if(cell.block.valueInHouse(d)) continue;
                cell.addCandidates(d);
            }
        });
    });
}

/**
 * Highlights naked singles.
 * @returns {Symbol | false} Solver.SOLVE or false.
 */
Solver.showNakedSingles = ()=>{
    let nakedSingles = Solver.findNakedSingle(cell);
    if(nakedSingles)
    {
        nakedSingles.forEach(obj=>{board.addHighlight(obj);});
        Solver.solutions = nakedSingles;
        console.log("Naked Single");
        return Solver.SOLVE;
    }
    return false;
}

/**
 * Highlights hidden singles.
 * @returns {Symbol | false} Solver.SOLVE or false.
 */
Solver.showHiddenSingles = ()=>{
    let hiddenSinges = Solver.findHiddenSingle(row, column, block);
    if(hiddenSinges)
    {
        hiddenSinges.forEach(obj=>{board.addHighlight(obj);});
        Solver.solutions = hiddenSinges;
        console.log("Hidden Single");
        return Solver.SOLVE;
    }
    return false;
}

/**
 * Highlights pairs and candidates eliminated by this pairs.
 * @returns {Symbol | false} Solver.REMOVE or false.
 */
Solver.showEliminationPairs = ()=>{
    let pairs = Solver.findHiddenPairs(row, column, block);
    if(!pairs) return;
    
    // find all pairs with 2 common houses 
    Solver.emininationPairs = [];
    Solver.candidatesToRemove = [];
    pairs.forEach(pair=>{
        let houses = pair.cell[0].commonHouse(pair.cell[1]);
        if(houses.length != 2) return;

        let removeCounter = 0;
        for(let i = 0; i < 2; i++)
        {
            pair.cell[0][houses[i]].cells.forEach(cell=>{
                if(cell == pair.cell[0] || cell == pair.cell[1])
                {
                    return;
                }
                else if(cell.candidates.includes(pair.value)) // save candidate to eliminate and highlight red
                {
                    removeCounter++;
                    Solver.candidatesToRemove.push(new CandidateObj(cell, pair.value));
                    board.addHighlight(Solver.candidatesToRemove[Solver.candidatesToRemove.length-1], "red");
                }     
            });
        }
        if(removeCounter > 0)
        {
            Solver.emininationPairs.push(pair); // save elimination pair
            board.addHighlight(pair.getCandidateObj(0));
            board.addHighlight(pair.getCandidateObj(1));
        }
    });
    if(Solver.candidatesToRemove.length > 0)
    {
        console.log("Elimination Pair");
        return Solver.REMOVE;
    }
    return false;
}

/**
 * Highlights 2 pairs in the same block and candidates eliminated by them.
 * @returns {Symbol | false} Solver.REMOVE or false.
 */
Solver.showHiddenDoubles = ()=>{
    hiddenDoubles = Solver.findHiddenDouble(block);
    if(hiddenDoubles)
    {
        Solver.candidatesToRemove = [];
        hiddenDoubles.forEach(double=>{
            // highlight candidates for elimination
            double.pair1.cell[0].candidates.forEach(candidate=>{
                if(candidate != double.pair1.value && candidate != double.pair2.value)
                {
                    let c = new CandidateObj(double.pair1.cell[0], candidate);
                    board.addHighlight(c, "red");
                    Solver.candidatesToRemove.push(c);
                }
            });
            double.pair1.cell[1].candidates.forEach(candidate=>{
                if(candidate != double.pair1.value && candidate != double.pair2.value)
                {
                    let c = new CandidateObj(double.pair1.cell[1], candidate);
                    board.addHighlight(c, "red");
                    Solver.candidatesToRemove.push(c);
                }
            });
            // highlight double
            board.addHighlight(double.pair1.getCandidateObj(0));
            board.addHighlight(double.pair1.getCandidateObj(1));
            board.addHighlight(double.pair2.getCandidateObj(0));
            board.addHighlight(double.pair2.getCandidateObj(1));
        });
        console.log("Double");
        return Solver.REMOVE;
    }
    return false;
}

/**
 * Highlights 2 pairs in the same row or column and candidates eliminated by them.
 * @returns {Symbol | false} Solver.REMOVE or false.
 */
Solver.showTwoPairElimination = ()=>{
    let twoPairs = Solver.findTwoPairs(cell);
    if(!twoPairs) return;

    Solver.candidatesToRemove = [];
    Solver.emininationPairs = [];

    twoPairs.forEach(pair=>{

        let houses = pair[0].cell.commonHouse(pair[1].cell);
        let removeCounter = 0;
        // find if pairs can eliminate any candidates and if they do then add tem to emininationPairs
        houses.forEach(house=>{
            pair[0].cell[house].cells.forEach(cell=>{
                if(cell == pair[0].cell || cell == pair[1].cell)
                {
                    return;
                }
                else if(cell.candidates.includes(pair[0].value[0])) // save candidate to eliminate and highlight red
                {
                    removeCounter++;
                    Solver.candidatesToRemove.push(new CandidateObj(cell, pair[0].value[0]));
                    board.addHighlight(Solver.candidatesToRemove[Solver.candidatesToRemove.length-1], "red");
                }    
                else if(cell.candidates.includes(pair[0].value[1])) // save candidate to eliminate and highlight red
                {
                    removeCounter++;
                    Solver.candidatesToRemove.push(new CandidateObj(cell, pair[0].value[1]));
                    board.addHighlight(Solver.candidatesToRemove[Solver.candidatesToRemove.length-1], "red");
                } 
            })
        });
        if(removeCounter > 0)
        {
            Solver.emininationPairs.push(new PairObj([pair[0].cell, pair[1].cell], pair[0].value[0])); // save elimination pair
            Solver.emininationPairs.push(new PairObj([pair[0].cell, pair[1].cell], pair[0].value[1]));
            board.addHighlight(pair[0].getCandidateObj(0));
            board.addHighlight(pair[0].getCandidateObj(1));
            board.addHighlight(pair[1].getCandidateObj(0));
            board.addHighlight(pair[1].getCandidateObj(1));
        }
    });
    if(Solver.candidatesToRemove.length > 0)
    {
        console.log("Two Pair Elimination");
        return Solver.REMOVE;
    }
    return false;
}

/**
 * Highlights X-Wing its houses and candidates eliminated by it.
 * @returns {Symbol | false} Solver.REMOVE or false.
 */
Solver.showXWing = ()=>{
    Solver.candidatesToRemove = [];
    let foundXWing = Solver.findXWing(row, column);
    if(!foundXWing) return false;
    
    let properXWingFound = false;

    foundXWing.forEach(xWing=>{
        if(properXWingFound) return;
        let xWingCandidate = xWing.p1.value;
        if(xWing.house == "row")
        {
            // hl candidates to eliminate in columns
            if(xWing.p1.cell[0].column.countCandidate(xWingCandidate) > 2 ||
            xWing.p1.cell[1].column.countCandidate(xWingCandidate) > 2)
            {
                properXWingFound = true;
                for(let i = 0; i < 2; i++)
                {
                    xWing.p1.cell[i].column.cells.forEach(cell=>{
                        let hlGreen = false;
                        let c = new CandidateObj(cell, xWingCandidate);
                        if(cell.candidates.includes(xWingCandidate))
                        {
                            if(cell != xWing.p1.cell[i] && cell != xWing.p2.cell[i])
                            {
                                board.addHighlight(c, "red");
                                Solver.candidatesToRemove.push(c);
                            }
                            else
                            {
                                board.addCellHighlight(c, "blue");
                                board.addHighlight(c);
                                hlGreen = true;
                            }
                        }

                        if(!hlGreen)
                            board.addCellHighlight(c, "red");
                    });
                }
                // add green highlight
                xWing.p1.cell[0].row.cells.forEach(cell=>{
                    if(cell == xWing.p1.cell[0] || cell == xWing.p1.cell[1]) return;
                    board.addCellHighlight(new CandidateObj(cell, xWingCandidate));
                });
                xWing.p2.cell[0].row.cells.forEach(cell=>{
                    if(cell == xWing.p2.cell[0] || cell == xWing.p2.cell[1]) return;
                    board.addCellHighlight(new CandidateObj(cell, xWingCandidate));
                });
                
            }
        }
        else if(xWing.house == "column")
        {
            if(xWing.p1.cell[0].row.countCandidate(xWingCandidate) > 2 ||
            xWing.p1.cell[1].row.countCandidate(xWingCandidate) > 2)
            {
                properXWingFound = true;
                for(let i = 0; i < 2; i++)
                {
                    xWing.p1.cell[i].row.cells.forEach(cell=>{
                        let hlGreen = false;
                        let c = new CandidateObj(cell, xWingCandidate);
                        if(cell.candidates.includes(xWingCandidate))
                        {
                            if(cell != xWing.p1.cell[i] && cell != xWing.p2.cell[i])
                            {
                                board.addHighlight(c, "red");
                                Solver.candidatesToRemove.push(c);
                            }
                            else
                            {
                                board.addCellHighlight(c, "blue");
                                board.addHighlight(c);
                                hlGreen = true;
                            }
                        }

                        if(!hlGreen)
                            board.addCellHighlight(c, "red");
                    });
                }
                // add green highlight
                xWing.p1.cell[0].column.cells.forEach(cell=>{
                    if(cell == xWing.p1.cell[0] || cell == xWing.p1.cell[1]) return;
                    board.addCellHighlight(new CandidateObj(cell, xWingCandidate));
                });
                xWing.p2.cell[0].column.cells.forEach(cell=>{
                    if(cell == xWing.p2.cell[0] || cell == xWing.p2.cell[1]) return;
                    board.addCellHighlight(new CandidateObj(cell, xWingCandidate));
                });
            }
        }
    });

    if(Solver.candidatesToRemove.length > 0)
    {
        console.log("X-Wing");
        return Solver.REMOVE;
    }
    return false;
}

/**
 * Highlights Finned X-Fing its houses and candidates eliminatet by it.
 * @returns {Symbol | false} Solver.REMOVE or false.
 */
Solver.showFinnedXWing = ()=>{
    Solver.candidatesToRemove = [];
    let foundFinnedXWing = Solver.findFinnedXWing(row, column);
    if(!foundFinnedXWing) return false;

    let properFinnedXWingFound = false;

    foundFinnedXWing.forEach(fXWing=>{
        if(properFinnedXWingFound) return;

        for(let pi = 0; pi < 2; pi++)
        {
            if(fXWing.p2.cell[pi].commonHouse(fXWing.fin[0]).includes("block"))
            {
                let func = (cell)=>{
                    if(cell.commonHouse(fXWing.p2.cell[pi]).includes("block") && cell.candidates.includes(fXWing.p2.value) &&
                     cell != fXWing.p2.cell[pi] && cell != fXWing.p1.cell[pi])
                        {
                            properFinnedXWingFound = true;
                            let c = new CandidateObj(cell, fXWing.p2.value);
                            board.addHighlight(c, "red");
                            board.addCellHighlight(c, "red");
                            Solver.candidatesToRemove.push(c);
                        }
                }
                if(fXWing.house == "row")
                    fXWing.p2.cell[pi].column.cells.forEach(func);
                else
                    fXWing.p2.cell[pi].row.cells.forEach(func);

                if(properFinnedXWingFound)
                {
                    board.addHighlight(fXWing.p1.getCandidateObj(0));
                    board.addHighlight(fXWing.p1.getCandidateObj(1));
                    board.addCellHighlight(fXWing.p1.getCandidateObj(0));
                    board.addCellHighlight(fXWing.p1.getCandidateObj(1));

                    board.addHighlight(fXWing.p2.getCandidateObj(0));
                    board.addHighlight(fXWing.p2.getCandidateObj(1));
                    board.addCellHighlight(fXWing.p2.getCandidateObj(0));
                    board.addCellHighlight(fXWing.p2.getCandidateObj(1));

                    fXWing.fin.forEach(fin=>{
                        board.addCellHighlight(new CandidateObj(fin, fXWing.p1.value), "blue");
                    });
                }
            }
        }
        
    });

    if(Solver.candidatesToRemove.length > 0)
    {
        console.log("Finned X-Wing");
        return Solver.REMOVE;
    }
    return false;
}

//#endregion methods + solutions

Solver.step = ()=>{
    // fill candidates if flag is ont set and set flag to true
    if(!Solver.candidatesFilled)
    {
        Solver.fillAllCandidates(cell);
        Solver.candidatesFilled = true;
        return true;
    }
    
    if(Solver.action == undefined)
    {
        Solver.action = Solver.FIND_SOLUTION;
    }

    if(Solver.action == Solver.FIND_SOLUTION)
    {
        board.removeHighlight();
        board.removeCellHighlight();
        Solver.action = Solver.showNakedSingles();
        if(Solver.action) return true;
        Solver.action = Solver.showHiddenSingles();
        if(Solver.action) return true;
        Solver.action = Solver.showEliminationPairs();
        if(Solver.action) return true;
        Solver.action = Solver.showHiddenDoubles();
        if(Solver.action) return true;
        Solver.action = Solver.showTwoPairElimination();
        if(Solver.action) return true;
        Solver.action = Solver.showXWing();
        if(Solver.action) return true;
        Solver.action = Solver.showFinnedXWing();
        if(Solver.action) return true;
    }
    else if(Solver.action == Solver.SOLVE)
    {
        board.removeHighlight();
        Solver.solveCells();
        Solver.action = Solver.FIND_SOLUTION;
        return true;
    }
    else if(Solver.action == Solver.REMOVE)
    {
        Solver.removeCandidates();
        Solver.action = Solver.FIND_SOLUTION;
        return true;
    }
    else
    {
        console.log("Solution not found!");
        Solver.action = Solver.FIND_SOLUTION;
    }

    return false;
}