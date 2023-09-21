import blobYellow from './assets/blob-yellow.png';
import blobBlue from './assets/blob-blue.png';
import styles from './App.module.scss';

import { useAppSelector } from './hooks';
import { selectAllQuestions } from './features/questions/questionsSlice';

import QuestionsPage from './pages/QuestionsPage';
import StartPage from './pages/StartPage';

function App() {
  const { questions } = useAppSelector(selectAllQuestions);

  return (
    <>
      <img className={styles.blueBlob} src={blobBlue} alt="blue blob" />
      <img className={styles.yellowBlob} src={blobYellow} alt="yellow blob" />
      {questions.length === 0 && <StartPage />}
      {questions.length > 0 && <QuestionsPage />}
    </>
  );
}

export default App;
