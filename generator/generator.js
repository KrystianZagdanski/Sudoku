
class Generator
{

    /**
     * Generate solution
     * @param {number} r - Current row
     * @param {number} c - Current column
     * @param {Array.<Array.<number>>} solution - Solution
     * @returns {Array.<Array.<number>>} solution
     */
    static generateSolution(r = 0, c = 0, solution = [[],[],[],[],[],[],[],[],[]])
    {
        let digits = [1,2,3,4,5,6,7,8,9];
        let exit = false;
        let result;

        while(solution[r][c] == undefined && digits.length > 0)
        {
            exit = false;
            let index = Math.floor(Math.random() * (digits.length - 0)) + 0;
            for(let x = 0; x < 9; x++)
            {
                if(solution[x][c] == digits[index] || solution[r][x] == digits[index])
                {
                    exit = true;
                    digits.splice(index, 1);
                    break;
                }
            }
            let ySeg = r-(r%3);
            let xSeg = c-(c%3);
            for(let y = ySeg; y < ySeg+3; y++)
            {
                for(let x = xSeg; x < xSeg+3; x++)
                {
                    if(solution[y][x] == digits[index])
                    {
                        exit = true;
                        digits.splice(index, 1);
                        break;
                    }
                }
            }
            if(exit) continue;
            solution[r][c] = digits[index];
            digits.splice(index, 1);
            if(r == 8 && c == 8)
                return solution;

            let nextC = (c+1)%9;
            let nextR = nextC == 0? r+1: r;
            result = this.generateSolution(nextR, nextC, solution);
            if(result == false)
            {
                solution[r][c] = undefined;
            }
            else
                return result;
        }

        return false;
    }

    /**
     * Returns sudoku game created from solution
     * @param {Array.<Array.<number>>} solution - Generated solution
     * @param {number} count - How many digits delete
     * @returns {Array.<Array.<number>>} new sudoku game
     */
    static deleteRandom(solution, count)
    {
        let g = [];
        for(let i = 0; i < solution.length; i++)
        {
            g[i] = solution[i].slice(0);
        }
        for(let i = 0; i < count; i ++)
        {
            let done = false;
            while(!done)
            {
                let r = Math.floor(Math.random() * (9 - 0)) + 0;
                let c = Math.floor(Math.random() * (9 - 0)) + 0;

                if(g[r][c] != 0)
                {
                    g[r][c] = 0;
                    done = true;
                }
            }
        }

        return g;
    }

    /**
     * Clear board and solver properties.
     */
    static clear()
    {
        for(let a = 0; a < 9; a++)
        {
            for(let b = 0; b < 9; b++)
            {
                cell[b][a].value = null;
                cell[b][a].isGiven = false;
                cell[b][a]._candidates = [];
            }
        }
        Solver.candidatesFilled = false;
        Solver.solutions = [];
        Solver.candidatesToRemove = [];
        Solver.action = Solver.FIND_SOLUTION;
    }

    /**
     * Generate and set new game.
     * @returns {Array.<Array.<number>>} 2d array with values generated for game
     */
    static generateGame()
    {
        let deleteCount = 55;
        let solution = this.generateSolution();
        let game = this.deleteRandom(solution, 10);
        let tempGame = [];
        for(let i = 0; i < game.length; i++)
        {
            tempGame[i] = game[i].slice(0);
        }
        deleteCount -= 10;

        while(deleteCount > 0)
        {
            this.clear()
            for(let r = 0; r < 9; r++)
            {
                for(let c = 0; c < 9; c++)
                {
                    if(tempGame[r][c] != 0)
                        cell[c][r].value = tempGame[r][c];
                }
            }
            console.log("__________________________________________________________");
            if(Solver.solve(true))
            {
                for(let i = 0; i < tempGame.length; i++)
                {
                    game[i] = tempGame[i].slice(0);
                }
                deleteCount -= 1;
            }
            else
            {
                for(let i = 0; i < game.length; i++)
                {
                    tempGame[i] = game[i].slice(0);
                }
            }
            tempGame = this.deleteRandom(tempGame, 1);
        }
        
        this.clear();
        for(let r = 0; r < 9; r++)
        {
            for(let c = 0; c < 9; c++)
            {
                if(game[r][c] != 0)
                    cell[c][r].given(game[r][c]);
            }
        }
        return game;
        
    }
}

//Easy: 28 32 28 32 32 32
//Norm: 26 27 30 28 28 25
//Hard: 26 25 21 26 26 26
// 21 - 32
// Delete: 49 - 60 
// Delete: 60% - 74%