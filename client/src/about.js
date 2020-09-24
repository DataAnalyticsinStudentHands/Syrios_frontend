import React from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
    PageTitleCentered,
    ParaTextLeftSmaller,
    SubTextLeft,
    PageSectionTitle,
    StyledLink,
    StyledLinkButton
} from "./componentStyling";
import logo from "./data/intro-images/Logo.png"
import drNeumann from "./data/about-images/DrNeumann.jpg"
import drLindner from "./data/about-images/DrLindner.jpg"
import drRodwell from "./data/about-images/DrRodwell.jpg"
import martin from "./data/about-images/Martin.jpg"
import rahul from "./data/about-images/Rahul.jpg"
import jinelly from "./data/about-images/Jinelly.jpg"
import xandria from "./data/about-images/Xandria.jpg"

const About = () => {
    AOS.init({
      duration: 1000,
    });

    return (
        <div>
            <div className="container-fluid p-0 px-6">
                {/* About Section */}
                <div className="row top-buffer-1">
                    <div className="col-md-1"></div>
                    <div className="col-md-10" data-aos="fade-up">
                        <PageTitleCentered>
                            About the SYRIOS Project
                        </PageTitleCentered>
                    </div>
                    <div className="col-md-1"></div>
                </div>

                <div className="row top-buffer-1">
                    <div className="col-sm-3">
                        <img className={"img-responsive"}
                             src={logo}
                             alt="logo"
                        />
                    </div>
                    <div className="col-sm-1"></div>
                    <div className="col-md">
                        <div className="row">
                            <ParaTextLeftSmaller>
                                The SYRIOS Project began in 2016 both as an outgrowth of research into
                                ancient Syria and in response to the current crisis within the modern
                                region. By focusing on the dynamic presentation of Syrian material
                                culture and the stories of its cities within the Greco-Roman period,
                                we seek to:
                            </ParaTextLeftSmaller>
                        </div>
                        <div className="row mt-md-3">
                            <ParaTextLeftSmaller>
                                <ul>
                                    <li>transform public awareness of the ancient world and Syria in particular</li>
                                    <li>revitalize the perception of Syria as a diverse and vibrant metropolitan
                                        region
                                    </li>
                                    <li>exemplify the power of objects as testimony to everyday lives and struggles</li>
                                    <li>offer historical professionals an enhanced, digital data source and model
                                        applicable to research, teaching, and community outreach
                                    </li>
                                    <li>invite new perspectives into the research and engagement with this historic
                                        place
                                    </li>
                                </ul>
                            </ParaTextLeftSmaller>
                        </div>
                        <div className="row">
                            <ParaTextLeftSmaller>
                              This current exhibit serves as Phase I and “Proof of
                              Concept” for the overall project. It focuses on the
                              history of the Syrian capital city of Antioch and the
                              concept of studying coins as pieces of art and objects
                              that move. From a technical perspective, this initial
                              exhibit provided a platform for investigating overall
                              design, interactivity, and usability.
                              <br />
                              <br />
                              By September 2021, we plan to launch Phase II of the
                              exhibit, which will be a full prototype focused on the
                              city of Antioch. This phase will include additional
                              animations, themed stories, an interactive timeline,
                              inscriptions database, downloadable datasets, and user
                              guides. Technical additions include the implementation
                              of parallax scrolling and responsive design layout,
                              adaption of our scheme to follow {' '}
                              <StyledLink href="http://nomisma.org/" target="_blank" rel="noopener noreferrer">Nomisma format</StyledLink>
                              {' '} and further accommodations for user accessibility.
                              <br />
                              <br />
                                  <StyledLinkButton to="/site-map" data-aos="fade-right">
                                    View the sitemap of The SYRIOS Project
                                  </StyledLinkButton>
                              <br />
                              <br />
                              By September 2024, we plan to launch Phase III of
                              the exhibit, which will be the final exhibit
                              encompassing the cities of ancient Syria.
                            </ParaTextLeftSmaller>
                        </div>
                    </div>
                </div>

                {/* Meet the Team */}

                <div className="row top-buffer-1">
                    <div className="col-md-2"></div>
                    <div className="col-md-8" data-aos="fade-up">
                        <PageTitleCentered>
                            Meet the Team
                        </PageTitleCentered>
                    </div>
                    <div className="col-md-2"></div>
                </div>
                <div className="row top-buffer-1">
                    <div className="col-md-2"></div>
                    <div className="col-md-8" data-aos="fade-up">
                        <PageSectionTitle>
                            Project Directors
                        </PageSectionTitle>
                    </div>
                    <div className="col-md-2"></div>
                </div>
                <div className="row no-gutters">
                    <div className="col-md-1"></div>
                    <div className="col-md-2 align-self-center">
                        <img
                            src={drNeumann}
                            alt="Logo"
                            className="profile_img"
                        />
                    </div>
                    <div className="col-md-8 pl-5 align-self-center">
                        <SubTextLeft>
                            <strong>Kristina Neumann, Ph.D.</strong>
                            <br />
                            <em>Assistant Professor of Roman and Digital History in the Department
                                of History at the University of Houston</em>
                            <br />
                            <br />
                            Her book – <em>Antioch in Syria: A History from Coins, 300 BCE-450 CE </em>
                            (Cambridge University Press) – analyzes the long-term development of
                            one Syrian city through a combination of digital technologies, Exploratory
                            Data Analysis, and coin evidence. Neumann has worked extensively in public
                            and community outreach, in particular with the University of Cincinnati’s
                            award-winning Classics Outreach Program, the Cincinnati Museum Center,
                            UH’s Ancient World Research Group, and the Center for Public History.
                            Additionally, Neumann has excavated with the American Academy at Rome,
                            Pompeii Archaeological Research Project: Porta Stabia, and the Hippos-Sussita
                            Excavation Project in northern Israel.
                        </SubTextLeft>
                    </div>
                    <div className="col-md-1"></div>
                </div>
                <div className="row top-spacer-1 no-gutters">
                    <div className="col-md-1"></div>
                    <div className="col-md-2 align-self-center">
                        <img
                            src={drLindner}
                            alt="Logo"
                            className="profile_img"
                        />
                    </div>
                    <div className="col-md-8 pl-5 align-self-center">
                        <SubTextLeft>
                            <strong>Peggy Lindner, Ph.D.</strong>
                            <br />
                            <em>Assistant Professor in the Department of Information & Logistics
                                Technology in the College of Technology at the University of Houston</em>
                            <br />
                            <br />
                            While Dr. Lindner’s background is in engineering, she has built her career
                            around data science education and digital humanities at UH since 2014
                            and has a keen appreciation of the importance of making data free and
                            accessible to everyone. She received her Ph.D. from the University of
                            Stuttgart in 2007, where she researched the management of applications
                            from science and engineering in heterogeneous grid environments. Trained
                            in High Performance Computing, she infuses all her projects with higher
                            expectations for quality and stability, while her expertise in data
                            representation has made it possible to think about larger and more
                            integrated data projects. She has extensive experience with students as
                            a co-director of the Data Analytics in Student Hands (DASH) project and
                            as a teacher in the Computer Information Technology program. She currently
                            serves on the Advisory Council for the Digital Research Commons at UH.
                        </SubTextLeft>
                    </div>
                    <div className="col-md-1"></div>
                </div>
                <div className="row top-buffer-1">
                    <div className="col-md-2"></div>
                    <div className="col-md-8" data-aos="fade-up">
                        <PageSectionTitle>
                            Digital Media and Content Team
                        </PageSectionTitle>
                    </div>
                    <div className="col-md-2"></div>
                </div>
                <div className="row top-spacer-1 no-gutters">
                    <div className="col-md-1"></div>
                    <div className="col-md-2 align-self-center">
                        <img
                            src={drRodwell}
                            alt="Logo"
                            className="profile_img"
                        />
                    </div>
                    <div className="col-md-8 pl-5 align-self-center">
                        <SubTextLeft>
                            <strong>Elizabeth Rodwell, Ph.D.</strong>
                            <br />
                            <em>Usability (UX) Lead</em>
                            <br />
                            <br />
                            Rodwell’s background combines design production/research, technology
                            studies, and anthropology. Before returning to graduate school to get
                            an M.A. and Ph.D. in anthropology, she was an Assistant Professor of
                            Computer Graphics and New Media at Johnson & Wales University for six
                            years. During this time, she earned an M.A. in Media Studies, and one
                            in Social Sciences at the University of Chicago. Her Ph.D. work at Rice
                            University examined the ways that Japanese television is experimenting
                            with interactivity, and the imbalance between technological innovation
                            and content censorship in Japanese mass media. After earning her Ph.D.
                            in 2015, she was employed in the business world as a usability
                            researcher – to learn how social scientific methods could be used to
                            enhance technological development. In 2019 she joined the faculty of
                            UH as an Assistant Professor of Digital Media, in the Information &
                            Logistics Technology department. Her book manuscript is titled, <em>Push
                            the Button: Interactive Television and Collaborative Journalism in Japan. </em>
                            Rodwell will be joined in this project by a student research assistant
                            to help lead usability testing, and will be assisted by students in
                            her senior-level UX course.
                        </SubTextLeft>
                    </div>
                    <div className="col-md-1"></div>
                </div>
                <div className="row top-spacer-1  no-gutters">
                    <div className="col-md-1"></div>
                    <div className="col-md-2 align-self-center">
                        <img
                            src={martin}
                            alt="Logo"
                            className="profile_img"
                        />
                    </div>
                    <div className="col-md-8 pl-5 align-self-center">
                        <SubTextLeft>
                            <strong>Martin Pepper</strong>
                            <br />
                            <em>Interaction Designer</em>
                            <br />
                            <br />
                            Pepper is a Houston, TX, based graphic designer with over 25 years of
                            experience creating immersive interactive experiences. His interaction
                            design has appeared in DVD-based games, educational software, Fortune
                            500 board rooms, airport kiosks, and on countless desktops and mobile
                            devices. Recognized by the American Advertising Federation and Business
                            Marketing Association, Martin’s work has been featured in juried AIGA
                            exhibitions, as well as Graphis Design Annuals and How Magazine. He is
                            a graduate of UH’s School of Art, and a founding member of the UH Graphic
                            Alumni Partnership.
                        </SubTextLeft>
                    </div>
                    <div className="col-md-1"></div>
                </div>
                <div className="row top-spacer-1  no-gutters">
                    <div className="col-md-1"></div>
                    <div className="col-md-2 align-self-center">
                        <img
                            src={rahul}
                            alt="Logo"
                            className="profile_img"
                        />
                    </div>
                    <div className="col-md-8 pl-5 align-self-center">
                        <SubTextLeft>
                            <strong>Rahul Raj Mogili</strong>
                            <br />
                            <em>Web Developer</em>
                            <br />
                            <br />
                            Mogili is currently a graduate student in the Computer Science Department
                            at UH with extensive experience in web development and UI/UX design. He has worked on projects using
                            React.js, GraphQL, MongoDB, Swift, Python. His academic projects include building a Carpooling app using Swift along with
                            prototyping in Adobe Xd, Developed a potential prediction model in Ensemble Learning, Facial Recognition using Deep Learning
                            with Convolutional Neural Networks. He also served as a Divisional Vice President of Street Cause NGO in India for
                            a period of 2 years.
                        </SubTextLeft>
                    </div>
                    <div className="col-md-1"></div>
                </div>
                <div className="row top-spacer-1  no-gutters">
                    <div className="col-md-1"></div>
                    <div className="col-md-2 align-self-center">
                        <img
                            src={jinelly}
                            alt="Logo"
                            className="profile_img"
                        />
                    </div>
                    <div className="col-md-8 pl-5 align-self-center">
                        <SubTextLeft>
                            <strong>Jinelly Swasey</strong>
                            <br />
                            <em>Graduate Usability (UX) Assistant</em>
                            <br />
                            <br />
                            In May 2020, Swasey graduated from the University of Houston with a B.S. in Digital
                            Media. While studying, she developed skills in UI/UX design, omnichannel
                            marketing, and branding. During the 2019-2020 academic year, she served
                            as the president of the student-led organization, GCEA, known as the
                            Graphic Communications Education Association. Swasey assists Dr. Rodwell
                            in user research and usability testing.
                        </SubTextLeft>
                    </div>
                    <div className="col-md-1"></div>
                </div>
                <div className="row top-spacer-1  no-gutters">
                    <div className="col-md-1"></div>
                    <div className="col-md-2 align-self-center">
                        <img
                            src={xandria}
                            alt="Logo"
                            className="profile_img"
                        />
                    </div>
                    <div className="col-md-8 pl-5 align-self-center">
                        <SubTextLeft>
                            <strong>Xandria Outing</strong>
                            <br />
                            <em>Graduate Assistant in Data Development and Curation </em>
                            <br />
                            <br />
                            Outing is a 2020 graduate from the University of Houston with a M.A. in
                            Public History. For the project, Outing built, maintained, and updated
                            digital spreadsheets with coin data. She oversaw the creation and editing
                            of the Omeka catalog and matched each entry with coin images from museum
                            databases. Outing seeks to become a museum curator and find new ways to
                            introduce history to the public.
                        </SubTextLeft>
                    </div>
                    <div className="col-md-1"></div>
                </div>

                <div className="row top-buffer-1">
                    <div className="col-md-2"></div>
                    <div className="col-md-8" data-aos="fade-up">
                        <PageSectionTitle>
                            Past Student Research Assistants
                        </PageSectionTitle>
                    </div>
                    <div className="col-md-2"></div>
                </div>

                <div className="row top-spacer-05">
                    <div className="col-md-1"></div>
                    <div className="col-md-10">
                        <SubTextLeft>
                            <ul>
                                <li>
                                  <strong>Alberto Wilson, <em>Ph.D. Candidate in the Department of History at the University of Houston</em></strong> <br /> Learned technical design within Omeka and associated APIs
                                </li>
                                <br />
                                <li>
                                  <strong>Tara Sewell, <em>Ph.D. 2020 from the Department of History at the University of Houston</em></strong> <br /> Creating digital data entries from printed excavation reports 
                                </li>
                                <br />
                                <li>
                                  <strong>Matthew Finnie, <em>Ph.D. Candidate in the Department of History at the University of Houston</em></strong> <br /> Created Syrian city profiles within Omeka
                                </li>
                                <br />
                                <li>
                                  <strong>Delfina Denari, <em>B.S. from the University of Houston</em></strong> <br /> Creation of 3D, annotated coin scans 
                                </li>
                                <br />
                                <li>
                                  <strong>Abigail Chetlain, <em>B.S. from the University of Houston</em></strong> <br /> Worked on graphic design of the digital project
                                </li>
                                <br />
                                <li>
                                  <strong>Anjana Kummari, <em>M.A. from the University of Houston</em></strong> <br /> Initial building of the backend of the digital project 
                                </li>
                            </ul>
                        </SubTextLeft>
                    </div>
                    <div className="col-md-1"></div>
                </div>

                {/* Acknowledgments */}

                <div className="row top-buffer-1">
                    <div className="col-md-2"></div>
                    <div className="col-md-8" data-aos="fade-up">
                        <PageTitleCentered>
                            Acknowledgments
                        </PageTitleCentered>
                    </div>
                    <div className="col-md-2"></div>
                </div>


                <div className="row top-spacer-1">
                    <div className="col-md-1"></div>
                    <div className="col-md-5">
                        <ParaTextLeftSmaller>
                            The SYRIOS Project is made possible through the generosity and support of the University of
                            Houston, in particular:
                            <br />
                            <br />
                            <StyledLink href="https://drc.lib.uh.edu/" target="_blank" rel="noopener noreferrer">Digital Research
                                Commons</StyledLink>
                            <br />
                            <StyledLink href="https://www.uh.edu/research/" target="_blank" rel="noopener noreferrer">Division of
                                Research</StyledLink>
                            <br />
                            <StyledLink href="https://libraries.uh.edu/" target="_blank" rel="noopener noreferrer">University of
                                Houston Libraries</StyledLink>
                            <br />
                            <StyledLink href="https://www.uh.edu/class/history/" target="_blank" rel="noopener noreferrer">Department
                                of History</StyledLink>
                            <br />
                            <StyledLink href="https://uh.edu/class/ctr-public-history/" target="_blank"
                               rel="noopener noreferrer">Center
                                for Public History</StyledLink>
                            <br />
                            <StyledLink href="https://www.uh.edu/technology/" target="_blank" rel="noopener noreferrer">College
                                of
                                Technology</StyledLink>
                            <br />
                            <StyledLink href="https://www.uh.edu/data-science-institute/" target="_blank"
                               rel="noopener noreferrer">Hewlett
                                Packard Enterprise Data Science Institute</StyledLink>

                        </ParaTextLeftSmaller>
                    </div>
                    <div className="col-md-5 ">
                        <ParaTextLeftSmaller>
                            We are also grateful to the many museums and institutions for their sharing of coin material:
                            <br />
                            <br />
                            <StyledLink href="http://numismatics.org/" target="_blank" rel="noopener noreferrer">American
                                Numismatic
                                Society</StyledLink>
                            <br />
                            <StyledLink href="https://library.princeton.edu/special-collections/divisions/numismatic-collection"
                               target="_blank" rel="noopener noreferrer">Princeton University Library Numismatic
                                Collection</StyledLink>
                            <br />
                            <StyledLink href="https://www.bnf.fr/en/bibliotheque-nationale-de-france-catalogue-general"
                               target="_blank" rel="noopener noreferrer">The Bibliothèque nationale de France</StyledLink>
                            <br />
                            <StyledLink href="https://www.smb.museum/en/museums-institutions/muenzkabinett/home/" target="_blank"
                               rel="noopener noreferrer">Münzkabinett at the Staatliche Museen in Berlin</StyledLink>
                            <br />
                            <StyledLink href="https://rpc.ashmus.ox.ac.uk/" target="_blank" rel="noopener noreferrer">Roman
                                Provincial Coinage Online</StyledLink>
                            <br />
                        </ParaTextLeftSmaller>
                    </div>
                    <div className="col-md-1"></div>
                </div>
                <div className="row top-spacer-1"></div>
            </div>
        </div>
    );
};

export default About;
