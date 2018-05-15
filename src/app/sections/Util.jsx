module.exports = {
  getIEVersion() {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const match = window.navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
    return match ? parseInt(match[1], 10) : undefined;
  },

  easeOut(duration, property, delay, easeFunction) {
    easeFunction = easeFunction || 'cubic-bezier(0.23, 1, 0.32, 1)';

    if (property && Object.prototype.toString.call(property) === '[object Array]') {
      var transitions = '';
      for (var i = 0; i < property.length; i++) {
        if (transitions) transitions += ',';
        transitions += this.create(duration, property[i], delay, easeFunction);
      }

      return transitions;
    } else {
      return this.createTransition(duration, property, delay, easeFunction);
    }
  },

  createTransition(duration, property, delay, easeFunction) {
    duration = duration || '450ms';
    property = property || 'all';
    delay = delay || '0ms';
    easeFunction = easeFunction || 'linear';

    return property + ' ' + duration + ' ' + easeFunction + ' ' + delay;
  }
};