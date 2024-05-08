import mapa from "../assets/data/mapGraphUnprocessed.json" assert { type: "json" }

// Los datos se consiguen de https://overpass-turbo.eu/
// [out:json]; (way({{bbox}})[highway]; ); (._;>;); out;

let nodosMapa = {}
let rutasMapa = {}
let conjuntoPuntos = []

mapa["elements"].forEach(elementoMapa => {
  if (elementoMapa["type"] == "node") {
    elementoMapa["rutas"] = []
    nodosMapa[elementoMapa["id"]] = elementoMapa
    conjuntoPuntos.push([
      elementoMapa["lat"],
      elementoMapa["lon"],
      elementoMapa["id"],
    ])
  } else if (elementoMapa["type"] == "way") {
    if (elementoMapa.nivelPeligro == null) {
      elementoMapa["nivelPeligro"] = 1
    }
    rutasMapa[elementoMapa["id"]] = elementoMapa
  }
})

Object.entries(rutasMapa).forEach(([k, ruta]) => {
  ruta["nodes"].forEach(idNodo => {
    let nodoActual = nodosMapa[idNodo]
    nodoActual["rutas"].push(ruta["id"])
  })
})

let datosProcesados = [nodosMapa, rutasMapa, conjuntoPuntos]

import fsPromises from "fs/promises"
await fsPromises.writeFile(
  "./GrafoProcesado.json",
  JSON.stringify(datosProcesados)
)
