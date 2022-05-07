import NavBar from "../components/NavBar";
import ScrollTextLand from "../components/ScrollTextLand";

import MainElection from "../components/Main-Election";

const MainPage = () => {

  return (
    <main
      className="light_theme big_screen"
      id="main_main"
    >
      <div
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          content: "",
          width: "100%",
          height: "100%",
          opacity:  0.078,
          position: "fixed",
          pointerEvents: "none",
          background: `url("./img/background.svg")`,
        }}
      />
      <ScrollTextLand word={"Decentralized Voting with Bitcoin using Algorand Network!"} />
      <NavBar />

        <MainElection />
    
    </main>
  );
};

export default MainPage;
