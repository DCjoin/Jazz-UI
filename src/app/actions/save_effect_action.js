'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
// import { Action } from 'constants/actionType/Effect.jsx';
import Ajax from '../ajax/Ajax.jsx';
import Immutable from 'immutable';
import Util from 'util/Util.jsx';

import {SaveEffect} from 'constants/Path.jsx';

export function getTagsByPlan(id) {
	Ajax.get( Util.replacePathParams(SaveEffect.getTagsByPlan, id), {
		success: (tags) => {
      AppDispatcher.dispatch({
        // type: Action.CREATE_ROLE,
        tags
      });
		}
	});
};