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
 * @param {Array.<Chain>} aChainArr - List of Chain objects
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