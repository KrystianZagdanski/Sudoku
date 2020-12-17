/**
 * Take House object and return list with objects containing digits and cells with hidden pairs
 * @param {House} aHouse - A House object
 * @returns {Array.<Object>} [{ digits[2], cells[2] },...]
 */
Solver.findHiddenPairs = (aHouse)=>{
    let hiddemPairs = [];
    let pairsOfNumber = [];
    let temp;
    // get cells of candidates with only 2 occurrences
    for(let i = 0; i < 9; i++)
    {
        temp = aHouse.findCandidate(i+1);
        if(temp.length == 2)
            pairsOfNumber.push({digit: i+1, cells: temp});
    }
    // find pairs
    for(let i = 0; i < pairsOfNumber.length-1; i++)
    {
        for(let j = i+1; j < pairsOfNumber.length; j++)
        {
            if(pairsOfNumber[i].cells[0] == pairsOfNumber[j].cells[0] &&
            pairsOfNumber[i].cells[1] == pairsOfNumber[j].cells[1])
            {
                hiddemPairs.push({
                    digits: [pairsOfNumber[i].digit, pairsOfNumber[j].digit],
                    cells: pairsOfNumber[i].cells
                });
            }
        }
    }
    return hiddemPairs;
}

/**
 * Take House object and return list with objects containing digits and cells with hidden triples
 * @param {House} aHouse - A House object
 * @returns {Array.<Object>} [{ digits[3], cells[3] },...]
 */
Solver.findHiddenTriples = (aHouse)=>{
    let hiddemTriples = [];
    let triplesOfNumber = [];
    let temp;
    // get cells of candidates with only 3 occurrences
    for(let i = 0; i < 9; i++)
    {
        temp = aHouse.findCandidate(i+1);
        if(temp.length == 3)
            triplesOfNumber.push({digit: i+1, cells: temp});
    }
    // find triples
    for(let i = 0; i < triplesOfNumber.length-2; i++)
    {
        temp = [];
        for(let j = i+1; j < triplesOfNumber.length; j++)
        {
            if(triplesOfNumber[i].cells[0] == triplesOfNumber[j].cells[0] &&
            triplesOfNumber[i].cells[1] == triplesOfNumber[j].cells[1]&&
            triplesOfNumber[i].cells[2] == triplesOfNumber[j].cells[2])
            {
                temp.push(triplesOfNumber[j]);
                if(temp.length == 2)
                {
                    hiddemTriples.push({
                        digits: [triplesOfNumber[i].digit, temp[0].digit, temp[1].digit],
                        cells: triplesOfNumber[i].cells
                    });
                }
                    
            }
        }
    }
    return hiddemTriples;
}

/**
 * Take list of House objects and return hidden multiples in object
 * @param {Array.<House>} aHouseArr - List of House objects
 * @returns {Object.<Array.<Object>>} {pairs[{ cells[2], digits[2] }, ...], triples[{ cells[3], digits[3] }, ...]}
 */
Solver.findHidden = (aHouseArr)=>{
    let hidden = {
        pairs: [],
        triples: []
    };
    let temp;
    for(let i = 0; i < aHouseArr.length; i++)
    {
        temp = Solver.findHiddenPairs(aHouseArr[i]);
        if(temp.length > 0)
            hidden.pairs = hidden.pairs.concat(temp);
        temp = Solver.findHiddenTriples(aHouseArr[i]);
        if(temp.length > 0)
            hidden.triples = hidden.triples.concat(temp);
    }
    return hidden;
}

/**
 * Take hiddenObj and return list of candidates to eliminate
 * @param {Object} hiddenObj - Multiple of cells
 * @returns {Array.<CandidateObj>} [CandidateObj, ...]
 */
Solver.findEliminatedByHidden = (hiddenObj)=>{
    let candidatesForElimination = [];
    hiddenObj.cells.forEach(cell=>{
        cell.candidates.forEach(candidate=>{
            if(hiddenObj.digits.length == 2)
            {
                if(candidate != hiddenObj.digits[0] && candidate != hiddenObj.digits[1])
                {
                    candidatesForElimination.push(new CandidateObj(cell, candidate));
                }
            } 
            else
            {
                if(candidate != hiddenObj.digits[0] && candidate != hiddenObj.digits[1] && candidate != hiddenObj.digits[2])
                {
                    candidatesForElimination.push(new CandidateObj(cell, candidate));
                }
            }
        });
    });
    return candidatesForElimination;
}