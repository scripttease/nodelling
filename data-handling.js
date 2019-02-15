function dataHandling(json) {
  const txt = JSON.parse(json)
  const stng = txt.toString()
  const lines = stng.split("\n")
  // first capture group is commits second is date
  return lines
}

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

function countStreak(kvMapObjArr) {
  // console.log(kvMapObjArr);
  // array
  // for each val in kvMapObjArr if commits <0 streaklength += 1
  // elseif (commits are 0) and if streaklength <1 push object into array containing val date, val streak length and calc val of start date (date - streak length in days) and set streaklength == 0 again
  let streakObj;
  const streakArray = [];
  let streakLength = 0;
  kvMapObjArr.forEach(function(obj) {
    // console.log(obj.commits);
    if (obj.commits > 0) {
      streakLength += 1
      // console.log(streakLength);
    } else if (obj.commits < 1 && streakLength > 0) {
      streakObj = {
        streak: streakLength,
        endDate: obj.date,
        startDate: obj.date - (streakLength * 24 * 3600000) ,
      }
      streakArray.push(streakObj)
      streakLength = 0

    } else {
      streakLength = 0
    }
    //nb forEach doesn't return it is side-effecting only
  });
  return streakArray;
}

function longestStreak(streakArray) {
  // var longestStreak;
  console.log(streakArray);
  const longestStreak = streakArray.reduce(function(acc, curr) {
    return (curr.streak >= acc.streak) ? curr : acc
  });
  console.log(longestStreak);
  return longestStreak
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
module.exports.louisCountStreak = louisCountStreak;
