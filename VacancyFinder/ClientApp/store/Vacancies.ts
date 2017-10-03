import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE

export interface VacanciesState {
    isLoading: boolean;
    startPage?: number;
    hasMorePages: boolean;
    searchText?: string;
    isSearchTextChanged: boolean;
    vacancies: Vacancy[];
}

export interface Vacancy {
    title: string;
    salary: number;
    employerName: string;
    url: string;
    id: string;
    description: string;
}

interface VacancyRequestResult {
    vacancies: Vacancy[];
    hasMorePages: boolean;
}
// -----------------
// ACTIONS


interface RequestVacanciesAction {
    type: 'REQUEST_VACANCIES';
    startPage: number;
}

interface ReceiveVacanciesAction {
    type: 'RECEIVE_VACANCIES';
    startPage: number;
    vacancyRequestResult: VacancyRequestResult;
}

interface SetSearchTextAction {
    type: 'SET_SEARCH_TEXT';
    searchText?: string;
}

type KnownAction = RequestVacanciesAction | ReceiveVacanciesAction | SetSearchTextAction;

// ----------------
// ACTION CREATORS

export const actionCreators = {
    requestVacancies: (startPage: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (startPage !== getState().vacancies.startPage || getState().vacancies.isSearchTextChanged) {
            let searchText: string = getState().vacancies.searchText || '';
            let fetchTask = fetch(`api/Vacancy/GetVacancies?startPage=${startPage}&searchText=${searchText}`)
                .then(response => response.json() as Promise<VacancyRequestResult>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_VACANCIES', startPage: startPage, vacancyRequestResult: data });
                });

            addTask(fetchTask);
            dispatch({ type: 'REQUEST_VACANCIES', startPage: startPage });
        }
    },

    setSearchText: (searchText: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SET_SEARCH_TEXT', searchText: searchText });
    }
};

// ----------------
// REDUCER

const unloadedState: VacanciesState = { vacancies: [], isLoading: false, hasMorePages: false, isSearchTextChanged: false };

export const reducer: Reducer<VacanciesState> = (state: VacanciesState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_VACANCIES':
            return {
                startPage: action.startPage,
                vacancies: state.vacancies,
                hasMorePages: state.hasMorePages,
                searchText: state.searchText,
                isLoading: true,
                isSearchTextChanged: false
            };
        case 'RECEIVE_VACANCIES':
            if (action.startPage === state.startPage) {
                return {
                    startPage: action.startPage,
                    vacancies: action.vacancyRequestResult.vacancies,
                    hasMorePages: action.vacancyRequestResult.hasMorePages,
                    searchText: state.searchText,
                    isLoading: false,
                    isSearchTextChanged: false
                };
            }
            break;
        case 'SET_SEARCH_TEXT':
            return {
                startPage: state.startPage,
                vacancies: state.vacancies,
                hasMorePages: state.hasMorePages,
                searchText: action.searchText,
                isLoading: state.isLoading,
                isSearchTextChanged: true
            };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
