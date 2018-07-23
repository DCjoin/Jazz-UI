import React, { Component } from 'react';
import Immutable from 'immutable';

var building=Immutable.fromJS({
            "id": 0,//层级节点ID
            "parentId": 0,//父节点ID
            "customerId": 0,//客户ID
            "name": "string",//名称
            "code": "string",
            "type": 0,//层级类型：Customer=-1，Organization=0,Site=1,Building=2,Room=3,Panel=4,Device=5,Gatway=6
            "systemIds": [//归属的产品类型 0,云能效;1,千里眼;2,机器顾问;8,信息顾问;32,变频顾问
                0
            ],
            "industryId": 8,//所属行业
            ZoneId:1,
            "buildingArea": 0,//面积
            "finishingDate": "2018-06-08T06:38:39.038Z",//竣工日期
            "subType": 0,//楼宇类型：原来的建筑类型=1,项目=2,工厂车间=3
            "customerName": "string",//客户名称
            "logo": {//图标信息
                "id": 0,
                "hierarchyId": 0,
                "logo": "string",//图标的相对路径
                "imageId": "string"
            },
            "location": {//位置信息
                "buildingId": 0,
                Latitude:40.00644,
                Longitude:116.494155,
                "updateTime": "2018-06-08T06:38:39.039Z",
                "province": "string",//省
                "updateUser": "string",
                "updateUserId": 0,
                "cityId": 0,//城市ID
                "address": "北京市朝阳区施耐德大厦A座"//详细地址
            },
            "administrators": [//维护负责人
                {
                "id": 0,
                "hierarchyId": 0,
                "name": "string",//姓名
                "title": "string",//职位
                "telephone": "string",//电话
                "email": "string"//邮箱
                }
            ]
})
export default class BuildingContent extends Component {
  render(){
    return null
  }
}