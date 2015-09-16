import keyMirror from 'keymirror';

module.exports = {

  Action: keyMirror({
    GET_FOLDER_TREE: null,
    CREATE_FOLDER_OR_WIDGET: null,
    MODIFY_NAME_SECCESS: null,
    MODIFY_NAME_ERROR: null,
    SET_SELECTED_NODE: null,
    COPY_ITEM: null,
    COPY_ITEM_ERROR: null,
    DELETE_ITEM: null,
    DELETE_ITEM_ERROR: null,
    SEND_ITEM: null,
    SHARE_ITEM: null,
    MOVE_ITEM: null,
    MOVE_ITEM_ERROR: null,
    MODIFY_NODE_READ_STATUS: null,
    GET_WIDGETDTOS_SUCCESS: null,
    GET_WIDGETDTOS_ERROR: null,
    GET_WIDGETDTOS_LOADING: null,
    UPDATE_WIDGETDTOS_SUCCESS: null,
    UPDATE_WIDGETDTOS_ERROR: null,
    UPDATE_WIDGETDTOS_LOADING: null,
    SET_WIDGET_INIT_STATE: null,
    EXPORT_WIDGET_ERROR: null,
    EXPORT_WIDGET_SUCCESS: null
  })

};
