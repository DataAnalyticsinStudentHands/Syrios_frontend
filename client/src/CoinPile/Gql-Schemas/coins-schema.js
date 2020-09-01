const { gql } = require("apollo-boost");

module.exports = gql`
{
  coins {
    id
    Title
    Bibliography
    ReverseType
    Image
    Region
    Mint
    State
    Date
    FromDate
    ToDate
    Material
    Denomination
    ObverseLegend
    ReverseLegend
    SourceImage
    RightsHolder
    ObverseType
    TypeCategory
    IssuingAuthority
    Diameter
    Era
    Diameter
    obverseFile
    reverseFile
  }
}
`