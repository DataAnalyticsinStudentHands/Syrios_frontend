import React from "react";
import "./demo.css";
import coin_1 from "../data/images/b_image1.png";
import coin_2 from "../data/images/b_image5.png";
import coin_3 from "../data/images/b_image6.png";
import coin_4 from "../data/images/b_image19.png";

const Demo = () => {
  return (
    <div>
      <div class="sketchfab-embed-wrapper">
        <iframe
          title="A 3D model"
          width="640"
          height="480"
          src="https://sketchfab.com/models/033a5ed32de347e1be254042555ad0c4/embed?preload=1&amp;ui_controls=1&amp;ui_infos=1&amp;ui_inspector=1&amp;ui_stop=1&amp;ui_watermark=1&amp;ui_watermark_link=1"
          frameborder="0"
          allow="autoplay; fullscreen; vr"
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
        ></iframe>

        <p style={{fontSize: '13px', fontWeight: 'normal', margin: '5px', color: '#4A4A4A'}}>
          <a
            href="https://sketchfab.com/3d-models/eastern-kings-coin-033a5ed32de347e1be254042555ad0c4?utm_medium=embed&utm_source=website&utm_campaign=share-popup"
            target="_blank"
            style={{fontWeight: 'bold', color: '#1CAAD9'}}
          >
            Eastern King&#39;s Coin
          </a>
          by{" "}
          <a
            href="https://sketchfab.com/peggylind?utm_medium=embed&utm_source=website&utm_campaign=share-popup"
            target="_blank"
            style={{fontWeight: 'bold', color: '#1CAAD9'}}
          >
            peggylind
          </a>
          on{" "}
          <a
            href="https://sketchfab.com?utm_medium=embed&utm_source=website&utm_campaign=share-popup"
            target="_blank"
            style={{fontWeight: 'bold', color: '#1CAAD9'}}
          >
            Sketchfab
          </a>
        </p>
      </div>
    </div>
  );
};

export default Demo;
