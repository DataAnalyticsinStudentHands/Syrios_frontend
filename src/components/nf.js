import React from "react";
import {Link} from 'react-router-dom';

/* We simply can use an array and loop and print each user */
const NotFoundPage = () => {
  return (
    <body className = 'gc_body'>
      <div>
        <h1 className = 'nf_h1'>
            404 Page Not Found
        </h1>
        <button className = 'nf_b1'>
          <Link to = '/'> MainPage </Link>
        </button>
      </div>
    </body>
  );
};

export default NotFoundPage;