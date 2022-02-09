import React, {useEffect, useState, createRef} from 'react';
import ReactDOM from 'react-dom';
import {
  Container,
  Row,
  Col
} from 'react-bootstrap';
import axios from 'axios';

import Navbar from 'src/components/Navbar.js';
import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer.js';
import OutsideClickHandler from 'src/utils/OutsideClickHandler.js';
import WhitePopUp from 'src/utils/WhitePopUp.js';

import './CoinSort.css';




const CoinSortDropDownTextToStrapiVariableKeys = [ // This is an array of objects that relate coin sort dropdown labels to their object keys that come from strapi.
  // Example (also a live example)
  // dropdownText is the name that resembles it in the drop down on the coin sort. In this case, the dropdownText is 'Size'
  // strapiKey is the object key received by strapi. We don't rename it or whatnot. In this case, it is Diameter
  // What this object is stating is that it will look for Sort By or Then By to be Size and then sort it based on Diameter
  // { type: 'sort', dropdownText: 'Size', strapiKey: 'Diameter' }

  // Sort options
  { type: 'sort', dropdownText: 'Size', strapiKey: 'Diameter' }, 
  { type: 'sort', dropdownText: 'Minting Date',  strapiKey: 'Date' },
  { type: 'sort', dropdownText: 'Issuing Authority', strapiKey: 'IssuingAuthority' },
  { type: 'sort', dropdownText: 'Governing Power', strapiKey: 'State' },
  { type: 'sort', dropdownText: 'Material', strapiKey: 'Material' },

  // Filter options 
];

// This is a class so I can more easily do stuff with the dropdowns
// Plus, it's a great way of compartmentalizing the dropdowns. Lmao I butchered that spelling.
class CoinSortDropDown extends React.Component {
  wrapperRef = createRef();
  
  static ArrayOfCoinSortDropDowns = [];
  constructor(props) {
    super(props);
    this.hide = true;

    this.state = {
      selection: this.props.defaultSelection,
    };
    
    CoinSortDropDown.ArrayOfCoinSortDropDowns.push(this);
  }

  static defaultProps = {
    items: [],
  };

  // These are essentially for the dropdown to pop up or pop down
  componentDidMount() {
    document.addEventListener("mouseup", this.handleClickOutside);
    document.addEventListener("mouseup", this.handleOnClick);
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleClickOutside);
    document.removeEventListener("mouseup", this.handleOnClick);
  }
  
  makeDropDownInvisible() {
    let dom = ReactDOM.findDOMNode(this).querySelector('.CoinSortDropDownList');

    dom.style.zIndex = -1000;
    dom.style.opacity = 0;
    dom.style.pointerEvents = 'none';
  }

  makeDropDownVisible() {
    let dom = ReactDOM.findDOMNode(this).querySelector('.CoinSortDropDownList');

    dom.style.zIndex = 1000;
    dom.style.opacity = 1;
    dom.style.pointerEvents = 'auto';
  }


  // If click outside is rendered, fined the correct dom element and move it's z-index to negative 1000
  handleClickOutside = (event) => {
    let thisDomNode = ReactDOM.findDOMNode(this);

    if (
      this.wrapperRef.current &&
      !this.wrapperRef.current.contains(event.target)
    ) {
      this.hide = true;

      this.makeDropDownInvisible();
    }
  };

  // If click outside is rendered, find the correct dom element and move it's z-index to positive 1000
  handleOnClick = (event) => {
    if (
      this.wrapperRef.current &&
      this.wrapperRef.current.contains(event.target)
    ) {
      this.hide = true;

      this.makeDropDownVisible();
    }
  };

  setStateSelection(str) {
    this.setState({ selection: str });
  }

  render() {
    return (
      <div ref={this.wrapperRef} className='CoinSortDropDownOuterMostDiv'>
        <div className='CoinSortDropDownTarget'>
          <div className='CoinSortDropDownTargetText BlueText CoinSortText'>
          {this.state.selection}
          <i className="demo-icon icon-arrow-thin-down CoinSortDropDownTargetIconArrow">&#xe808;</i>
          </div>
        </div>
        <div className='CoinSortDropDownList'>
          <i className="demo-icon icon-arrow-thin-down CoinSortDropDownListIconArrow">&#xe808;</i>
          {(() => { // List of options dependent on the items prop
            let jsxArr = [];
            this.props.items.forEach((e, index) => {
              jsxArr.push(
                <div 
                  key={`${this.props.items}${index}`} 
                  className='BlueText CoinSortDropDownListCellOuterDiv'
                  onClick={(e) => { // onClick, change the coin sort drop down target text to the appropriate selection and drop the dropdown
                    let dom = e.target;

                    let newFilter = dom.innerText;

                    if (this.props.items.indexOf(newFilter) === -1) return;

                    this.setStateSelection(newFilter);
                    this.makeDropDownInvisible();

                  }}>
                  <div className='text-start'>
                    {e}
                  </div>
                  <div className='CoinSortDropDownListUnderLine' />
                </div>
              );
            });
            return(
              <div style={{ padding: '10px' }}>
                {jsxArr}
              </div>
            );
          })()}
        </div>
      </div>
    );
  }
}



