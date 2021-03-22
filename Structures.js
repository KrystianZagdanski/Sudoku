/**
 * Represents single cell in sudoku.
 * @class
 * @property {number} value - Solution for this cell.
 * @property {number} id - Index of a cell.
 * @property {Boolean} isGiven - True if it's oryginally given number and not filled by user.
 * @property {House} row - Row of this cell.
 * @property {House} column - Column of this cell.
 * @property {House} block - block of this cell.
 * @property {Array.<number>} _candidates - Colection of numbers which might be solution.
 */
class Cell
{
    /**
     * @constructor
     * @param  {number} id - Index of a cell.
     */
    constructor(id)
    {
        this.value = null;
        this.id = id;
        this.isGiven = false;
        this.row = null;
        this.column = null;
        this.block = null;

        this._candidates = [];
    }

    /**
     * Returns candidates if cell isn't solved.
     * @readonly
     * @public
     */
    get candidates()
    {
        if(this.value)
            return [];

        return this._candidates;
    }

    /**
     * Return copy of this cell
     * @returns {Cell}
     */
    copy()
    {
        let newCell = new Cell(this.id);
        newCell.value = this.value;
        newCell.isGiven = this.isGiven;
        newCell.row = this.row;
        newCell.column = this.column;
        newCell.block = this.block;
        newCell._candidates = this._candidates.slice(0);
        return newCell;
    }

