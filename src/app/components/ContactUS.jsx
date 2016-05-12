'use strict';

import React from 'react';


var ContactUS = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  render() {
    console.log('this.props.params.lang:' + this.props.params.lang);
    return (
      <div className="jazz-contactus">
				<div className="jazz-contactus-header">
					<h2>{I18N.Platform.About.ContactUs}</h2>

				</div>

				<div className="jazz-contactus-content">
					<div className="jazz-contactus-content-contacts">
						<span>{I18N.ContactUS.Tips}</span>
						<h3>{I18N.ContactUS.Business}</h3>
						<div className="business">
							<div className="card" style={{
        marginRight: '30px'
      }}>
								<div><span className="cardName">张磊</span><span>{I18N.ContactUS.BusinessManager}</span></div>
								<div><span>186 0085 5282</span></div>
								<div><a href="mailto:Lei-Johnny.Zhang@schneider-electric.com">Lei-Johnny.Zhang@schneider-electric.com</a></div>
							</div>
							<div className="card">
								<div><span className="cardName">孙琳</span><span>{I18N.ContactUS.BusinessDevelopmentManager}</span></div>
								<div><span>186 1176 3140</span></div>
								<div><a href="mailto:Lin-Lynn.Sun@schneider-electric.com">Lin-Lynn.Sun@schneider-electric.com</a></div>
							</div>
						</div>
						<h3>{I18N.ContactUS.Technology}</h3>
						<div className="technology">
							<div className="card" style={{
        marginRight: '30px'
      }}>
								<div><span className="cardName">云晓旭</span><span>{I18N.ContactUS.TechnicalSupport}</span></div>
								<div><span>186 1175 7398</span></div>
								<div><a href="mailto:xiaoxu-bean.yun@schneider-electric.com">xiaoxu-bean.yun@schneider-electric.com</a></div>
							</div>
							<div className="card">
								<div><span className="cardName">郭全</span><span>{I18N.ContactUS.ProductManager}</span></div>
								<div><span>186 1125 7740</span></div>
								<div><a href="mailto:quan.guo@schneider-electric.com">quan.guo@schneider-electric.com</a></div>
							</div>
						</div>
					</div>


					<div className="jazz-contactus-content-QRcode">
						<h4 style={{
        width: '200px'
      }}>{I18N.ContactUS.MicroSite}</h4>
						<h5>{I18N.ContactUS.Scan}</h5>
		        <div className="QRcode"></div>
					</div>
				</div>



      </div>
      );
  }
});

module.exports = ContactUS;
