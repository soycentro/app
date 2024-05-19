import mapa from "../assets/data/mapGraphProcessed.json" with { type: "json" }

let conjuntoNodos = mapa[0]
let conjuntoVias = mapa[1]
let conjuntoPuntos = mapa[2]

// Priority queue tomado de https://stackoverflow.com/questions/42919469/efficient-way-to-implement-priority-queue-in-javascript

const top = 0
const parent = i => ((i + 1) >>> 1) - 1
const left = i => (i << 1) + 1
const right = i => (i + 1) << 1

class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = []
    this._comparator = comparator
  }
  size() {
    return this._heap.length
  }
  isEmpty() {
    return this.size() == 0
  }
  peek() {
    return this._heap[top]
  }
  push(...values) {
    values.forEach(value => {
      this._heap.push(value)
      this._siftUp()
    })
    return this.size()
  }
  pop() {
    const poppedValue = this.peek()
    const bottom = this.size() - 1
    if (bottom > top) {
      this._swap(top, bottom)
    }
    this._heap.pop()
    this._siftDown()
    return poppedValue
  }
  replace(value) {
    const replacedValue = this.peek()
    this._heap[top] = value
    this._siftDown()
    return replacedValue
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j])
  }
  _swap(i, j) {
    ;[this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]]
  }
  _siftUp() {
    let node = this.size() - 1
    while (node > top && this._greater(node, parent(node))) {
      this._swap(node, parent(node))
      node = parent(node)
    }
  }
  _siftDown() {
    let node = top
    while (
      (left(node) < this.size() && this._greater(left(node), node)) ||
      (right(node) < this.size() && this._greater(right(node), node))
    ) {
      let maxChild =
        right(node) < this.size() && this._greater(right(node), left(node))
          ? right(node)
          : left(node)
      this._swap(node, maxChild)
      node = maxChild
    }
  }
}

// Retorna un conjunto de IDs de nodos generado por A* entre dos puntos.
// VertInicio y VertDestino son ids de OSM.
// Nivel peligro ayuda a la heuristica de generacion de camino, si es 0 no nos importa que tan peligrosa es una ruta
// si es 1, una ruta donde es el doble de probable que te roben seria como caminar el doble de distancia,
// con valores mas altos, se discentiviza aun mas las rutas peligrosas.
function A_EstrellaRuta(idNodoInicio, idNodoDestino, factorPeligro) {
  let frontera = new PriorityQueue((a, b) => a[1] < b[1])

  let nodoInicio = conjuntoNodos[idNodoInicio]
  let nodoDestino = conjuntoNodos[idNodoDestino]

  frontera.push([nodoInicio, 0, [idNodoInicio]])
  let explorados = {}
  explorados[idNodoInicio] = 1

  while (!frontera.isEmpty()) {
    let popFrontera = frontera.pop()
    let nodo = popFrontera[0]
    let distanciaRecorrida = popFrontera[1]
    let trayectoRecorrido = popFrontera[2]

    if (nodo == nodoDestino) {
      return trayectoRecorrido
    }

    explorados[idNodoDestino] = null; // esto lo arregla :)

    nodo["rutas"].forEach(idRutaConectadaANodo => {
      let nivelPeligroRuta = conjuntoVias[idRutaConectadaANodo]["nivelPeligro"]

      conjuntoVias[idRutaConectadaANodo]["nodes"].forEach(idNodoNuevo => {
        // Deberia haber hecho esto en ts pero funciona :)
        if (explorados[idNodoNuevo] == null) {
          let trayectoNuevo = Array.from(trayectoRecorrido)
          explorados[idNodoNuevo] = 1
          let nodoNuevo = conjuntoNodos[idNodoNuevo]

          // Distancia entre el nodo que estamos trabajando y el nodo nuevo al que nos dirigmos
          let distanciaNodoNuevo = HeuristicaDistancia(nodo, nodoNuevo)
          // Aqui esta el truco, usamos la distancia hacia el nodo nuevo y la multiplicamos por cuan peligrosa es la calle que estamos recorriendo
          let heuristicaPeligro =
            distanciaNodoNuevo * nivelPeligroRuta * factorPeligro
          // Distancia entre el nodo que estamos trabajando y el destino
          let distanciaObjetivo = HeuristicaDistancia(nodoDestino, nodoNuevo)

          let heuristica =
            distanciaRecorrida +
            distanciaObjetivo +
            distanciaNodoNuevo +
            heuristicaPeligro

          trayectoNuevo.push(idNodoNuevo)
          frontera.push([nodoNuevo, heuristica, trayectoNuevo])
        }
      })
    })
  }
}

