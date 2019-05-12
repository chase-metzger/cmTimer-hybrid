const POSSIBLE_MOVES = ['R', 'L', 'U', 'D', 'F', 'B'];
const POSSIBLE_MODIFIERS = ['2', '\''];


const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const pickFromArray = (arr) => {
  const randIndex = getRandomInt(0, arr.length - 1);
  return arr[randIndex];
}

export const generateScramble = (scrambleLength) => {
  const result = [];
  let previousMove = '';
  for (let i = 0; i < scrambleLength; ++i) {
    let nextMove = pickFromArray(POSSIBLE_MOVES);
    while (nextMove === previousMove) {
      nextMove = pickFromArray(POSSIBLE_MOVES);
    }

    if (getRandomInt(0, 1) === 0) {
      const modifier = pickFromArray(POSSIBLE_MODIFIERS);
      result.push(`${nextMove}${modifier}`);
    } else {
      result.push(nextMove);
    }

    previousMove = nextMove;
  }

  return result;
}

export const scrambleToString = (scramble) => {
  let result = '';
  scramble.forEach((s, i) => {
    result = result + (i !== 0 ? ' ' : '') + s;
  })
  return result;
}
