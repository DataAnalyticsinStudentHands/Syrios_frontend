

function SwitchFront(Switchitem){
    Switchitem.childNodes[0].style.opacity = '0.0';
    setTimeout(() => {
      try {
        Switchitem.childNodes[0].style.display = 'none';
        Switchitem.childNodes[1].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          Switchitem.childNodes[1].style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);
  }
  export default SwitchFront