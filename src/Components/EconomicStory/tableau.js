import React from 'react';
import TableauReport from 'tableau-react';
 
const Tableau = props => (
  <TableauReport
    url="https://public.tableau.com/views/CivicCoinMap/Sheet1?:display_count=n&:origin=viz_share_link"
    // token="<TRUSTED TICKET HERE>"
  />
)

export default Tableau;