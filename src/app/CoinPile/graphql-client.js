import React, { useState } from "react";
import ApolloClient, { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import "./coinpile.css";
import { motion } from "framer-motion";
import { Modal } from "react-bootstrap";
// import { ApolloProvider, useQuery } from "@apollo/react-hooks";

const GQL_Client = () => {
  const client = new ApolloClient({
    uri: "http://localhost:3002/graphql",
  });

  const [show, setShow] = useState(false);

  const GET_COINS = gql`
    {
      coins {
        _id
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

  const { loading, error, data } = useQuery(GET_COINS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( ${error.message}</p>;

  const ReturnCoins = () => {
    return data.coins.map(({ _id, Title, Bibliography, ReverseType, Image, Region, Mint, State, Date, FromDate, ToDate, Material,
        Denomination, ObverseLegend, ReverseLegend, SourceImage, RightsHolder, ObverseType, TypeCategory, IssuingAuthority, Era, obverseFile, reverseFile, Diameter }) => (
      <div>
        <motion.input
          type="image"
          key={_id}
          alt="Coin"
          src={obverseFile}
          whileHover={{ scale: 7 }}
          style={{
            height: Diameter * 2,
            width: Diameter * 2,
          }}
          onClick={(_id) => setShow(true)}
          whileTap={{ scale: 4 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          drag
          dragConstraints={{
            top: -650,
            left: -650,
            right: 650,
            bottom: 650,
          }}
        />
        <Modal
          show={show}
          onHide={() => setShow(false)}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Coin Information
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4 style={{ textAlign: "center" }}>{Title}</h4>
            <div style={{ textAlign: "center" }}>
              <img src={obverseFile} alt="" className="modal-image"></img>
              <img src={reverseFile} alt="" className="modal-image"></img>
            </div>
            <h5 id="dialogue-text">
              <strong>Region</strong> - {Region}
            </h5>
            <h5 id="dialogue-text">
              <strong>Mint</strong> - {Mint}
            </h5>
            <h5 id="dialogue-text">
              <strong>Material</strong> - {Material}
            </h5>
            <h5 id="dialogue-text">
              <strong>Diameter</strong> - {Diameter}
            </h5>
            <h5 id="dialogue-text">
              <strong>Authority</strong> - {IssuingAuthority}
            </h5>
            <h5 id="dialogue-text">
              <strong>Date</strong> - {Date}
            </h5>
            <h5 id="dialogue-text">
              <strong>Type</strong> - {TypeCategory}
            </h5>
            <h5 id="dialogue-text">
              <strong>Obverse Type</strong> - {ObverseType}
            </h5>
            <h5 id="dialogue-text">
              <strong>Obverse Legend</strong> - {ObverseLegend}
            </h5>
            <h5 id="dialogue-text">
              <strong>Reverse Type</strong> - {ReverseLegend}
            </h5>
            <h5 id="dialogue-text">
              <strong>Reverse Legend</strong> - {ReverseLegend}
            </h5>
            <h5 id="dialogue-text">
              <strong>Rights Holder</strong> - {RightsHolder}
            </h5>
            <h5 id="dialogue-text">
              <strong>Source Image</strong> - {SourceImage}
            </h5>
          </Modal.Body>
        </Modal>
      </div>
    ));
  };

  return (
    <div className="class-coinpile">
      <ReturnCoins />
    </div>
  );
};

export default GQL_Client;
