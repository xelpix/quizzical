import styles from './QuestionsPage.module.scss';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  setAnswer,
  checkAnswers,
  startNewGame,
  fetchQuestions,
  selectAllQuestions,
} from '../features/questions/questionsSlice';

import { useWindowWidth } from '../hooks';
import Confetti from 'react-confetti';

const QuestionsPage = () => {
  const { questions, checked, rightAnswers, loading } = useAppSelector(selectAllQuestions);
  const dispatch = useAppDispatch();

  const handleAnswer = (answer: string, questionID: string) => {
    dispatch(() => dispatch(setAnswer({ answer, questionID })));
  };

  const handleCheckAnswers = () => {
    dispatch(() => dispatch(checkAnswers()));
  };

  const handleNewGame = () => {
    dispatch(fetchQuestions());
    dispatch(() => dispatch(startNewGame()));
  };

  const width = useWindowWidth();

  if (loading) return <h2 className={styles.loader}>Loading...</h2>;

  return (
    <div className={styles.questionPageWrapper}>
      {questions.map((question) => {
        return (
          <div key={question.id} className={styles.questionContainer}>
            <h2 className={styles.questionTitle}>{question.question}</h2>
            <div className={styles.answersContainer}>
              {question.allAnswers.map((answer, i) => {
                const isSelected = answer === question.currentAnswer;

                const isCorrect = answer === question.correctAnswer;
                let buttonClassName = isSelected ? styles.clickedBtn : styles.answerBtn;

                if (checked) {
                  if (isSelected) {
                    if (isCorrect) {
                      buttonClassName = styles.rightBtn;
                    } else {
                      buttonClassName = styles.wrongBtn;
                    }
                  } else if (isCorrect) {
                    buttonClassName = styles.rightBtn;
                  } else {
                    buttonClassName = styles.mutedBtn;
                  }
                }

                return (
                  <button
                    disabled={checked}
                    onClick={() => handleAnswer(answer, question.id)}
                    key={i}
                    className={buttonClassName}
                  >
                    {answer}
                  </button>
                );
              })}
            </div>
            <div className={styles.divider}></div>
          </div>
        );
      })}

      {!checked && (
        <button onClick={handleCheckAnswers} className={styles.checkBtn}>
          Check answers
        </button>
      )}

      {checked && (
        <div className={styles.resultContainer}>
          {rightAnswers === questions.length && <Confetti width={width} />}
          <p className={styles.resultText}>
            You scored {rightAnswers}/{questions.length} correct answers
          </p>
          <button disabled={loading} onClick={handleNewGame} className={styles.playAgainBtn}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionsPage;
