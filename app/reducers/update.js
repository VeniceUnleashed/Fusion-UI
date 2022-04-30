import {
    CHANGE_UPDATE_ERROR,
    CHANGE_UPDATE_STATE,
    CHANGE_UPDATE_PROGRESS,
} from '../constants/ActionTypes'

import * as UpdateError from '../constants/UpdateError'
import * as UpdateState from '../constants/UpdateState'

const initialState = {
    state: UpdateState.IDLE,
    error: UpdateError.NONE,
    leftFiles: 0,
    percentage: 0,
};

export default function update(state = initialState, action)
{
    switch (action.type)
    {
        case CHANGE_UPDATE_STATE:
        {
            return {
                ...state,
                state: action.state,
            };
        }

        case CHANGE_UPDATE_ERROR:
        {
            return {
                ...state,
                error: action.error,
            };
        }

        case CHANGE_UPDATE_PROGRESS:
        {
            return {
                ...state,
                leftFiles: action.totalFiles - action.doneFiles,
                percentage: action.downloaded / action.total,
            };
        }

        default:
            return state;
    }
}