import { leastSquaresRegression } from "./leastSquares.mjs"
import mapa from "../assets/data/mapGraphProcessed.json" with { type: "json" }


// transforma los pesos de peligro del grafo en los pesos adecuados
// para renderizar el heatmap
function transformWeight(weight) {
  if (weight==1 || weight>=5) return 0 
  else if (weight > 1) return weight-0.5
  else return weight
}

// De todos los nodos asociados a una calle, aproxima y devuelve nodos 
// distribuidos uniformemente
// points: Array<{lat, long}>
const POINT_DISTANCE = .00035
function getPointsUniform(points) {
  const x = points.map(el => el.long)
  const y = points.map(el => el.lat)
  // estimamos la recta que forman los nodos
  const {slope, intercept} = leastSquaresRegression(y, x)
  
  // intervalo en el que se define la recta
  const [a, b] = [Math.min(...x), Math.max(...x)]
  const fa = a*slope + intercept
  const fb = b*slope + intercept

  // calculamos el largo del segmento de recta para luego calcular
  // cuantos nodos vamos a distribuir (un nodo cada POINT_DISTANCE)
  const distance = Math.sqrt((a - b) ** 2 + (fa - fb) ** 2)
  const numPoints = Math.round(distance/POINT_DISTANCE) 

  const heatmapPoints = []
  const increment = Math.abs(b-a)/(numPoints-1)
  for(let i=0; i<numPoints; i++) {
    const long = a + increment*i
    const lat = long*slope + intercept
    heatmapPoints.push({lat, long})
  }

  return heatmapPoints
}


function getHeatmapPoints() {
  let streets = []
  for (var key in mapa[1]) {
    streets.push({id: key, oldWeight: mapa[1][key].nivelPeligro, nodesIds: mapa[1][key]["nodes"]})
  }
  
  const heatMapPoints = []
  streets.forEach(street => {
    const newWeight = transformWeight(street["oldWeight"])
    
    const nodesCoords = [] // son todos los nodos asociados a la calle
    street["nodesIds"].forEach(nodeId => {
      nodesCoords.push({lat: mapa[0][nodeId]["lat"], long: mapa[0][nodeId]["lon"]})
    })
    
    const points = getPointsUniform(nodesCoords)
    const weightedPoints = points.map(el => {
      return {...el, weight: newWeight}
    })
    
    heatMapPoints.push(...weightedPoints)
  });

  return heatMapPoints
}

import fsPromises from "fs/promises"
await fsPromises.writeFile(
  "./assets/data/HeatMapProcesado.json",
  JSON.stringify(getHeatmapPoints())
)