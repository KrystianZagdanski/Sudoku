class Board
{

    static COLOR = {
        RED: "red",
        GREEN: "green",
        BLUE: "blue",
        YELLOW: "yellow"
    };
    /**
     * Create new visable representation of a board.
     * @constructor
     */
    constructor()
    {
        // data
        this.cells = [];                // logical cells
        this.boxes = [];                // visual cells to draw
        this.links = [];                // listo of links to draw
        this.highlights = [];           // list of candidates {obj:CandidateObj, color:color} to highlight
        this.cellHighlights = [];       // list of cells {obj:CandidateObj, color:color} to highlight

        // board
        this.backgroundColor = "#000";
        this.leftOffset = 2;

        // cells
        this.cellSize = 70;
        
        this.cellColor = "gray";
        this.cellColor2 = "#777"
        this.cellHighlightColor = "rgba(200, 255, 200, 1)";
        this.cellHighlightColor2 = "rgba(200, 255, 200, 0.5)";
        this.cellRadious = 5;

        // text
        this.givenColor = "#104";
        this.valueColor = "#222";
        this.wallColor = "#333";
        this.givenWallColor = "#333"
        this.candidateColor = "#222";
        this.litCandidateColor = "#ccc";

        // links
        this.weakLinkColor = "rgba(255,0,0,.5)";
        this.weakStrongLinkColor = "rgba(255,255,0,.5)";
        this.strongLinkColor = "rgba(0,227,0,.5)";

        // highlights
        this.digitHighlightColorGreen = "rgba(0,200,0,0.4)";
        this.digitHighlightColorRed = "rgba(200,0,0,0.4)";
        this.digitHighlightColorBlue = "rgba(0,0,200,0.2)";
        this.digitHighlightColorYellow = "rgba(255,255,0,0.4)";

        this.cellHighlightColorGreen = "rgba(0,200,0,0.2)";
        this.cellHighlightColorRed = "rgba(200,0,0,0.2)";
        this.cellHighlightColorBlue = "rgba(0,0,200,0.2)";
        this.cellHighlightColorYellow = "rgba(255,255,0,0.3)";
    }

    /**
     * Set given cells as cells to draw and create board.
     * @param  {Array.<Array.<Cell>>} cells - 2d Array of cells of sudoku.
     */
    init(cells)
    {
        let boxIndex = 0;
        for(let a = 0; a < 9; a++)
        {
            let y = (73*a)+Math.floor(a/3)*3;
            for(let b = 0; b < 9; b++)
            {
                this.boxes[boxIndex] = {
                    x: this.leftOffset+(73*b)+Math.floor(b/3)*3,
                    y: y,
                    w: this.cellSize,
                    h: this.cellSize,
                };
                this.boxes[boxIndex].tx = this.boxes[boxIndex].x+(this.boxes[boxIndex].w/2);
                this.boxes[boxIndex].ty = this.boxes[boxIndex].y + 60;
                boxIndex++;
                // add cell
                this.cells.push(cells[b][a]);
            }
        }
    }

    /**
     * Add Link to draw.
     * @param  {Link} aLink - Link to add.
     */
    addLink(aLink)
    {
        this.links.push(aLink);
    }

    /**
     * Remove given link from board or all liks if aLink is not specified.
     * @param  {Link} [aLink] - Link to remove.
     */
    removeLink(aLink)
    {
        if(aLink)
            this.links.splice(this.links.findIndex((e)=>{return e == aLink;}), 1);
        else
            this.links = [];
    }

    /**
     * Add Links from given Chain to draw.
     * @param  {Chain} aChain - Chain to draw.
     */
    addChain(aChain)
    {
        aChain.links.forEach(link=>{this.links.push(link)});
    }

    /**
     * Remove links from given Chain from board.
     * @param  {Chain} aChain - Chain to remove.
     */
    removeChain(aChain)
    {
        if(aChain)
            aChain.links.forEach(link=>{this.removeLink(link)});
        else
            this.removeLink();
    }

    /**
     * Highlights given candidate.
     * @param  {CandidateObj} aCandidateObj - Candidate to highlight.
     * @param  {string} [color] - Color of higlight(default green)"red" or "green" or "yellow".
     */
    addHighlight(aCandidateObj, color)
    {
        let c = this.digitHighlightColorGreen;
        if(color == "red")
            c = this.digitHighlightColorRed;
        else if(color == "blue")
            c = this.digitHighlightColorBlue;
        else if(color == "yellow")
            c = this.digitHighlightColorYellow;
        this.highlights.push({obj:aCandidateObj, color:c});
    }

    /**
     * Remove highlight or all highlightts if candidate not given.
     * @param  {CandidateObj} [aCandidateObj] - Highlighted candidate.
     */
    removeHighlight(aCandidateObj)
    {
        if(aCandidateObj)
            this.highlights.splice(this.highlights.findIndex((e)=>{return e.obj == aCandidateObj;}), 1);
        else
            this.highlights = [];
    }

    /**
     * Highlights cell of given candidate.
     * @param  {CandidateObj} aCandidateObj - candidate with cell to highlight.
     * @param  {string} [color] - Color of higlight(default green)"red" or "green" or "blue" or "yellow".
     */
    addCellHighlight(aCandidateObj, color)
    {
        let c = this.cellHighlightColorGreen;
        if(color == "red")
            c = this.cellHighlightColorRed;
        else if(color == "blue")
            c = this.cellHighlightColorBlue;
        else if(color == "yellow")
            c = this.cellHighlightColorYellow;
        this.cellHighlights.push({obj:aCandidateObj, color:c});
    }

    /**
     * Remove higlight or all highlights if candidate is not given.
     * @param  {CandidateObj} [aCandidateObj] - Highlight candidate.
     */
    removeCellHighlight(aCandidateObj)
    {
        if(aCandidateObj)
            this.cellHighlights.splice(this.cellHighlights.findIndex((e)=>{return e.obj == aCandidateObj;}), 1);
        else
            this.cellHighlights = [];
    }
    
    /**
     * Draw lines.
     * @param  {CanvasRenderingContext2D} ctx - Context 2d.
     */
    drawLine(ctx)
    {
        let x0, y0, x1, y1, n;
        this.links.forEach(link=>{
            ctx.lineWidth = 2;
            if(link.isStrong())
            {
                ctx.strokeStyle = this.strongLinkColor;
                if(link.isWeak)
                {
                    ctx.strokeStyle = this.weakStrongLinkColor;
                    ctx.setLineDash([7, 5]);
                }
            }
            else
            {
                ctx.strokeStyle = this.weakLinkColor;
                ctx.setLineDash([7, 5]);
            }
            // calculate position 
            n = link.digitA.value-1;
            x0 = this.boxes[link.digitA.cell.id].x + this.leftOffset + 10+n%3*23,
            y0 = this.boxes[link.digitA.cell.id].y + 13+Math.floor(n/3)*23;
            n = link.digitB.value-1;
            x1 = this.boxes[link.digitB.cell.id].x + this.leftOffset + 10+n%3*23,
            y1 = this.boxes[link.digitB.cell.id].y + 13+Math.floor(n/3)*23;

            // draw
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();

            ctx.setLineDash([]);
        });
    }

    /**
     * Draw highlights of candidates.
     * @param  {CanvasRenderingContext2D} ctx - Context 2d.
     */
    drawHighlights(ctx)
    {
        this.highlights.forEach(hl=>{
            ctx.fillStyle = hl.color;
            let x = this.boxes[hl.obj.cell.id].x + 3+(hl.obj.value-1)%3*23,
                y = this.boxes[hl.obj.cell.id].y + 3+Math.floor((hl.obj.value-1)/3)*23;
            ctx.fillRect(x, y, 18, 18);
        });
    }

    /**
     * Draw highlights of cells.
     * @param  {CanvasRenderingContext2D} ctx - Context 2d.
     */
    drawCellsHighlights(ctx)
    {
        this.cellHighlights.forEach(hl=>{
            ctx.fillStyle = hl.color;
            let x = this.boxes[hl.obj.cell.id].x,
                y = this.boxes[hl.obj.cell.id].y,
                w = this.boxes[hl.obj.cell.id].w,
                h = this.boxes[hl.obj.cell.id].h;
            ctx.fillRect(x, y, w, h);
        });
    }

    /**
     * Draw cell on board.
     * @param  {CanvasRenderingContext2D} ctx - Context 2d.
     * @param  {Object} box - Box object of this Board.
     */
    drawBox(ctx, box)
    {
        let cx = box.x+(box.w/2); // box center
        let cy = box.y+(box.h/2); // box center

        // create gradient
        let gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, box.w/2);
        gradient.addColorStop(0, this.cellColor);
        gradient.addColorStop(1, this.cellColor2);

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.lineJoin = "round";
        ctx.lineWidth = this.cellRadious;
        // draw shadow
        ctx.strokeStyle = "#333";
        ctx.strokeRect(box.x+(this.cellRadious/2)-2, box.y+(this.cellRadious/2), box.w-this.cellRadious+2, box.h-this.cellRadious+2);
        // draw box
        ctx.strokeStyle = this.cellColor2;
        ctx.strokeRect(box.x+(this.cellRadious/2), box.y+(this.cellRadious/2), box.w-this.cellRadious, box.h-this.cellRadious);
        ctx.fillRect(box.x+(this.cellRadious/2), box.y+(this.cellRadious/2), box.w-this.cellRadious, box.h-this.cellRadious);
        ctx.closePath();
    }

    /**
     * Draw digit on board.
     * @param  {CanvasRenderingContext2D} ctx - Context 2d.
     * @param  {Object} box - Box object of this Board.
     * @param  {number} i - Index of a box.
     */
    drawDigit(ctx, box, i)
    {
        let cx = box.x+(box.w/2); // box center
        let cy = box.y+(box.h/2); // box center

        // create gradients
        let valueGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, box.w/2);
        valueGradient.addColorStop(0, "#ccc");
        valueGradient.addColorStop(1, "#999");
        let givenGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, box.w/2);
        givenGradient.addColorStop(0, "#55d");
        givenGradient.addColorStop(1, "black");
        let givenWallGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, box.w/2);
        givenWallGradient.addColorStop(0, "#33f");
        givenWallGradient.addColorStop(1, "#333");
        let wallGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, box.w/2);
        wallGradient.addColorStop(0, "#aaa");
        wallGradient.addColorStop(1, "#333");

        // set colors
        if(this.cells[i].value == curentNumber || (this.cells[i].candidates.includes(curentNumber) && this.cells[i].value == null))
        {
            this.givenColor = givenGradient;
            this.valueColor = valueGradient;
            this.givenWallColor = givenWallGradient;
            this.wallColor = wallGradient;
        }
        else
        {
            this.givenColor = "black";
            this.valueColor = "#444"; // #444
            this.givenWallColor = "#333";
            this.wallColor = "#333";
        }

        // draw numbers
        ctx.textAlign = "center";
        if(this.cells[i].value) // draw values
        {
            // draw walls (shadow digit)
            ctx.font = "62px Verdana";
            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
            ctx.strokeText(this.cells[i].value, box.tx+1, box.ty-1); // draw edges
            ctx.fillStyle = this.wallColor;
            if(this.cells[i].isGiven)
                ctx.fillStyle = this.givenWallColor;
            else
                ctx.fillStyle = this.wallColor;
            ctx.fillText(this.cells[i].value, box.tx+1, box.ty-1); // draw walls of number

            // draw digit
            ctx.font = "60px Verdana";
            if(this.cells[i].isGiven)
                ctx.fillStyle = this.givenColor;
            else
                ctx.fillStyle = this.valueColor;
            ctx.fillText(this.cells[i].value, box.tx, box.ty);
        }
        else                    // draw candidates
        {
            ctx.font = "20px Verdana";
            for(let n = 0; n < 9; n++)
            {
                if((n+1) == curentNumber)
                {
                    ctx.fillStyle = this.litCandidateColor;
                }
                else
                {                        
                    ctx.fillStyle = this.candidateColor;
                }
                let x = this.leftOffset+10+n%3*23,
                    y = 20+Math.floor(n/3)*23;
                if(this.cells[i].candidates.includes(n+1))
                {                       
                    ctx.fillText(n+1, box.x+x, box.y+y);
                }
            }
        }

    }

    /**
     * Draw board.
     * @param  {HTMLCanvasElement} canvas - Canvas.
     * @param  {CanvasRenderingContext2D} ctx - Context 2d.
     */
    draw(canvas, ctx)
    {
        // background
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        // content
        this.boxes.forEach((box, i)=>{
            this.drawBox(ctx, box);
        });
        this.drawCellsHighlights(ctx);
        this.drawHighlights(ctx);
        this.boxes.forEach((box, i)=>{
            this.drawDigit(ctx, box, i);
        });
        this.drawLine(ctx);
    }
}