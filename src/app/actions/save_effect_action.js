'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from 'constants/actionType/Effect.jsx';
import Ajax from '../ajax/Ajax.jsx';
import Immutable from 'immutable';
import Util from 'util/Util.jsx';

import {SaveEffect} from 'constants/Path.jsx';


export function getTagsByPlan(id) {
	Ajax.get( Util.replacePathParams(SaveEffect.getEnergyEffectTags, id, 0), {
		success: (tags) => {
      AppDispatcher.dispatch({
        type: Action.UPDATE_TAGS,
        tags
      });
		}
	});
};

export function getEnergySolution(problemId) {
	Ajax.get( Util.replacePathParams(SaveEffect.getEnergySolution, problemId, 'w_146,h_97', 'w_600,h_400'), {
		success: (data) => {
			AppDispatcher.dispatch({
				type: Action.GET_ENERGY_SOLUTION,
				data
			});
		}
	});
}

export function updateTags(tags) {
    AppDispatcher.dispatch({
      type: Action.UPDATE_TAGS,
      tags
    });
}

export function getPreviewChart2(params) {

	Ajax.post(SaveEffect.energyEffectPriview, {
		params,
		success: (data) => {
	    	AppDispatcher.dispatch({
		        type: Action.GET_PREVIEW_CHART2,
		        data
		    });
		}
	});
}
export function getPreviewChart3(params) {
	Ajax.post(SaveEffect.energyEffectPriview, {
		params,
		success: (data) => {
	    	AppDispatcher.dispatch({
		        type: Action.GET_PREVIEW_CHART3,
		        data
		    });
		}
	});
}
export function saveItem(customerId, hierarchyId, params, onSubmitDone) {
	Ajax.post( Util.replacePathParams(SaveEffect.addItem, customerId, hierarchyId, params.EnergySystem) , {
		params,
		success: (id) => {
			if(onSubmitDone && typeof onSubmitDone === 'function') {
				onSubmitDone();
			} else {
		    	AppDispatcher.dispatch({
			        type: Action.ADD_ITEM,
			    });

			}
		},
		error: () => {

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

export function getDetail(energyEffectId) {
	Ajax.get( Util.replacePathParams(SaveEffect.getDetail,energyEffectId), {
		success: (detail) => {
			AppDispatcher.dispatch({
				type: Action.GET_EFFECT_DETAIL,
				detail
			});
		}
	});
}

export function deleteItem(energyEffectItemId,callback) {
	Ajax.get( Util.replacePathParams(SaveEffect.deleteitem,energyEffectItemId), {
		success: () => {
			if(callback){
				callback();
			}else {
				AppDispatcher.dispatch({
					type: Action.DELETE_EFFECT_ITEM,
					energyEffectItemId,
				});
			}

		}
	});
}

export function changeEnergySystemForEffect(sysId,energyEffectId) {
			AppDispatcher.dispatch({
				type: Action.CHANGE_ENERGY_SYSTEM_FOR_EFFECT,
				sysId,
				energyEffectId
			});
}

export function getDrafts(hierarchyId) {
	//4:草稿
	Ajax.get( Util.replacePathParams(SaveEffect.getitemlist,hierarchyId,4), {
		success: (drafts) => {
			AppDispatcher.dispatch({
				type: Action.GET_DRAFTS_SUCCESS,
				drafts
			});
		}
	});
}

export function configEnergySystem(customerId,hierarchyId,energyProblemId,energySystem) {

	Ajax.get( Util.replacePathParams(SaveEffect.configEnergySystem,customerId,hierarchyId,energyProblemId,energySystem), {
		success: (eid) => {
			// AppDispatcher.dispatch({
			// 	type: Action.SET_ENERGY_EFFECT_ID,
			// 	pid: energyProblemId,
			// 	eid,
			// });
		}
	});
}

export function addEnergyEffectTag(energyProblemId, tagId) {

	Ajax.get( Util.replacePathParams(SaveEffect.addenergyeffecttag, energyProblemId, tagId), {
		success: () => {
		}
	});
}
