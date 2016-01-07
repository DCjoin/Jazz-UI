import keyMirror from 'keymirror';

module.exports = {
  dataStatus: keyMirror({
    NEW: 1,
    UPDATED: 2,
    DELETED: 3,
    NOCHANGED:0
  })
};
