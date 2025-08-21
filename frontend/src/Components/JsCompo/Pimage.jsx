
function Pimage(props){
    return <div>
        <div className="h-fit">
           <img
  className="rounded-t-3xl w-full aspect-[3/4] object-cover object-center"
  src={props.image}
  alt="movie"
/>
          </div>
    </div>
}

export default Pimage;