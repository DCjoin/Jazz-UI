'use strict';

import React from 'react';
import {Navigation, State} from 'react-router';
import MainAppBar from './MainAppBar.jsx';
import BackgroudImage from '../controls/BackgroundImage.jsx';
import classNames from 'classnames';
import _findIndex from 'lodash/array/findIndex';
import CustomerStore from '../stores/CustomerStore.jsx';

var _bgData = "";
var timeoutHandler = null;
var _ = {
  findIndex: _findIndex
};

var SelectCustomer = React.createClass({
    mixins: [
      Navigation, State
    ],
    getInitialState: function() {
      return {
        currentIndex:0,
      };
    },
    _saveSelectCustomer : function(customer) {
      //SelectCustomerActionCreator.selectCustomer(customer);
    },
    _onClose() {
      this.props.close();
    },
    _selectCustomerChangeHandler : function(selectedIndex) {
      if (this.state.currentIndex == selectedIndex) {
        //var customerList = CurrentUserCustomerStore.getAll();
        var customerList = [
            {
                "Id": 310643,
                "Name": "梅赛德斯",
                "Version": 5717631
            }, {
                "Id": 312170,
                "Name": "克莱斯勒",
                "Version": 5566023
            }, {
                "Id": 309902,
                "Name": "福特",
                "Version": 5167425
            }, {
                "Id": 311056,
                "Name": "大众",
                "Version": 5209955
            }, {
                "Id": 306463,
                "Name": "丰田",
                "Version": 5236682
            }, {
                "Id": 306437,
                "Name": "雷克萨斯",
                "Version": 5057861
            }, {
                "Id": 100650,
                "Name": "本田",
                "Version": 5391643
            }, {
                "Id": 312297,
                "Name": "讴歌",
                "Version": 5218283
            }, {
                "Id": 309866,
                "Name": "马自达",
                "Version": 4994126
            }
        ];
        this._saveSelectCustomer(customerList[selectedIndex]);
      } else {
        this.setState({currentIndex: selectedIndex});
      }
    },

    _getCustomerList() {
      var customerList = CustomerStore.getCustomers();
      console.log('**************************************');
      console.log(JSON.stringify(customerList,0,1));
      console.log('**************************************');

      customerList = customerList.map(((item, idx) => {
          var style = {
              opacity: 0.95
          };
          var innerStyle = {
              width: '90%',
              height: '90%',
              cursor: 'pointer'
          };
          var baseWidth = this.state.screenWidth / 5.5;

          var baseHeight = baseWidth / 2;
          if (baseWidth < 210) baseWidth = 210;
          style.width = baseWidth + 'px';
          style.height = baseHeight + 'px';
          style.minWidth = style.width;
          var gap = this.state.currentIndex - idx;
          var title = null;
          if (this.state.currentIndex != idx) {
              var absGap = Math.abs(gap);
              if (absGap == 1) {
                  style.opacity = 0.8;
                  innerStyle.width = '48%';
                  innerStyle.height = '48%';
              } else if (absGap == 2) {
                  style.opacity = 0.65;
                  innerStyle.width = '32%';
                  innerStyle.height = '32%';
              }
          } else {
              title = item.Name;
          }
          style.left = ((this.state.screenWidth - 150 * 2 - baseWidth) / 2 - this.state.currentIndex * baseWidth) + 'px';

          var imageId = item.Id.toString();
          var customerName = item.Name;

          return (
              <div className="pop-select-customer-ct" style={style} key={idx} onClick={this._selectCustomerChangeHandler.bind(this, idx)} >
                  <div style={innerStyle} title={customerName}>
                    <BackgroudImage imageId={imageId} />
                  </div>
                  {customerName && <span>{customerName}</span>}
              </div>
          );
      }).bind(this));

      return customerList;

    },

    _prevPage() {
      if (this.state.currentIndex > 0) {
        this.setState({
          currentIndex: this.state.currentIndex - 1
        });
      }
    },
    _nextPage() {
      var customerList = [
          {
              "Id": 310643,
              "Name": "梅赛德斯",
              "Version": 5717631
          }, {
              "Id": 312170,
              "Name": "克莱斯勒",
              "Version": 5566023
          }, {
              "Id": 309902,
              "Name": "福特",
              "Version": 5167425
          }, {
              "Id": 311056,
              "Name": "大众",
              "Version": 5209955
          }, {
              "Id": 306463,
              "Name": "丰田",
              "Version": 5236682
          }, {
              "Id": 306437,
              "Name": "雷克萨斯",
              "Version": 5057861
          }, {
              "Id": 100650,
              "Name": "本田",
              "Version": 5391643
          }, {
              "Id": 312297,
              "Name": "讴歌",
              "Version": 5218283
          }, {
              "Id": 309866,
              "Name": "马自达",
              "Version": 4994126
          }
      ];

      if (this.state.currentIndex < (customerList.length - 1)) {
        this.setState({
          currentIndex: this.state.currentIndex + 1
        });
      }
    },

    _handleResize() {
      if (timeoutHandler != null) {
        clearTimeout(timeoutHandler);
      }
      timeoutHandler = setTimeout(() => {
        this.setState({screenWidth: document.getElementById('emopapp').clientWidth});
      }, 400);
    },

    componentDidMount: function() {
      window.addEventListener('resize', this._handleResize);

      var that = this,
          app = document.getElementById('emopapp');

      this.setState({
        screenWidth: app.clientWidth,
      });
    },
    componentWillMount : function() {
        if (this.props.currentCustomerId) {
            var customerList = [
                {
                    "Id": 310643,
                    "Name": "梅赛德斯",
                    "Version": 5717631
                }, {
                    "Id": 312170,
                    "Name": "克莱斯勒",
                    "Version": 5566023
                }, {
                    "Id": 309902,
                    "Name": "福特",
                    "Version": 5167425
                }, {
                    "Id": 311056,
                    "Name": "大众",
                    "Version": 5209955
                }, {
                    "Id": 306463,
                    "Name": "丰田",
                    "Version": 5236682
                }, {
                    "Id": 306437,
                    "Name": "雷克萨斯",
                    "Version": 5057861
                }, {
                    "Id": 100650,
                    "Name": "本田",
                    "Version": 5391643
                }, {
                    "Id": 312297,
                    "Name": "讴歌",
                    "Version": 5218283
                }, {
                    "Id": 309866,
                    "Name": "马自达",
                    "Version": 4994126
                }
            ];
            var idx = _.findIndex(customerList, 'Id', this.props.currentCustomerId);
            if (idx < 0)
                idx = 0;
            this.setState({currentIndex: idx});
        }
    },

    render: function() {
        var closeButton = (
            <em className="icon-close pop-close-overlay-icon" onClick={this._onClose} style={{
                margin: -10,
                padding: 10,
                position: 'absolute',
                zIndex: 100,
                top: '30px',
                right: '30px',
                color:'#fff'
            }}></em>
        );
        return (
            <div>
                <div className="jazz-selectbg"></div>
                <div className="jazz-mask"></div>
                <div className="jazz-customerList">
                  <div style={{ flex: 1, display: 'flex' }}>
                    <div className="jazz-select-customer-handler" onClick ={this._prevPage} >
                      <em className="icon-arrow-left"></em>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                      <div id="pop_select_customer_list" style={{ flex: 1, display: 'flex' }}>{this._getCustomerList()}</div>
                    </div>
                    <div className="jazz-select-customer-handler" onClick ={this._nextPage}>
                      <em className="icon-arrow-right"></em>
                    </div>
                  </div>
                </div>
                {closeButton}
            </div>

        );
    }
});

module.exports = SelectCustomer;
