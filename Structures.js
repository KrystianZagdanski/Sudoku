class Cell
{
    /**
     * Represents single cell in sudoku.
     * @constructor
     * @param  {number} id - Index of a cell.
     */
    constructor(id)
    {
        // Public
        this.value = null;          // Solution for this cell
        this.id = id;               // index
        this.isGiven = false;       // True if it's oryginally given number and not filled by user
        this.row = null;            // row of this cell
        this.column = null;         // column of this cell
        this.block = null;          // block of this cell

        // Private
        this._candidates = [];       // Colection of numbers which might be solution
    }

    get candidates()
    {
        if(this.value)
            return [];
        else
            return this._candidates;
    }

    /**
     * Take Cell and returns true if it have the same candidates
     * @param {Cell} Cell - Cell objesct
     * @returns {true | false} true|false
     */
    haveSameCandidatesAs(Cell)
    {
        if(this.candidates.length != Cell.candidates.length)
            return false;
        
        for(let i = 0; i < this.candidates.length; i++)
        {
            if(this.candidates[i] != Cell.candidates[i])
                return false;
        }

        return true;
    }

    /**
     * Add candidates to Cell.
     * @param  {Array.<number> | number} candidates - Candidates you want to add.
     */
    addCandidates(candidates)
    {
        if(Array.isArray(candidates))
        {
            candidates.forEach(value => {
                if(!this._candidates.includes(value))
                {
                    this._candidates.push(value);
                }
            });
        }
        else if(candidates != null && !this._candidates.includes(candidates))
        {
            this._candidates.push(candidates);
        }
    }

    /**
     * Set value of a Cell and isGiven flag.
     * @param  {number} digit - Value of a cell.
     */
    given(digit)
    {
        this.value = digit;
        this.isGiven = true;
    }

    /**
     * Remove candidate from Cell candidates.
     * @param  {number} digit - Candidate to remove.
     */
    removeCandidate(digit)
    {
        let index = this._candidates.indexOf(digit);
        if(index != -1)
        {
            this._candidates.splice(index, 1);
        }
    }

    /**
     * Set Cell value and romove it from all houses of this Cell.
     * @param  {number} digit - Solution for cell.
     */
    solve(digit)
    {
        this.value = digit;
        let cells = []; 
        cells.push(this.row.findCandidate(digit));
        cells.push(this.column.findCandidate(digit));
        cells.push(this.block.findCandidate(digit));
        for(let i = 0; i < 3; i++)
        {
            cells[i].forEach(cell=>{
                if(cell.id == this.id) return;
    
                cell.removeCandidate(digit);
            });
        }
    }

    /**
     * Returns list of types of houses common with aCell.
     * @param  {Cell} aCell - Cell to compare to.
     * @returns {Array.<string>} "row" or "column" or "block".
     */
    commonHouse(aCell)
    {
        let type = [];
        if(this.row == aCell.row) type.push("row");
        if(this.column == aCell.column) type.push("column");
        if(this.block == aCell.block) type.push("block");
        return type;
    }
}

class House
{
    /**
     * Represents row or column or block of 9 cells in sudoku.
     * @param  {number} id - Index of a House.
     * @param {string} type - Type of a house: "row" or "column" or "block".
     * @constructor
     */
    constructor(id, type)
    {
        this.cells = []; // list of cells within this house
        this._index = id;
        this.type = type;
    }

    get index()
    {
        return this._index;
    }

    /**
     * Add Cell to House and House this House to cell.
     * @param  {Cell} aCell - Cell to add to the House..
     */
    addCell(aCell)
    {
        if(this.cells.length < 9)
        {
            aCell[this.type] = this;
            this.cells.push(aCell);
        }
        else
        {
            console.error("You cna have only 9 cells in a House");
        }
    }

    /**
     * Returns true if any cell in this House have given value.
     * @param  {number} value - Value to look for.
     * @returns {Boolean} True of False.
     */
    valueInHouse(value)
    {
        let isIn = false;
        this.cells.forEach(c =>{
            if(c.value == value)
            {
                isIn = true;
                return;
            }
        });

        return isIn;
    }

    /**
     * Returns list of Cells containing given digit in candidates.
     * @param  {number} digit - Candidate to find.
     * @returns {Array.<Cell>}
     */
    findCandidate(digit)
    {
        let cells = [];
        this.cells.forEach(c =>{
            if(c.candidates.includes(digit)) cells.push(c);
        });
        return cells;
    }

    /**
     * Returns number of appearances of a candidate in this House.
     * @param  {number} digit - Candidate.
     * @returns {number} 0-9
     */
    countCandidate(digit)
    {
        let count = 0;
        this.cells.forEach(c =>{
            if(cell.value) return;
            if(c.candidates.includes(digit)) count++;
        });
        return count;
    }

    /**
     * Remove candidate from house except specified cells.
     * @param  {number} digit - Candidate.
     * @param  {Array.<Cell> | Cell} [except] - Cells to ignore.
     */
    removeCandidate(digit, except)
    {
        this.cells.forEach(cell=>{
            if(except)
            {
                if(Array.isArray(except))
                {
                    if(except.includes(cell)) return;
                }
                else
                {
                    if(cell == except) return;
                }
            }
            cell.removeCandidate(digit);
        });
    }

    /**
     * Returns list of number of canidates in House.
     * @returns {Array.<number>} [number_of_candidate_x,...]
     */
    countAllCandidates()
    {
        let count = [];
        for(let i = 1; i <= 9; i++)
        {
            count[i-1] = this.countCandidate(i);
        }
        return count;
    }
}

