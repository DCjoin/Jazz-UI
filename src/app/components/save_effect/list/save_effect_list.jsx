import React, { Component } from 'react';
import {ItemForManager,ItemForConsultant,ItemForDraft} from './Item.jsx';
import FontIcon from 'material-ui/FontIcon';
// import _ from 'lodash-es';
import Immutable from "immutable";
import privilegeUtil from 'util/privilegeUtil.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import FlatButton from "controls/NewFlatButton.jsx";
import {getenergyeffect,deleteItem,saveeffectratetag} from 'actions/save_effect_action.js';
import ListStore from '../../../stores/save_effect/ListStore.jsx';
import { CircularProgress,Dialog} from 'material-ui';
import ConfigRate from './ConfigRate.jsx';
import HierarchyStore from 'stores/HierarchyStore.jsx';
import CurrentUserCustomerStore from 'stores/CurrentUserCustomerStore.jsx';
import {find} from 'lodash-es';
import Detail from './save_effect_detail.jsx';
import Step1 from '../edit/step1.jsx';

function privilegeWithSave_Effect( privilegeCheck ) {
   return true
	// return privilegeCheck(PermissionCode.Save_Effect, CurrentUserStore.getCurrentPrivilege());
}
function isFull() {
	return privilegeWithSave_Effect(privilegeUtil.isFull.bind(privilegeUtil));
}

function getCustomerById(customerId) {
	return find(CurrentUserCustomerStore.getAll(), customer => customer.Id === customerId * 1 );
}


export default class EffectList extends Component {

  static contextTypes = {
        hierarchyId: React.PropTypes.string
      };

  constructor(props, ctx) {
        super(props)
        this._onChanged = this._onChanged.bind(this);
        this._onDraftDelete = this._onDraftDelete.bind(this);
        this._onRateTagSave = this._onRateTagSave.bind(this);
        this._onItemClick = this._onItemClick.bind(this);

  }

