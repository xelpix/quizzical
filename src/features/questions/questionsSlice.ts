import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import he from 'he';
import { v4 as uuidv4 } from 'uuid';
import { mergeRightAnswerAndIncorrects } from '../../utils';
import { RootState } from '../../store';

const url = 'https://opentdb.com/api.php?amount=5&category=15&difficulty=easy&type=multiple';

type ReceivedDataType = {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  typ: string;
};

type FormattedDataType = {
  id: string;
  correctAnswer: string;
  allAnswers: string[];
  question: string;
  currentAnswer: string;
};

type QuestionsType = {
  questions: FormattedDataType[];
  loading: boolean;
  error: string | null;
  checked: boolean;
  rightAnswers: number;
};

const initialState: QuestionsType = {
  questions: [],
  loading: false,
  error: null,
  checked: false,
  rightAnswers: 0,
};

type SetAnswerPayloadType = {
  questionID: string;
  answer: string;
};

export const fetchQuestions = createAsyncThunk('questions/fetchQuestions', async () => {
  try {
    const response = await axios(url);
    return transformData(response.data.results);
  } catch (error) {
    throw error;
  }
});

const transformData = (questions: ReceivedDataType[]): FormattedDataType[] => {
  const transformData = questions.map((el) => {
    const { correct_answer, incorrect_answers, question } = el;
    return {
      id: uuidv4(),
      correctAnswer: he.decode(correct_answer),
      allAnswers: mergeRightAnswerAndIncorrects(incorrect_answers, correct_answer),
      question: he.decode(question),
      currentAnswer: '',
    };
  });

  return transformData;
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    startNewGame: (state) => {
      state.checked = false;
      state.rightAnswers = 0;
      state.loading = true;
    },

    setAnswer: (state, action: PayloadAction<SetAnswerPayloadType>) => {
      console.log(action.payload);
      const questionToAnswer = state.questions.find(
        (question) => question.id === action.payload.questionID
      );

      if (questionToAnswer) {
        questionToAnswer.currentAnswer = action.payload.answer;
      }
    },

    checkAnswers: (state) => {
      state.checked = true;
      let howManyRight = 0;
      state.questions.forEach((question) => {
        if (question.correctAnswer === question.currentAnswer) {
          howManyRight++;
        }
      });

      state.rightAnswers = howManyRight;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? 'An error occurred';
      });
  },
});

export const selectAllQuestions = (state: RootState) => state.questions;

export const { setAnswer, checkAnswers, startNewGame } = questionsSlice.actions;

export default questionsSlice.reducer;
