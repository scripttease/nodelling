function dataHandling(txt) {
  // const txt = JSON.parse(json)
  const stng = txt.toString()
  const lines = stng.split("\n")
  // first capture group is commits second is date
  return lines
}

// returns the days in an array of objects with format
// [.. { commits: n, date: timestamp } ...]
function extractData(lines) {

  const regex = /data-count="([0-9]+)" data-date="(20[0-9][0-9]-[0-9][0-9]-[0-9][0-9])/
  const map1 = lines.map(line => regex.exec(line));
  const filt = map1.filter(x => x != null);
  // fat arrow syntax is more complicated with objects (needd a ( before {
  const kvMapObjArr = filt.map(function(x) {
    return {
      commits: parseInt(x[1]),
      date: Date.parse(x[2],)
    };
  });
  return kvMapObjArr;
}

// returns streaks in an array of objects with formt:
//[...{ streak: n, endDate: timestamp, startDate: timestamp }... ]
function countStreak(kvMapObjArr) {
  // array
  // for each val in kvMapObjArr if commits <0 streaklength += 1
  // elseif (commits are 0) and if streaklength <1 push object into array containing val date, val streak length and calc val of start date (date - streak length in days) and set streaklength == 0 again
  let streakObj;
  const length = kvMapObjArr.length;
  const streakArray = [];
  let streakLength = 0;
  kvMapObjArr.forEach(function(obj, ind) {
    // console.log(obj.commits);
    // console.log(ind);
      // needs to be first clause
    if ( obj.commits > 0 && ind == length-1 ) {
      streakLength += 1
      // console.log('ind = length')
      // console.log(ind);
      // console.log(length-1);
      // console.log(streakLength);
      streakObj = {
        streak: streakLength,
        endDate: obj.date,
        startDate: obj.date - ((streakLength-1) * 24 * 3600000) ,
      }
      streakArray.push(streakObj)
    } else if (obj.commits > 0) {
      streakLength += 1
      // console.log(streakLength);
      // nb this clause only works if curr streak not longest
    } else if (obj.commits < 1 && streakLength > 0) {
      streakObj = {
        streak: streakLength,
        endDate: obj.date - (24 * 3600000),
        startDate: obj.date - (streakLength * 24 * 3600000) ,
      }
      streakArray.push(streakObj)
      streakLength = 0

    } else {
      streakLength = 0
    }
    //nb forEach doesn't return it is side-effecting only
  });
  // console.log(streakArray);
  return streakArray;
}

//TODO fix because fails if curr streak same as longest other streak (doesn't chose current)
function longestStreak(streakArray) {
  // console.log(streakArray);
  const longestStreakObj = streakArray.reduce(function(acc, curr) {
    return (curr.streak >= acc.streak) ? curr : acc
  });
  // console.log(longestStreakObj);
  return longestStreakObj
}

function streakDates(longestStreakObj) {
  // console.log(longestStreakObj.startDate);
  // return longestSO.startDate.getDate()
  const sd = new Date(longestStreakObj.startDate)
  const sdYear = sd.getFullYear()
  // note that january is 0! so add 1
  const sdMonth = sd.getMonth() + 1
  const sdDay = sd.getDate()
  const sdStr = sd.toDateString()

  const ed = new Date(longestStreakObj.endDate)
  const edYear = ed.getFullYear()
  // note that january is 0! so add 1
  const edMonth = ed.getMonth() + 1
  const edDay = ed.getDate()
  const edDate = edDay + '-' + edMonth + '-' + edYear
  const edStr = ed.toDateString();

  const str =  'In the last year, your longest streak was ' + longestStreakObj.streak + ' days, logged from ' + sdStr + ' to ' + edStr + '.';
  // return str
  //TODO also return current streak length in obj

  const td = new Date();
  const tdYear = td.getFullYear()
  // note that january is 0! so add 1
  const tdMonth = td.getMonth() + 1
  const tdDay = td.getDate()
  const tdStr = td.toDateString()
  return {
    longestStreakLength: longestStreakObj.streak,
    longestStreakStart: sdStr,
    longestStreakEnd: edStr,
    longestAsString: str,
    todayAsString: tdStr,
  }
}

function extractSVG(txt) {
  // const txt = JSON.parse(json)
  const regex = /(\<svg width\=\".*?\<\/g><\/svg\>)/gs;
  const svgAll = regex.exec(txt)
  // const svg = svgAll[1]
  return {
    svg: svgAll[1],
    userInfo: svgAll,
  }
}

function userStats(data) {

  const stringData = dataHandling(data);
  const dataArrayObj = extractData(stringData);
  const streakArrObj = countStreak(dataArrayObj);
  const lastStreak = streakArrObj[streakArrObj.length -1]
  const lastStreakDays = lastStreak.streak

  const longestStrk = longestStreak(streakArrObj);
  const longestDays = longestStrk.streak

  const datesObj = streakDates(longestStrk);
  const svgObj = extractSVG(data);

  const todayAsStr = datesObj.todayAsString;


    // TODO if streak is still going, average number of commits, fave language this year, maybe even find good open source stuff to commit to depending on your prev commits, your fave lang and thte tabs like this is a good one for beginners to contribute to in open source stuff

  return {
    currentStreakLength: lastStreakDays, 
    svg: svgObj.svg,
    longestStreakLength: longestDays,
    longestStreakStart: datesObj.longestStreakStart,
    longestStreakEnd: datesObj.longestStreakEnd,
    today: todayAsStr,
  }
}





function louisCountStreak(days) {
  const streaks = [];

  while (days.length > 0) {
    const streak = collectNextStreak(days);
    if (streak.length > 0) {
      streaks.push(streak);
    }
  }

  return streaks;
}

function collectNextStreak(days) {
  const streakDays = [];

  discardNoCommitDays(days);

  while (days[0] && days[0].commits > 0) {
    streakDays.push(days.shift());
  }

  return streakDays;
}

function discardNoCommitDays(days) {
  while (days[0] && days[0].commits == 0) {
    days.shift();
  }
}


module.exports.dataHandling = dataHandling;
module.exports.extractData = extractData;
module.exports.countStreak = countStreak;
module.exports.longestStreak = longestStreak;
module.exports.streakDates = streakDates;
module.exports.extractSVG = extractSVG;
module.exports.userStats = userStats;
module.exports.louisCountStreak = louisCountStreak;
