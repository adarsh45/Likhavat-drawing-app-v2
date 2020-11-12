import { createContext } from 'react';

const ShapeContext = createContext({shapeType: 'line', updateShapeType: ()=>{}});

export default ShapeContext;