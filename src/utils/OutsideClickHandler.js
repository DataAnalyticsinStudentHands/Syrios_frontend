import { useEffect, useRef } from 'react';

const OutsideClickHandler = (props) => {
  const ref = useRef(null);
  const { onOutsideClick } = props;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick && onOutsideClick();
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [ onOutsideClick ]);

  return (
    <div ref={ref} style={{ opacity: 1 }}>
      {props.children}
    </div> 
  );
}

export default OutsideClickHandler;
