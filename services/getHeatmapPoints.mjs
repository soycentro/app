import points from "../assets/data/HeatMapProcesado.json" with { type: "json" }

export function getHeatmapPoints() {
  const relevantHeatmapPoints = []
  points.forEach(el => {
    if (el.weight != 0 && el.lat && el.long) {
      relevantHeatmapPoints.push(el)
    }
  })

  const renamedPoints = relevantHeatmapPoints.map(obj => {
    return {
      latitude: obj.lat,
      longitude: obj.long,
      weight: obj.weight
    };
  })

  const safePoints = []
  const dangerousPoints = []
  renamedPoints.forEach(el => {
    if (el.weight >= 1) {
      dangerousPoints.push(el)
    } else {
      safePoints.push(el)
    }
  })

  return [safePoints, dangerousPoints]
}

console.dir(getHeatmapPoints(), {'maxArrayLength': null})
