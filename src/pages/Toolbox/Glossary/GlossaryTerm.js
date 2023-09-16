import React, { useState, useEffect } from "react";
import glossaryRequest from "src/api/glossary";
import createMarkup from "src/utils/Markup";
import { Link, useParams } from "react-router-dom";

const GlossaryTerm = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [termData, setTermData] = useState([]);
	const { term } = useParams();

	useEffect(() => {
		async function fetchData() {
			if (term) {
				const results = await glossaryRequest.glossaryFindByTerm(term);
				setTermData(results.data.data[0].attributes);
				setIsLoading(false);
			}
		}
		fetchData();
	}, [term]);

	if (isLoading)
		return (
			<div id="glossary-loading">
				<div className="loader" />
			</div>
		);
	return (
		<div id="glossary-term">
			<div className="glossary-item">
				<div className="glossary-term">{termData.term}</div>
				<p className="glossary-basic">
					<span> {termData.type} </span>
					{termData.syllabication && (
						<>
							<span>&nbsp;|&nbsp;</span>
							<span> {termData.syllabication} </span>
						</>
					)}
					{termData.sounds_like && (
						<>
							<span>&nbsp;|&nbsp;</span>
							<span> {termData.sounds_like} </span>
						</>
					)}
				</p>
			</div>

			{termData.definition.length > 0 && (
				<div className="glossary-item">
					<div className="glossary-title">DEFINITION</div>
					<div
						className="glossary-body"
						dangerouslySetInnerHTML={createMarkup(
							termData.definition
						)}
					/>
				</div>
			)}

			{termData.glossaries.length > 0 && (
				<div className="glossary-item">
					<div className="glossary-title">Related Words</div>
					<div className="glossary-related-word">
						{termData.glossaries.map((word) => {
							return (
								<span key={word.term}>
									<Link
										to={`/Toolbox/Glossary/term/${word.term}`}>
										{word.term}
									</Link>
									&nbsp;&nbsp;
								</span>
							);
						})}
					</div>
				</div>
			)}

			{termData.context && (
				<div className="glossary-item">
					<div className="glossary-title">See Word in Context</div>
					<div
						className="glossary-body"
						style={{ fontSize: "5em" }}
						dangerouslySetInnerHTML={createMarkup(termData.context)}
					/>
				</div>
			)}
		</div>
	);
};

export default GlossaryTerm;
