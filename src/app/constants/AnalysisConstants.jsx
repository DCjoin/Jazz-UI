import keyMirror from 'keymirror';

module.exports = {
  MenuAction: keyMirror({
    Copy: null,
    Send: null,
    Delete: null,
    Share: null,
    Export: null,
    Save: null,
    SaveAs: null,
  }),
  ProblemMarkEnum: {
  	AirConditioning: 1,
  	Boiler: 2,
  	StrongElectricity: 3,
  	WeakElectricity: 4,
  	Drainage: 5,
  	AirCompression: 6,
  	Other: 20,
  }
};
