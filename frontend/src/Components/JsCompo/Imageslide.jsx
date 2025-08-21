import React from "react";
import event1 from "./event1.jpeg";

function Imageslide(){
    return <div>
                <div className="h-fit">
                  <div>
                    <div className="relative h-[445px] w-full  bg-cover flex items-center bg-no-repeat"
                     style={{ backgroundImage: `url(${event1})`,
                      backgroundPosition: 'center 0px',}}>
                      <div className="absolute top-0 left-0 bottom-0 w-[50%] bg-gradient-to-r from-black/100 to-transparent z-10" />
                     <div className="absolute top-0 right-0 bottom-0 w-[50%] bg-gradient-to-l from-black/100 to-transparent z-10" />


                    </div>
                  </div>
                </div>
              </div>



}


export default Imageslide;