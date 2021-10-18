import React, {useState, useEffect} from 'react';
import Svg, {
	Circle,
	Ellipse,
	G,
	Text,
	TSpan,
	TextPath,
	Path,
	Polygon,
	Polyline,
	Line,
	Rect,
	Use,
	Image,
	Symbol,
	Defs,
	LinearGradient,
	RadialGradient,
	Stop,
	ClipPath,
	Pattern,
	Mask,
} from 'react-native-svg';

import Footer from 'src/components/Footer.js';
import Navbar from 'src/components/Navbar.js';
import LoadingPage from 'src/components/LoadingPage.js';
import 'src/components/constants.css';
import './Timeline.css';

const Timeline = () => {
	const [loading, set_loading] = useState(true);
	const [timeline, set_timeline] = useState(undefined);

	if (loading) {
		return (
			<div id='Timeline'>
				{Navbar()}
				{LoadingPage()}
				{Footer()}
			</div>
		);
	}

	return (
		<div id='Timeline'>
			{Navbar()}
			{timeline}
			<div>
				<svg
					viewBox="0 -15 100 500"
					style={{opacity: ".4"}}
				>
          <Circle
            cx="50"
            cy="50"
            r="45"
            stroke="blue"
            strokeWidth="2.5"
            fill="green"
          />
          <Rect
            x="15"
            y="15"
            width="70"
            height="70"
            stroke="red"
            strokeWidth="2"
            fill="yellow"
          />
				</svg>
			</div>
			{Footer()}
		</div>
	);
}

export default Timeline;
