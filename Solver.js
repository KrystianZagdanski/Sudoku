/*
    Active parts of solver
*/
//#region methods + solutions

// fill all posible candidates in every cell
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

// highlights naked singles (method code 1)
Solver.showNakedSingles = ()=>{
    Solver.nakedSingles = Solver.findNakedSingle(cell);
    if(Solver.nakedSingles)
    {
        Solver.nakedSingles.forEach(obj=>{board.addHighlight(obj);});
        console.log("Naked Single (Code 1)");
        return 1;
    }
    return false;
}

// solve naked singles (method code 1 solution)
Solver.solveNakedSingles = ()=>{
    if(Solver.nakedSingles)
        Solver.nakedSingles.forEach(obj=>{obj.cell.solve(obj.value)});
}

// highlight hidden singles (method code 2)
Solver.showHiddenSingles = ()=>{
    Solver.hiddenSinges = Solver.findHiddenSingle(row, column, block);
    if(Solver.hiddenSinges)
    {
        Solver.hiddenSinges.forEach(obj=>{board.addHighlight(obj);});
        console.log("Hidden Single (Code 2)");
        return 2;
    }
    return false;
}

// solve hidden singles (method code 2 solution)
Solver.solveHiddenSingles = ()=>{
    if(Solver.hiddenSinges)
        Solver.hiddenSinges.forEach(obj=>{obj.cell.solve(obj.value)});
}

// highlight pairs and candidates to eliminate (method code 3)
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
        console.log("Elimination Pair (Code 3)");
        return 3;
    }
    return false;
}

// remove eliminated candidates from elimination pairs (method code 3 solution)
Solver.removeEliminationPairsCandidates = ()=>{
    if(Solver.candidatesToRemove.length == 0) return;

    Solver.candidatesToRemove.forEach(cadidateObj=>{
        cadidateObj.remove();
    });

    Solver.candidatesToRemove = [];
    Solver.emininationPairs = [];
}

// highlight double elimination (method code 4)
Solver.showHiddenDoubles = ()=>{
    Solver.hiddenDoubles = Solver.findHiddenDouble(block);
    if(Solver.hiddenDoubles)
    {
        Solver.hiddenDoubles.forEach(double=>{
            // highlight candidates for elimination
            double.pair1.cell[0].candidates.forEach(candidate=>{
                if(candidate != double.pair1.value && candidate != double.pair2.value)
                {
                    board.addHighlight(new CandidateObj(double.pair1.cell[0], candidate), "red");
                }
            });
            double.pair1.cell[1].candidates.forEach(candidate=>{
                if(candidate != double.pair1.value && candidate != double.pair2.value)
                {
                    board.addHighlight(new CandidateObj(double.pair1.cell[1], candidate), "red");
                }
            });
            // highlight double
            board.addHighlight(double.pair1.getCandidateObj(0));
            board.addHighlight(double.pair1.getCandidateObj(1));
            board.addHighlight(double.pair2.getCandidateObj(0));
            board.addHighlight(double.pair2.getCandidateObj(1));
        });
        console.log("Double (Code 4)");
        return 4;
    }
    return false;
}

// remove other candidates from double elimination cells (method code 4 solution)
Solver.removeDoubleEmininationCandidates = ()=>{
    if(!Solver.hiddenDoubles) return;

    Solver.hiddenDoubles.forEach(double=>{
        for(let digit = 1; digit <= 9; digit++)
        {
            if(digit != double.pair1.value && digit != double.pair2.value)
            {
                double.pair1.cell[0].removeCandidate(digit);
                double.pair1.cell[1].removeCandidate(digit);
            }
        }
    });
}

// highlight two pair elimination (method code 5)
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
        console.log("Two Pair Elimination (Code 5)");
        return 5;
    }
    return false;
}

// remove eliminated candidates from two pair elimination (method code 5 solution)
Solver.removeTwoPairEliminationCandidates = ()=>{
    if(Solver.candidatesToRemove.length == 0) return;

    Solver.candidatesToRemove.forEach(cadidateObj=>{
        cadidateObj.remove();
    });

    Solver.candidatesToRemove = [];
    Solver.emininationPairs = [];
}

// highlight X-Wing (method code 6)
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
        console.log("X-Wing (Code 6)");
        return 6;
    }
    return false;
}

// remove eliminated candidates from X-Wing (method code 6 solution)
Solver.removeXWingCandidates = ()=>{
    if(Solver.candidatesToRemove.length == 0) return;

    Solver.candidatesToRemove.forEach(cadidateObj=>{
        cadidateObj.remove();
    });

    Solver.candidatesToRemove = [];
}

// highlight Finned X-Wing (method code 7)
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
        console.log("Finned X-Wing (Code 7)");
        return 7;
    }
    return false;
}

// remove eliminated candidates from Finned X-Wing (method code 7 solution)
Solver.removeFinnedXWingCandidates = ()=>{
    if(Solver.candidatesToRemove.length == 0) return;

    Solver.candidatesToRemove.forEach(cadidateObj=>{
        cadidateObj.remove();
    });

    Solver.candidatesToRemove = [];
}

//#endregion methods + solutions

// alternate between showing method and applying it
// return true if any action could be taken otherwise return false
Solver.step = ()=>{

    // fill candidates if flag is ont set and set flag to true
    if(!Solver.candidatesFilled)
    {
        Solver.fillAllCandidates(cell);
        Solver.candidatesFilled = true;
        return true;
    }

    if(Solver.methodCode == undefined)
        Solver.methodCode = false;
    
    // if method was found then execude it
    if(Solver.methodCode)
    {
        switch(Solver.methodCode)
        {
            case 1:
                Solver.solveNakedSingles();
                break;
            case 2:
                Solver.solveHiddenSingles();
                break;
            case 3:
                Solver.removeEliminationPairsCandidates();
                break;
            case 4:
                Solver.removeDoubleEmininationCandidates();
                break;
            case 5:
                Solver.removeTwoPairEliminationCandidates();
                break;
            case 6:
                Solver.removeXWingCandidates();
                break;
            case 7:
                Solver.removeFinnedXWingCandidates();
                break;
            default:
                break;
        }
        board.removeHighlight();
        board.removeCellHighlight();
        Solver.methodCode = false;
        return true;
    }
    else // find and save method code to Solver.methodCode
    {
        Solver.methodCode = Solver.showNakedSingles();
        if(Solver.methodCode) return true;
        Solver.methodCode = Solver.showHiddenSingles();
        if(Solver.methodCode) return true;
        Solver.methodCode = Solver.showEliminationPairs();
        if(Solver.methodCode) return true;
        Solver.methodCode = Solver.showHiddenDoubles();
        if(Solver.methodCode) return true;
        Solver.methodCode = Solver.showTwoPairElimination();
        if(Solver.methodCode) return true;
        Solver.methodCode = Solver.showXWing();
        if(Solver.methodCode) return true;
        Solver.methodCode = Solver.showFinnedXWing();
        if(Solver.methodCode) return true;
    }
    return false;

}