let timeStart = 0;
let timeEnd = 0;


function mesureTimeOf(func)
{
    timeStart = Math.floor(Date.now()/1000);
    func();
    timeEnd = Math.floor(Date.now()/1000);
    return timeEnd-timeStart;
}

function tim()
{
    return Math.floor(Date.now()/1000);
}

function testEasy(index = null, log = true)
{
    Generator.dificulty = 1;
    timeStart = Math.floor(Date.now()/1000);
    Generator.generateGame();
    timeEnd = Math.floor(Date.now()/1000);
    if(log) console.log("E("+(index!=null?index:"")+") Time:"+ (timeEnd-timeStart)+" Score:"+Generator.sum(Solver.dificultyScore));
    return timeEnd-timeStart;
}

function testMedium(index = null, log = true)
{
    Generator.dificulty = 2;
    timeStart = Math.floor(Date.now()/1000);
    Generator.generateGame();
    timeEnd = Math.floor(Date.now()/1000);
    if(log) console.log("M("+(index!=null?index:"")+") Time:"+ (timeEnd-timeStart)+" Score:"+Generator.sum(Solver.dificultyScore));
    return timeEnd-timeStart;
}

function testHard(index = null, log = true)
{
    Generator.dificulty = 3;
    timeStart = Math.floor(Date.now()/1000);
    Generator.generateGame();
    timeEnd = Math.floor(Date.now()/1000);
    if(log) console.log("H("+(index!=null?index:"")+") Time:"+ (timeEnd-timeStart)+" Score:"+Generator.sum(Solver.dificultyScore));
    return timeEnd-timeStart;
}

function avrage(data)
{
    let sum = 0;
    data.forEach(t => {
        sum += t;
    });
    return sum / data.length;
}

// var scores = {
//     easy: [],
//     medium: [],
//     hard: []
// };

function testGenerator(iterations = 100)
{
    let times = [];
    let avrageTimes = [];
    let maxTimes = [];
    let totalTime = [0,0,0];
    // scores = {
    //     easy: [0,0,1000,0],
    //     medium: [0,0,1000,0],
    //     hard: [0,0,1000,0]
    // };

    console.log("Start test for easy...");
    for(let e = 0; e < iterations; e++)
    {
        times.push(testEasy(e));
    }
    avrageTimes.push(avrage(times));
    maxTimes.push(Math.max(...times));
    totalTime[0] = Generator.sum(times);
    console.log("Easy avrage generation time: "+avrageTimes[0]+" Min:"+Math.min(...times)+" Max:"+Math.max(...times));
    times = [];

    console.log("Start test for medium...");
    for(let m = 0; m < iterations; m++)
    {
        times.push(testMedium(m));
    }
    avrageTimes.push(avrage(times));
    maxTimes.push(Math.max(...times));
    totalTime[1] = Generator.sum(times);
    console.log("Medium avrage generation time: "+avrageTimes[1]+" Min:"+Math.min(...times)+" Max:"+Math.max(...times));
    times = [];

    console.log("Start test for hard...");
    for(let h = 0; h < iterations; h++)
    {
        times.push(testHard(h));
    }
    avrageTimes.push(avrage(times));
    maxTimes.push(Math.max(...times));
    totalTime[2] = Generator.sum(times);
    console.log("Hard avrage generation time: "+avrageTimes[2]+" Min:"+Math.min(...times)+" Max:"+Math.max(...times));
    times = [];

    console.log("Test Done!");
    console.log("Avrage:");
    console.log("Easy "+avrageTimes[0]+" Total:"+totalTime[0]+" Max("+maxTimes[0]+")");
    console.log("Medium "+avrageTimes[1]+" Total:"+totalTime[1]+" Max("+maxTimes[1]+")");
    console.log("Hard "+avrageTimes[2]+" Total:"+totalTime[2]+" Max("+maxTimes[2]+")");

    // console.log("Easy: ("+scores.easy[0]/scores.easy[1]+") "+scores.easy[2]+"min "+scores.easy[3]+"max Count:"+scores.easy[1]);
    // console.log("Medium: ("+scores.medium[0]/scores.medium[1]+") "+scores.medium[2]+"min "+scores.medium[3]+"max Count:"+scores.medium[1]);
    // console.log("Hard: ("+scores.hard[0]/scores.hard[1]+") "+scores.hard[2]+"min "+scores.hard[3]+"max Count:"+scores.hard[1]);
}
