if(document.readyState !== "loading")
{
    main();
}
else
{
    document.addEventListener("DOMContentLoaded", main);
}

// create canvas
const canvas = document.createElement("canvas");
canvas.width = 663;         // + 8(bold lines) + 6(thin lines) -> +14
canvas.height = 663;
const ctx = canvas.getContext("2d");
let curentNumber = null;    // currently selected number
let buttosnDiv;
var cell = [];              // 2d array of Cell objects
var row = [];               // House with cells in rows
var column = [];            // House with cells in columns
var block = [];             // House with cells in blocks
let board = new Board();    // Board object to draw on

/**
 * Updates Board.
 */
function Update()
{
    board.draw(canvas, ctx);

    requestAnimationFrame(Update);
}
/**
 * Set up elements and start Uptade()
 */
function main()
{
    // add canvas to div
    const div = document.getElementById("SudokuDiv");
    div.appendChild(canvas);

    // create new cells
    for(let x = 0; x < 9; x++)
    {
        cell[x] = [];
        column[x] = new House(x, "column");
        for(let y = 0; y < 9; y++)
        {
            // create cell
            cell[x][y] = new Cell(9*y+x);
            // create row in first iteration
            if(x == 0)
            {
                row[y] = new House(y, "row");
            }
            // create block
            let blockIndex = Math.floor(x/3)+3*Math.floor(y/3);
            if(block[blockIndex] == undefined)
            {
                block[blockIndex] = new House(blockIndex, "block");
            }

            // add cells to houses
            column[x].addCell(cell[x][y], "column");
            block[blockIndex].addCell(cell[x][y], "block");
            row[y].addCell(cell[x][y], "row");
            // add houses to cell
            cell[x][y].column = column[x];
            cell[x][y].block = block[blockIndex];
            cell[x][y].row = row[y];
        }
    }
    //Solver.init(cell, row, column, block);
    
    // init Board
    board.init(cell);

    // create buttons
    buttosnDiv = document.getElementById("buttons");
    for(let b = 0; b < 9; b++)
    {
        let button = document.createElement("button");
        button.classList.add("selection");
        button.textContent = b+1;

        button.onclick = (e)=>{
            let buttons = buttosnDiv.children;
            for(let i = 0; i < buttons.length; i++)
            {
                buttons[i].classList.remove("HLBlue");
            }
            if(curentNumber == b+1)
            {
                curentNumber = null;
                return;
            }
            curentNumber = b+1;
            button.classList.add("HLBlue");
        };
        buttosnDiv.appendChild(button);
    }

    //save loader
    document.getElementById("saveFile").addEventListener("change", loadSave, false);

    // create text function buttons
    funcButtonsDiv = document.getElementById("funcButtonsDiv");

    let stepBtn = document.createElement("button");
    stepBtn.textContent = "step()";
    stepBtn.onclick = (e)=>{Solver.step()};
    stepBtn.style.backgroundColor = "lime";
    funcButtonsDiv.appendChild(stepBtn);

    requestAnimationFrame(Update);
}