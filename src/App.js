import { useEffect, useState } from 'react';
import { Stage, Layer, Line, Rect, Circle, Text, Arrow } from 'react-konva';
import nextId from "react-id-generator";
import './App.css';
import ToolBar from './Components/ToolBar';
import ShapeContext from './Context/ShapeContext';

// the first very simple and recommended way:
// const ImageLoad = () => {
//   const [image] = useImage('C:/Users/Adarsh/Desktop/hitesh_test.png');
//   return <Image x={500} y={500} image={image} />;
// };

const defaultProperties = {
  strokeColor: '#ffffff',
  strokeWidth: 5
}

function App() {

  const [drawing , setDrawing] = useState(false);
  const [dragging , setDragging] = useState(false);
  const [shapeType, setShapeType] = useState('pencil');
  const [elements, setElements] = useState([]);
  const [pointsArray, setPointsArray] = useState([]);
  const [properties, setProperties] = useState(defaultProperties);

  useEffect(()=> {
    if (shapeType === 'text') {
      const textInput = prompt("Enter text here...");
      const initialElement = createElement(nextId(), shapeType, textInput);
      setElements(e=>[...e, initialElement]);
      setShapeType('drag');
      setDragging(true);
    }
  }, [shapeType])

  const clearAllElements = ()=> {
    setElements([]);
  }

  const updateShapeType = (updatedShape)=>{
    setShapeType(updatedShape);
  }

  const updateDragStatus = (updatedDragStatus)=>{
    setDragging(updatedDragStatus);
  }

  const updateStrokeWidth = (updatedStrokeWidth)=>{
    setProperties({...properties, strokeWidth: updatedStrokeWidth});
  }

  const updateStrokeColor = (updatedStrokeColor)=>{
    setProperties({...properties, strokeColor: updatedStrokeColor});
  }

  const createElement = (id, shape, x1, y1, x2, y2)=>{
    let myElement;
    switch (shape) {
      case 'text':
        myElement = {id, shape, text: x1};
        break;
      case 'line':
        myElement = {id, shape, x1, y1, x2, y2};
        break;
      case 'arrow':
        myElement = {id, shape, x1, y1, points: [x1, y1, x2, y2]};
        break;
      case 'pencil':
        setPointsArray([...pointsArray, x1, y1]);
        setPointsArray([...pointsArray, x2, y2]);
        myElement = {id, shape, x1, y1, points: pointsArray};
        break;
      case 'rect':
        myElement = {id, shape, x1, y1, width: x2-x1, height: y2-y1};
        break;
      case 'circle':
        let radius = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
        myElement = {id, shape, x1, y1, radius};
        break;
      default:
        myElement = {id, shape, x1, y1, x2, y2};
    }
    myElement = {...myElement, properties};
    return myElement;
  }

  const handleMouseDown = (e)=>{
    if (dragging) return;
    setDrawing(true);
    // const {clientX, clientY} = e.evt;
    const {x, y} = e.target.getStage().getPointerPosition();

    const initialElement = createElement(nextId(), shapeType, x, y, x, y);
    setElements([...elements, initialElement]);
  }

  const handleMouseMove = (e)=>{
    if (!drawing) return;
    // const {clientX, clientY} = e.evt;
    const {x, y} = e.target.getStage().getPointerPosition();

    const index = elements.length - 1;
    const elementsCopy = [...elements];
    const {id, shape, x1, y1} = elementsCopy[index];
    elementsCopy[index] = createElement(id, shape, x1, y1, x, y);
    
    setElements(elementsCopy);
  }

  const handleMouseUp = ()=>{
    setDrawing(false);
    if (shapeType === 'pencil') {
      setPointsArray([]);
    }
  }

  const handleUndo = ()=> {
    const elementsCopy = [...elements];
    elementsCopy.pop();
    setElements(elementsCopy);
  }

  return (
    <ShapeContext.Provider value={{shapeType, updateShapeType, dragging, updateDragStatus, handleUndo, updateStrokeColor, updateStrokeWidth, clearAllElements}}>

    <div id="container">
    <div id="canvas">
      <Stage
      style={{backgroundColor: "#202020"}}
      width={window.innerWidth} 
      height={window.innerHeight} 
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}>
      <Layer>

      {
        elements.map(element=> {
          switch(element.shape){
            case 'text':
              return(
              <Text
                key={element.id}
                x={200}
                y={100}
                text={element.text}
                fill={element.properties.strokeColor}
                fontSize={30}
                draggable={dragging}
                />
            )
            case 'line':
              return(
              <Line
                key={element.id}
                x={0}
                y={0}
                points={[element.x1, element.y1, element.x2, element.y2]}
                stroke={element.properties.strokeColor}
                strokeWidth={element.properties.strokeWidth}
                draggable={dragging}
                lineCap="round"
                tension={0.0}
                />
            )
            case 'pencil':
              return(
              <Line
                key={element.id}
                points={element.points}
                stroke={element.properties.strokeColor}
                strokeWidth={element.properties.strokeWidth}
                draggable={dragging}
                lineCap="round"
                />
            )
            case 'rect':
              return(
                <Rect 
                key={element.id}
                x={element.x1}
                y={element.y1}
                width={element.width}
                height={element.height}
                stroke={element.properties.strokeColor}
                strokeWidth={element.properties.strokeWidth}
                draggable={dragging}
                />
            )
          case 'circle':
            return(
              <Circle
                key={element.id}
                x={element.x1}
                y={element.y1}
                radius={element.radius}
                stroke={element.properties.strokeColor}
                strokeWidth={element.properties.strokeWidth}
                draggable={dragging}
                />
            )
            case 'arrow':
              return (
                <Arrow
                  key={element.id}
                  points={element.points}
                  stroke={element.properties.strokeColor}
                  fill={element.properties.strokeColor}
                  strokeWidth={element.properties.strokeWidth}
                  draggable={dragging}
                />
              )
          
            default:
                return <Line
                key={element.id}
                points={element.points}
                stroke={element.properties.strokeColor}
                strokeWidth={element.properties.strokeWidth}
                draggable={dragging}
                />;
          }
          
          })
      }

      </Layer>
    </Stage>
    </div>

      <div className="overlay">
      
        <ToolBar />
      
      </div>
    </div>
    <div id="error-msg">
        <p>Sorry! Currently app is not accessible on mobile devices, Please use a laptop / desktop instead!</p>
    </div>
    </ShapeContext.Provider>
  );
}

export default App;
