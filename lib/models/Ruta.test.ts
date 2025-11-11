// MoraA: archivo de test para probar lo de caja  blanca
import { construirCaminoRuta } from "./Ruta"; 
import { Tramo } from "@/lib/types";

// --- DATOS DE PRUEBA ---

const tramoA_B: Tramo = {
    nroTramo: 1,
    idSucursalOrigen: 1, // A
    idSucursalDestino: 2, // B
    duracionEstimadaMin: 60,
    distanciaKm: 100,
    nombreSucursalOrigen: "A",
    nombreSucursalDestino: "B",
};

const tramoB_C: Tramo = {
    nroTramo: 2,
    idSucursalOrigen: 2, // B
    idSucursalDestino: 3, // C
    duracionEstimadaMin: 60,
    distanciaKm: 100,
    nombreSucursalOrigen: "B",
    nombreSucursalDestino: "C",
};

const tramoC_A_Ciclo: Tramo = { 
    nroTramo: 3,
    idSucursalOrigen: 3, // C
    idSucursalDestino: 1, // A
    duracionEstimadaMin: 60,
    distanciaKm: 100,
    nombreSucursalOrigen: "C",
    nombreSucursalDestino: "A",
};

const tramoD_E_Roto: Tramo = { //  no conecta con nada
    nroTramo: 4,
    idSucursalOrigen: 4, // D
    idSucursalDestino: 5, // E
    duracionEstimadaMin: 60,
    distanciaKm: 100,
    nombreSucursalOrigen: "D",
    nombreSucursalDestino: "E",
};
// --- FIN DE DATOS DE PRUEBA ---


// "describe" agrupa todas las pruebas para esta función
describe("Pruebas de Caja Blanca para construirCaminoRuta", () => {

    // --- PRUEBA 1 (
    it("Prueba Nro 1: Debe devolver una lista vacía si no hay tramos", () => {
        const tramos: Tramo[] = []; // Descripción Nro 1
        const resultado = construirCaminoRuta(tramos); // Ejecución
        expect(resultado).toEqual([]); // Resultado Esperado Nro 1
    });

    // --- PRUEBA 2 
    it("Prueba Nro 2: Debe devolver la lista original si hay un ciclo", () => {
        const tramos: Tramo[] = [tramoA_B, tramoB_C, tramoC_A_Ciclo]; // Descripción Nro 2
        const resultado = construirCaminoRuta(tramos); // Ejecución
        expect(resultado).toEqual(tramos); // Resultado Esperado Nro 2
    });

    // --- PRUEBA 3 
    it("Prueba Nro 3: Debe devolver la lista con un solo tramo", () => {
        const tramos: Tramo[] = [tramoA_B]; // Descripción Nro 3
        const resultado = construirCaminoRuta(tramos); // Ejecución
        expect(resultado).toEqual([tramoA_B]); // Resultado Esperado Nro 3
    });

    // --- PRUEBA 4 
    it("Prueba Nro 4: Debe devolver solo los tramos conectados si la ruta está rota", () => {
        const tramos: Tramo[] = [tramoA_B, tramoD_E_Roto]; // Descripción Nro 4
        const resultado = construirCaminoRuta(tramos); // Ejecución
        expect(resultado).toEqual([tramoA_B]); // Resultado Esperado Nro 4
    });

    // --- PRUEBA 5 
    it("Prueba Nro 5: Debe devolver la lista ordenada si los tramos están desordenados", () => {
        const tramos: Tramo[] = [tramoB_C, tramoA_B]; // Descripción Nro 5 (en desorden)
        const resultado = construirCaminoRuta(tramos); // Ejecución
        expect(resultado).toEqual([tramoA_B, tramoB_C]); // Resultado Esperado Nro 5 (en orden)
    });



});