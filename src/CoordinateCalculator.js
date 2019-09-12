// AN = Algebraic Notation
// file in [1, fileCount]
// rank in [1, rankCount]
// level in [1, levelCount]

const isFileLetterOutOfBounds = (fileCount, letter) => {
  const max = String.fromCodePoint("a".codePointAt(0) + fileCount - 1);

  return letter < "a" || letter > max;
};

const isFileOutOfBounds = (fileCount, file) => file < 1 || file > fileCount;

const isLevelLetterOutOfBounds = (levelCount, letter) => {
  const max = String.fromCodePoint("A".codePointAt(0) + levelCount - 1);

  return letter < "A" || letter > max;
};

const isLevelOutOfBounds = (levelCount, rank) => rank < 1 || rank > levelCount;

const isNil = value => value === undefined || value === null;

const isRankOutOfBounds = (rankCount, rank) => rank < 1 || rank > rankCount;

class CoordinateCalculator {
  constructor(fileCount = 8, rankCount = 8, levelCount = 1) {
    this._fileCount = fileCount;
    this._rankCount = rankCount;
    this._levelCount = levelCount;
  }

  get fileCount() {
    return this._fileCount;
  }

  get rankCount() {
    return this._rankCount;
  }

  get levelCount() {
    return this._levelCount;
  }

  anToFile(an) {
    if (isNil(an)) {
      return null;
    }

    const letter = an.trim().charAt(0);

    if (isNil(letter) || isFileLetterOutOfBounds(this.fileCount, letter)) {
      return null;
    }

    return letter.codePointAt(0) - "a".codePointAt(0) + 1;
  }

  anToIndex(an) {
    if (isNil(an)) {
      return null;
    }

    const file = this.anToFile(an);
    const rank = this.anToRank(an);
    const level = this.anToLevel(an);
    console.log(`file=${file} rank=${rank} level=${level}`);

    if (isNil(file) || isNil(rank)) {
      return null;
    }

    if (isNil(level)) {
      return (rank - 1) * this.fileCount + (file - 1);
    }

    return (level - 1) * this.rankCount * this.fileCount + (rank - 1) * this.fileCount + (file - 1);
  }

  anToLevel(an) {
    if (isNil(an)) {
      return null;
    }

    const an2 = an.trim();
    const letter = an2.charAt(an2.length - 1);

    if (isNil(letter) || isLevelLetterOutOfBounds(this.levelCount, letter)) {
      return null;
    }

    return letter.codePointAt(0) - "A".codePointAt(0) + 1;
  }

  anToRank(an) {
    if (isNil(an)) {
      return null;
    }

    const rank = parseInt(an.trim().substring(1));

    return isRankOutOfBounds(this.rankCount, rank) ? null : rank;
  }

  fileRankToAN(file, rank) {
    if (isFileOutOfBounds(this.fileCount, file) || isRankOutOfBounds(this.rankCount, rank)) {
      return null;
    }

    const letter = String.fromCodePoint("a".codePointAt(0) + file - 1);

    if (isNil(letter) || isFileLetterOutOfBounds(this.fileCount, letter)) {
      return null;
    }

    return `${letter}${rank}`;
  }

  fileRankLevelToAN(file, rank, level) {
    if (
      isFileOutOfBounds(this.fileCount, file) ||
      isRankOutOfBounds(this.rankCount, rank) ||
      isLevelOutOfBounds(this.levelCount, level)
    ) {
      return null;
    }

    const fileLetter = String.fromCodePoint("a".codePointAt(0) + file - 1);

    if (isNil(fileLetter) || isFileLetterOutOfBounds(this.fileCount, fileLetter)) {
      return null;
    }

    const levelLetter = String.fromCodePoint("A".codePointAt(0) + level - 1);

    if (isNil(levelLetter) || isLevelLetterOutOfBounds(this.levelCount, levelLetter)) {
      return null;
    }

    return `${fileLetter}${rank}${levelLetter}`;
  }
}

export default CoordinateCalculator;
