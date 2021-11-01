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
import axios from 'axios';

import Footer from 'src/components/Footer.js';
import Navbar from 'src/components/Navbar.js';
import LoadingPage from 'src/components/LoadingPage.js';
import 'src/components/constants.css';
import './Timeline.css';

const Timeline = () => {
	const [loading, set_loading] = useState(true);
	const [timeline, set_timeline] = useState(undefined);

	useEffect(() => {
		if (loading) {
			axios.get(process.env.REACT_APP_strapiURL + '/timeline')
				.then((res) => {
					// processedZones will process each zone from start to render.
					let processedZones = [];
					/* processed Zones MUST have this data structure
					processedZones.push({
							startX: startX,
							endX: endX,
							yDate: yDate,
							group: group,
							color: color
						});
					*/
					// Need to go zone by zone
					// First we need to process the zones. Check for min maxes, etc so we can set up our canvas
					res.data.zone.forEach((timelineComp)=> {
						// Get the startX and endX and yDate all corresponding
						// This is probably temporary.
						// I'm just checking for keys in a more verbose way that way if I change it slightly in strapi, it doesn't break
						let startX = undefined, endX = undefined, yDate = undefined, group = undefined, color = undefined;
						for (let i = 0; i < Object.keys(timelineComp).length; i++) {
							let key = Object.keys(timelineComp)[i];

							if (startX === undefined && key.toLowerCase().includes('start') && key.toLowerCase().includes('x')) {
								startX = timelineComp[key].split('\n').map(Number);
							}
							if (endX === undefined && key.toLowerCase().includes('end') && key.toLowerCase().includes('x')) {
								endX = timelineComp[key].split('\n').map(Number);
							}
							if (yDate === undefined && key.toLowerCase().includes('date') && key.toLowerCase().includes('y')) {
								yDate = timelineComp[key].split('\n').map(Number);
							}

							if (group === undefined && key.toLowerCase().includes('group')) {
								group = timelineComp[key];
							}

							if (color === undefined && key.toLowerCase().includes('color')) {
								color = timelineComp[key].Hash;
							}
						}

						// We need this object data structure in an array for the rest of this to work.
						// processedZones is just a way for me to easily work with an array of objects.
						processedZones.push({
							startX: startX,
							endX: endX,
							yDate: yDate,
							group: group,
							color: color
						});
					});

					/* This is where we are processing all of the information to ready it for display. 
					 * This will get a bit complicated
					 *
					 * 1) We need to get our yDate min and maxes and other min and maxes 
					 * 2) We need to line up the yDates, endX, and startX between all the processedZones verbosely using the min and maxes we aggregated in step 1
					 * 3) We create React.Fragments for each processedZones of bezier curves
					 * 4) We setup our svg viewbox and return it
					 * 
					 * */

					// Step 1
					let maxY = Number.MIN_SAFE_INTEGER, minY = Number.MAX_SAFE_INTEGER, maxXSize = Number.MIN_SAFE_INTEGER;
					processedZones.forEach((e) => {
						// Don't ask why you need to spread it.
						// Just if you don't, it returns NaN
						maxY = Math.max(maxY, ...e.yDate);
						minY = Math.min(minY, ...e.yDate);
						maxXSize = Math.max(maxXSize, e.startX.length);
					});

					// Step 2
					processedZones.forEach((e) => {
						let eMinY = Math.min(...e.yDate);
						if (minY !== eMinY) {
							let n = Math.abs(eMinY - minY);
							let zerosBuffer = new Array(n); for (let i=0; i<n; ++i) zerosBuffer[i] = minY;
							e.yDate = zerosBuffer.concat(e.yDate);
							e.startX = zerosBuffer.concat(e.startX);
							e.endX = zerosBuffer.concat(e.endX);
						}

						let eMaxY = Math.max(...e.yDate);
						if (maxY !== eMaxY) {
							let n = Math.abs(eMaxY - maxY);
							let zerosBuffer = new Array(n); for (let i=0; i<n; ++i) zerosBuffer[i] = maxY;
							e.yDate = e.yDate.concat(zerosBuffer);
							e.startX = e.startX.concat(zerosBuffer);
							e.endX = e.endX.concat(zerosBuffer);
						}

						if (e.startX.length !== maxXSize) {
							let n = Math.abs(e.startX.length - maxXSize);
							let zerosBuffer = new Array(n); for (let i=0; i<n; ++i) zerosBuffer[i] = 0;
							e.startX = e.startX.concat(zerosBuffer);
						}

						if (e.endX.length !== maxXSize) {
							let n = Math.abs(e.endX.length - maxXSize);
							let zerosBuffer = new Array(n); for (let i=0; i<n; ++i) zerosBuffer[i] = 0;
							e.endX = e.endX.concat(zerosBuffer);
						}

						for (let i = 0; i < e.yDate.length; i++) {
							e.yDate[i] += Math.abs(minY);
						}
					});
				
					// Step 3
					let svgPaths = []
					processedZones.forEach((e) => {
						let d = `M ${e.startX[0]} ${e.yDate[0]} C `;
						for (let i = 1; i < e.yDate.length; i++) {
							let x = e.startX[i], y = e.yDate[i];
							d += `${x} ${y} `;
						}

						d += `L ${e.endX[e.yDate.length-1]} ${e.yDate[e.yDate.length-1]} C `;
						for (let i = e.yDate.length - 1; i >= 0; i--) {
							let x = e.endX[i], y = e.yDate[i];
							d += `${x} ${y} `;
						}

						d += `L ${e.startX[0]} ${e.yDate[0]}`;
					});

					let reactFragments = [];
					svgPaths.forEach((e, index) => {
						reactFragments.push(
								<Path
									key={`svgpath_${index}`}
									d={e}
									fill={processedZones[index].color}
									stroke={processedZones[index].color}
									strokeWidth='0.1px'
								/>
						);
					});


					// Step 4
					let viewBoxHeight = Math.abs(minY - maxY);
					set_timeline(
						<Svg height='100%' width='50%' viewBox={`0 0 100 ${viewBoxHeight}`}>
							{reactFragments}
						</Svg>
					);
					set_loading(false);
				});
		}
	});


	// Render page here
	//
	// if loading is true, render loading page
	// else render timeline
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
			{Footer()}
		</div>
	);
}

export default Timeline;
