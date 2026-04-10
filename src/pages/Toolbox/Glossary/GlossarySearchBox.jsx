import React, { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import glossaryRequest from "src/api/glossary";

function SearchBar() {
	const [inputText, setInputText] = useState("");
	const [data, setData] = useState([]);

	useEffect(() => {
		async function fetchData() {
			if (inputText.length > 0) {
                const {
                    data: { data },
                } = await glossaryRequest.glossarySearch(inputText);
                setData(data);
			} else {
				setData([]);
			}
		}
		fetchData();
	}, [inputText]);

	return (
		<>
			<div className="search-box">
				<input
					type="text"
					className="search-box__input"
					label="Search glossary"
					placeholder="Search glosssary"
					onChange={(e) => {
						setInputText(e.target.value);
					}}
				/>
			</div>
			{data.length > 0 && (
				<ListGroup className="result-list">
					{data.map((item, index) => {
                        console.log(item);
						return (
							<ListGroup.Item
								key={index}
								className="result-list-item">
								<Link
									className="glossary-term-a"
									to={`/Toolbox/Glossary/term/${item.attributes.term}`}
                                    onClick={() => {
                                        setInputText("");
                                    }}
                                >
									{item.attributes.term}
								</Link>
							</ListGroup.Item>
						);
					})}
				</ListGroup>
			)}
		</>
	);
}
export default SearchBar;
