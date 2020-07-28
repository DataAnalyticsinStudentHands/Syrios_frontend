import React from 'react';
import TableauReport from 'tableau-react';

const Tableau = props => (
  <TableauReport
    url="https://public.tableau.com/views/ForeignCoinsmintedduringtheRomanperiodandfoundatDuraEuropos/Sheet1?:language=en&:display_count=y&publish=yes&:origin=viz_share_link"
    // token="<TRUSTED TICKET HERE>"
  />
)

export default Tableau;
