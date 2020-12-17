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
 * Highlights naked pair and candidates it can eliminate.
 * @param {Boolean} - Show all pairs if true, default false
 * @returns {Symbol | false} Solver.REMOVE or false.
 */
Solver.showNakedPairs = (showAll = false)=>{
    let houses = {"row":row, "column":column, "block":block};
    Solver.candidatesToRemove = [];
    for(let houseType in houses)
    {
        let naked = Solver.findNaked(houses[houseType]);
        let foundElimination = false;
        if(naked.pairs.length > 0)
        {
            naked.pairs.forEach(pair=>{
                if(foundElimination && !showAll)
                    return;
                Solver.candidatesToRemove = Solver.candidatesToRemove.concat(Solver.findEliminatedByNaked(pair, pair[0][houseType]));
                if(Solver.candidatesToRemove.length > 0)
                {
                    board.addHighlight(new CandidateObj(pair[0], pair[0].candidates[0]));
                    board.addHighlight(new CandidateObj(pair[0], pair[0].candidates[1]));
                    board.addHighlight(new CandidateObj(pair[1], pair[1].candidates[0]));
                    board.addHighlight(new CandidateObj(pair[1], pair[1].candidates[1]));
                    Solver.candidatesToRemove.forEach(cObj=>{
                        board.addHighlight(cObj, Board.COLOR.RED);
                    });
                    foundElimination = true;
                }
            });  
        }
        if(foundElimination && !showAll)
            break;
    }
    if(Solver.candidatesToRemove.length > 0)
    {
        console.log("Naked Pair NEW");
        return Solver.REMOVE;
    }
    else
        return false;
}

/**
 * Highlights naked triple and candidates it can eliminate.
 * @param {Boolean} - Show all triples if true, default false
 * @returns {Symbol | false} Solver.REMOVE or false.
 */
Solver.showNakedTriples = (showAll = false)=>{
    let houses = {"row":row, "column":column, "block":block};
    Solver.candidatesToRemove = [];
    for(let houseType in houses)
    {
        let naked = Solver.findNaked(houses[houseType]);
        let foundElimination = false;
        if(naked.triples.length > 0)
        {
            naked.triples.forEach(triple=>{
                if(foundElimination && !showAll)
                    return;
                Solver.candidatesToRemove = Solver.candidatesToRemove.concat(Solver.findEliminatedByNaked(triple, triple[0][houseType]));
                if(Solver.candidatesToRemove.length > 0)
                {
                    triple.forEach(cell=>{
                        board.addHighlight(new CandidateObj(cell, cell.candidates[0]));
                        board.addHighlight(new CandidateObj(cell, cell.candidates[1]));
                        board.addHighlight(new CandidateObj(cell, cell.candidates[2]));
                    });
                    Solver.candidatesToRemove.forEach(cObj=>{
                        board.addHighlight(cObj, Board.COLOR.RED);
                    });
                    foundElimination = true;
                }
            });  
        }
        if(foundElimination && !showAll)
            break;
    }
    if(Solver.candidatesToRemove.length > 0)
    {
        console.log("Naked Triple NEW");
        return Solver.REMOVE;
    }
    else
        return false;
}

/**
 * Highlights naked quad and candidates it can eliminate.
 * @param {Boolean} - Show all quads if true, default false
 * @returns {Symbol | false} Solver.REMOVE or false.
 */
Solver.showNakedQuad = (showAll = false)=>{
    let houses = {"row":row, "column":column, "block":block};
    Solver.candidatesToRemove = [];
    for(let houseType in houses)
    {
        let naked = Solver.findNaked(houses[houseType]);
        let foundElimination = false;
        if(naked.quads.length > 0)
        {
            naked.quads.forEach(quad=>{
                if(foundElimination && !showAll)
                    return;
                Solver.candidatesToRemove = Solver.candidatesToRemove.concat(Solver.findEliminatedByNaked(quad, quad[0][houseType]));
                if(Solver.candidatesToRemove.length > 0)
                {
                    quad.forEach(cell=>{
                        board.addHighlight(new CandidateObj(cell, cell.candidates[0]));
                        board.addHighlight(new CandidateObj(cell, cell.candidates[1]));
                        board.addHighlight(new CandidateObj(cell, cell.candidates[2]));
                        board.addHighlight(new CandidateObj(cell, cell.candidates[3]));
                    });
                    Solver.candidatesToRemove.forEach(cObj=>{
                        board.addHighlight(cObj, Board.COLOR.RED);
                    });
                    foundElimination = true;
                }
            });  
        }
        if(foundElimination && !showAll)
            break;
    }
    if(Solver.candidatesToRemove.length > 0)
    {
        console.log("Naked Quad NEW");
        return Solver.REMOVE;
    }
    else
        return false;
}

