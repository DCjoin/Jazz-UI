import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/DataAnalysis.jsx';
import {Collect} from '../../constants/actionType/customerSetting/Tag.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import Path from 'constants/Path.jsx';
import util from 'util/Util.jsx';

const InputDataAction = {
  getTags(CustomerId,HierarchyId,page){
    Ajax.post('/Tag/GetTagsByFilter', {
      params: {
        filter:{
          CustomerId:parseInt(CustomerId),
          HierarchyId,
          Type:1,
          CollectionMethod:Collect.Manual
        },
        page: page,
        size: 20,
        start: 20 * (page - 1)
      },
      success: function(tagData) {
        AppDispatcher.dispatch({
          type: Action.GET_MANUAL_TAGS,
          tagData: tagData
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_TAG_LIST_ERROR
        });
      }
    })
  },
  getLatestRawData(tagId){
    Ajax.get(util.replacePathParams(Path.DataAnalysis.getLatestRawData, tagId), {
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.GET_LATEST_RAW_DATA,
          data: res,
        })
      }
    } );
  },
  saveRawData(alldata,newDataList,tagId,callback){
    Ajax.post('/Energy/ModifyTagRawData', {
      params: {
        newEnergyData:{
          TargetEnergyData:[{
            Target:{
              Type:1,
              TargetId:tagId
            },
            EnergyData:newDataList
          }],

        }
      },
      success: function(tagData) {
        if(callback) callback()
        else {
          AppDispatcher.dispatch({
            type: Action.SAVE_RAW_DATA_SUCCESS,
            alldata
          });
        }

      },
      error: function(err, res) {
      }
    })
  },
  ifLeave(){
    AppDispatcher.dispatch({
      type: Action.JUDGET_IF_LEAVE,
    });
  },
  changeSelectedTag(){
    AppDispatcher.dispatch({
      type: Action.SELECTED_TAG_CHANGE,
    });
  }
}

export default InputDataAction;
