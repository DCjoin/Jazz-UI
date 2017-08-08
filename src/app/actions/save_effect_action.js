'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from 'constants/actionType/Effect.jsx';
import Ajax from '../ajax/Ajax.jsx';
import Immutable from 'immutable';
import Util from 'util/Util.jsx';

import {SaveEffect} from 'constants/Path.jsx';

export function getTagsByPlan(id) {
	setTimeout(() => {		
    AppDispatcher.dispatch({
      type: Action.UPDATE_TAGS,
      tags: [
				{Id: 1, Name: 'tag1', Configed: false, isNew: false},
				{Id: 2, Name: 'tag2', Configed: true, isNew: false},
				{Id: 3, Name: 'tag3', Configed: true, isNew: false},
				{Id: 4, Name: 'tag4', Configed: false, isNew: true},
				{Id: 5, Name: 'tag5', Configed: false, isNew: true},
			]
    });
	}, 100);
	// Ajax.get( Util.replacePathParams(SaveEffect.getTagsByPlan, id), {
	// 	success: (tags) => {
 //      AppDispatcher.dispatch({
 //        type: Action.UPDATE_TAGS,
 //        tags
 //      });
	// 	}
	// });
};

export function updateTags(tags) {
    AppDispatcher.dispatch({
      type: Action.UPDATE_TAGS,
      tags
    });	
};