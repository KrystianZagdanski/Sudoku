// load save file
function loadSave(e)
{
    let file = e.target.files[0];
    if(!file) return;

    let reader = new FileReader();
    reader.onload = function(e){
        let contents = e.target.result;
        let index = 0;
        for(let a = 0; a < 9; a++)
        {
            for(let b = 0; b < 9; b++)
            {
                if(contents[index] == 0)
                {
                    cell[b][a].value = null;
                    cell[b][a].isGiven = false;
                }
                else
                {
                    cell[b][a].given(parseInt(contents[index]));
                }
                cell[b][a]._candidates = [];
                index++;
            }
        }
    };
    reader.readAsText(file);
    Solver.candidatesFilled = false;
}

// save and download game save file
function saveGame()
{
    let data = "";
    for(let a = 0; a < 9; a++)
    {
        for(let b = 0; b < 9; b++)
        {
            if(cell[b][a].value)
                data += cell[b][a].value.toString();
            else
                data += "0";
        }
    }

    const a = document.createElement('a');
    const file = new File([data], "save.txt", {type: "text/plain"});

    a.href = URL.createObjectURL(file);
    a.download = "save.txt";
    a.click();

    URL.revokeObjectURL(a.href);
}