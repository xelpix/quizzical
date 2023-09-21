import styles from './StartPage.module.scss';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchQuestions, selectAllQuestions } from '../features/questions/questionsSlice';

const StartPage = () => {
  const dispatch = useAppDispatch();

  const handleFetchData = () => {
    dispatch(fetchQuestions());
  };

  const { loading, error } = useAppSelector(selectAllQuestions);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quizzical</h2>
      <p className={styles.desc}>Try out this game quiz!</p>
      <button disabled={loading} onClick={handleFetchData} className={styles.startBtn}>
        {loading ? 'Loading...' : ' Start quiz '}
      </button>
      {error && (
        <p className={styles.errorMsg}>Something went wrong... Refresh the page and try again.</p>
      )}
    </div>
  );
};

export default StartPage;
