import React from "react";
import "./contact.css";

const Contact = () => {
  return (
    <div>
      <div className="class-contact-para">
        <span>
          Acknowledgements: Created by <strong>Rahul Raj Mogili</strong> in React.js, CSS,
          Bootstrap, Node.js{" "}
        </span>
        <br></br>
        <span>
          For more information about design, contact <strong>Dr. Peggy Lindner</strong>
          (plindner@central.uh.edu)
        </span>
        <br></br>
        <span>
          For more information about content, contact <strong>Dr. Kristina Neumann</strong>
          (kmneuma2@central.uh.edu)
        </span>
        <br></br>
        <span>
          Part of <strong>The SYRIOS Project</strong>: Studying Urban Relationships and Identity
          over Ancient Syria
        </span>
      </div>
    </div>
  );
};

export default Contact;
