import he from 'he';

export function mergeRightAnswerAndIncorrects(incorrect_answers: string[], correct_answer: string) {
  const copy = [...incorrect_answers];
  const randomIndex = Math.floor(Math.random() * (copy.length + 1));
  copy.splice(randomIndex, 0, correct_answer);

  const clearedCopy = copy.map((el) => {
    return he.decode(el);
  });

  return clearedCopy;
}
