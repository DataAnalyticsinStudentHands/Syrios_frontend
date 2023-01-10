import React, { useState, useEffect, useContext } from "react";
import "./SearchBar.scss";
import { Link } from "react-router-dom";
import qs from "qs";

import { CoinContext } from "src/context/coinContext";

const SearchBar = () => {
	const { coinsKeyTerms, fetchCoinData } = useContext(CoinContext);
	coinsKeyTerms ?? fetchCoinData();
	const [tags, setTages] = useState({
		material: [],
		mint: [],
		issuing_authority: [],
		governing_power: [],
		language: [],
		denomination: [],
		ancient_territory: [],
	});
	const [tagOptions, setTageOptions] = useState({});
	const [pattern, setPattern] = useState("");
	const [searchUrl, setSearchUrl] = useState("");
	const [tagBox, setTagBox] = useState(false);

	useEffect(() => {
	    setTageOptions(coinsKeyTerms)
	},[coinsKeyTerms])

	useEffect(() => {
		let newURL = qs.stringify({
			pattern: pattern,
			tags: tags,
		});
		setSearchUrl(newURL);
	}, [tags, pattern]);

	function addTags(obj, tag) {
		let newTagsObj = { ...tags };
		let newTagOptionsObj = { ...tagOptions };
		newTagOptionsObj[obj] = newTagOptionsObj[obj].filter((i) => i !== tag);
		if (!newTagsObj[obj].includes(tag)) {
			newTagsObj[obj].push(tag);
		}
		setTages(newTagsObj);
		setTageOptions(newTagOptionsObj);
		setTagBox(false);
	}
	function deleteTags(obj, tag) {
		let newTagsObj = { ...tags };
		let newTagOptionsObj = { ...tagOptions };
		newTagsObj[obj] = newTagsObj[obj].filter((i) => i !== tag);
		if (!newTagOptionsObj[obj].includes(tag)) {
			newTagOptionsObj[obj].push(tag);
		}
		setTages(newTagsObj);
		setTageOptions(newTagOptionsObj);
	}

	function GetOptionLi() {
		let li = [];
		for (let key in tagOptions) {
			tagOptions[key]?.forEach((tag) => {
				li.push(
					<li onClick={() => addTags(key, `${tag}`)} value={tag}>
						{tag}
					</li>
				);
			});
		}
		return li;
	}
	function GetTagLi() {
		let li = [];
		for (let key in tags) {
			tags[key]?.forEach((tag, index) => {
				li.push(
					<li key={index}>
						{tag}{" "}
						<span
							className="icon-syrios-x-thin"
							onClick={() => deleteTags(key, `${tag}`)}
						/>
					</li>
				);
			});
		}
		return li;
	}
	return (
		<div className="search">
			<div className="tag-content">
				<ul>
					<Link
						className="link icon-entypo-search"
						to={`/Coins/${searchUrl}`}
					/>
					<GetTagLi />
					<input
						type="text"
						className="search-bar__input"
						id="coin-collection-search"
						placeholder="Search by coin name, type, date, and more."
						onChange={(e) => {
							setPattern(e.target.value);
						}}
						onFocus={() => {
							if (!tagBox) {
								setTagBox(true);
							}
							// TODO something is wrong here
							// e.target.addEventListener('keypress', function (e){
							//     if(e.key === 'Enter'){
							//         setPattern(e.target.value)
							//         console.log(searchUrl);
							//     }
							// })
						}}
					/>
				</ul>
			</div>
			{tagBox ? (
				<div className="tag-options">
					<p>Common Search Key words</p>
					<ul>
						<GetOptionLi />
					</ul>
				</div>
			) : (
				<></>
			)}
		</div>
	);
};
export default SearchBar;
