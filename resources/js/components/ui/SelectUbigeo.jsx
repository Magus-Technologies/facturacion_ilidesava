import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

/**
 * Componente para seleccionar Departamento, Provincia y Distrito
 * Incluye campo de Ubigeo (6 dígitos)
 */
export default function SelectUbigeo({ 
    value = {}, 
    onChange, 
    disabled = false,
    errors = {} 
}) {
    const [departamentos, setDepartamentos] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [distritos, setDistritos] = useState([]);
    
    const [loadingDepartamentos, setLoadingDepartamentos] = useState(false);
    const [loadingProvincias, setLoadingProvincias] = useState(false);
    const [loadingDistritos, setLoadingDistritos] = useState(false);

    const [selectedDepartamento, setSelectedDepartamento] = useState(value.departamento || "");
    const [selectedProvincia, setSelectedProvincia] = useState(value.provincia || "");
    const [selectedDistrito, setSelectedDistrito] = useState(value.distrito || "");
    const [ubigeo, setUbigeo] = useState(value.ubigeo || "");
    const [isAutoCompleting, setIsAutoCompleting] = useState(false);

    // Cargar departamentos al montar
    useEffect(() => {
        cargarDepartamentos();
    }, []);

    // Cargar provincias cuando cambia el departamento (solo si no está autocompletando)
    useEffect(() => {
        if (selectedDepartamento && !isAutoCompleting) {
            cargarProvincias(selectedDepartamento);
        } else if (!selectedDepartamento && !isAutoCompleting) {
            setProvincias([]);
            setDistritos([]);
            setSelectedProvincia("");
            setSelectedDistrito("");
        }
    }, [selectedDepartamento, isAutoCompleting]);

    // Cargar distritos cuando cambia la provincia (solo si no está autocompletando)
    useEffect(() => {
        if (selectedDepartamento && selectedProvincia && !isAutoCompleting) {
            cargarDistritos(selectedDepartamento, selectedProvincia);
        } else if (!selectedProvincia && !isAutoCompleting) {
            setDistritos([]);
            setSelectedDistrito("");
        }
    }, [selectedProvincia, selectedDepartamento, isAutoCompleting]);

    // Actualizar ubigeo cuando cambian los valores (solo si no está autocompletando)
    useEffect(() => {
        if (!isAutoCompleting && selectedDepartamento && selectedProvincia && selectedDistrito) {
            const nuevoUbigeo = `${selectedDepartamento}${selectedProvincia}${selectedDistrito}`;
            setUbigeo(nuevoUbigeo);
            
            // Notificar cambios al padre
            onChange?.({
                departamento: selectedDepartamento,
                provincia: selectedProvincia,
                distrito: selectedDistrito,
                ubigeo: nuevoUbigeo,
                departamentoNombre: departamentos.find(d => d.departamento === selectedDepartamento)?.nombre || "",
                provinciaNombre: provincias.find(p => p.provincia === selectedProvincia)?.nombre || "",
                distritoNombre: distritos.find(d => d.distrito === selectedDistrito)?.nombre || "",
            });
        }
    }, [selectedDepartamento, selectedProvincia, selectedDistrito, isAutoCompleting, departamentos, provincias, distritos]);

    const cargarDepartamentos = async () => {
        setLoadingDepartamentos(true);
        try {
            const response = await fetch('/api/departamentos');
            const data = await response.json();
            setDepartamentos(data);
        } catch (error) {
            console.error('Error al cargar departamentos:', error);
        } finally {
            setLoadingDepartamentos(false);
        }
    };

    const cargarProvincias = async (departamentoId) => {
        setLoadingProvincias(true);
        try {
            const response = await fetch(`/api/provincias/${departamentoId}`);
            const data = await response.json();
            setProvincias(data);
        } catch (error) {
            console.error('Error al cargar provincias:', error);
        } finally {
            setLoadingProvincias(false);
        }
    };

    const cargarDistritos = async (departamentoId, provinciaId) => {
        setLoadingDistritos(true);
        try {
            const response = await fetch(`/api/distritos/${departamentoId}/${provinciaId}`);
            const data = await response.json();
            setDistritos(data);
        } catch (error) {
            console.error('Error al cargar distritos:', error);
        } finally {
            setLoadingDistritos(false);
        }
    };

    // Método público para setear valores desde fuera (cuando se consulta RUC)
    useEffect(() => {
        if (value.ubigeo && value.ubigeo.length === 6 && value.ubigeo !== ubigeo) {
            const dept = value.ubigeo.substring(0, 2);
            const prov = value.ubigeo.substring(2, 4);
            const dist = value.ubigeo.substring(4, 6);
            
            // Cargar en cascada: departamento -> provincia -> distrito
            const cargarCascada = async () => {
                setIsAutoCompleting(true);
                
                try {
                    // 1. Setear departamento
                    setSelectedDepartamento(dept);
                    
                    // 2. Cargar y setear provincia
                    const respProvincias = await fetch(`/api/provincias/${dept}`);
                    const dataProvincias = await respProvincias.json();
                    setProvincias(dataProvincias);
                    
                    // Esperar a que React actualice el DOM
                    await new Promise(resolve => setTimeout(resolve, 100));
                    setSelectedProvincia(prov);
                    
                    // 3. Cargar y setear distrito
                    const respDistritos = await fetch(`/api/distritos/${dept}/${prov}`);
                    const dataDistritos = await respDistritos.json();
                    setDistritos(dataDistritos);
                    
                    // Esperar a que React actualice el DOM
                    await new Promise(resolve => setTimeout(resolve, 100));
                    setSelectedDistrito(dist);
                    
                    setUbigeo(value.ubigeo);
                    
                    // Notificar al padre con los nombres completos
                    const deptNombre = departamentos.find(d => d.departamento === dept)?.nombre || "";
                    const provNombre = dataProvincias.find(p => p.provincia === prov)?.nombre || "";
                    const distNombre = dataDistritos.find(d => d.distrito === dist)?.nombre || "";
                    
                    onChange?.({
                        departamento: dept,
                        provincia: prov,
                        distrito: dist,
                        ubigeo: value.ubigeo,
                        departamentoNombre: deptNombre,
                        provinciaNombre: provNombre,
                        distritoNombre: distNombre,
                    });
                } catch (error) {
                    console.error('[UBIGEO] Error al cargar ubicación:', error);
                } finally {
                    setIsAutoCompleting(false);
                }
            };
            
            cargarCascada();
        }
    }, [value.ubigeo, ubigeo, departamentos, onChange]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Departamento */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Departamento
                </label>
                <div className="relative">
                    <Select
                        value={selectedDepartamento}
                        onValueChange={setSelectedDepartamento}
                        disabled={disabled || loadingDepartamentos}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione departamento" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px] overflow-y-auto">
                            {departamentos.map((dept) => (
                                <SelectItem key={dept.id_ubigeo} value={dept.departamento}>
                                    {dept.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {loadingDepartamentos && (
                        <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                    )}
                </div>
                {errors.departamento && (
                    <p className="text-sm text-red-600">{errors.departamento}</p>
                )}
            </div>

            {/* Provincia */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Provincia
                </label>
                <div className="relative">
                    <Select
                        value={selectedProvincia}
                        onValueChange={setSelectedProvincia}
                        disabled={disabled || !selectedDepartamento || loadingProvincias}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione provincia" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px] overflow-y-auto">
                            {provincias.map((prov) => (
                                <SelectItem key={prov.id_ubigeo} value={prov.provincia}>
                                    {prov.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {loadingProvincias && (
                        <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                    )}
                </div>
                {errors.provincia && (
                    <p className="text-sm text-red-600">{errors.provincia}</p>
                )}
            </div>

            {/* Distrito */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Distrito
                </label>
                <div className="relative">
                    <Select
                        value={selectedDistrito}
                        onValueChange={setSelectedDistrito}
                        disabled={disabled || !selectedProvincia || loadingDistritos}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione distrito" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px] overflow-y-auto">
                            {distritos.map((dist) => (
                                <SelectItem key={dist.id_ubigeo} value={dist.distrito}>
                                    {dist.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {loadingDistritos && (
                        <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                    )}
                </div>
                {errors.distrito && (
                    <p className="text-sm text-red-600">{errors.distrito}</p>
                )}
            </div>

            {/* Ubigeo (oculto pero se guarda en DB) */}
            <input type="hidden" value={ubigeo} />
        </div>
    );
}
