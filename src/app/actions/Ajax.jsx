import PopAppDispatcher from '../dispatcher/AppDispatcher.jsx';
import AjaxConstants from '../constants/AjaxConstants.jsx';

let {AjaxActionType} = AjaxConstants;

var AjaxAction = {

    handleGlobalError(httpStatusCode){
        PopAppDispatcher.dispatch({
            type: AjaxActionType.AJAX_END_ERROR,
            httpStatusCode: httpStatusCode
        });
    }

};

module.exports = AjaxAction;