// La heuristica que usamos es la distancia en el plano simple.
function HeuristicaDistancia(VertInicio, VertDestino) {
  return Math.sqrt(Math.pow(VertInicio['lat'] - VertDestino['lat'], 2) + Math.pow(VertInicio['lon'] - VertDestino['lon'], 2));
}

let ruta = A_EstrellaRuta(9718796286, 7996465710, 1)

// Recibe un conjunto de coordenadas y retorna la suma de la distancia real entre todas
// Las coordenadas que recibe y exporta esta funcion son en forma [lat, lon].
function CalcularLongitudRuta(coordenadas) {
    let longitud = 0;
    let i = 0;

    while (i < coordenadas.length - 1) {
        longitud = longitud + Math.sqrt((Math.pow(coordenadas[i][0] - coordenadas[i + 1][0], 2) + Math.pow(coordenadas[i][1] - coordenadas[i + 1][1], 2)));
        i = i + 1;
    }

    return longitud;
}

// Recibe un conjunto de IDs y retorna un conjunto de coordenadas a partir de estos
// Las coordenadas que recibe y exporta esta funcion son en forma [lat, lon].
function CoordenadasDeID(ids) {
  let coordenadas = []

  ids.forEach(id => {
    let nodo = conjuntoNodos[id]
    coordenadas.push([nodo["lat"], nodo["lon"]])
  })

  return coordenadas
}

// Recibe una coordenanda y usa una busqueda lineal para retornar el ID del punto mas cercano
// Las coordenadas que recibe y exporta esta funcion son en forma [lat, lon].
function NodeIDCoordenada(coordenada) {
  let distanciaMasCercana = 100000
  let idMasCercano = 0 // Es el id del punto mas cercano
  let distancia = 0

  conjuntoPuntos.forEach(punto => {
    distancia =
      Math.pow(punto[0] - coordenada[0], 2) +
      Math.pow(punto[1] - coordenada[1], 2)
    if (distancia < distanciaMasCercana) {
      distanciaMasCercana = distancia
      idMasCercano = punto[2] // punto[2] = id.
    }
  })
  return idMasCercano
}


// Recibe un conjunto de rutas e imprime las coordenadas de esta para que se puedan visualizar de forma facil
// Usado para debug mientras se termina la integracion a la interfaz de la app
function PrintCoordenadas(conjuntoRutas) {
    conjuntoRutas.forEach(ruta => {
        console.log('Para la ruta con riesgo %s:', ruta[2]);
        ruta[0].forEach(coord => {
            console.log('%s, %s', coord[0], coord[1]);
        });
    });
}

// Funcion principal que se expone, retorna un array con la misma cantidad de elementos que conjuntoNivelesRiesgo de forma [[CoordenadasRuta], LongitudRuta].
// Las coordenadas que recibe y exporta esta funcion son en forma [lat, lon].
// conjuntoNivelesRiesgo debe ser un array compuesto de numeros reales, por cada numero que tiene el array, se retorna un camino.

export function getRoutes(
  coordenadaInicio,
  coordenadaFin,
  conjuntoNivelesRiesgo
) {
  return new Promise((resolve, reject) => {
    try {
      let idInicio = NodeIDCoordenada(coordenadaInicio)
      let idFin = NodeIDCoordenada(coordenadaFin)

      let conjuntoRutas = []
      conjuntoNivelesRiesgo.forEach(nivelRiesgo => {
        let conjuntoIDs = A_EstrellaRuta(idInicio, idFin, nivelRiesgo)
        let conjuntoCoords = CoordenadasDeID(conjuntoIDs)
        let distanciaRuta = CalcularLongitudRuta(conjuntoCoords)

        conjuntoRutas.push([conjuntoCoords, distanciaRuta, nivelRiesgo])
      })

      resolve(conjuntoRutas)
    } catch (error) {
      reject(error)
    }
  })
}

// Ejemplo de uso:
// getRoutes([4.6104075, -74.0708565], [4.596605, -74.0693091], [0, 1, 2])
//   .then(routes => {
//     console.log(routes)
//   })
//   .catch(error => {
//     console.log(error)
//   })
