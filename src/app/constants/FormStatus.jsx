import keyMirror from 'keymirror';

module.exports = {
  formStatus: keyMirror({
    ADD: null,
    EDIT: null,
    VIEW: null,
    CREATESAVING:null,
    CREATESAVED:null,
    UPDATESAVING:null,
    UPDATESAVED:null,
    DELETING:null,
    DELETED:null
  })
};
