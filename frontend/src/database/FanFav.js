// frontend/src/database/FanFav.js
import comedyImg from "../Components/Images/favImage/comedy.jpeg";
import Magic from "../Components/Images/favImage/Magic.jpeg";
import Music from "../Components/Images/favImage/Music.jpeg";
import Kids from "../Components/Images/favImage/Kids.jpg";
import Theatre from "../Components/Images/favImage/Theatre.jpeg";

const fanfav = [
  { id: 1, imageURL: comedyImg, category: "Comedy" },
  { id: 2, imageURL: Magic, category: "Magic Shows" },
  { id: 3, imageURL: Music, category: "Music" },
  { id: 4, imageURL: Kids, category: "Kids" },
  { id: 5, imageURL: Theatre, category: "Theatre Shows" },
];

export default fanfav;