// The actual function
const CoinSort = () => {
  const [isLoading, set_isLoading] = useState(true);
  const [coins, set_coins] = useState(undefined);

  // This is for the tool tips
  const [ArrangeToolTipBox1x1GridDescription, set_ArrangeToolTipBox1x1GridDescription] = useState(undefined);
  const [ArrangeToolTipBox2x1GridDescription, set_ArrangeToolTipBox2x1GridDescription] = useState(undefined);
  const [ArrangeToolTipBox3x1GridDescription, set_ArrangeToolTipBox3x1GridDescription] = useState(undefined);
  const [ArrangeToolTipBox2x2GridDescription, set_ArrangeToolTipBox2x2GridDescription] = useState(undefined);
  const [ArrangeToolTipBox3x2GridDescription, set_ArrangeToolTipBox3x2GridDescription] = useState(undefined);
  const [ArrangeToolTipBox6x3GridDescription, set_ArrangeToolTipBox6x3GridDescription] = useState(undefined);

  useEffect(() => {
    if (isLoading) {
      axios.get(process.env.REACT_APP_strapiURL + '/coins?_limit=-1&_sort=y_date:ASC')
        .then((res, err) => {
          if (err) {
            console.error(err);
          } else {
            set_coins(res.data);
            set_isLoading(false);
          }
        });

      axios.get(process.env.REACT_APP_strapiURL + '/coin-sort')
        .then((res, err) => {
          if (err) {
            console.error(err);
          } else {
            // console.log(res.data);

            set_ArrangeToolTipBox1x1GridDescription(res.data.ArrangeToolTipBox1x1GridDescription);
            set_ArrangeToolTipBox2x1GridDescription(res.data.ArrangeToolTipBox2x1GridDescription);
            set_ArrangeToolTipBox3x1GridDescription(res.data.ArrangeToolTipBox3x1GridDescription);
            set_ArrangeToolTipBox2x2GridDescription(res.data.ArrangeToolTipBox2x2GridDescription);
            set_ArrangeToolTipBox3x2GridDescription(res.data.ArrangeToolTipBox3x2GridDescription);
            set_ArrangeToolTipBox6x3GridDescription(res.data.ArrangeToolTipBox6x3GridDescription);
          }
        });
    }
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <LoadingPage />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div id='CoinSort'>
        <p id='CoinSortTitle' className='OrangeText'>
          Coin Sort
        </p>
        <div id='CoinSortOptions'>
          {/* Arrange */}
          <div id='CoinSortArrange' className='CoinSortCell'>
            <div>
              <p className='GrayText CoinSortText'>
                Arrange: <i 
                  className="demo-icon icon-info BlueText InfoIcon"
                  onClick={(e) => { // onClick move i-card for information as to what Arrange options do to z-index 1000
                    let popUp = undefined;
                    WhitePopUp.ArrayOfWhitePopUps.forEach((e) => {
                      if (e.props.id.includes('ArrangeToolTipBox')) {
                        popUp = e;
                      }
                    });

                    popUp.show();
                  }}>&#xe817;</i>
              </p> 
              <WhitePopUp id='ArrangeToolTipBox'>
                <div className='ToolTipBox'>
                  <p className='OrangeText ToolTipTitle'>
                    TOOL TIP: ARRANGEMENT OPTIONS
                  </p>
                  <p className='BlueText ToolTipText'>
                    <span style={{fontWeight: 'bold'}}>1 x 1 Grid:</span> {ArrangeToolTipBox1x1GridDescription}
                  </p>
                  <p className='BlueText ToolTipText'>
                    <span style={{fontWeight: 'bold'}}>2 x 1 Grid:</span> {ArrangeToolTipBox2x1GridDescription}
                  </p>
                  <p className='BlueText ToolTipText'>
                    <span style={{fontWeight: 'bold'}}>3 x 1 Grid:</span> {ArrangeToolTipBox3x1GridDescription}
                  </p>
                  <p className='BlueText ToolTipText'>
                    <span style={{fontWeight: 'bold'}}>2 x 2 Grid:</span> {ArrangeToolTipBox2x2GridDescription}
                  </p>
                  <p className='BlueText ToolTipText'>
                    <span style={{fontWeight: 'bold'}}>3 x 2 Grid:</span> {ArrangeToolTipBox3x2GridDescription}
                  </p>
                  <p className='BlueText ToolTipText'>
                    <span style={{fontWeight: 'bold'}}>6 x 3 Grid:</span> {ArrangeToolTipBox6x3GridDescription}
                  </p>
                </div>
              </WhitePopUp>
            </div>
            {/* Tool tip */}
            <CoinSortDropDown id='GridDropDown' items={['None', '1 x 1 Grid', '2 x 1 Grid', '3 x 1 Grid', '2 x 2 Grid', '3 x 2 Grid', '6 x 3 Grid']} defaultSelection='None' />
            <div 
              id='CoinSortClearTable' 
              className='CoinSortClearText OrangeText'
              onClick={(e) => {
                let GridDropDown = undefined;

                CoinSortDropDown.ArrayOfCoinSortDropDowns.forEach((e) => {
                  if (e.props.id.includes('GridDropDown')) {
                    GridDropDown = e;
                  }
                });

                GridDropDown.setStateSelection('None');
              }}>
              <i className="demo-icon icon-x-thin">&#xe839;</i>Clear Table
            </div>
          </div>
          <div className='CoinSortVerticalLine CoinSortCell' />

          {/* Sort By */}
          <div id='CoinSortSortBy' className='CoinSortCell'>
            <p className='GrayText CoinSortText'>
              Sort By: <i 
              className="demo-icon icon-info BlueText InfoIcon"
                onClick={(e) => { // onClick move i-card for information as to what Arrange options do to z-index 1000
                  let dom = e.target;

                  console.log(dom);
                }}>&#xe817;</i>
            </p>
            <CoinSortDropDown id='SortByDropDown' items={['None', 'Minting Date', 'Material', 'Issuing Authority', 'Governing Power', 'Size']} defaultSelection='None' />
            <div 
              id='CoinSortClearSort' 
              className='CoinSortClearText OrangeText'
              onClick={(e) => {
                let SortByDropDown = undefined, ThenByDropDown = undefined;

                CoinSortDropDown.ArrayOfCoinSortDropDowns.forEach((e) => {
                  if (e.props.id.includes('SortByDropDown')) SortByDropDown = e;
                  if (e.props.id.includes('ThenByDropDown')) ThenByDropDown = e;
                });

                SortByDropDown.setStateSelection('None');
                ThenByDropDown.setStateSelection('None');
              }}>
              <i className="demo-icon icon-x-thin">&#xe839;</i>Clear Sort 
            </div>
          </div>

          {/* Then By */}
          <div id='CoinSortThenBy' className='CoinSortCell'>
            <p className='GrayText CoinSortText'>
              Then By:
            </p>
            <CoinSortDropDown id='ThenByDropDown' items={['None', 'Minting Date', 'Material', 'Issuing Authority', 'Governing Power', 'Size']} defaultSelection='None' />
          </div>
          <div className='CoinSortVerticalLine CoinSortCell' />

          {/* Filter */}
          <div id='CoinSortFilter' className='CoinSortCell'>
            <p className='GrayText CoinSortText'>
              Filter: <i 
              className="demo-icon icon-info BlueText InfoIcon"
                onClick={(e) => { // onClick move i-card for information as to what Arrange options do to z-index 1000
                  let dom = e.target;

                  console.log(dom);
                }}>&#xe817;</i>
            </p>
            <CoinSortDropDown id='FilterDropDown' items={['None', 'Including', 'Excluding']} defaultSelection='None' />
            <div 
              id='CoinSortClearFilter' 
              className='CoinSortClearText OrangeText'
              onClick={(e) => {
                let FilterDropDown = undefined, WithDropDown = undefined, OfKindDropDown = undefined;

                CoinSortDropDown.ArrayOfCoinSortDropDowns.forEach((e) => {
                  if (e.props.id.includes('FilterDropDown')) FilterDropDown = e;
                  if (e.props.id.includes('WithDropDown')) WithDropDown = e;
                  if (e.props.id.includes('OfKindDropDown')) OfKindDropDown = e;
                });

                FilterDropDown.setStateSelection('None');
                WithDropDown.setStateSelection('None');
                OfKindDropDown.setStateSelection('None');
              }}>
              <i className="demo-icon icon-x-thin">&#xe839;</i>Clear Filter
            </div>
          </div>

          {/* With */}
          <div id='WithDropDown' className='CoinSortCell'>
            <p className='GrayText CoinSortText'>
              With:
            </p>
            <CoinSortDropDown id='WithDropDown' items={['None', 'Minting Date', 'Material', 'Issuing Authority', 'Governing Power', 'Type']} defaultSelection='None' />
          </div>
          
          {/* Of kind */}
          <div id='OfKindDropDown' className='CoinSortCell'>
            <p className='GrayText CoinSortText'>
              Of kind:
            </p>
            <CoinSortDropDown id='OfKindDropDown' items={['None', 'God', 'Ruler', 'Female', 'Idea', 'Animal', 'Object', 'Nature', 'War/Weapon', 'Letter', 'Building', 'Other']} defaultSelection='None' />
          </div>
          <div className='CoinSortVerticalLine CoinSortCell' />
        </div>
        <div id='Coins'>
        </div>
      </div>
    {Footer()}
    </>
  );
}

export default CoinSort;