  state={
    effect:Immutable.fromJS({
  "Drafts": [
    {
      "ConfigStep": 1,
      "EnergyProblemId": 2,
      "EnergySolutionName": "sample string 1",
      "TagId": 4,
      "TagName": "sample string 5",
      EnergyEffectItemId:1
    },
    {
      "ConfigStep": 1,
      "EnergyProblemId": 2,
      "EnergySolutionName": "sample string 2",
      "TagId": 4,
      "TagName": "sample string 5",
      EnergyEffectItemId:2
    },
    {
      "ConfigStep": 1,
      "EnergyProblemId": 2,
      "EnergySolutionName": "sample string 3",
      "TagId": 4,
      "TagName": "sample string 5",
      EnergyEffectItemId:3
    },
    {
      "ConfigStep": 1,
      "EnergyProblemId": 2,
      "EnergySolutionName": "sample string 3",
      "TagId": 4,
      "TagName": "sample string 5"
    },
    {
      "ConfigStep": 1,
      "EnergyProblemId": 2,
      "EnergySolutionName": "sample string 3",
      "TagId": 4,
      "TagName": "sample string 5"
    },
    {
      "ConfigStep": 1,
      "EnergyProblemId": 2,
      "EnergySolutionName": "sample string 3",
      "TagId": 4,
      "TagName": "sample string 5"
    },
    {
      "ConfigStep": 1,
      "EnergyProblemId": 2,
      "EnergySolutionName": "sample string 3",
      "TagId": 4,
      "TagName": "sample string 5"
    },
    {
      "ConfigStep": 1,
      "EnergyProblemId": 2,
      "EnergySolutionName": "sample string 3",
      "TagId": 4,
      "TagName": "sample string 5"
    },
    {
      "ConfigStep": 1,
      "EnergyProblemId": 2,
      "EnergySolutionName": "sample string 3",
      "TagId": 4,
      "TagName": "sample string 5"
    },
    {
      "ConfigStep": 1,
      "EnergyProblemId": 2,
      "EnergySolutionName": "sample string 3",
      "TagId": 4,
      "TagName": "sample string 5"
    },
    {
      "ConfigStep": 1,
      "EnergyProblemId": 2,
      "EnergySolutionName": "sample string 3",
      "TagId": 4,
      "TagName": "sample string 5"
    },
    {
      "ConfigStep": 1,
      "EnergyProblemId": 2,
      "EnergySolutionName": "sample string 3",
      "TagId": 4,
      "TagName": "sample string 5"
    },
    {
      "ConfigStep": 1,
      "EnergyProblemId": 2,
      "EnergySolutionName": "sample string 3",
      "TagId": 4,
      "TagName": "sample string 5"
    },
    {
      "ConfigStep": 1,
      "EnergyProblemId": 2,
      "EnergySolutionName": "sample string 3",
      "TagId": 4,
      "TagName": "sample string 5"
    },
    {
      "ConfigStep": 1,
      "EnergyProblemId": 2,
      "EnergySolutionName": "sample string 3",
      "TagId": 4,
      "TagName": "sample string 5"
    },
    {
      "ConfigStep": 1,
      "EnergyProblemId": 2,
      "EnergySolutionName": "sample string 3",
      "TagId": 4,
      "TagName": "sample string 5"
    },
    {
      "ConfigStep": 1,
      "EnergyProblemId": 2,
      "EnergySolutionName": "sample string 3",
      "TagId": 4,
      "TagName": "sample string 5"
    },
    {
      "ConfigStep": 1,
      "EnergyProblemId": 2,
      "EnergySolutionName": "sample string 3",
      "TagId": 4,
      "TagName": "sample string 5"
    }
  ],
  "EnergyEffects": [
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 20,
      "ConfigedTagCount": 0,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6,
      EnergyEffectItemId:1,
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 6,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 2,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 1,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    }
  ],
  "SavingRateConfigState": 1
}),
  draftShow:false,
  deleteConfirmShow:false,
  deleteIndex:null,
  configRateShow:false,
  effectDetailShow:false,
  displayEffect:null
  }

  _getHierarchyId(router, context) {
		return +router.location.query.init_hierarchy_id || +context.hierarchyId || null;
	}
	_getSelectedHierarchy() {
		let selectedHierarchyId = this._getHierarchyId(this.props.router, this.context);
		return find(HierarchyStore.getBuildingList().concat(getCustomerById(this.props.router.params.customerId)), building => building.Id === selectedHierarchyId) || null;
	}
  _onChanged(){
    this.setState({
      effect:ListStore.getEffect()
    })
  }

  _onDraftShow(){
    this.setState({
      draftShow:true
    })
  }

  _onDraftDelete(index){
    this.setState({
      deleteConfirmShow:true,
      deleteIndex:index
    })
  }

  _onConfigRateShow(){
    this.setState({
      configRateShow:true
    })
  }

  _onRateTagSave(list){
    this.setState({
      configRateShow:false
    },()=>{
        saveeffectratetag(this.props.router.params.customerId,this.context.hierarchyId,list)
    })
  }

  _onItemClick(effect){
    this.setState({
      effectDetailShow:true,
      displayEffect:effect
    })
  }

  _renderDeleteDialog(){
    let draft=this.state.effect.get('Drafts').getIn([this.state.deleteIndex]);
    let actions = [
      <FlatButton
      inDialog={true}
      primary={true}
      label={I18N.Template.Delete.Delete}
      style={{backgroundColor:'#dc0a0a',marginRight:'20px'}}
      onTouchTap={()=>{
        this.setState({
          deleteConfirmShow:false,
          deleteIndex:null
        },()=>{
          deleteItem(draft.get('EnergyEffectItemId'));
        })
      }}
      />,
      <FlatButton
      label={I18N.Common.Button.Cancel2}
      style={{borderRadius: "2px",border: 'solid 1px #9fa0a4'}}
      onTouchTap={()=>{
        this.setState({
          deleteConfirmShow:false,
          deleteIndex:null
        })
      }}
      />
    ];
    let dialogProps = {
      ref: 'dialog',
      actions: actions,
      modal: true,
      open: true,
    };
    return(
      <Dialog {...dialogProps}>
        <div style={{
            'word-wrap': 'break-word',
            'word-break': 'break-all',
            fontSize: "14px",
            color: "#626469"
          }}>
          {I18N.format(I18N.SaveEffect.DraftDeleteConfirm,draft.get('TagName'))}
        </div>

      </Dialog>
    )
  }

  componentDidMount(){
    // getenergyeffect(this.context.hierarchyId);
    ListStore.addChangeListener(this._onChanged);
  }

  componentWillUnmount(){
    ListStore.removeChangeListener(this._onChanged);
  }

  render(){
    var style={
      btn:{
        height:'30px',
        width:'100px',
        lineHeight:'30px',
        marginLeft:'15px'
      },
      lable:{
        fontSize: "14px",
        fontWeight: "500",
        padding:'0'
      }
    };

    return(
      <Step1 tags={Immutable.fromJS([{
          Id:1,Name:'Tag1'
        },{
          Id:1,Name:'Tag2'
        },{
          Id:1,Name:'Tag3'
        }])}
      isView={true}/>
    )

    if(this.state.effect===null){
      return (
        <div className="jazz-effect-list flex-center">
         <CircularProgress  mode="indeterminate" size={80} />
       </div>
      )
    }else if(this.state.effect.get('EnergyEffects').size===0){
      return (
        <div className="jazz-effect-list flex-center">
          <FontIcon className="icon-weather-thunder" style={{fontSize:'60px'}} color="#32ad3d"/>
         <div className="nolist-font">{I18N.SaveEffect.NoEffectList}</div>
       </div>
      )
    }else if(this.state.draftShow){
      return(
        <div className="jazz-effect-overlay">
        <div className="jazz-effect-list">
          <div className="jazz-effect-list-header">
            <div className="jazz-effect-list-title" style={{margin:'20px 0 5px 0'}}>{I18N.SaveEffect.Draft}</div>
          </div>
          {this.state.effect.get('Drafts').size===0?
            <div className="jazz-effect-list-content flex-center">
              <FontIcon className="icon-weather-thunder" style={{fontSize:'60px'}} color="#32ad3d"/>
             <div className="nolist-font">{I18N.SaveEffect.NoDraft}</div>
           </div>
            :<div className="jazz-effect-list-content">
          {this.state.effect.get('Drafts').map((item,index)=>(<ItemForDraft effect={item} onDelete={()=>{this._onDraftDelete(index)}} canEdit={isFull()}/>))}
          </div>}
          {this.state.deleteConfirmShow && this._renderDeleteDialog()}
        </div>
      </div>
      )
    }else if(this.state.effectDetailShow){
      return(
          <Detail effect={this.state.displayEffect} onBack={()=>{this.setState({effectDetailShow:false,displayEffect:null},
                                                            ()=>{
                                                              // getenergyeffect(this.context.hierarchyId)
                                                            })}}
                                                    canEdit={isFull()}/>
      )
    }else{
      let disabled=ListStore.getRateBtnDisabled(this.state.effect.get("EnergyEffects"));
      return(
        <div className="jazz-effect-overlay">
          <div className="jazz-effect-list">
            {isFull() && !disabled && this.state.effect.get('SavingRateConfigState') && <div className="jazz-effect-list-rateTip">
              {I18N.SaveEffect.EffectRateTip}
            </div>}
            <div className="jazz-effect-list-header">
              <div>
                <div className="jazz-effect-list-title">{I18N.Setting.Effect.List}</div>
                {isFull() && <FlatButton label={I18N.SaveEffect.ConfigSaveRatio} onTouchTap={this._onConfigRateShow.bind(this)}
                            disabled={disabled} style={style.btn} labelStyle={style.lable} secondary={true}/>}
              </div>
              <div className="draft-btn" onClick={this._onDraftShow.bind(this)}>
                {`${I18N.SaveEffect.Draft} (${this.state.effect.get('Drafts').size})`}
              </div>
            </div>
            <div className="jazz-effect-list-content">
              {this.state.effect.get("EnergyEffects").map(item=>(isFull()?<ItemForConsultant effect={item} onClick={this._onItemClick} canEdit={isFull()}/>:<ItemForManager effect={item} onClick={this._onItemClick} canEdit={isFull()}/>))}
            </div>
            {this.state.configRateShow &&
                <ConfigRate hierarchyName={this._getSelectedHierarchy().Name} hierarchyId={this.context.hierarchyId}
                            onClose={()=>{this.setState({configRateShow:false})}} onSave={this._onRateTagSave}/>}
          </div>
        </div>

      )
    }

  }
}

EffectList.propTypes = {
  list:React.PropTypes.object,
};
