'use strict';


let I18N={};
I18N.getResourceString = function (resName) {
    resName = resName.replace(/#/ig, '');
    var resource = I18N;
    var nsArray = resName.split('.');
    for (var i = 0; i < nsArray.length; i++) {
        resource = resource[nsArray[i]];
        if (resource === undefined) return undefined;
    }
    arguments[0] = resource;
    return I18N.format.apply(this, arguments);
};
I18N.format = function (res) {
    var regexp,
        matches,
        s = res,
        i;

    i = 1;
    for (; i < arguments.length; i++) {
        s = s.replace(new RegExp('\\{' + (i - 1) + '\\}'), arguments[i]);
    }

    regexp = /##(\w|\.)+##/ig;
    matches = s.match(regexp);
    i = 0;
    if (matches !== null) {
        for (; i < matches.length; i++) {
            s = s.replace(matches[i], I18N.getResourceString(matches[i]));
        }
    }

    return s.replace(/\{\d+\}/ig,'');
};

I18N.MainMenu={};
I18N.MainMenu.Asset = '我的资产';
I18N.MainMenu.Alarm = '故障报警';
I18N.MainMenu.Maintain = '设备维护';
I18N.MainMenu.Setting = '设置';
I18N.MainMenu.Customer = '客户管理';
I18N.MainMenu.User = '用户管理';
I18N.MainMenu.DeviceTemplate = '台账模板';
I18N.MainMenu.ParameterTemplate = '参数模板';

I18N.Login={};
I18N.Login.UserName='用户名';
I18N.Login.Password='密码';
I18N.Login.Logout ='注销';
I18N.Login.Login ='登陆';

I18N.M212001='用户不存在';
I18N.M212002='服务提供商无效';
I18N.M212003='服务提供商不存在';
I18N.M212004='服务商未生效';
I18N.M212005='用户未生效';
I18N.M212006='密码错误';
I18N.M212007='服务商域名不正确';

I18N.Common={};
I18N.Common.Glossary={};
I18N.Common.Glossary.HierarchyNode = '层级节点';

I18N.Message={};

I18N.Message.DeletionConcurrency = '该{0}已不存在，马上为您刷新。';
I18N.Message.UpdateConcurrency = '该{0}已被修改，马上为您刷新。';
I18N.Message.CustomerUnavailable = '抱歉，该客户不存在或无访问权限，请退出系统后重新登录。';

I18N.Message.M1 = '服务器错误。';
I18N.Message.M8 = '您没有该功能权限。';
I18N.Message.M9 = '您没有该数据权限。';

I18N.Message.M01002 = '##Common.Glossary.Hierarchy##的ID非法，无法获取高级属性。';
I18N.Message.M01006 = '该##Common.Glossary.Code##已存在';
I18N.Message.M01010 = '##Common.Label.DuplicatedName##';
I18N.Message.M01011 = '该层级树的父节点已被删除，无法保存该节点。';
I18N.Message.M01012 = '该层级节点包含子节点，无法删除。';
I18N.Message.M01013 = '该层级节层级超限';
I18N.Message.M01014 = '该节点已被其他用户修改或删除，层级树将被刷新。';
I18N.Message.M01015 = '当前层级节点无子节点'; //for energy view single tag to pie chart
I18N.Message.M01016 = '相关的##Common.Glossary.Hierarchy##无有效日历，无法获得本年的目标值和基准值。';
I18N.Message.M01018 = '无法移动到目标节点下，请按照规则拖动层级节点：<br/>组织->组织、客户；<br/>园区->组织、客户；<br/>楼宇->园区、组织、客户。';
I18N.Message.M01019 = '层级被修改';
I18N.Message.M01251 = '该层级节点的高级属性已被其他用户修改。界面即将刷新';
I18N.Message.M01254 = '高级属性的输入项非法，无法保存。';
I18N.Message.M01301 = '日历已被其他用户修改。';
I18N.Message.M01302 = '已为本节点创建了日历，不能重复创建。';
I18N.Message.M01304 = '该##Common.Glossary.Tag##未与任何##Common.Glossary.Hierarchy##关联';
I18N.Message.M01305 = '与该##Common.Glossary.Tag##相关的##Common.Glossary.Hierarchy##未配置日历属性，无法进行计算。';
I18N.Message.M01306 = '##Common.Label.TimeOverlap##';
I18N.Message.M01401 = '该层级节点上已有系统维度设置，无法删除。';
I18N.Message.M01402 = '该层级节点上已有区域维度设置，无法删除。';
I18N.Message.M01405 = '该层级节点上已有日历设置，无法删除。';
I18N.Message.M01406 = '该层级节点上已有成本设置，无法删除。';
I18N.Message.M01407 = '该层级节点上已有高级属性设置，无法删除。';
I18N.Message.M01408 = '该层级节点上已有数据点关联，无法删除。';

//building picture
I18N.Message.M01503 = '只允许上传jpg/png格式图片，请重新上传。';
I18N.Message.M01504 = '图片文件太大，请您重新上传。';
I18N.Message.M01505 = '图片尺寸太小，请您重新上传。';
I18N.Message.M01506 = '图片尺寸太大，请您重新上传。';
I18N.Message.PictureUploadFailed = '图片上传失败，请稍后再试。';

/******
Energy Error Code
*******/
I18N.Message.M02004 = '聚合粒度非法';
I18N.Message.M02007 = '开始时间不能大于结束时间';
I18N.Message.M02008 = '介质不同，不能绘制饼图。';
I18N.Message.M02013 = '该数据点已被删除，无法加载。';
I18N.Message.M02020 = '导出图表失败，请点击“查看数据”后再重试。';
I18N.Message.M02021 = '导出EXCEL失败，请点击“查看数据”后再重试。';
I18N.Message.M02104 = '无法转换非能耗组介质单位';
I18N.Message.M02105 = '抱歉，发生了错误，无法绘制饼图。';
I18N.Message.M02106 = '抱歉，发生了错误，无法绘制饼图。';
I18N.Message.M02107 = '抱歉，发生了错误，无法绘制饼图。';
I18N.Message.M02108 = '介质单位性质不同，无法转换';
I18N.Message.M02109 = '介质不同，无法转换为常用单位';
I18N.Message.M02114 = '数据点无法转换为统一单位';
I18N.Message.M02017 = '数据点关联发生变化，无法绘图';
I18N.Message.M02203 = '该数据点不存在，无法获取目标值基准值。';
I18N.Message.M02205 = '昼夜比关键能效指标不支持按小时展示';
I18N.Message.M02301 = '该层级节点不存在。';
I18N.Message.M02023 = '所选数据点介质不同，无法共同绘制饼状图！';
I18N.Message.M02009 = '没有数据权限或权限已被修改，无法查询数据';
I18N.Message.M02407 = '峰谷平电价展示不支持按分钟/小时展示';
I18N.Message.M02408 = '该节点未设置峰谷时段，无法展示';
I18N.Message.M02027 = '该异常记录中数据点的步长小于当前支持的最小步长，无法查看。';

I18N.Message.M02601 = '缺少昼夜日历的部分，无法绘图。请设置后再试。';//'{0}所对应的层级节点没有设置昼夜日历，无法查看昼夜比数据';
I18N.Message.M02602 = '缺少工作日历的部分，无法绘图。请设置后再试。';//'{0}所对应的层级节点没有设置工作日历，无法查看公休比数据';
I18N.Message.M02603 = '缺少总面积的部分，无法绘图。请设置后再试。';
I18N.Message.M02604 = '缺少供冷面积的部分，无法绘图。请设置后再试。';
I18N.Message.M02605 = '缺少采暖面积的部分，无法绘图。请设置后再试。';
I18N.Message.M02606 = '缺少人口数量的部分，无法绘图。请设置后再试。';

I18N.Message.M02500 = '该##Common.Glossary.Tag##未与任何##Common.Glossary.Hierarchy##关联';
I18N.Message.M02501 = '缺少人口属性的部分无法绘图。请设置后再试。';
I18N.Message.M02502 = '缺少面积属性的部分无法绘图。请设置后再试。';
I18N.Message.M02503 = '缺少采暖面积属性的部分无法绘图。请设置后再试。';
I18N.Message.M02504 = '缺少供冷面积属性的部分无法绘图。请设置后再试。';

I18N.Message.M02505 = '缺少人口属性的部分无法绘图。请设置后再试。';
I18N.Message.M02506 = '缺少面积属性的部分无法绘图。请设置后再试。';
I18N.Message.M02507 = '缺少采暖面积属性的部分无法绘图。请设置后再试。';
I18N.Message.M02508 = '缺少供冷面积属性的部分无法绘图。请设置后再试。';
I18N.Message.M02509 = '该能效标识已被删除，请重新选择以查看。';
I18N.Message.M02510 = '该能效标识无数据，请重新选择以查看。';
I18N.Message.M02701 = '所选层级部分删除，无法排名。';

/******
 * Carbon
 ******/
I18N.Message.M03005 = '转换因子重复，界面即将刷新。';
I18N.Message.M03008 = '该转换物与转换目标不匹配，无法保存转换因子。';

/******
 * TOU Tariff Error Code
 ******/
I18N.Message.M03025 = '价格策略配置已被他人修改，界面即将刷新。';
I18N.Message.M03029 = '峰值季节不存在，界面即将刷新。';
I18N.Message.M03030 = '不能保存空的价格策略。';
I18N.Message.M03032 = '未设置平时电价，请确保峰时区间和谷时区间充满24小时。';
I18N.Message.M03033 = '价格策略必须包含峰时电价和谷时电价。';
I18N.Message.M03034 = '峰值季节时间区间为空，无法保存。';
I18N.Message.M03035 = '##Common.Label.TimeOverlap##';
I18N.Message.M03038 = '价格策略已被引用，不可删除。';
I18N.Message.M03039 = '峰值季节时间区间为空，无法保存。';
I18N.Message.M03040 = '##Common.Label.DuplicatedName##';
I18N.Message.M03041 = '峰值季节已存在';
I18N.Message.M03042 = '该输入项只能是正数';

/******
 * Calendar
 ******/
I18N.Message.M03052 = '日历的结束日期必须大于等于开始日期。';
I18N.Message.M03053 = '##Common.Label.TimeOverlap##';
I18N.Message.M03054 = '##Common.Label.DuplicatedName##';
I18N.Message.M03057 = '结束时间必须大于开始时间。';
I18N.Message.M03058 = '日历已被引用，不可删除。';     //--------------
I18N.Message.M03059 = '二月日期不能为29/30/31。';
I18N.Message.M03060 = '小月日期不能为31。';
I18N.Message.M03061 = '至少添加一个采暖季或者供冷季。';
I18N.Message.M03062 = '采暖季与供冷季时间段不能在同一月份内。';
I18N.Message.M03063 = '采暖季与供冷季时间段相差不能小于7天。';
I18N.Message.M03902 = '价格策略名称超过100个字符';
I18N.Message.M03903 = '价格策略名称中包含非法字符';

/*****
labeling
******/
I18N.Message.M03080 = '能效标识已存在，界面将被刷新。';
I18N.Message.M03081 = '能效标识已被删除，界面将被刷新。';
I18N.Message.M03082 = '能效标识已被其他用户修改，界面将被刷新。';
I18N.Message.M03083 = '能效标识没有设置区域。';
I18N.Message.M03084 = '能效标识级别错误。';
I18N.Message.M03085 = '能效标识数据来源年份错误。';

/******
SystemDimension Error Code, NOTE that for error of
04050,04052,04053,04054,
refresh is needed.
04051 should refresh hierarchy tree
*******/
I18N.Message.M04052 = '勾选当前##Common.Glossary.DimensionNode##前，必须确保它的父节点已被勾选。';
I18N.Message.M04054 = '反勾选当前##Common.Glossary.DimensionNode##前，必须确保它的所有子节点未被勾选。';
I18N.Message.M04055 = '当前系统维度节点无子节点';   //for energy view single tag to pie chart
I18N.Message.M04056 = '无法删除该系统维度节点。请先删除该节点下的所有数据点关联关系。';
/******
Dashboard Error Code, NOTE that for error of
05002
refresh is needed.
05011 should refresh hierarchy tree
*******/
I18N.Message.M05001 = '##Common.Label.DuplicatedName##';
I18N.Message.M05011 = '该##Common.Glossary.Dashboard##对应的##Common.Glossary.HierarchyNode##已经被删除，马上为您刷新 。';
I18N.Message.M05013 = '该##Common.Glossary.HierarchyNode##的##Common.Glossary.Dashboard##数量已达上限，请删除部分内容后继续。';
I18N.Message.M05014 = '“我的收藏”内容已达上限，请删除部分内容后继续。';
I18N.Message.M05015 = '##Common.Label.DuplicatedName##';
I18N.Message.M05016 = '当前的##Common.Glossary.Dashboard##的##Common.Glossary.Widget##数量已达上限，无法创建新的##Common.Glossary.Widget##。';
I18N.Message.M05017 = '所有##Common.Glossary.Widget##的##Common.Glossary.Dashboard##的Id不完全一致。';

I18N.Message.M05023 = '{0}{1}';
I18N.Message.M05023_Sub0 = '以下用户Id已被删除：{0}。';
I18N.Message.M05023_Sub1 = '无法分享给这些人：{0}。';

/******
Tag Error Code, NOTE that for error of 06001, 06117,06152,06139,06154,06156, refresh is needed.
*******/

I18N.Message.M06100 = '##Common.Glossary.Tag##已经被删除，无法加载。';
I18N.Message.M06104 = '##Common.Label.DuplicatedName##';
I18N.Message.M06107 = '该##Common.Glossary.Code##已存在';
I18N.Message.M06109 = '该##Common.Glossary.Channel##已存在';
I18N.Message.M06122 = '##Common.Label.DuplicatedName##';
I18N.Message.M06127 = '该##Common.Glossary.Code##已存在';
I18N.Message.M06133 = '##Common.Glossary.Formula##的格式有误，请检查。';
I18N.Message.M06134 = '##Common.Glossary.VirtualTag##的##Common.Glossary.Formula##包含非法的##Common.Glossary.Tag##，无法保存。';
I18N.Message.M06136 = '##Common.Glossary.VirtualTag##的##Common.Glossary.Formula##包含循环调用，无法保存。';

I18N.Message.M06156 = '##Common.Glossary.VirtualTag##的##Common.Glossary.Formula##包含非法的##Common.Glossary.Tag##，无法保存。';
I18N.Message.M06160 = '##Common.Glossary.PhysicalTag##的##Common.Glossary.Commodity##与##Common.Glossary.UOM##不匹配，无法保存。';
I18N.Message.M06161 = '##Common.Glossary.VirtualTag##的##Common.Glossary.Commodity##与##Common.Glossary.UOM##不匹配，无法保存。';
I18N.Message.M06164 = '##Common.Glossary.VirtualTag##的##Common.Glossary.CalculationStep##非法，无法保存。';
I18N.Message.M06174 = '##Common.Glossary.PhysicalTag##的##Common.Glossary.Type##非法，无法保存。';
I18N.Message.M06182 = '{0}"{1}"正在被引用，无法删除。请取消所有引用后再试。<br/>引用对象：{2}';
I18N.Message.M06183 = '##Common.Glossary.Tag##已经过期，可能该##Common.Glossary.Tag##已被他人修改或删除。界面即将刷新。';
I18N.Message.M06186 = '##Message.M06202##';
I18N.Message.M06192 = '##Common.Glossary.DayNightRatio####Common.Glossary.Tag##的##Common.Glossary.CalculationStep##必须大于等于天。';
I18N.Message.M06193 = '当前层级节点的子节点下不包含与该数据点介质相同的数据点';
I18N.Message.M06194 = '当前系统维度的子节点下不包含与该数据点介质相同的数据点';
I18N.Message.M06195 = '当前区域维度的子节点下不包含与该数据点介质相同的数据点';
I18N.Message.M06196 = '当前层级节点不包含与该数据点介质单位相同的数据点';
I18N.Message.M06197 = '当前系统维度不包含与该数据点介质单位相同的数据点';
I18N.Message.M06198 = '当前区域维度不包含与该数据点介质单位相同的数据点';
I18N.Message.M06201 = '无法将##Common.Glossary.CalculationStep##修改为“{0}”。本##Common.Glossary.Tag##与其他##Common.Glossary.Tag##存在引用关系，引用##Common.Glossary.Tag##的##Common.Glossary.CalculationStep##必须大于等于被引用##Common.Glossary.Tag##的##Common.Glossary.CalculationStep##。';
I18N.Message.M06202 = '对应节点下已存在相同介质的能耗数据点。';
I18N.Message.M06203 = '该##Common.Glossary.Tag##不是能耗数据。';


I18N.Message.M07001 = '数据权限已被其他用户修改，界面将被刷新。';
I18N.Message.M07000 = '没有功能权限。';
I18N.Message.M07009 = '没有数据权限。';

I18N.Message.M07010 = '##Common.Label.DuplicatedName##';
I18N.Message.M07011 = '角色已绑定用户，无法删除。';
I18N.Message.M07021 = '层级节点不存在或已被删除，界面将被刷新。';

/*
AreaDimensionNodeNameDuplicate = 208,
AreaDimensionNodeLevelOverLimitation = 209,
AreaDimensionNodeHasNoParent = 210,
AreaDimensionNodeHasBeenDeleted = 211,
AreaDimensionNodeHasChildren = 212,
AreaDimensionNodeHasBeenModified = 213,
*/
I18N.Message.M08200 = '关联##Common.Glossary.DimensionNode##的##Common.Glossary.HierarchyNode##已被删除，界面将被刷新。';
I18N.Message.M08208 = '##Common.Glossary.Name##重复';
I18N.Message.M08209 = '当前的##Common.Glossary.DimensionNode##的级次超出最大长度，无法保存。';
I18N.Message.M08210 = '当前的##Common.Glossary.DimensionNode##的父节点已被删除，界面将被刷新。';
I18N.Message.M08211 = '当前的##Common.Glossary.DimensionNode##已被他人删除，界面将被刷新。';
I18N.Message.M08212 = '无法删除该区域维度节点。请先删除该节点下的所有子节点。';
I18N.Message.M08214 = '当前区域维度节点无子节点';   //for energy view single tag to pie chart
I18N.Message.M08215 = '无法删除该区域维度节点。请先删除该节点下的所有数据点关联关系。';

I18N.Message.M09001 = '数据已被删除，界面将被刷新。';
I18N.Message.M09002 = '数据已被他人修改，界面将被刷新。';
I18N.Message.M09107 = '数据已被他人修改，请点击“确定”开始重新加载数据。';
I18N.Message.M09112 = '对应的##Common.Glossary.Tag##已被删除，马上为您刷新。';
I18N.Message.M09113 = '计算前请先设置计算规则。';
I18N.Message.M09114 = '值超过合法范围，无法保存。合法的值范围为-999999999.999999～999999999.999999。';
I18N.Message.M09155 = I18N.format(I18N.Message.UpdateConcurrency, '计算值');
I18N.Message.M09157 = '对应的##Common.Glossary.Tag##已被删除，马上为您刷新。';
I18N.Message.M09158 = '##Common.Glossary.Tag##未被关联至层级树和维度树，请先将##Common.Glossary.Tag##关联。';
I18N.Message.M09159 = '##Common.Glossary.Tag##所关联的层级树日历属性为空，请先为层级树设置日历。';
I18N.Message.M09160 = '##Common.Glossary.Tag##所关联的层级树日历属性该年数据为空，请先为层级树设置该年日历属性。';

//Cost concurrency error
I18N.Message.M10007 = '峰谷平电价展示不支持按小时展示';
I18N.Message.M10015 = '已经存在同##Common.Glossary.HierarchyNode##的数据,界面将被刷新';
I18N.Message.M10019 = '需量成本Tag为无效数据';
I18N.Message.M10020 = '无功电量Tag为无效数据';
I18N.Message.M10021 = '有功电量Tag为无效数据';

I18N.Message.M11012 = '该客户被层级引用，不能删除！';
I18N.Message.M11351 = '编码重复';
I18N.Message.M11352 = '##Common.Label.DuplicatedName##';
I18N.Message.M11354 = '图片文件太大，请您重新上传。';
I18N.Message.M11355 = '图片尺寸太大，请您重新上传。';
I18N.Message.M11356 = '只允许上传GIF/PNG格式图片，请重新上传';
I18N.Message.M11357 = '客户信息已被其他用户删除，界面将被刷新。';
I18N.Message.M11358 = '客户已被其他数据引用，不能删除。';
I18N.Message.M11404 = '该客户被用户引用，不能删除。';
I18N.Message.M11408 = '该客户被数据点引用，不能删除。';


I18N.Message.M12001 = '##Common.Label.DuplicatedName##';
I18N.Message.M12003 = '登录密码错误';
I18N.Message.M12006 = '默认平台管理员账户不可删除。';
I18N.Message.M12008 = '用户已被删除。界面将刷新。';
I18N.Message.M12009 = '您不能删除自己的账户。';
I18N.Message.M12010 = '您不能修改别人的密码。';
I18N.Message.M12011 = '您不能修改别人的资料。';
I18N.Message.M12050 = '图片文件太大，上传失败。请重新上传。';
I18N.Message.M12051 = '请上传jpg/png/gif/bmp格式图片';
I18N.Message.M12052 = '意见反馈邮件发送失败。';
I18N.Message.M12100 = '用户名不存在';
I18N.Message.M12101 = '邮箱地址错误';
I18N.Message.M12102 = '重置密码的链接地址错误';
I18N.Message.M12103 = '链接已经失效！';
I18N.Message.M12105 = '服务商已经暂停！请联系管理员。';
I18N.Message.M12106 = '服务商已经删除！请联系管理员。';
I18N.Message.M12107 = '您的用户被删除了！请联系管理员。';
I18N.Message.M12108 = '非试用用户，不能发送！';


I18N.Message.M13001 = '数据点已经被其他用户删除！';
I18N.Message.M13002 = '报警已经被其他用户删除！';
I18N.Message.M13003 = '报警已经被其他用户修改！';
I18N.Message.M13011 = '日历已经被其他用户删除！';

I18N.Message.M13015 = '报警已经被其他用户配置！';
I18N.Message.M13016 = '用户已经被其他用户删除！';

I18N.Message.M14001 = '服务商已经被其他用户修改！';
I18N.Message.M14002 = '服务商ID重复！';
I18N.Message.M14003 = '服务商已经被其他用户删除！';
I18N.Message.M14004 = '服务商已经暂停！';
I18N.Message.M14005 = '服务商没有管理员！';
I18N.Message.M14006 = '服务商正在建立中，请稍后再试！';

I18N.Message.M11364 = '地图页信息已存在，界面将被刷新';
I18N.Message.M11365 = '至少包含一个地图页信息';
I18N.Message.M11366 = '客户已被删除，界面将被刷新';
I18N.Message.M11367 = '地图页信息已被他人修改，界面即将刷新。';
I18N.Message.M03070 = '行业对标已存在，界面将被刷新。';
I18N.Message.M03071 = '行业对标已被删除，界面将被刷新。';
I18N.Message.M03072 = '行业对标已被其他用户修改，界面将被刷新。';
I18N.Message.M03073 = '行业对标没有设置区域。';
I18N.Message.M01500 = '地图信息已存在，界面将被刷新。';
I18N.Message.M01501 = '地图信息已被其他用户删除，界面将被刷新。';
I18N.Message.M01502 = '地图信息已被其他用户修改，界面将被刷新。';
I18N.Message.M01507 = '楼宇节点已被其他用户删除，界面将被刷新。';
I18N.Message.M05025 = '该共享已被删除。';
I18N.Message.M05024 = '该用户已被删除。';
I18N.Message.M05027 = '发起者用户已被删除。';
I18N.Message.M05028 = '该订阅者已移除。';
I18N.Message.M00953 = '输入非法。';

I18N.Message.M11600 = '自定义能效标识在该客户下已经存在，请使用其它名字。';
I18N.Message.M11601 = '自定义能效标识错误。';
I18N.Message.M11602 = '自定义能效标识级别不连续。';
I18N.Message.M11603 = '并发错误,请刷新。';

I18N.Message.M05003 = '输入非法。';

I18N.Message.M20001 = '规则名称重复。';
I18N.Message.M20002 = '规则已经被删除。';
I18N.Message.M20003 = '规则已经被修改。';
I18N.Message.M20006 = '客户已经被删除。';
I18N.Message.M20007 = '规则总额超限。';
I18N.Message.M20012 = '部分数据点已关联到其他规则。';
I18N.Message.M20013 = '无法修改以下数据点的数据：{0}。';
I18N.Message.M20014 = '部分数据点已被删除或没有数据权限。';

I18N.Message.M21707 = '报表"{0}"已被删除，马上为您刷新';
I18N.Message.M21705 = '报表名称重复';
I18N.Message.M21702 = '该报表已被修改，马上为您刷新。';
I18N.Message.M21706 = '报表中存在重复的Tag，请检查。';


module.exports = I18N;
