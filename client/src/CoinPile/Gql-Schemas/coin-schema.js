const { gql } = require("apollo-boost");

module.exports = gql`
  query Coin($id: String!) {
    coin(id: $id) {
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
`;

// export const getCoinById=(id)=>{
//     return  gql`
//     query Coin($${id}: String!) {
//         id
//         Title
//         Bibliography
//         ReverseType
//         Image
//         Region
//         Mint
//         State
//         Date
//         FromDate
//         ToDate
//         Material
//         Denomination
//         ObverseLegend
//         ReverseLegend
//         SourceImage
//         RightsHolder
//         ObverseType
//         TypeCategory
//         IssuingAuthority
//         Diameter
//         Era
//         Diameter
//         obverseFile
//         reverseFile
//     }
//   `;
// }
