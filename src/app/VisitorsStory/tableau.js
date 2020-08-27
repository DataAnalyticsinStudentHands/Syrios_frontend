import React from 'react';
import TableauReport from 'tableau-react';

const Tableau1 = props => (
  <TableauReport
    url="https://public.tableau.com/views/ForeignFindsatAntiochRomanPeriod/Sheet1?:language=en&:display_count=y&:origin=viz_share_link"
    // token="<TRUSTED TICKET HERE>"
  />
)

const Tableau2 = props => (
    <TableauReport
    url="https://public.tableau.com/views/ForeignCoinsmintedduringtheRomanperiodandfoundatDuraEuropos/Sheet1?:language=en&:display_count=y&publish=yes&:origin=viz_share_link"
        // token="<TRUSTED TICKET HERE>"
    />
)

const Tableau3 = props => (
    <TableauReport
        url="https://public.tableau.com/shared/MDMS6GNNF?:display_count=y&:origin=viz_share_link"
        // token="<TRUSTED TICKET HERE>"
    />
)

export {
  Tableau1,
  Tableau2,
  Tableau3
};
