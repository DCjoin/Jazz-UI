'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import Tag from '../constants/actionType/Tag.jsx';
import Ajax from '../ajax/ajax.jsx';

var Action = Tag.Action;

let TagAction = {
  loadall(node,page){
    Ajax.post('/Tag.svc/GetTagsByFilter?', {
         params: {
          filter: {
            Association: {
              AssociationId: node.Id,
              AssociationOption: 2
            },
            CustomerId: window.currentCustomerId,
            IncludeAssociationName: true
          },
          limit: 20,
          page: page,
          size: 20,
          start: 20*(page-1)
          },
        success: function(tagList){
          console.log("**wyh**TagAction");
          console.log(tagList);
          AppDispatcher.dispatch({
              type: Action.LOAD_TAG_NODE,
              tagList: tagList
          });
        },
        error: function(err, res){
          console.log(err,res);
        }
    });
  }

};

module.exports = TagAction;