class CandidateObj
{
    /**
     * Represents candidate in a Cell.
     * @param  {Cell} aCell - Cell of a candidate.
     * @param  {number} value - Digit, cnadidate.
     */
    constructor(aCell, value)
    {
        this.cell = aCell;
        this.value = value;
    }
    /**
     * Remove this candidate from cell.
     */
    remove()
    {
        this.cell.removeCandidate(this.value);
    }
    /**
     * Use this candidate to solve cell.
     */
    setAsSolution()
    {
        this.cell.solve(this.value);
    }
}

class PairObj
{
    /**
     * Representation of two candidates creating a pair.(Only 2 digits in a cell or the same digit in 2 cells)
     * @param  {Array.<Cell> | Cell} aCell - Cell or [Cell, Cell] creating pair.
     * @param  {Array.<number> | number} values - [value, value] or value creating pair.
     */
    constructor(aCell, values)
    {
        this.cell = aCell;
        this.value = values;
    }

    /**
     * Returns first or second candidate as CandidateObj
     * @param  {number} index - Index of cadidate (0 or 1).
     * @returns {CandidateObj} CandidateObj
     */
    getCandidateObj(index)
    {
        if(Array.isArray(this.cell))
        {
            return new CandidateObj(this.cell[index], this.value);
        }
        else
        {
            return new CandidateObj(this.cell, this.value[index]);
        }
    }
}

class XWing
{
    /**
     * Represents X-Wing
     * @param  {number} value - Candidate digit.
     * @param  {Array.<Cell>} cells - Cells of X-wing.
     * @param  {string} houseType - Common house type of cells "row" or "column".
     * @param  {Array.<Cell>} [fins] - Finn Cells of X-Wing.
     * @param  {Cell} [emptyCell] - Cell withoud candidate.
     * @constructor
     */
    constructor(value, cells, houseType, fins, emptyCell)
    {
        this.value = value;
        this.cells = cells;
        this.houseType = houseType;
        this.fins = fins || [];
        this.emptyCell = emptyCell || false;
    }
    /**
     * Returns cell of a X-Wing as CandidateObj.
     * @param  {number} index - index of Cell.
     * @returns {CandidateObj} - CandidateObj
     */
    getCandidateObj(index)
    {
        return new CandidateObj(this.cells[index], this.value);
    }
}

class Link
{
    /**
     * Pair of two linked CandidateObj.
     * @param  {CandidateObj} aCandidateObjA - First CandidateObj.
     * @param  {CandidateObj} aCandidateObjB - Second CandidateObj.
     * @param  {Boolean} isWeak - Set to true if it's used as weak link.
     * @constructor
     */
    constructor(aCandidateObjA, aCandidateObjB, isWeak)
    {
        this.digitA = aCandidateObjA;
        this.digitB = aCandidateObjB;
        this.isWeak = isWeak;
    }

    /**
     * Returns true if link is strong.
     * @returns {Boolean} true or false.
     */
    isStrong()
    {
        if(this.digitA.cell == this.digitB.cell) // if candidates are in the same cell
        {
            if(this.digitA.cell.candidates.length == 2)
                return true;
            else
                return false;
        }
        else // if candidates are the same
        {
            let commonHouse = this.digitA.cell.commonHouse(this.digitB.cell);
            if(commonHouse.length == 0) return false;

            if(commonHouse.includes("row"))
            {
                let candidatesCount = this.digitA.cell.row.countCandidate(this.digitA.value)
                if( candidatesCount == 2) return true;
            }
            if(commonHouse.includes("column"))
            {
                let candidatesCount = this.digitA.cell.column.countCandidate(this.digitA.value)
                if( candidatesCount == 2) return true;
            }
            if(commonHouse.includes("block"))
            {
                let candidatesCount = this.digitA.cell.block.countCandidate(this.digitA.value)
                if( candidatesCount == 2) return true;
            }
            return false;
        }
    }
}

class Chain
{
    /**
     * Represents chain in sudoku. Odd number of Alternating weak and strong Links.
     * @constructor
     */
    constructor()
    {
        // Public
        this.first = null; // start point cell
        this.last = null; // end poin cell
        this.links = []; // list of links in order

        // Private
        this._complete = false;
        this._strongLinkNext = true; // flag indicating if next link should be strong 
    }

    get complete()
    {
        return this._complete;
    }

    // return true if given link can be next link of this chain
    /**
     * Returns true if given Link can be the next link in this Chain.
     * @param  {Link} aLink - Link to check.
     * @returns {Boolean} true or false.
     */
    isValid(aLink)
    {
        if(this._strongLinkNext && aLink.isStrong())
            return true;
        else
            return false;
    }

    /**
     * Add link to the chain if Link is valid.
     * @param  {Link} aLink - Link to add.
     */
    push(aLink)
    {
        if(!this.isValid(aLink))
        {
            console.error("Expected Strong Link!:",aLink);
            return;
        }

        this.links.push(aLink); // add link
        this._strongLinkNext = !this._strongLinkNext; // alterd link type
        if(this.links.length % 2 == 0)
            this._complete = false;
        else
            this._complete = true;

        if(this.first == null) // set first cell
        {
            this.first = aLink.cellA;
        }
        this.last = aLink.cellB; // set last cell
    }

    /**
     * Remove last Link.
     */
    pop()
    {
        this.links.pop();
        if(this.links.length > 0)
        {
            this.last = this.links[this.links.length-1];
        }
        else
        {
            this.first = null;
            this.last = null;
        }
    }
}