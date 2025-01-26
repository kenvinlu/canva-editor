export function getRandomItems(array: any, count = 10) {
  const shuffledArray = [...array].slice();
  let currentIndex = shuffledArray.length;
  let randomIndex, temporaryValue;

  // Implement random array elements
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    temporaryValue = shuffledArray[currentIndex];
    shuffledArray[currentIndex] = shuffledArray[randomIndex];
    shuffledArray[randomIndex] = temporaryValue;
  }

  return shuffledArray.slice(0, count);
}
