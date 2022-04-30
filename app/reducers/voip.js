import {
    SET_VOIP_DATA,
} from '../constants/ActionTypes'

const initialState = {
    devices: [],
    selectedDevice: 0,
    cutoffVolume: 0.5,
    volume: 0,
};

export default function voip(state = initialState, action)
{
    switch (action.type)
    {
        case SET_VOIP_DATA:
        {
            return {
                ...state,
                ...action.data,
            };
        }

        default:
            return state;
    }
}
