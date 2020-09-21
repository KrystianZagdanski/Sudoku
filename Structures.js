//#region Cell
/*
    Represents single cell in sudoku
*/
class Cell
{
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

    // return candidates if cell have no value otherwise return empty array
    get candidates()
    {
        if(this.value)
            return [];
        else
            return this._candidates;
    }

    // add candidates if not in list already 
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

    // set isGiven flag and value of that cell
    given(number)
    {
        this.value = number;
        this.isGiven = true;
    }

    // delete candidate from list
    removeCandidate(value)
    {
        let index = this._candidates.indexOf(value);
        if(index != -1)
        {
            this._candidates.splice(index, 1);
        }
    }

    // fill solution for this cell and remove this candidate from it's houses
    solve(value)
    {
        this.value = value;
        let cells = []; 
        cells.push(this.row.findCandidate(value));
        cells.push(this.column.findCandidate(value));
        cells.push(this.block.findCandidate(value));
        for(let i = 0; i < 3; i++)
        {
            cells[i].forEach(cell=>{
                if(cell.id == this.id) return;
    
                cell.removeCandidate(value);
            });
        }
        
    }

    // return types of common houses of this and given cell in array
    commonHouse(cell)
    {
        let type = [];
        if(this.row == cell.row) type.push("row");
        if(this.column == cell.column) type.push("column");
        if(this.block == cell.block) type.push("block");
        return type;
    }
}
//#endregion Cell

//#region House
/*
    Represents row, column or block of 9 cells
*/
class House
{
    constructor(index)
    {
        this.cells = []; // list of cells within this house
        this._index = index;
    }

    get index()
    {
        return this._index;
    }

    addCell(cell, type)
    {
        if(this.cells.length < 9)
        {
            if(type == "row") cell.row = this;
            else if(type == "column") cell.column = this;
            else if(type == "block") cell.block = this;
            else console.error("Invalid or no type of House was specitied!");
            this.cells.push(cell);
        }
        else
        {
            console.error("You cna have only 9 cells in a House");
        }
    }

    // return true if value already is in this house
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

    // return all cells containing given digit
    findCandidate(digit)
    {
        let cells = [];
        this.cells.forEach(c =>{
            if(c.candidates.includes(digit)) cells.push(c);
        });
        return cells;
    }

    // return count of given candidate in this house
    countCandidate(digit)
    {
        let count = 0;
        this.cells.forEach(c =>{
            if(cell.value) return;
            if(c.candidates.includes(digit)) count++;
        });
        return count;
    }

    // removes given candidate from all cells in this house except cells in except paramiter
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

    // return count of all candidates in house
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
//#endregion House

//#region Candidate Object
class CandidateObj
{
    constructor(aCell, value)
    {
        this.cell = aCell;
        this.value = value;
    }

    remove()
    {
        this.cell.removeCandidate(this.value);
    }
}
//#endregion Candidate Object

//#region Pair Object
/*
    Object conataining pair of cells with the same candidate
    or single cell with only two candidates
*/
class PairObj
{
    constructor(aCell, values)
    {
        this.cell = aCell;
        this.value = values; 
    }

    // return CandidateObj 
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
//#endregion Pair Object

//#region Link
/*
    Pair of 2 same numbers in 2 diferent cells or 2 diferent numbesr in one cell
*/
class Link
{
    constructor(aCandidateObjA, aCandidateObjB, isWeak)
    {
        this.digitA = aCandidateObjA;
        this.digitB = aCandidateObjB;
        this.isWeak = isWeak;
    }

    // return true if link is strong
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
//#endregion Link

//#region Chain
/*
    Chain is colection of alternating weak and strong links
    Chain must have odd number of links to be correctly completed 

    weak link: pair of numbers where there is more than 2 of them
    strong link: pair of numbers where these are only one in cell or house
*/
class Chain
{
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
    isValid(aLink)
    {
        if(this._strongLinkNext && aLink.isStrong())
            return true;
        else
            return false;
    }

    // add link at the end of the chain or throw an error if weak link is added instead of strong
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

    // remove last link
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
    //#endregion Chain
}