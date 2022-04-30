import {
    SET_SETTINGS,
    SET_CURRENT_SETTINGS,
    SHOW_SETTINGS_POPUP,
} from '../constants/ActionTypes'

const initialState = {
    gameSettings: null,
    currentSettings: null,
    showPopup: false,
};

export default function settings(state = initialState, action)
{
    switch (action.type)
    {
        case SET_SETTINGS:
        {
            return {
                ...state,
                gameSettings: { ...action.settings },
                currentSettings: { ...action.settings },
            };
        }

        case SET_CURRENT_SETTINGS:
        {
            return {
                ...state,
                currentSettings: {
                    ...state.currentSettings,
                    ...action.settings,
                }
            }
        }

        case SHOW_SETTINGS_POPUP:
        {
            return {
                ...state,
                showPopup: action.show,
            }
        }

        default:
            return state;
    }
}
