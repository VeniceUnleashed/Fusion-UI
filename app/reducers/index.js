import { combineReducers } from 'redux'

import { default as base } from './base'
import { default as user } from './user'
import { default as update } from './update'
import { default as servers } from './servers'
import { default as console } from './console'
import { default as settings } from './settings'
import { default as voip } from './voip'

export default combineReducers({
    base,
    user,
    update,
    servers,
    console,
    settings,
    voip,
});
