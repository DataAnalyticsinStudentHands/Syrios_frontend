export const colors = {
  roman: '#B85828',
  greek: '#F2D16B',
  easternStates: '#7FA87F',
  default: '#71797E',
  findColor: function(text) {
    text = text.toLowerCase();
    if (text.includes('roman'))
      return this.roman;
    if (text.includes('greek'))
      return this.greek;
    if (text.includes('eastern') || text.includes('persian'))
      return this.easternStates;
    return this.default;
  }
};
