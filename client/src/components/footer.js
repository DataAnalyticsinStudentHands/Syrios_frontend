import React, {useState} from 'react';
import OutsideClickHandler from "../reactHelpers/OutsideClickHandler";
import "./footer.css"
import logo from "../assets/logos/Logo.png"



const Footer = () => {
	const [CreditsAndReferencesDropdown, setCreditsAndReferencesDropdown] = useState(undefined);
	const [CreditsAndReferencesDropDownTimer, setCreditsAndReferencesDropdownTimer] = useState(new Date());

	return (
		<div className="Footer">
			{/* The SYRIOS Project */}
			<a href="/">
				<div className="SyriosLogoDark">
					<div className="SyriosLogoDarkImageDiv">
						<img className="SyriosLogoDarkImage" src={logo} alt="SyriosLogoDark"/>
					</div>

					<p className="SyriosLogoDarkText">
						The <span style={{color: "#FFFFFF", fontWeight: "bold"}}>SYRIOS</span> Project
					</p>
				</div>
			</a>
			{/* END of The SYRIOS Project */}

			{/* Credits & References */}
			<div className="CreditsAndReferences"
				onClick={(e) => {
					if (new Date() - CreditsAndReferencesDropDownTimer > 250) {
						document.getElementsByClassName("CreditsAndReferencesArrow")[0].style.transform = "rotate(-315deg)";
						document.getElementsByClassName("CreditsAndReferencesArrow")[0].style.top = "-.2em";

						setCreditsAndReferencesDropdown(
							<OutsideClickHandler
								onOutsideClick={() => {
									setCreditsAndReferencesDropdownTimer(new Date());
									document.getElementsByClassName("CreditsAndReferencesArrow")[0].style.transform = "rotate(-135deg)";
									document.getElementsByClassName("CreditsAndReferencesArrow")[0].style.top = ".1em";
									setCreditsAndReferencesDropdown(undefined);
								}}>
								<div className="CreditsAndReferencesDropDown">
									<div className="CreditsAndReferencesDropDownFirstTitle">
										Coin Images Courtesy of:
									</div>
									<div className="CreditsAndReferencesDropDownSecondTitle">
										To read more, check these out:
									</div>
									<div 
										className="CreditsAndReferencesClose"
										onClick={(e) => {
											setCreditsAndReferencesDropdownTimer(new Date());
											document.getElementsByClassName("CreditsAndReferencesArrow")[0].style.transform = "rotate(-315deg)";
											document.getElementsByClassName("CreditsAndReferencesArrow")[0].style.top = ".1em";
											setCreditsAndReferencesDropdown(undefined);
										}}>
									</div>
								</div>
							</OutsideClickHandler>
						);
					}
				}}>
				<p className="FooterAllCapitalText CreditsAndReferencesText">
					CREDITS & REFERENCES <i className="CreditsAndReferencesArrow"></i>
				</p>
			</div>
			{CreditsAndReferencesDropdown}
			{/* End of Credit & References */}

			{/* ABOUT US */}
			<div className="AboutUs">
				<a href="/information/about/">
					<p className="FooterAllCapitalText">
						ABOUT US
					</p>
				</a>
			</div>
			{/* End of ABOUT US */}

			{/* CONTACT US */}
			<a href="/information/contact-us/">
				<div className="ContactUs">
					<p className="FooterAllCapitalText">
						CONTACT US
					</p>
				</div>
			</a>
			{/* End of CONTACT US */}
		</div>
	);
}

export default Footer;
