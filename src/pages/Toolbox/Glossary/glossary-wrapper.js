import React from "react";
import { Outlet } from "react-router";
import { Container, Nav } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import SearchBar from "./GlossarySearchBox";
import { useState, useEffect } from "react";
import glossaryRequest from "src/api/glossary";
import LoadingPage from "src/components/loadingPage/LoadingPage";
import PageTitleComponent from "src/components/constant/pageTitleText";
import qs from "qs";
function GlossaryWrapper() {
	const alphabetGroup = [
		"ABC",
		"DEF",
		"GHI",
		"JKL",
		"MNO",
		"PQRS",
		"TUV",
		"WXYZ",
	];
	const { group, term } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [glossary, setGlossary] = useState([]);

    // const [isHovering, setIsHovering] = useState(false);
    // // Event handlers
    // const handleMouseEnter = (e) => {
    //     let glossaryTerm = Object.keys(qs.parse(e.target.href))[0].split("/term/")[1].replace(/%20/g, " ");
    //     console.log(glossaryTerm);
    //     // let term = e.target.href.split("/term/")[1];
    //     // console.log(term);
    //   setIsHovering(true);
    //   // Add any additional logic you want to perform when hovering starts
    // };
    // const handleMouseLeave = () => {
    //   setIsHovering(false);
    //   // Add any additional logic you want to perform when hovering ends
    // };

	useEffect(() => {
		const fetchData = async () => {
			const result = await glossaryRequest.glossaryHomeFind();
			setGlossary(result.data.data.attributes);
			setIsLoading(false);
		};
		fetchData().catch(console.error);
	}, []);
	if (isLoading) return <LoadingPage />;
	return (
		<div id="glossary-page">
			<Container>
				<PageTitleComponent
					title={glossary.title}
					text={glossary.text}
					subtext={glossary.subtext}
					icon={<sup className="story-icon">&#xe817;</sup>}
				/>
				<SearchBar />
				{/* <div>
					<a
						href="../../../Toolbox/Glossary/term/issuing authority"
						className="glossary-tag"
                        style={{fontSize:"5rem"}}
						// data-title="civic, provincial/regional, or royal/imperial administration initiating the production of a coin and guaranteeing its value as money"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
						issuing authority;<sup class="story-icon"></sup>{" "}
					</a>
				</div> */}
				<Nav
					variant="tabs"
					defaultActiveKey="/All"
					className="d-flex justify-content-center"
					style={{ marginTop: "3.5vmax" }}>
					<Nav.Item>
						<Link
							to="/Toolbox/Glossary/all"
							eventkey="All"
							style={{
								backgroundColor: group === "all" ? "white" : "",
							}}>
							All
						</Link>
					</Nav.Item>
					{group ? (
						<>
							{alphabetGroup.map((alphabet) => {
								return (
									<Nav.Item key={alphabet}>
										<Link
											to={`/Toolbox/Glossary/${alphabet}`}
											style={{
												backgroundColor:
													group === alphabet
														? "white"
														: "",
											}}
											eventkey={alphabet}>
											{alphabet}
										</Link>
									</Nav.Item>
								);
							})}
						</>
					) : (
						<></>
					)}
					{term ? (
						<>
							{alphabetGroup.map((alphabet) => {
								return (
									<Nav.Item key={alphabet}>
										<Link
											to={`/Toolbox/Glossary/${alphabet}`}
											style={{
												backgroundColor:
													alphabet.indexOf(
														term
															.charAt(0)
															.toUpperCase()
													) !== -1
														? "white"
														: "",
											}}
											eventkey={alphabet}>
											{alphabet}
										</Link>
									</Nav.Item>
								);
							})}
						</>
					) : (
						<></>
					)}
				</Nav>
				<Outlet />
			</Container>
		</div>
	);
}
export default GlossaryWrapper;
