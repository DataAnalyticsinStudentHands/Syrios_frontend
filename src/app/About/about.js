import React from "react";
import "./about.css";
import logo from "../data/intro-images/Logo.png"
import drNeumann from "../data/about-images/DrNeumann.jpg"
import drRodwell from "../data/about-images/DrRodwell.jpg"
import martin from "../data/about-images/Martin.jpg"
import rahul from "../data/about-images/Rahul.jpg"
import jinelly from "../data/about-images/Jinelly.jpg"
import xandria from "../data/about-images/Xandria.jpg"


const About = () => {
  return (
    <div className="class-contact-para">

      <div className="about-head">
        <p id="about-style-head">
          About the Syrios Project
        </p>
      </div>

      <div className="about-desc">
        <img
          src={logo}
          alt="Logo"
        />
        <p id="about-style-para1">
          The SYRIOS Project began in 2016 both as an outgrowth of research into
          ancient Syria and in response to the current crisis within the modern
          region. By focusing on the dynamic presentation of Syrian material
          culture and the stories of its cities within the Greco-Roman period,
          we seek to:
          <br></br>
          <br></br>
          <ul>
            <li>transform public awareness of the ancient world and Syria in particular</li>
            <li>revitalize the perception of Syria as a diverse and vibrant metropolitan region</li>
            <li>exemplify the power of objects as testimony to everyday lives and struggles</li>
            <li>offer historical professionals an enhanced, digital data source and model applicable to research, teaching, and community outreach</li>
            <li>invite new perspectives into the research and engagement with this historic place</li>
          </ul>
        </p>
      </div>

      <div className="team-head">
        <p id="about-style-head">
          Meet the Team
        </p>
      </div>

      <div className="team-1-1">
        <p id="about-style-subhead">
          Directors
        </p>
      </div>

      <div className="team-1-2">
        <img
          src={drNeumann}
          alt="Logo"
        />
        <p id="about-style-para2">
          <strong>Kristina Neumann, Ph.D.</strong>
          <br></br>
          <em>Assistant Professor of Roman and Digital History in the Department
          of History at the University of Houston</em>
          <br></br>
          <br></br>
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
        </p>
      </div>

      <div className="team-1-3">
        <img
          src={drNeumann}
          alt="Logo"
        />
        <p id="about-style-para2">
          <strong>Peggy Lindner, Ph.D.</strong>
          <br></br>
          <em>Assistant Professor in the Department of Information & Logistics
          Technology in the College of Technology at the University of Houston</em>
          <br></br>
          <br></br>
          While Lindner’s background is in engineering, she has built her career
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
        </p>
      </div>

      <div className="team-1-4">
        <p id="about-style-subhead">
          Digital Media and Content Team
        </p>
      </div>

      <div className="team-1-5">
        <img
          src={drRodwell}
          alt="Logo"
        />
        <p id="about-style-para2">
          <strong>Elizabeth Rodwell, Ph.D.</strong>
          <br></br>
          <em>Usability (UX) Lead</em>
          <br></br>
          <br></br>
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
        </p>
      </div>

      <div className="team-1-6">
        <img
          src={martin}
          alt="Logo"
        />
        <p id="about-style-para2">
          <strong>Martin Pepper</strong>
          <br></br>
          <em>Interaction Designer</em>
          <br></br>
          <br></br>
          Pepper is a Houston, TX, based graphic designer with over 25 years of
          experience creating immersive interactive experiences. His interaction
          design has appeared in DVD-based games, educational software, Fortune
          500 board rooms, airport kiosks, and on countless desktops and mobile
          devices. Recognized by the American Advertising Federation and Business
          Marketing Association, Martin’s work has been featured in juried AIGA
          exhibitions, as well as Graphis Design Annuals and How Magazine. He is
          a graduate of UH’s School of Art, and a founding member of the UH Graphic
          Alumni Partnership.
        </p>
      </div>

      <div className="team-1-7">
        <img
          src={rahul}
          alt="Logo"
        />
        <p id="about-style-para2">
          <strong>Rahul Raj Mogili</strong>
          <br></br>
          <em>Graduate Assistant</em>
          <br></br>
          <br></br>
          Mogili is currently a graduate student in the Computer Science Department
          at UH with extensive experience in web development and UI/UX design.
        </p>
      </div>

      <div className="team-1-8">
        <img
          src={jinelly}
          alt="Logo"
        />
        <p id="about-style-para2">
          <strong>Jinelly Swasey</strong>
          <br></br>
          <em>Graduate Usability (UX) Assistant</em>
          <br></br>
          <br></br>
          In May 2020, Swasey graduated from the University with a B.S. in Digital
          Media. While studying, she developed skills in UI/UX design, omnichannel
          marketing, and branding. During the 2019-2020 academic year, she served
          as the president of the student-led organization, GCEA, known as the
          Graphic Communications Education Association. Swasey assists Dr. Rodwell
          in user research and usability testing.
        </p>
      </div>

      <div className="team-1-9">
        <img
          src={xandria}
          alt="Logo"
        />
        <p id="about-style-para2">
          <strong>Xandria Outing</strong>
          <br></br>
          <em>Graduate Assistant in Data Development and Curation </em>
          <br></br>
          <br></br>
          Outing is a 2020 graduate from the University of Houston with a M.A. in
          Public History. For the project, Outing built, maintained, and updated
          digital spreadsheets with coin data. She oversaw the creation and editing
          of the Omeka catalog and matched each entry with coin images from museum
          databases. Outing seeks to become a museum curator and find new ways to
          introduce history to the public.
        </p>
      </div>

      <div className="team-1-10">
        <p>
          <strong>Past Student Research Assistants</strong>
          <br></br>
          <br></br>
          Alberto Wilson, Ph.D. Candidate in the Department of History at the University of Houston
          <br></br>
          Tara Sewell, Ph.D. 2020 from the Department of History at the University of Houston
          <br></br>
          Matthew Finnie, Ph.D. Candidate in the Department of History at the University of Houston
          <br></br>
          Delfina Denari, B.S. from the University of Houston
          <br></br>
          Abigail Chetlain, B.S. from the University of Houston
          <br></br>
          Anjana Kummari, M.A. from the University of Houston
        </p>
      </div>

      <div className="acknowledgments-head">
        <p id="about-style-head">
          Acknowledgments
        </p>
      </div>

      <div className="acknowledgments-1-1">
        <p id="about-style-para1">
          The SYRIOS Project is made possible through the generosity and support of the University of Houston, in particular:
          <br></br>
          <br></br>
          <a href="https://drc.lib.uh.edu/" target="_blank" rel="noopener noreferrer">Digital Research Commons</a>
            <br></br>
          <a href="https://www.uh.edu/research/" target="_blank" rel="noopener noreferrer">Division of Research</a>
            <br></br>
          <a href="https://libraries.uh.edu/" target="_blank" rel="noopener noreferrer">University of Houston Libraries</a>
            <br></br>
          <a href="https://www.uh.edu/class/history/" target="_blank" rel="noopener noreferrer">Department of History</a>
            <br></br>
          <a href="https://uh.edu/class/ctr-public-history/" target="_blank" rel="noopener noreferrer">Center for Public History</a>
            <br></br>
          <a href="https://www.uh.edu/technology/" target="_blank" rel="noopener noreferrer">College of Technology</a>
            <br></br>
          <a href="https://www.uh.edu/data-science-institute/" target="_blank" rel="noopener noreferrer">Hewlett Packard Enterprise Data Science Institute</a>
          <br></br>
          <br></br>
          <br></br>
          The SYRIOS Project is made possible through the generosity and support of the University of Houston, in particular:
          <br></br>
          <br></br>
          <a href="http://numismatics.org/" target="_blank" rel="noopener noreferrer">American Numismatic Society</a>
            <br></br>
          <a href="https://library.princeton.edu/special-collections/divisions/numismatic-collection" target="_blank" rel="noopener noreferrer">Princeton University Library Numismatic Collection</a>
            <br></br>
          <a href="https://www.bnf.fr/en/bibliotheque-nationale-de-france-catalogue-general" target="_blank" rel="noopener noreferrer">The Bibliothèque nationale de France</a>
            <br></br>
          <a href="https://www.smb.museum/en/museums-institutions/muenzkabinett/home/" target="_blank" rel="noopener noreferrer">Münzkabinett at the Staatliche Museen in Berlin</a>
            <br></br>
          <a href="https://rpc.ashmus.ox.ac.uk/" target="_blank" rel="noopener noreferrer">Roman Provincial Coinage Online</a>
            <br></br>
        </p>
      </div>

    </div>
  );
};

export default About;
