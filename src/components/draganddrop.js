import React from "react";
import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";
// import img1 from "../images/1.png"
// import img2 from "../images/2.png"
// import img3 from "../images/3.png"
// import img4 from "../images/4.png"


const URLImage = ({ image }) => { 
  const [img] = useImage(image.src);
  return (
    <div>
 <Image
        image={img}
        x={image.x}
        y={image.y}
        // I will use offset to set origin to the center of the image
        offsetX={img ? img.width / 2 : 0}
        offsetY={img ? img.height / 2 : 0}
      />
   
    </div>
  );
};



export default URLImage;