import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface IDemon {
    id: number;
    name: string;
    dna: number;
    level: number;
    rariry: number;
}

interface IBattleBrotherDataState {
    loading: boolean;
    allDemons: any[]; // need to verify
    allOwnerDemons: IDemon[]; // need to verify
    error: boolean;
    errorMsg: string;
}

interface IBattleBrotherCheckSuccess {
    allDemons: any[];
    allOwnerDemons: IDemon[];
}

const initialState = {
    loading: false,
    allDemons: [],
    allOwnerDemons: [],
    error: false,
    errorMsg: ''
} as IBattleBrotherDataState;

export const battleBrotherDataSlice = createSlice({
    name: 'battleBrother',
    initialState,
    reducers: {
        checkDataRequest: (state: IBattleBrotherDataState) => {
            state.loading = true;
        },
        checkDataSuccess: (state: IBattleBrotherDataState, action: PayloadAction<IBattleBrotherCheckSuccess>) => {
            state.loading = false;
            state.allDemons = action.payload.allDemons;
            state.allOwnerDemons = action.payload.allOwnerDemons;
        },
        checkDataFailed: (state: IBattleBrotherDataState, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = true;
            state.errorMsg = action.payload;
        }
    }
});

export const { checkDataRequest, checkDataSuccess, checkDataFailed } = battleBrotherDataSlice.actions;

export const battleBrotherData = (state: RootState) => state.battleBrotherData;

export default battleBrotherDataSlice.reducer;