import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface IBlockchainState {
    loading: boolean;
    account: any; // need to verify
    battleBrotherToken: any; // Contract type import { Contract } from "web3-eth-contract";
    web3: any; // Web3 type import Web3 from "web3";
    errorMsg: string;
}

export interface IConnectionSuccessAction {
    account: any;
    battleBrotherToken: any; // Contract type import { Contract } from "web3-eth-contract";
    web3: any; // Web3 type import Web3 from "web3";
}

const initialState = {
    loading: false,
    account: null,
    battleBrotherToken: null,
    web3: null,
    errorMsg: ''
} as IBlockchainState;

export const blockchainSlice = createSlice({
    name: 'blockchain',
    initialState,
    reducers: {
        connectionRequest: (state: IBlockchainState) => {
            state.loading = true;
        },
        connectionSuccess: (state: IBlockchainState, action: PayloadAction<IConnectionSuccessAction>) => {
            state.loading = false;
            state.account = action.payload.account;
            state.battleBrotherToken = action.payload.battleBrotherToken;
            state.web3 = action.payload.web3;
        },
        connectionFailed: (state: IBlockchainState, action: PayloadAction<string>) => {
            state.loading = false;
            state.errorMsg = action.payload;
        },
        updateAccount: (state: IBlockchainState, action: PayloadAction<any>) => {
            state.account = action.payload;
        }
    }
});

export const { connectionRequest, connectionSuccess, connectionFailed, updateAccount } = blockchainSlice.actions;

export const blockChainStatus = (state: RootState) => state.blockchain;

export default blockchainSlice.reducer;