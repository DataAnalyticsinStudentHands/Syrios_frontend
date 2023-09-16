import React, { useState, useEffect } from "react";
import FeedBackicon from "src/components/constant/FeedBackIcon";
import SearchBar from "./component/SearchBar";
import SpotLight from "./component/SpotLight";
import ReactPlayer from "react-player";
import coinCollections from "src/api/coin-collections";
import LoadingPage from "src/components/loadingPage/LoadingPage";
import { Link } from "react-router-dom";
const CoinCatalog = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const response = await coinCollections.coinCollectionPage();
			setData(response.data.data.attributes);
			setLoading(false);
		};
		fetchData();
	}, []);
	return (
		<>
			<FeedBackicon url="default" />
			{loading ? (
				<LoadingPage />
			) : (
				<div id="coin-catalog">
					<div className="catalog-section">
						<h1>{data.title}</h1>
						<h3>{data.subtitle}</h3>
					</div>

					<div className="catalog-section">
						<SearchBar />

						<div className="catalog-buttons">
							{data.contents.map((content, index) => {
								if (index === 0) return null;
								return (
									<a href={`#anchor-${index}`} key={index}>
										{content.anchor ?? content.title}
									</a>
								);
							})}
						</div>
					</div>

					<div className="catalog-section">
						<h2>{data.contents[0].title}</h2>
						<SpotLight data={data.spotlight.data} />
					</div>

					<div className="catalog-section">
						<span className="anchor" id="anchor-1"></span>

						<h2>{data.contents[1].title}</h2>
                        <p>{data.contents[1].body}</p>

                        {data.coin_of_the_day.data && 
						<div className="coins-of-the-day">
							<div className="left">
								<h1>{data.coin_of_the_day.data.attributes.name}</h1>
								<h2>
									{data.coin_of_the_day.data.attributes
										.image_caption ??
										data.coin_of_the_day.data.attributes.image.data
											.attributes.caption}
								</h2>
								<p>{data.coin_of_the_day.data.attributes.abstract}</p>
								<button>
									<Link
										to={`/StoryReader?id=${data.coin_of_the_day.data.id}`}>
										Learn more
									</Link>
								</button>
							</div>
							<div className="right">
								<img
									src={`${process.env.REACT_APP_UPLOAD_URL}${data.coin_of_the_day.data.attributes.image.data.attributes.url}`}
									alt="test_image"
								/>
							</div>
						</div>
                        }
					</div>
					<div className="catalog-section">
						<span className="anchor" id="anchor-2"></span>
						<h2>{data.contents[2].title}</h2>
						<p>{data.contents[2].body}</p>
					</div>

					<div className="catalog-section">
						<span className="anchor" id="anchor-3"></span>
						<h2>{data.contents[3].title}</h2>
						<p>{data.contents[3].body}</p>
					</div>

					<div className="catalog-section">
						<span className="anchor" id="anchor-4"></span>
						<h2>{data.contents[4].title}</h2>
						<p>{data.contents[4].body}</p>
						<div className="catalog-VideoBox">
                            {data.video_url &&
							<ReactPlayer
								url={data.video_url}
								width="100%"
								height="100%"
								controls={true}
								playing={false}
							/>
                            }
						</div>
					</div>
				</div>
			)}
		</>
	);
};
export default CoinCatalog;