/**
 * Highlights hidden pair and candidates it can eliminate.
 * @param {Boolean} - Show all pairs if true, default false
 * @returns {Symbol | false} Solver.REMOVE or false.
 */
Solver.showHiddenPairs = (showAll = false)=>{
    let houses = {"row":row, "column":column, "block":block};
    Solver.candidatesToRemove = [];
    for(let houseType in houses)
    {
        let hidden = Solver.findHidden(houses[houseType]);
        let foundElimination = false;
        if(hidden.pairs.length > 0)
        {
            hidden.pairs.forEach(pair=>{
                if(foundElimination && !showAll)
                    return;
                Solver.candidatesToRemove = Solver.candidatesToRemove.concat(Solver.findEliminatedByHidden(pair));
                if(Solver.candidatesToRemove.length > 0)
                {
                    board.addHighlight(new CandidateObj(pair.cells[0], pair.digits[0]));
                    board.addHighlight(new CandidateObj(pair.cells[0], pair.digits[1]));
                    board.addHighlight(new CandidateObj(pair.cells[1], pair.digits[0]));
                    board.addHighlight(new CandidateObj(pair.cells[1], pair.digits[1]));
                    Solver.candidatesToRemove.forEach(cObj=>{
                        board.addHighlight(cObj, Board.COLOR.RED);
                    });
                    foundElimination = true;
                }
            });  
        }
        if(foundElimination && !showAll)
            break;
    }
    if(Solver.candidatesToRemove.length > 0)
    {
        console.log("Hidden Pair NEW");
        return Solver.REMOVE;
    }
    else
        return false;
}

/**
 * Highlights hidden triple and candidates it can eliminate.
 * @param {Boolean} - Show all pairs if true, default false
 * @returns {Symbol | false} Solver.REMOVE or false.
 */
Solver.showHiddenTriples = (showAll = false)=>{
    let houses = {"row":row, "column":column, "block":block};
    Solver.candidatesToRemove = [];
    for(let houseType in houses)
    {
        let hidden = Solver.findHidden(houses[houseType]);
        let foundElimination = false;
        if(hidden.triples.length > 0)
        {
            hidden.triples.forEach(triple=>{
                if(foundElimination && !showAll)
                    return;
                Solver.candidatesToRemove = Solver.candidatesToRemove.concat(Solver.findEliminatedByHidden(triple));
                if(Solver.candidatesToRemove.length > 0)
                {
                    for(let i = 0; i < triple.cells.length; i++)
                    {
                        board.addHighlight(new CandidateObj(triple.cells[i], triple.digits[0]));
                        board.addHighlight(new CandidateObj(triple.cells[i], triple.digits[1]));
                        board.addHighlight(new CandidateObj(triple.cells[i], triple.digits[2]));
                    }
                    Solver.candidatesToRemove.forEach(cObj=>{
                        board.addHighlight(cObj, Board.COLOR.RED);
                    });
                    foundElimination = true;
                }
            });  
        }
        if(foundElimination && !showAll)
            break;
    }
    if(Solver.candidatesToRemove.length > 0)
    {
        console.log("Hidden Triple NEW");
        return Solver.REMOVE;
    }
    else
        return false;
}

/**
 * Highlights Box Line and Pointing Line.
 * @param {Boolean} - Show all quads if true, default false
 * @returns {Symbol | false} Solver.REMOVE or false.
 */
