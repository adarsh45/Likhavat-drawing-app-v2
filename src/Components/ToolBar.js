import React, { useContext, useState } from 'react';
import {FaRegCircle, FaDownload, FaGripLinesVertical, FaFont,
        FaInfoCircle, FaArrowsAlt, FaPen, FaRegSquare, FaUndo,
        FaTrash, FaLongArrowAltRight} from 'react-icons/fa';
import ShapeContext from '../Context/ShapeContext';

const ToolBar = ()=> {

    const {updateShapeType, dragging, updateDragStatus,
         handleUndo, updateStrokeColor, updateStrokeWidth, clearAllElements} = useContext(ShapeContext);

    const [sizeValue, setSizeValue] = useState(5);

    const handleClick = (id)=>{
        updateShapeType(id);
        if (id==='drag') {
            updateDragStatus(true);
        }
        if (id === 'text') {
            id = 'drag';
            // updateDragStatus(true);
        }
        if (dragging) {
            updateDragStatus(false);
        }
        
        const el = document.getElementById(id);
        const parent = el.parentNode;
        const children = parent.childNodes;
        children.forEach(child=>{
            if (child.classList.contains('active')) {
                child.classList.remove('active');
                return;
            }
        })
        el.classList.add('active');
    }

    const handleClickSizeChange = (e)=>{
        
        if (e.target.innerText === '+') {
            if (sizeValue >= 10) {
            return alert("Sorry, Size cannot be increased further!");
            }
            setSizeValue(sizeValue+1);
        } else if (e.target.innerText === '-'){
            if (sizeValue <= 1) {
            return alert("Sorry, Size cannot be decreased further!");
            }
            setSizeValue(sizeValue-1);
        }
        updateStrokeWidth(sizeValue);
    }

    const downloadBoard = ()=> {
        alert("Sorry, This feature is under development!");
    }

    const clearCanvas = ()=> {
        if (window.confirm("Are you sure you want to Clear the Entire Board?")) {
            clearAllElements();
        }
    }

    const iconStyle = {
        fontSize: "1.4em"
    }

    return(
        <>
        <div id="toolbar">
            <div className="tool" id="drag" onClick={()=> handleClick('drag')}>
            <label htmlFor="drag"><FaArrowsAlt style={iconStyle}  /></label>
            
            </div>
        <div className="tool active" id="pencil" onClick={()=> handleClick('pencil')}>
            <label htmlFor="pencil"><FaPen style={iconStyle}/></label>
        </div>
        <div className="tool" id="line" onClick={()=> handleClick('line')}>
            <label htmlFor="line"> <FaGripLinesVertical style={iconStyle}/> </label>
         </div>
         <div className="tool" id="arrow" onClick={()=> handleClick('arrow')}>
            <label htmlFor="arrow"> <FaLongArrowAltRight style={iconStyle}/> </label>
         </div>
        <div className="tool" id="rect" onClick={()=> handleClick('rect')}>
          <label htmlFor="rect"><FaRegSquare style={iconStyle}/></label>
        </div>
        <div className="tool" id="circle" onClick={()=> handleClick('circle')}>
            <label htmlFor="circle"><FaRegCircle style={iconStyle}/></label>
        </div>
        <div className="tool" id="text" onClick={()=> handleClick('text')}>
            <label htmlFor="text"><FaFont style={iconStyle}/></label>
        </div>
        <div className="tool" id="download-tool" onClick={downloadBoard}>
            <FaDownload style={iconStyle}/>
        </div>
        <div className="tool" id="about-tool">
            <FaInfoCircle style={iconStyle}/>
        </div>
        
    </div>
    <div className="settings">
            <div className="tool" id="undo" onClick={handleUndo}>
                <FaUndo style={iconStyle}/>
            </div>
            <hr style={{margin:0, padding: 0}} />
            <div className="colorsList" id="colors">
                <div className="colorBox" id="white" onClick={()=>{updateStrokeColor("#ffffff")}}></div>
                <div className="colorBox" id="yellow" onClick={()=>{updateStrokeColor("#fff222")}}></div>
                <div className="colorBox" id="blue" onClick={()=>{updateStrokeColor("#007bff")}}></div>
            </div>
            <hr style={{margin:0, padding: 0}} />
            <div id="size-tool">
            <div>Size</div>
                <span> <button id="decreaseSizeBtn" onClick={handleClickSizeChange}>-</button> </span>
                <span id="sizeText"> {sizeValue} </span>
                <span> <button id="increaseSizeBtn" onClick={handleClickSizeChange}>+</button> </span>
            </div>
            <hr/>
            <div className="tool" id="clear-all-tool" onClick={clearCanvas}>
                <FaTrash style={iconStyle}/>
            </div>
        </div>
    
    </>
    );
}

export default ToolBar;