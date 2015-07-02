// Decorator (yeah baby !) - Feels like Python all over again :-)
export default (target) => {
  target.prototype.onChange = function(key, evt, action = null) {
    let parts = key.split('.'),
      len = parts.length - 1,
      update = {}, level, state = this.state;

    // Deep cloning of a simple Javascript object (wait for jsperf.com to be back online to compare)
    level = update;
    for (let i = 0, l = len - 1; i <= l; i++) {
      state = state[parts[i]] || {};
      level = (level[parts[i]] = state);
    }
    level[parts[len]] = evt.target.value;

    this.setState(update);
    if (action) action(evt.target.value);
  };
  return target;
};
