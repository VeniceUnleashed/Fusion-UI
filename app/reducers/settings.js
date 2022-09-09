import {
    SET_SETTINGS,
    SET_CURRENT_SETTINGS,
    SHOW_SETTINGS_POPUP,
    SET_MOD_SETTINGS,
    SET_SETTINGS_TAB,
    SET_SETTINGS_SELECTED_MOD,
} from '../constants/ActionTypes'

const initialState = {
    gameSettings: null,
    currentSettings: null,
    showPopup: false,
    modSettings: {},
    tab: "game",
    selectedMod: "",
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

        case SET_SETTINGS_TAB:
        {
            return {
                ...state,
                tab: action.tab,
            }
        }

        
        case SET_SETTINGS_SELECTED_MOD:
        {
            return {
                ...state,
                selectedMod: action.selectedMod,
            }
        }

        case SET_MOD_SETTINGS:
        {
            return {
                ...state,
                modSettings: { ...action.settings },
            }
        }

        default:
            return state;
    }
}
