import React,{useState} from 'react';
import './App.css';
import URLImage from "./components/draganddrop";
import { Stage, Layer, Image } from "react-konva";
import "konva";
import { toast } from 'react-toastify';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"
import {Rect, Circle, Ellipse, Line } from 'react-konva';



function downloadURI(uri, name) {
  var link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


function App() {
  const dragUrl = React.useRef();
  const [images, setImages] = React.useState([]);

  const stageRef = React.useRef(null);

  // const dragUrl = useRef("");

  const handleExport = () => {
    const clonedStage = stageRef.current.clone({
      draggable: false,
    });

    // Convert to data URL
    const dataURL = clonedStage.toDataURL();
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "canvas_image.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDragStart = (e) => {
    dragUrl.current = e.target.src;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const position = stageRef.current.getPointerPosition();

    setImages((prevImages) => [
      ...prevImages,
      {
        x: position.x,
        y: position.y,
        width: 100, // You can set the desired width and height
        height: 100,
        src: dragUrl.current,
      },
    ]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const width = window.innerWidth;
  const height = window.innerHeight;


  let [pdffile,setPdffile]=useState("");

  let [loading,setLoading]=useState(false);
  let [loading2,setLoading2]=useState(false);

  function pdffileupload(files) {
    setPdffile(files);
  }

  async function uploadpdf () {
    if(!pdffile) {
      toast.error("Plese Select the File to upload");
      return ;
    }
   try {
    console.log("Uploading doc...")
         setLoading(true);

         const formData = new FormData();
           formData.append('pdfs',pdffile[0] );

           console.log(formData,"file",pdffile[0])

         let uploadresponse = await axios.post(`${process.env.REACT_APP_URL}/actions/uploadpdfs`,formData,{headers:{'Content-Type': 'multipart/form-data',"Token-DocsAI":`Bearer ${localStorage.getItem('token')}`}})

           setLoading(false);
           toast.success('Document Uploading Completed');
           console.log("Document Uploading Completed.")
           localStorage.setItem('currPdf',pdffile[0].name)
   }
   catch(error) {
    setLoading(false);
    toast.error(`Error:${error.response.data.message}`);
    console.log("Some Error Occured :",error)
   }
  }



  return (
    <div>
       <ToastContainer/>

      <nav className="navbar bg-primary navbar-expand-lg" data-bs-theme="dark">
  <div className="container-fluid">
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <a className="navbar-brand" href="/">Image Editor</a>
    <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="/">Home</a>
        </li>
      </ul>
      <form className="d-flex" role="search">
        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
        <button className="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>


       <button onClick={handleExport}>Click here to download the Image</button>
       <br/>
     Drag and drop the Image:
      <br />
      <img
        alt="lion"
        src="https://konvajs.org/assets/lion.png"
        draggable="true"
        onDragStart={(e) => {
          dragUrl.current = e.target.src;
        }}
      />
      <div
        onDrop={(e) => {
          e.preventDefault();
          // register event position
          stageRef.current.setPointersPositions(e);
          // add image
          setImages(
            images.concat([
              {
                ...stageRef.current.getPointerPosition(),
                src: dragUrl.current
              }
            ])
          );
        }}
        onDragOver={(e) => e.preventDefault()}
      >

<Stage  width={window.innerWidth}
          height={window.innerHeight}
          style={{ border: "1px solid grey" }} ref={stageRef}>
        <Layer>
          <Rect x={0} y={0} width={80} height={80} fill="red" />
          <Rect x={width - 80} y={0} width={80} height={80} fill="red" />
          <Rect
            x={width - 80}
            y={height - 80}
            width={80}
            height={80}
            fill="red"
          />
          {images.map((image) => {
              return <URLImage image={image} />;
            })}
          <Rect x={0} y={height - 80} width={80} height={80} fill="red" />
        </Layer>
      </Stage>
      </div>
    </div>
  );
}

export default App;