Solver.showBoxLine = (showAll = false)=>{
    Solver.candidatesToRemove = [];
    let boxLinesRow = Solver.findLine(row);
    let boxLinesColumn = Solver.findLine(column);
    let pointingLinesBlock = Solver.findLine(block);
    if(boxLinesRow.length > 0)
    {
        boxLinesRow.forEach(line=>{
            if(Solver.candidatesToRemove.length > 0 && !showAll)
                return;
            let cond;
            line[0].cell.block.cells.forEach(blockCell=>{
                if(line.length == 2)
                    cond = blockCell.candidates.includes(line[0].value) && blockCell != line[0].cell && blockCell != line[1].cell;
                else
                    cond = blockCell.candidates.includes(line[0].value) && blockCell != line[0].cell && blockCell != line[1].cell && blockCell != line[2].cell;

                if(cond)
                {
                    let cObj = new CandidateObj(blockCell, line[0].value);
                    Solver.candidatesToRemove.push(cObj);
                    board.addHighlight(cObj, Board.COLOR.RED);
                }
            });
            line[0].cell.row.cells.forEach(rowCell=>{
                if(line.length == 2)
                    cond = rowCell != line[0].cell && rowCell != line[1].cell;
                else
                    cond = rowCell != line[0].cell && rowCell != line[1].cell && rowCell != line[2].cell;
                
                let cObj = new CandidateObj(rowCell, line[0].value);
                if(cond)
                {
                    board.addCellHighlight(cObj, Board.COLOR.BLUE);
                }
                else
                {
                    board.addHighlight(cObj);
                    board.addCellHighlight(cObj);
                }
            });
        });
    }
    if(boxLinesColumn.length > 0)
    {
        boxLinesColumn.forEach(line=>{
            if(Solver.candidatesToRemove.length > 0 && !showAll)
                return;
            let cond;
            line[0].cell.block.cells.forEach(blockCell=>{
                if(line.length == 2)
                    cond = blockCell.candidates.includes(line[0].value) && blockCell != line[0].cell && blockCell != line[1].cell;
                else
                    cond = blockCell.candidates.includes(line[0].value) && blockCell != line[0].cell && blockCell != line[1].cell && blockCell != line[2].cell;

                if(cond)
                {
                    let cObj = new CandidateObj(blockCell, line[0].value);
                    Solver.candidatesToRemove.push(cObj);
                    board.addHighlight(cObj, Board.COLOR.RED);
                }
            });
            line[0].cell.column.cells.forEach(columnCell=>{
                if(line.length == 2)
                    cond = columnCell != line[0].cell && columnCell != line[1].cell;
                else
                    cond = columnCell != line[0].cell && columnCell != line[1].cell && columnCell != line[2].cell;
                
                let cObj = new CandidateObj(columnCell, line[0].value);
                if(cond)
                {
                    board.addCellHighlight(cObj, Board.COLOR.BLUE);
                }
                else
                {
                    board.addHighlight(cObj);
                    board.addCellHighlight(cObj);
                }
            });
        });
    }
    if(pointingLinesBlock.length > 0)
    {
        pointingLinesBlock.forEach(line=>{
            if(Solver.candidatesToRemove.length > 0 && !showAll)
                return;
            let lineHouse;
            if(line[0].cell.commonHouse(line[1].cell).includes("row"))
                lineHouse = line[0].cell.row;
            else
                lineHouse = line[1].cell.column;
            let cond;
            lineHouse.cells.forEach(houseCell=>{
                if(line.length == 2)
                    cond = houseCell.candidates.includes(line[0].value) && houseCell != line[0].cell && houseCell != line[1].cell;
                else
                    cond = houseCell.candidates.includes(line[0].value) && houseCell != line[0].cell && houseCell != line[1].cell && houseCell != line[2].cell;

                if(cond)
                {
                    let cObj = new CandidateObj(houseCell, line[0].value);
                    Solver.candidatesToRemove.push(cObj);
                    board.addHighlight(cObj, Board.COLOR.RED);
                }
            });
            line[0].cell.block.cells.forEach(blockCell=>{
                if(line.length == 2)
                    cond = blockCell != line[0].cell && blockCell != line[1].cell;
                else
                    cond = blockCell != line[0].cell && blockCell != line[1].cell && blockCell != line[2].cell;
                
                let cObj = new CandidateObj(blockCell, line[0].value);
                if(cond)
                {
                    board.addCellHighlight(cObj, Board.COLOR.BLUE);
                }
                else
                {
                    board.addHighlight(cObj);
                    board.addCellHighlight(cObj);
                }
            });
        });
    }
    if(Solver.candidatesToRemove.length > 0)
    {
        console.log("Box Line NEW");
        return Solver.REMOVE;
    }
    else
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
        //Solver.action = Solver.showTwoPairElimination();
        Solver.action = Solver.showNakedPairs(); // NEW
        if(Solver.action) return true;
        Solver.action = Solver.showNakedTriples(); // NEW
        if(Solver.action) return true;
        Solver.action = Solver.showNakedQuad(); // NEW
        if(Solver.action) return true;
        Solver.action = Solver.showHiddenPairs(); // NEW
        if(Solver.action) return true;
        Solver.action = Solver.showHiddenTriples(); // NEW
        if(Solver.action) return true;
        Solver.action = Solver.showBoxLine(); // NEW
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