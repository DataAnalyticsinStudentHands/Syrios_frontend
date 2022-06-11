import React, {useEffect, useState} from 'react';
import axios from 'axios';

import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer.js';
import OutsideClickHandler from 'src/utils/OutsideClickHandler.js';

const CoinSortDropDown = (props) => {
  const [show, set_show] = useState(false);
  const [selection, set_selection] = useState(props.state);

  const CloseHandler = (e) => {
    set_show(false);
  }

  const OpenHandler = (e) => {
    set_show(true);
  }

  const Select = (e) => {
    set_selection(e.target.dataset.selection);
    set_show(false);
    props.set_state(selection);
  }

  let display_styling = {
    opacity: show ? 1 : 0,
    zIndex: show ? 1000 : -1000
  };
  let selection_jsx = [];

  props.selections.forEach((e, index) => {
    selection_jsx.push(
      <div key={`coin_sort_dropdown_${e + index}`} className='coin-sort-dropdown-item' onClick={Select} data-selection={e}>
        <p data-selection={e} className='coin-sort-dropdown-item-text dark-blue-text'>
          {e} { index === 0 &&
          <i className='coin-sort-dropdown-arrow' style={{position: 'absolute', right: '0', marginRight: '20px'}}/>
        }
        </p>
        <hr data-selection={e} className='coin-sort-dropdown-item-line-spacer' />
      </div>
    );
  });

  return (
    <div className='coin-sort-option'>
      <p className='dark-text' style={{fontSize: '14px', marginBottom: '3px'}}>
        {props.title}
      </p>
      <div className='coin-sort-dropdown-outermost-div'>
        <div className='coin-sort-dropdown-bar' onClick={OpenHandler}>
          <p className='coin-sort-dropdow-bar-text blue-text'>
            {selection}
          </p>
          <i className='coin-sort-dropdown-arrow'/>
        </div>
        <OutsideClickHandler show={show} onOutsideClick={CloseHandler}>
          <div className='coin-sort-dropdown' style={display_styling}>
            <div className='coin-sort-dropdown-items'>
              {selection_jsx}
            </div>
          </div>
        </OutsideClickHandler>
      </div>
    </div>
  );
}



const CoinSort = () => {
  const arrangement_selections = ['None', '1 x 1 Grid', '2 x 1 Grid', '3 x 1 Grid', '2 x 2 Grid', '3 x 2 Grid', '6 x 3 Grid'];
  const sort_selections = ['None', 'Minting Date', 'Material', 'Issuing Authority', 'Governing Power', 'Size'];
  const [is_loading, set_is_loading] = useState(true);
  const [arrangement_selection, set_arrangement_selection] = useState(arrangement_selections[0]);
  const [sort_selection, set_sort_selection] = useState(sort_selections[0]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_strapiURL + '/api/coin-sort')
      .then((res, err) => {
        set_is_loading(false);
      });
  });

  if (is_loading) {
    return (
      <>
        <LoadingPage />
        <Footer />
      </>
    );
  }

  return (
    <div id='coin-sort-wrapper'>
      <div className='navbar-spacer' />
      <div id='coin-sort-spacer' />
      <div id='coin-sort-options'>
        <CoinSortDropDown title='Arrange:' selections={arrangement_selections} state={arrangement_selection} set_state={set_arrangement_selection}/>
        <div className='coin-sort-menu-vr'/>
        <CoinSortDropDown title='Sort:' selections={sort_selections} state={sort_selection} set_state={set_sort_selection} />
      </div>
      <Footer />
    </div>
  );
}

export default CoinSort;
