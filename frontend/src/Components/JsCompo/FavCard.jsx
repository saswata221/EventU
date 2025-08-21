import React from "react";

function favCard(props){
    return (
         <div className="px-4 py-2 hover:scale-[101%]">
            <img
              className="rounded-3xl h-auto w-fit max-w-[230px] max-h-[350px] object-cover object-center "
              src={props.imageURL}
              alt="movie"
            />
        </div>
    )
}




export default favCard;