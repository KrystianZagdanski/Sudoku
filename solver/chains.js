/**
 * Take list of Cell objects and return list of chains creating YWing
 * @param {Array.<Cell>} aCellArr - List of Cell objects
 * @returns {Array.<Chain>} [Chain, ...]
 */
Solver.findYWing = (aCellArr)=>{
    let chains = [];
    let pairs = Solver.findTwoDigitCells(aCellArr);
    if(!pairs)
        return [];
    pairs.forEach(anchor => {
        let armA = [], armB = [];
        let valA = anchor.value[0],
        valB = anchor.value[1],
        valC = null;

        for(let i = 0; i < pairs.length; i++)
        {
            let p = pairs[i];
            if(p == anchor) continue;
            if(p.cell.commonHouse(anchor.cell).length > 0)
            {
                let cand = p.value;
                let foundArmA = cand.includes(valA) && !cand.includes(valB);
                let foundArmB = cand.includes(valB) && !cand.includes(valA);
                if(foundArmA || foundArmB)
                {
                    if(foundArmA)
                    {
                        valC = cand[0] != valA ? cand[0] : cand[1];
                        armA.push([p.cell, valC]);
                    }
                    else
                    {
                        valC = cand[0] != valB ? cand[0] : cand[1];
                        armB.push([p.cell, valC]);
                    }

                    if(armA.length > 0 && armB.length > 0)
                    {
                        for(let a = 0; a < armA.length; a++)
                        {
                            for(let b = 0; b < armB.length; b++)
                            {
                                if(armA[a][1] == armB[b][1] && armA[a][0].commonHouse(armB[b][0]).length == 0)
                                {
                                    let chain = new Chain();
                                    chain.linkFromTO(new CandidateObj(armA[a][0], armA[a][1]), new CandidateObj(armA[a][0], valA)); // from armA_C to armA_A
                                    chain.linkTo(new CandidateObj(anchor.cell, valA)); // from armA_A to anchor_A
                                    chain.linkTo(new CandidateObj(anchor.cell, valB)); // from anchor_A to anchor_B
                                    chain.linkTo(new CandidateObj(armB[b][0], valB)); // from anchor_B to armB_B
                                    chain.linkTo(new CandidateObj(armB[b][0], armB[b][1])); // from armB_B to armB_C
                                    chains.push(chain);
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    return chains;
}

/**
 * Takes Chain creating YWing and return list of candidates that can be eliminated by it
 * @param {Chain} aChain - A Chain object
 * @returns {Array.<CandidateObj>} [CandidateObj, ...] 
 */
Solver.findEliminatedByYWing = (aChain)=>{
    let candidatesForElimination = [];
    let A = aChain.first,
    B = aChain.last;
    let commonBlockWithA = A.cell.commonHouse(aChain.links[2].digitA.cell).includes("block");
    let commonBlockWithB = B.cell.commonHouse(aChain.links[2].digitA.cell).includes("block");
    if(commonBlockWithA || commonBlockWithB)
    {
        A.cell.block.cells.forEach(cell=>{
            if( (cell.row.index == B.cell.row.index && cell.candidates.includes(A.value)) ||
            (cell.column.index == B.cell.column.index && cell.candidates.includes(A.value)) )
            {
                candidatesForElimination.push(new CandidateObj(cell, A.value));
            }
        });
        B.cell.block.cells.forEach(cell=>{
            if( (cell.row.index == A.cell.row.index && cell.candidates.includes(A.value)) ||
            (cell.column.index == A.cell.column.index && cell.candidates.includes(A.value)) )
            {
                candidatesForElimination.push(new CandidateObj(cell, A.value));
            }
        });
    }
    else
    {
        let cell1 = A.cell.row.cells[B.cell.column.index],
        cell2 = A.cell.column.cells[B.cell.row.index];
        if(cell1.candidates.includes(A.value))
            candidatesForElimination.push(new CandidateObj(cell1, A.value));
        if(cell2.candidates.includes(A.value))
            candidatesForElimination.push(new CandidateObj(cell2, A.value));
    }

    return candidatesForElimination;
}

/**
 * Take start pair, index of candidate of taht pair and list of pairs 
 * and return list of Chains created from that point
 * @param {PairObj} start - start point PairObj
 * @param {number} startIndex - index of value to start from
 * @param {Array.<PairObj>} pairs - list of pairs
 * @param {Chain} chain - current chain
 * @param {Array.<Chain>} - list of found chains
 * @returns {Array.<Chain>} [Chain,...]
 */
Solver.findChain = (start, startIndex, pairs_, chain = new Chain(), chains = [])=>{
    let pairs = pairs_.slice(0);
    if(chain.first == null)
    {
        pairs.splice(pairs.indexOf(start), 1);
        chain.linkFromTO(new CandidateObj(start.cell, start.value[startIndex]), new CandidateObj(start.cell, start.value[startIndex>0?0:1]));
    }
    for(let i = 0; i < pairs.length; i++)
    {
        if(pairs[i].cell.commonHouse(chain.last.cell).length > 0)
        {
            if(pairs[i].value[0] == chain.last.value)
            {
                let chainCopy = chain.copy();
                chainCopy.linkTo(new CandidateObj(pairs[i].cell, pairs[i].value[0]));
                chainCopy.linkTo(new CandidateObj(pairs[i].cell, pairs[i].value[1]));
                if(chainCopy.last.value == chainCopy.first.value)
                {
                    chains.push(chainCopy);
                }
                let newPairs = pairs.slice(0);
                newPairs.splice(i, 1);
                Solver.findChain(start, null, newPairs, chainCopy.copy(), chains);
            }
            else if(pairs[i].value[1] == chain.last.value)
            {
                let chainCopy = chain.copy();
                chainCopy.linkTo(new CandidateObj(pairs[i].cell, pairs[i].value[1]));
                chainCopy.linkTo(new CandidateObj(pairs[i].cell, pairs[i].value[0]));
                if(chainCopy.last.value == chainCopy.first.value)
                    chains.push(chainCopy);
                let newPairs = pairs.slice(0);
                newPairs.splice(i, 1);
                Solver.findChain(start, null, newPairs, chainCopy.copy(), chains);
            }
        }
    }
    
    if(startIndex != null)
        return chains;
    
}

/**
 * Take list of cells and return sorted list of XY-Chains
 * @param {Array.<Cell>} aCellArr - List of Cell objects
 * @returns {Array.<Chain>} [Chain, ...] 
 */
Solver.findXYChains = (aCellArr)=>{
    let chains = [];
    let pairs = Solver.findTwoDigitCells(aCellArr);
    if(!pairs)
        return [];
    pairs.forEach(pair=>{
        for(let startIndex = 0; startIndex < pair.value.length; startIndex++)
        {
            chains = chains.concat(Solver.findChain(pair, startIndex, pairs));
        }
    });
    chains.sort((c1,c2)=>{
        if(c1.length > c2.length) return 1;
        if(c1.length < c2.length) return -1;
        return 0;
    });
    return chains;
}

/**
 * Take Chain and return list of candidates that can be eliminated by it
 * @param {Chain} aChain - A Chain object
 * @returns {Array.<CandidateObj>} [CandidateObj, ...] 
 */
Solver.findEliminatedByXYChain = (aChain)=>{
    let candidatesForElimination = [];
    let A = aChain.first, B = aChain.last;
    let commonHouses = A.cell.commonHouse(B.cell);

    if(commonHouses.length == 0)
    {
        let Ah = [A.cell.row.cells, A.cell.column.cells];
        let Bh = [B.cell.row.cells, B.cell.column.cells];
        let ArBc = A.cell.row.cells[B.cell.column.index];
        let AcBr = A.cell.column.cells[B.cell.row.index];
        if(ArBc.candidates.includes(A.value) && !aChain.isPartOfChain(ArBc))
            candidatesForElimination.push(new CandidateObj(ArBc, A.value));
        if(AcBr.candidates.includes(A.value) && !aChain.isPartOfChain(AcBr))
            candidatesForElimination.push(new CandidateObj(AcBr, A.value));

        Ah.forEach(cells=>{
            cells.forEach(cell=>{
                if(cell.block == B.cell.block && cell.candidates.includes(A.value) &&
                cell != ArBc && cell != AcBr && !aChain.isPartOfChain(cell))
                {
                    candidatesForElimination.push(new CandidateObj(cell, A.value));
                }
            });
        });

        Bh.forEach(cells=>{
            cells.forEach(cell=>{
                if(cell.block == A.cell.block && cell.candidates.includes(A.value) &&
                cell != ArBc && cell != AcBr && !aChain.isPartOfChain(cell))
                {
                    candidatesForElimination.push(new CandidateObj(cell, A.value));
                }
            });
        });
        
    }
    else
    {
        commonHouses.forEach(houseType=>{
            A.cell[houseType].cells.forEach(ABHouseCell=>{
                if(ABHouseCell == A.cell || ABHouseCell == B.cell)
                    return;
    
                if(ABHouseCell.candidates.includes(A.value) && !aChain.isPartOfChain(ABHouseCell))
                    candidatesForElimination.push(new CandidateObj(ABHouseCell, A.value));
            });
        });
    }
    

    return candidatesForElimination;
}