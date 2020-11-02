export function hasRedundancy(arr) {
  let exist = new Set();
  var length = arr.length;
  for (var i = 0; i < length; i++) {
    if (exist.has(arr[i])) {
      return true;
    }
    exist.add(arr[i]);
  }
  return false;
}

export function indexGenerator(d = 9, t = "row", pos) {
  let base = Math.sqrt(d);

  let createArray = function (l, func) {
    return Array.from(Array(l).keys(), func);
  };
  if (pos == undefined) {
    switch (t) {
      case "row":
        return createArray(d); //[0,1,2,..,8],d=9
      case "col":
        return createArray(d, (x) => d * x); //[0,9,18,..,72],d=9
      case "grid":
        return createArray(base, (x) => base * d * x).reduce(function (
          acc,
          cur
        ) {
          return acc.concat(createArray(base, (x) => cur + x * base));
        },
        []); //[0,3,6,27,30,33,54,57,60],d=9
      default:
        return [];
    }
  } else {
    let rowRef = Math.floor(pos / 9); //rowRef=4 => pos=42
    let colRef = pos % d; //colRef=6 => pos=42

    //rowRef=4,colRef=6 => [3,6]
    let [gRowRef, gColRef] = [rowRef, colRef].map(
      (x) => Math.floor(x / base) * base
    );
    switch (t) {
      case "row":
        return createArray(d, (n) => n + 9 * rowRef); // return the {rowRef}th row
      case "col":
        return createArray(d, (n) => n * 9 + colRef); // return the {colRef}th col
      case "grid":
        return createArray(base, (x) => x + gRowRef).reduce(function (
          acc,
          cur
        ) {
          return acc.concat(createArray(base, (x) => 9 * cur + gColRef + x));
        },
        []);
      default:
        return [];
    }
  }
}

export function filterIndexes(target = [[]], minIndex) {
  if (minIndex == undefined) minIndex = -1;
  let out = [];
  let exist = new Set();
  for (var i = 0; i < target.length; i++) {
    let l = target[i].length;
    for (var j = 0; j < l; j++) {
      let n = target[i][j];
      if (!exist.has(n) && n > minIndex) {
        exist.add(n);
        out.push(n);
      }
    }
  }
  return out;
}

export function dummyPuzzleExample() {
  let str =
    "435269781" +
    "682571493" +
    "197834562" +
    "826195347" +
    "374682915" +
    "951743628" +
    "519326874" +
    "248957136" +
    "763418259";
  return [...str];
}
