import { configureStore } from '@reduxjs/toolkit';
import blockchain from './states/blockchain';
import battleBrotherData from './states/battleBrotherData';

export const store = configureStore({
    reducer: {
        blockchain,
        battleBrotherData
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;