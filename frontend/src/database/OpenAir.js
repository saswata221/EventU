import IPL from "../Components/Images/Openair/IPL.png";
import Football from "../Components/Images/Openair/Football.png";
import Kabadi from "../Components/Images/Openair/Kabadi.jpeg";
import Chou from "../Components/Images/Openair/Chou.jpeg";
import Egame from "../Components/Images/Openair/Egame.png";

const OpenAir = [
  {
    id: 1,
    text: "Football Screening",
    imageURL: Football,
    route: "/openair?sport=football",
  },
  {
    id: 2,
    text: "Cricket Screening",
    imageURL: IPL,
    route: "/openair?sport=cricket",
  },
  {
    id: 3,
    text: "Hockey",
    imageURL: Egame,
    route: "/openair?sport=hockey",
  },
  {
    id: 4,
    text: "Kabadi Screening",
    imageURL: Kabadi,
    route: "/openair?sport=kabaddi",
  },
  {
    id: 5,
    text: "Cultural Dances",
    imageURL: Chou,
    route: "/",
  },
];

export default OpenAir;
