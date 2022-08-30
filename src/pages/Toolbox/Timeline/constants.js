export function colors(text){
  text = text.toLowerCase();
  // ColorB85828:'#B85828',
  let ColorB85828 = ['roman republic','reman principate','start_roman_x'];
  // Color78a878:'#78a878',
  let Color78a878=['persina','parthian','hasmonean','armenian','sasanian','herodian','nabataean'];
  // Colord8b848:'#d8b848',
  let Colord8b848=['greek', 'seleucid', 'ptolemaic' , 'alexander the great', 'attalid','start_greek_hellenistic_x'];
  // Color737271:'#737271',
  let Color737271=['emesene' , 'commagenian','syrian' , 'palmyrene'];
  // Color486678:'#486678',
  let Color486678=['political'];
  // Color313029:'#313029',
  let Color313029=['military'];
  // Colord88858:'#d88858',
  let Colord88858=['economic'];
  // Colord8a048:'#d8a048',
  let Colord8a048=['eastern'];
  let Color7FA87F=['start_eastern_states_x'];
  if(ColorB85828.includes(text))
    return '#b85828';
  else if(Color78a878.includes(text))
    return '#78a878';
  else if(Colord8b848.includes(text))
    return '#d8b848';
  else if(Color737271.includes(text))
    return '#737271';
  else if(Color486678.includes(text))
    return '#486678';
  else if(Color313029.includes(text))
    return '#313029';
  else if(Colord88858.includes(text))
    return '#88858';
  else if(Colord8a048.includes(text)){
    return '#8a048';
  }
  else if(Color7FA87F.includes(text)){
    return '#7FA87F';
  }
  else{
    return '#71797E'
  }

}

//  export function find_color(text) {
//       text = text.toLowerCase();
//       // console.log(text)
//       if (text.includes('roman'))
//         return '#B85828'; //b85828
//       if (text.includes('greek', 'seleucid', 'ptolemaic' , 'alexander the great', 'attalid'))
//         return '#d8b848';
//       if (text.includes('persina' , "parthian" , "hasmonean" , "armenian" , "sasanian" , "herodian" , "nabataean"))
//         return '#78a878';
//       if (text.includes('emesene' , 'commagenian','syrian' , 'palmyrene'))
//         return '#737271';
//       if (text.includes('political'))
//         return '#486678';
//       if (text.includes('military'))
//         return '#313029';
//       if (text.includes('cultural'))
//         return '#d88858';
//       if (text.includes('economic'))
//         return '#d8a048';
//       if (text.includes('eastern'))
//         return '#7FA87F';
//       return this.default;
//   }
// export const mintColor = {
//   find_color:function(text){
//     text = text.toLowerCase();
//     if(text.includes("antioch"))
//       return "#f4f2f0";
//     if(text.includes("syria"))
//       return "#737271";
//     if(text.includes("roman"))
//       return "#b85828";
//     if(text.includes("greek" , "Hellenistic"))
//       return "#987818";
//     if(text.includes("eastern"))
//       return "#184818";
//   }
