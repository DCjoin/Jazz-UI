'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from 'constants/actionType/Effect.jsx';
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
}

export function getenergyeffect(id) {
	Ajax.get( Util.replacePathParams(SaveEffect.getenergyeffect, id), {
		success: (effect) => {
      AppDispatcher.dispatch({
        type: Action.GET_ENERGY_EFFECT,
        effect
      });
		}
	});
}

export function getEffectRateTag(hierarchyId) {
	Ajax.get( Util.replacePathParams(SaveEffect.getenergyeffectratetags,hierarchyId), {
		success: (tags) => {
			AppDispatcher.dispatch({
				type: Action.GET_EFFECT_RATE_TAG,
				tags
			});
		}
	});
}

export function saveeffectratetag(customerId,hierarchyId,list) {
	Ajax.post( Util.replacePathParams(SaveEffect.saveenergyeffectratetags,customerId,hierarchyId), {
		params: list.toJS(),
		success: () => {
			AppDispatcher.dispatch({
				type: Action.SAVE_EFFECT_RATE_TAG,
			});
		}
	});
}
