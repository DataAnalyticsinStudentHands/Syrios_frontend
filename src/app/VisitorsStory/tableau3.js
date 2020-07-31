import React from 'react';
import TableauReport from 'tableau-react';

const Tableau = props => (
  <TableauReport
    url="https://public.tableau.com/shared/MDMS6GNNF?:display_count=y&:origin=viz_share_link"
    // token="<TRUSTED TICKET HERE>"
  />
)

export default Tableau;
