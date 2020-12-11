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
        let xWingCandidate = xWing.value;
        if(xWing.houseType == "row")
        {
            // hl candidates to eliminate in columns
            if(xWing.cells[0].column.countCandidate(xWingCandidate) > 2 ||
            xWing.cells[1].column.countCandidate(xWingCandidate) > 2)
            {
                properXWingFound = true;
                for(let i = 0; i < 2; i++)
                {
                    xWing.cells[i].column.cells.forEach(cell=>{
                        let hlGreen = false;
                        let c = new CandidateObj(cell, xWingCandidate);
                        if(cell.candidates.includes(xWingCandidate))
                        {
                            if(cell != xWing.cells[i] && cell != xWing.cells[i+2])
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
                xWing.cells[0].row.cells.forEach(cell=>{
                    if(cell == xWing.cells[0] || cell == xWing.cells[1]) return;
                    board.addCellHighlight(new CandidateObj(cell, xWingCandidate));
                });
                xWing.cells[2].row.cells.forEach(cell=>{
                    if(cell == xWing.cells[2] || cell == xWing.cells[3]) return;
                    board.addCellHighlight(new CandidateObj(cell, xWingCandidate));
                });
                
            }
        }
        else if(xWing.house == "column")
        {
            if(xWing.cells[0].row.countCandidate(xWingCandidate) > 2 ||
            xWing.cells[1].row.countCandidate(xWingCandidate) > 2)
            {
                properXWingFound = true;
                for(let i = 0; i < 2; i++)
                {
                    xWing.cells[i].row.cells.forEach(cell=>{
                        let hlGreen = false;
                        let c = new CandidateObj(cell, xWingCandidate);
                        if(cell.candidates.includes(xWingCandidate))
                        {
                            if(cell != xWing.cells[i] && cell != xWing.cells[i+2])
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
                xWing.cells[0].column.cells.forEach(cell=>{
                    if(cell == xWing.cells[0] || cell == xWing.cells[1]) return;
                    board.addCellHighlight(new CandidateObj(cell, xWingCandidate));
                });
                xWing.cells[2].column.cells.forEach(cell=>{
                    if(cell == xWing.cells[2] || cell == xWing.cells[3]) return;
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
            if(fXWing.cells[pi+2].commonHouse(fXWing.fins[0]).includes("block"))
            {
                let func = (cell)=>{
                    if(cell.commonHouse(fXWing.cells[pi+2]).includes("block") && cell.candidates.includes(fXWing.value) &&
                     cell != fXWing.cells[pi+2] && cell != fXWing.cells[pi])
                        {
                            properFinnedXWingFound = true;
                            let c = new CandidateObj(cell, fXWing.value);
                            board.addHighlight(c, "red");
                            board.addCellHighlight(c, "red");
                            Solver.candidatesToRemove.push(c);
                        }
                }
                if(fXWing.houseType == "row")
                    fXWing.cells[pi+2].column.cells.forEach(func);
                else
                    fXWing.cells[pi+2].row.cells.forEach(func);

                if(properFinnedXWingFound)
                {
                    board.addHighlight(fXWing.getCandidateObj(0));
                    board.addHighlight(fXWing.getCandidateObj(1));
                    board.addHighlight(fXWing.getCandidateObj(2));
                    board.addHighlight(fXWing.getCandidateObj(3));
                    board.addCellHighlight(fXWing.getCandidateObj(0));
                    board.addCellHighlight(fXWing.getCandidateObj(1));
                    board.addCellHighlight(fXWing.getCandidateObj(2));
                    board.addCellHighlight(fXWing.getCandidateObj(3));

                    fXWing.fins.forEach(fin=>{
                        board.addCellHighlight(new CandidateObj(fin, fXWing.value), "blue");
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

/**
 * Highlights Sashimi X-Fing its houses and candidates eliminatet by it.
 * @returns {Symbol | false} Solver.REMOVE or false;
 */
Solver.showSashimiXWing = ()=>{
    Solver.candidatesToRemove = [];
    let foundSashimiXWing = Solver.findSashimiXWing(row, column);
    if(!foundSashimiXWing) return false;

    let foundXwing = false;

    foundSashimiXWing.forEach(xwing=>{
        if(foundXwing) return;

        let eliminateIn;
        if(xwing.houseType == "row")
            eliminateIn = "column";
        else
            eliminateIn = "row";

        xwing.emptyCell.block.cells.forEach(cell=>{
            if(!cell.candidates.includes(xwing.value)) return;

            if(!xwing.fins.includes(cell) && !xwing.cells.includes(cell) && cell.commonHouse(xwing.emptyCell).includes(eliminateIn))
            {
                foundXwing = true;
                let c = new CandidateObj(cell, xwing.value);
                Solver.candidatesToRemove.push(c);
                board.addHighlight(c, "red");
                board.addCellHighlight(c, "red");
            }
        });
        if(foundXwing)
        {
            board.addHighlight(xwing.getCandidateObj(0));
            board.addHighlight(xwing.getCandidateObj(1));
            board.addHighlight(xwing.getCandidateObj(2));
            xwing.fins.forEach(fin=>{
                board.addHighlight(new CandidateObj(fin, xwing.value));
            });
            

            board.addCellHighlight(xwing.getCandidateObj(0));
            board.addCellHighlight(xwing.getCandidateObj(1));
            board.addCellHighlight(xwing.getCandidateObj(2));
            board.addCellHighlight(new CandidateObj(xwing.emptyCell, xwing.value));
            xwing.fins.forEach(fin=>{
                board.addCellHighlight(new CandidateObj(fin, xwing.value), "blue");
            });
        }
    });
    
    if(Solver.candidatesToRemove.length > 0)
    {
        console.log("Sashimi X-Wing");
        return Solver.REMOVE;
    }
    return false;
}

/**
 * Make one step of solving sudoku.
 * @returns {boolean} false if couldn't do any action else true.
 */
Solver.step = ()=>{
    // fill candidates if flag is not set and set flag to true
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
        Solver.action = Solver.showSashimiXWing();
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

/**
 * Solve sudoku using Sudoku lovling metohods.
 */
Solver.solve = ()=>{
    while(Solver.step());
}