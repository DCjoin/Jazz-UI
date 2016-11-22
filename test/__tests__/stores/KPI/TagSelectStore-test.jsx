import TagSelectStore from 'stores/KPI/TagSelectStore.jsx';
import AppDispatcher from 'dispatcher/AppDispatcher.jsx';
import { Action } from 'constants/actionType/KPI.jsx';
import {expect} from 'chai';

const getDimension=()=>{
  return([
    {
      Comment:"qq",
    HierarchyId:100010,
    Id:100010,
    Name:"一层",
    ParentId:0,
    Version:5908501,
    Children:null},
    {
      Comment:"gg",
    HierarchyId:100010,
    Id:100011,
    Name:"一层",
    ParentId:0,
    Version:5908501,
    Children:null}
  ])
};

const getTags=()=>{
  return{
    pageIndex:0,
    total:2,
    Data:[
      {
        Id:303443,
        Name:'25',
        UomId:39,
        CommodityId:12
      },
      {
        Id:100021,
        Name:'BAV1A11',
        UomId:1,
        CommodityId:1
      }
    ]
  }
};

describe('TagSelectStore', function() {
  it('assemble Dimension should be correct', function () {
    let data=getDimension();
    AppDispatcher.dispatch({
        type: Action.GET_KPI_DIMENSION_SUCCESS,
        data: data,
    });
    expect(TagSelectStore.getDimensions().get('Id')).to.equal(-1);
    expect(TagSelectStore.getDimensions().get('Children').size).to.equal(data.length);

  });

  it('get tags should be correct', function () {
    let tags=getTags();
    AppDispatcher.dispatch({
        type: Action.GET_KPI_TAGS_SUCCESS,
        data: tags.Data,
    });
    expect(TagSelectStore.getTags().size).to.equal(tags.total);
  });
});
