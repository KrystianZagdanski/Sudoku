// detect click
document.addEventListener("click",(e)=>{
    if(curentNumber == null) return;
    let m = {};
    m.x = e.pageX - canvas.offsetLeft;
    m.y = e.pageY - canvas.offsetTop;
    board.boxes.forEach((box, i)=>{
        if(m.x > box.x && m.x < box.x+box.w && m.y > box.y && m.y < box.y+box.h)
        {
            // if cell don't have value thenn fill with current value
            if(!board.cells[i].value)
            {
                board.cells[i].solve(curentNumber);
            }
            else if(board.cells[i].value == curentNumber)
            {
                board.cells[i].value = null;
            }
        }
    });
});

// detect right click
document.addEventListener("contextmenu",(e)=>{
    if(curentNumber == null)
    {
        e.preventDefault(); 
        return;
    }
    let m = {};
    m.x = e.pageX - canvas.offsetLeft;
    m.y = e.pageY - canvas.offsetTop;
    board.boxes.forEach((box, i)=>{
        if(m.x > box.x && m.x < box.x+box.w && m.y > box.y && m.y < box.y+box.h)
        {
            e.preventDefault(); 
            // if cell don't have value thenn fill with current value
            if(!board.cells[i]._candidates.includes(curentNumber))
            {
                board.cells[i].addCandidates(curentNumber);
            }
            else
            {
                board.cells[i].removeCandidate(curentNumber);
            }
        }
    });
}, false);

// detect key press
document.addEventListener("keypress",(e)=>{
    let k = e.key;
    if(k > 0 && k < 10)
    {
        
        let buttons = buttosnDiv.children;
        if(curentNumber != null)
        {
            buttons[curentNumber-1].classList.remove("HLBlue");
        }
        if(curentNumber == k)
        {
            curentNumber = null;
            return;
        }
        buttons[k-1].classList.add("HLBlue");
        curentNumber = parseInt(k);
    }
});