    /**
     * Take Cell and returns true if it have the same candidates.
     * @param {Cell} Cell - Cell objesct.
     * @returns {true | false} true|false
     */
    haveSameCandidatesAs(aCell)
    {
        if(this.candidates.length != aCell.candidates.length)
            return false;
        
        for(let i = 0; i < this.candidates.length; i++)
        {
            if(this.candidates[i] != aCell.candidates[i])
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
        this._candidates.sort((a,b)=>{return a-b;});
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

    /**
     * Returns list of common candidates.
     * @param  {Cell} aCell - Cell to compare to.
     * @returns {Array.<number>} [digit, ...].
     */
    commonCandidates(aCell)
    {
        let candidates = [];
        this.candidates.forEach(digitA=>{
            aCell.candidates.forEach(digitB=>{
                if(digitA == digitB)
                    candidates.push(digitA);
            });
        });
        return candidates;
    }
}

/**
 * Represents row or column or block of 9 cells in sudoku.
 * @calss
 * @property {Array.<Cell>} cells - List of cells within this house.
 * @property {number} _index - Index of a house.
 * @property {"row" | "column" | "block"} type - Type of a house.
 */
class House
{
    /**
     * @param  {number} id - Index of a House.
     * @param {"row" | "column" | "block"} type - Type of a house.
     * @constructor
     */
    constructor(id, type)
    {
        this.cells = [];
        this._index = id;
        this.type = type;
    }

    /**@readonly */
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
            console.error("You can have only 9 cells in a House");
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
     * @returns {number} [0-9]
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

/**
 * Object holding value of candidate and Cell
 * @calss
 * @property {Cell} cell - Cell with candidate
 * @property {number} value - Candidate/Digit
 */
class CandidateObj
{
    /**
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

/**
 * Representation of two candidates creating a pair.(Only 2 digits in a cell or the same digit in 2 cells)
 * @class
 * @property {Array.<Cell> | Cell} cell - Cell or [Cell, Cell] creating pair.
 * @property {Array.<number> | number} value - Value or [value, value] creating pair.
 */
class PairObj
{
    /**
     * @param  {Array.<Cell> | Cell} aCell - Cell or [Cell, Cell] creating pair.
     * @param  {Array.<number> | number} values - [value, value] or value creating pair.
     */
    constructor(aCell, values)
    {
        this.cell = aCell;
        this.value = values;
    }

    /**
     * Returns first or second candidate as CandidateObj.
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

/**
 * Represents X-Wing
 * @class
 * @property {number} value - Candidate digit.
 * @property {Array.<Cell>} cells - Cells of X-wing.
 * @property {"row" | "column"} houseType - Common house type of cells.
 * @property {Array.<Cell>} fins - Finn Cells of X-Wing.
 * @property {Cell} emptyCell - Cell without candidate.
 */
class XWing
{
    /**
     * @param  {number} value - Candidate digit.
     * @param  {Array.<Cell>} cells - Cells of X-wing.
     * @param  {"row" | "column"} houseType - Common house type of cells.
     * @param  {Array.<Cell>} [fins] - Finn Cells of X-Wing.
     * @param  {Cell} [emptyCell] - Cell without candidate.
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
     * @param  {number} index - Index of Cell.
     * @returns {CandidateObj} - CandidateObj
     */
    getCandidateObj(index)
    {
        return new CandidateObj(this.cells[index], this.value);
    }
}

/**
 * Represents Fish
 * @class
 * @property {number} value - Candidate digit.
 * @property {Array.<Cell>} cells - Cells of Fish.
 * @property {"row" | "column"} houseType - Common house type of cells.
 * @property {Array.<Cell>} fins - Finn Cells of Fish.
 * @property {Cell} emptyCell - Cell without candidate.
 */
class Fish
{
    /**
     * @param  {number} value - Candidate digit.
     * @param  {Array.<Cell>} cells - Cells of Fish.
     * @param  {"row" | "column"} houseType - Common house type of cells.
     * @param  {Array.<House>} eliminationHouses - List of houses where fish can eliminate candidates.
     * @param  {Array.<Cell>} [fins] - Finn Cells of Fish.
     * @param  {Cell} [emptyCell] - Cell without candidate.
     * @constructor
     */
    constructor(value, cells, houseType, eliminationHouses, fins, emptyCell)
    {
        this.value = value;
        this.cells = cells;
        this.houseType = houseType;
        this.eliminationHouses = eliminationHouses;
        this.fins = fins || [];
        this.emptyCell = emptyCell || false;
    }

    /**
     * Returns cell of a Fish as CandidateObj.
     * @param  {number} index - Index of Cell.
     * @returns {CandidateObj} - CandidateObj
     */
    getCandidateObj(index)
    {
        return new CandidateObj(this.cells[index], this.value);
    }
}

/**
 * Pair of two linked CandidateObj.
 * @class
 * @property {CandidateObj} digitA - Start of a link.
 * @property {CandidateObj} digitB - End of a link.
 * @property {Boolean} isWeak - Set to true if it's used as weak link.
 */
class Link
{
    /**
     * @param  {CandidateObj} aCandidateObjA - First CandidateObj.
     * @param  {CandidateObj} aCandidateObjB - Second CandidateObj.
     * @param  {Boolean} isWeak - Set to true if it's used as weak link.
     * @constructor
     */
    constructor(aCandidateObjA, aCandidateObjB, isWeak)
    {
        this.digitA = aCandidateObjA;
        this.digitB = aCandidateObjB;
        this.isWeak = isWeak || !this.isStrong();
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

/**
 * Represents chain in sudoku. Odd number of Alternating weak and strong Links.
 * @class
 * @property {CandidateObj} first - Start of a chain.
 * @property {CandidateObj} last - End of a chain.
 * @property {Array.<Link>} links - List of links in a chain.
 * @property {Boolean} _complete - Flag specify if chain is complete (have odd number of links).
 * @property {Boolean} _strongLinkNext - Flag specify if next link should be strong or not.
 */
class Chain
{
    /**
     * @constructor
     */
    constructor()
    {
        /**@public */
        this.first = null;
        this.last = null;
        this.links = [];

        /**@private */
        this._complete = false;
        this._strongLinkNext = true;
    }

    /**
     * Returns true if Chain is complete.
     * @readonly
     */
    get complete()
    {
        return this._complete;
    }

    /**
     * Returns length of a chain
     * @readonly
     */
    get length()
    {
        return this.links.length;
    }

    /**
     * Returns copy of itself.
     * @returns {Chain} Chain
     */
    copy()
    {
        let chainCopy = new Chain();
        chainCopy.first = this.first;
        chainCopy.last = this.last;
        chainCopy.links = this.links.slice(0);
        chainCopy._complete = this._complete;
        chainCopy._strongLinkNext = this._strongLinkNext;
        return chainCopy;
    }

    /**
     * Returns true if cell is part of this chain.
     * @param {Cell} aCell - Cell you want ot search for.
     * @returns {Boolean} true | flase
     */
    isPartOfChain(aCell)
    {
        for(let i = 0; i < this.links.length; i++)
        {
            if(aCell == this.links[i].digitA.cell || aCell == this.links[i].digitB.cell)
                return true;
        }
        return false;
    }
    /**
     * Returns true if given Link can be the next link in this Chain.
     * @param  {Link} aLink - Link to check.
     * @returns {Boolean} true or false.
     */
    isValid(aLink)
    {
        if(this._strongLinkNext && aLink.isStrong())
            return true;
        else if(!this._strongLinkNext)
            return true;
        else
            return false;
    }

    /**
     * Create Link from last point to given Candidate.
     * @param {CandidateObj} aCandidateObj - New end point of a chain.
     */
    linkTo(aCandidateObj)
    {
        if(this.last == null) throw Error("Chain have no links to attach to!");
        let anchor = this.links[this.links.length-1].digitB;
        let newLink = new Link(anchor, aCandidateObj);
        this.push(newLink);
    }

    /**
     * Create Link from A to B.
     * @param {CandidateObj} aCandidateObjA - Start.
     * @param {CandidateObj} aCandidateObjB  - End.
     */
    linkFromTO(aCandidateObjA, aCandidateObjB)
    {
        let newLink = new Link(aCandidateObjA, aCandidateObjB);
        this.push(newLink);
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

        if(!this._strongLinkNext)
            aLink.isWeak = true;
        this.links.push(aLink); // add link
        this._strongLinkNext = !this._strongLinkNext; // alterd link type
        if(this.links.length % 2 == 0)
            this._complete = false;
        else
            this._complete = true;

        if(this.first == null) // set first cell
        {
            this.first = aLink.digitA;
        }
        this.last = aLink.digitB; // set last cell
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