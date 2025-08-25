import React from "react";
import { Link } from "react-router-dom";
import PText from "./PText";
import Pimage from "./Pimage";

function Card(props) {
  let day = "01";
  let month = "JAN";

  if (props.date) {
    const parts = props.date.split("-");
    if (parts.length === 3) {
      const rawDay = parts[2].split("T")[0];
      day = rawDay;

      const monthMap = {
        "01": "JAN", "02": "FEB", "03": "MAR", "04": "APR",
        "05": "MAY", "06": "JUN", "07": "JUL", "08": "AUG",
        "09": "SEP", "10": "OCT", "11": "NOV", "12": "DEC",
      };
      month = monthMap[parts[1]] || "JAN";
    }
  }

  const rating = parseFloat(props.rating).toFixed(1);

  // Determine the link path based on type
  const linkPath = props.type === 'event' 
    ? `/eventinfo/${props.tmdb_id}` 
    : `/movie/${props.tmdb_id}`;

  return (
    <Link to={linkPath}>
      <div className="mx-5 my-4 hover:scale-[101%] w-[230px]">
        <div className="bg-[#0b131c] rounded-3xl text-white relative">
          <div className="absolute top-0 right-0 bg-[#EF233C] text-white rounded-tr-3xl w-10 flex flex-col items-center justify-start py-1 px-1 ">
            <span className="text-xl font-bold">{day}</span>
            {month.split("").map((char, index) => (
              <span key={index} className="text-md font-semibold">{char}</span>
            ))}
          </div>

          <Pimage image={props.image} />
          <PText
            rating={rating}
            likes={props.likes}
            price={props.price}
          />
        </div>
      </div>
    </Link>
  );
}

export default Card;