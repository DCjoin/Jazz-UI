import React, { Component, PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import {getDateTimeItemsByStepForVal} from 'util/Util.jsx';

function AddIcon(props) {
	let otherProps = {
		onClick: (e) => {
			if( !props.disabled && props.onClick && typeof props.onClick === 'function' ) {
				props.onClick(e);
			}
		}
	};
	if( !props.disabled ) {
		otherProps.className = 'icon-add';
		otherProps.href = 'javascript:void(0)';
	} else {
		otherProps.className = 'icon-add disabled';
	}
	return (<a {...props} {...otherProps}/>)
}

function AdditiveComp({
	className,
	contentClassName,
	title,
	operationDisabled,
	renderFunc,
	data,
	limit,
	onAdd,
	onDelete}
) {
	let disabled = data && data.length >= limit;
	return (
		<div className={className}>
			<hgroup className='' style={{color: '#202622', fontSize: '14px',display:'flex'}}>
				<div style={{color:'#9fa0a4',fontSize:'12px'}}>{title}</div>
			 {!operationDisabled && <AddIcon
						disabled={disabled}
						onClick={onAdd}/>}
			</hgroup>
			<div className={contentClassName}>{data.map( (item, idx) =>
				<div style={{display: 'flex'}}>
					{renderFunc(item, idx)}
					{data && data.length > 1 &&
					(!operationDisabled && <IconButton iconClassName='icon-close' iconStyle={{
						fontSize: 12,
						iconHoverColor: '#0cad04',
					}} onClick={() => {
						onDelete(item);
					}}/>)}
				</div>)}
			</div>
		</div>
	)
}

export default class TimePeriodComp extends Component {
  render(){
    let{title,workRuningTimes,onAddWorkTime,onChangeWorkTime,onDeleteWorkTime,operationDisabled}=this.props;
    return (
      <AdditiveComp
        className={'calendar-run-time'}
        title={title}
        limit={4}
        data={workRuningTimes}
        onAdd={onAddWorkTime}
        onDelete={onDeleteWorkTime}
				operationDisabled={operationDisabled}
        renderFunc={(data, idx) =>
        <div key={idx} style={{display: 'flex', alignItems: 'center', marginLeft: -10}}>
          <ViewableDropDownMenu
            autoWidth={false}
            iconStyle={{display: 'none'}}
            labelStyle={{textOverflow: 'clip'}}
            itemLabelStyle={{textOverflow: 'clip'}}
            style={{width: 50, marginLeft: 10, marginTop: -6}}
            defaultValue={data.FromTime*60}
            dataItems={getDateTimeItemsByStepForVal(60).slice(0, 24)}
            didChanged={(val) => {
              if(val > data.ToTime*60) {
                onChangeWorkTime(data, 'ToTime', val);
              }
              onChangeWorkTime(data, 'FromTime', val);
            }}/>
          {I18N.Setting.DataAnalysis.To}
          <ViewableDropDownMenu
            autoWidth={false}
            iconStyle={{display: 'none'}}
            labelStyle={{textOverflow: 'clip'}}
            itemLabelStyle={{textOverflow: 'clip'}}
            style={{width: 50, marginLeft: 10, marginTop: -6}}
            defaultValue={data.ToTime*60 || 60 * 24}
            dataItems={getDateTimeItemsByStepForVal(60).slice(1)}
            didChanged={(val) => {
              if(val === 0) {
                val = 60 * 24;
              }
              if(val < data.FromTime*60) {
                onChangeWorkTime(data, 'FromTime', val);
              }
              onChangeWorkTime(data, 'ToTime', val);
            }}/>
        </div>
		}/>);
  }
}

TimePeriodComp.propTypes={
  workRuningTimes:React.PropTypes.array,
	onChangeWorkTime:React.PropTypes.func,
	onAddWorkTime:React.PropTypes.func,
	onDeleteWorkTime:React.PropTypes.func,
	title:React.PropTypes.string,
}