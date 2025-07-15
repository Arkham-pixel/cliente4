import Siniestro from '../models/CasoComplex.js';
import Responsable from '../models/Responsable.js';
import FuncionarioAseguradora from '../models/FuncionarioAseguradora.js';

export const crearSiniestro = async (req, res) => {
  try {
    const nuevoSiniestro = new Siniestro(req.body);
    await nuevoSiniestro.save();
    res.status(201).json(nuevoSiniestro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los siniestros con paginación y búsqueda
export const obtenerSiniestros = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const query = {};
    // Construir filtros dinámicamente
    Object.keys(filters).forEach((key) => {
      if (filters[key]) query[key] = { $regex: filters[key], $options: 'i' };
    });
    const siniestros = await Siniestro.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Siniestro.countDocuments(query);
    res.json({ total, page: Number(page), limit: Number(limit), siniestros });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener siniestros', error });
  }
};

// Obtener un siniestro por ID
export const obtenerSiniestroPorId = async (req, res) => {
  try {
    const siniestro = await Siniestro.findById(req.params.id);
    if (!siniestro) return res.status(404).json({ mensaje: 'No encontrado' });
    res.json(siniestro);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar siniestro', error });
  }
};

// Actualizar un siniestro por ID (todos los campos)
export const actualizarSiniestro = async (req, res) => {
  try {
    const siniestro = await Siniestro.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!siniestro) return res.status(404).json({ mensaje: 'No encontrado' });
    res.json(siniestro);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar siniestro', error });
  }
};

// Eliminar un siniestro por ID
export const eliminarSiniestro = async (req, res) => {
  try {
    const siniestro = await Siniestro.findByIdAndDelete(req.params.id);
    if (!siniestro) return res.status(404).json({ mensaje: 'No encontrado' });
    res.json({ mensaje: 'Siniestro eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar siniestro', error });
  }
};

// Obtener siniestros con información de responsables y funcionarios (JOIN)
export const obtenerSiniestrosConResponsables = async (req, res) => {
  try {
    console.log('🔍 Iniciando obtenerSiniestrosConResponsables...');
    const { page = 1, limit = 10, ...filters } = req.query;
    
    // Construir filtros dinámicamente
    const matchStage = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) matchStage[key] = { $regex: filters[key], $options: 'i' };
    });

    console.log('🔍 Filtros aplicados:', matchStage);

    // Pipeline SOLO con responsables (funcionaba antes)
    const pipeline = [
      // Match stage para filtros
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      
      // Lookup para unir con la colección de responsables
      {
        $lookup: {
          from: 'gsk3cAppresponsable',
          let: { codiResp: { $toString: '$codiRespnsble' } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$codiRespnsble', '$$codiResp'] }
              }
            }
          ],
          as: 'responsableInfo'
        }
      },
      
      // Unwind para aplanar el array de responsableInfo
      {
        $unwind: {
          path: '$responsableInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      
      // Agregar campos con nombres
      {
        $addFields: {
          nombreResponsable: {
            $cond: {
              if: { $ne: ['$responsableInfo.nmbrRespnsble', null] },
              then: '$responsableInfo.nmbrRespnsble',
              else: 'Sin asignar'
            }
          },
          nombreFuncionario: 'Sin asignar' // Temporalmente fijo
        }
      },
      
      // Proyectar solo los campos que necesitamos
      {
        $project: {
          responsableInfo: 0
        }
      }
    ];

    console.log('🔍 Pipeline creado:', JSON.stringify(pipeline, null, 2));

    // Agregar paginación
    const skip = (page - 1) * limit;
    pipeline.push(
      { $skip: skip },
      { $limit: Number(limit) }
    );

    // Obtener total para paginación
    const totalPipeline = [
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      { $count: 'total' }
    ];

    console.log('🔍 Ejecutando agregación...');
    const [siniestros, totalResult] = await Promise.all([
      Siniestro.aggregate(pipeline),
      Siniestro.aggregate(totalPipeline)
    ]);

    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    // Debug: Log para verificar los datos
    console.log('🔍 Debug - Total siniestros encontrados:', siniestros.length);
    console.log('🔍 Debug - Total para paginación:', total);
    
    if (siniestros.length > 0) {
      console.log('🔍 Debug - Primer siniestro:', {
        _id: siniestros[0]._id,
        codiRespnsble: siniestros[0].codiRespnsble,
        nombreResponsable: siniestros[0].nombreResponsable,
        nmroSinstro: siniestros[0].nmroSinstro
      });
      
      // Verificar algunos más
      siniestros.slice(1, 3).forEach((s, i) => {
        console.log(`🔍 Debug - Siniestro ${i + 2}:`, {
          codiRespnsble: s.codiRespnsble,
          nombreResponsable: s.nombreResponsable
        });
      });
    }

    console.log('🔍 Enviando respuesta al frontend...');
    res.json({ 
      total, 
      page: Number(page), 
      limit: Number(limit), 
      siniestros 
    });
  } catch (error) {
    console.error('Error en obtenerSiniestrosConResponsables:', error);
    res.status(500).json({ mensaje: 'Error al obtener siniestros con responsables', error: error.message });
  }
};

// Endpoint de prueba para verificar el JOIN
export const probarJoin = async (req, res) => {
  try {
    // Obtener algunos siniestros sin JOIN
    const siniestrosSinJoin = await Siniestro.find().limit(3);
    console.log('🔍 Siniestros sin JOIN:', siniestrosSinJoin.map(s => ({
      _id: s._id,
      codiRespnsble: s.codiRespnsble,
      funcAsgrdra: s.funcAsgrdra,
      nmro_sinstro: s.nmro_sinstro
    })));

    // Obtener algunos responsables
    const responsables = await Responsable.find().limit(3);
    console.log('🔍 Responsables disponibles:', responsables.map(r => ({
      _id: r._id,
      codiRespnsble: r.codiRespnsble,
      nmbrRespnsble: r.nmbrRespnsble
    })));

    // Obtener algunos funcionarios
    const funcionarios = await FuncionarioAseguradora.find().limit(3);
    console.log('🔍 Funcionarios disponibles:', funcionarios.map(f => ({
      _id: f._id,
      codiAsgrdra: f.codiAsgrdra,
      nmbrFuncionario: f.nmbrFuncionario,
      email: f.email
    })));

    // Probar el JOIN con un solo documento
    const pipeline = [
      { $limit: 1 },
      {
        $lookup: {
          from: 'gsk3cAppresponsable',
          localField: 'codiRespnsble',
          foreignField: 'codiRespnsble',
          as: 'responsableInfo'
        }
      },
      {
        $lookup: {
          from: 'gsk3cAppcontactoscli',
          let: { funcId: { $toString: '$funcAsgrdra' } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$id', '$$funcId'] }
              }
            }
          ],
          as: 'funcionarioInfo'
        }
      },
      {
        $unwind: {
          path: '$responsableInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$funcionarioInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          nombreResponsable: '$responsableInfo.nmbrRespnsble',
          nombreFuncionario: '$funcionarioInfo.nmbrContcto'
        }
      }
    ];

    const resultadoJoin = await Siniestro.aggregate(pipeline);
    console.log('🔍 Resultado del JOIN:', resultadoJoin);

    res.json({
      siniestrosSinJoin: siniestrosSinJoin.map(s => ({
        _id: s._id,
        codiRespnsble: s.codiRespnsble,
        funcAsgrdra: s.funcAsgrdra,
        nmro_sinstro: s.nmro_sinstro
      })),
      responsables: responsables.map(r => ({
        _id: r._id,
        codiRespnsble: r.codiRespnsble,
        nmbrRespnsble: r.nmbrRespnsble
      })),
      funcionarios: funcionarios.map(f => ({
        _id: f._id,
        id: f.id,
        codiAsgrdra: f.codiAsgrdra,
        nmbrContcto: f.nmbrContcto,
        email: f.email
      })),
      resultadoJoin
    });
  } catch (error) {
    console.error('Error en probarJoin:', error);
    res.status(500).json({ mensaje: 'Error al probar JOIN', error: error.message });
  }
};

// Endpoint específico para verificar funcionarios
export const verificarFuncionarios = async (req, res) => {
  try {
    // Obtener algunos funcionarios para ver la estructura
    const funcionarios = await FuncionarioAseguradora.find().limit(5);
    console.log('🔍 Estructura de funcionarios:', funcionarios);
    
    // Obtener algunos siniestros para ver los IDs de funcionarios
    const siniestros = await Siniestro.find().limit(5);
    console.log('🔍 IDs de funcionarios en siniestros:', siniestros.map(s => s.funcAsgrdra));
    
    // Probar JOIN manual con el nuevo enfoque
    const pipeline = [
      { $limit: 1 },
      {
        $lookup: {
          from: 'gsk3cAppcontactoscli',
          let: { funcId: { $toString: '$funcAsgrdra' } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$id', '$$funcId'] }
              }
            }
          ],
          as: 'funcionarioInfo'
        }
      }
    ];
    
    const resultado = await Siniestro.aggregate(pipeline);
    console.log('🔍 Resultado del JOIN manual:', resultado);
    
    res.json({
      funcionarios: funcionarios.map(f => ({
        _id: f._id,
        id: f.id,
        codiAsgrdra: f.codiAsgrdra,
        nmbrContcto: f.nmbrContcto,
        email: f.email
      })),
      funcAsgrdraEnSiniestros: siniestros.map(s => s.funcAsgrdra),
      resultadoJoin: resultado
    });
  } catch (error) {
    console.error('Error en verificarFuncionarios:', error);
    res.status(500).json({ mensaje: 'Error al verificar funcionarios', error: error.message });
  }
};

// Endpoint básico sin JOIN para verificar datos
export const obtenerSiniestrosBasicos = async (req, res) => {
  try {
    console.log('🔍 Iniciando endpoint básico...');
    
    // Verificar que el modelo existe
    console.log('🔍 Modelo Siniestro:', typeof Siniestro);
    console.log('🔍 Modelo Siniestro.find:', typeof Siniestro.find);
    
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    console.log('🔍 Intentando obtener siniestros básicos...');
    console.log('🔍 Parámetros - page:', page, 'limit:', limit, 'skip:', skip);
    
    // Intentar obtener solo 1 documento primero
    const primerSiniestro = await Siniestro.findOne();
    console.log('🔍 Primer siniestro encontrado:', primerSiniestro ? 'SÍ' : 'NO');
    
    if (!primerSiniestro) {
      console.log('🔍 No se encontraron siniestros en la base de datos');
      return res.json({
        total: 0,
        page: Number(page),
        limit: Number(limit),
        siniestros: []
      });
    }
    
    const siniestros = await Siniestro.find()
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Siniestro.countDocuments();
    
    console.log('🔍 Siniestros básicos encontrados:', siniestros.length);
    console.log('🔍 Total en BD:', total);
    
    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      siniestros
    });
  } catch (error) {
    console.error('Error en obtenerSiniestrosBasicos:', error);
    console.error('Error completo:', error.stack);
    res.status(500).json({ 
      mensaje: 'Error al obtener siniestros básicos', 
      error: error.message,
      stack: error.stack 
    });
  }
};

// Endpoint de prueba simple para verificar si hay datos
export const probarDatosSimples = async (req, res) => {
  try {
    // Obtener siniestros sin JOIN
    const siniestrosSinJoin = await Siniestro.find().limit(3);
    console.log('🔍 Siniestros sin JOIN:', siniestrosSinJoin.length);
    
    // Probar JOIN solo con responsables (sin funcionarios)
    const pipelineSoloResponsables = [
      { $limit: 3 },
      {
        $lookup: {
          from: 'gsk3cAppresponsable',
          localField: 'codiRespnsble',
          foreignField: 'codiRespnsble',
          as: 'responsableInfo'
        }
      },
      {
        $unwind: {
          path: '$responsableInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          nombreResponsable: '$responsableInfo.nmbrRespnsble'
        }
      }
    ];
    
    const resultadoSoloResponsables = await Siniestro.aggregate(pipelineSoloResponsables);
    console.log('🔍 Resultado solo responsables:', resultadoSoloResponsables.length);
    
    // Probar el endpoint actual
    const pipelineActual = [
      { $limit: 3 },
      {
        $lookup: {
          from: 'gsk3cAppresponsable',
          localField: 'codiRespnsble',
          foreignField: 'codiRespnsble',
          as: 'responsableInfo'
        }
      },
      {
        $unwind: {
          path: '$responsableInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          nombreResponsable: '$responsableInfo.nmbrRespnsble',
          nombreFuncionario: 'Sin asignar'
        }
      },
      {
        $project: {
          responsableInfo: 0
        }
      }
    ];
    
    const resultadoActual = await Siniestro.aggregate(pipelineActual);
    console.log('🔍 Resultado actual:', resultadoActual.length);
    
    res.json({
      siniestrosSinJoin: siniestrosSinJoin.length,
      resultadoSoloResponsables: resultadoSoloResponsables.length,
      resultadoActual: resultadoActual.length,
      primerSiniestro: siniestrosSinJoin[0],
      primerConResponsable: resultadoSoloResponsables[0],
      primerActual: resultadoActual[0]
    });
  } catch (error) {
    console.error('Error en probarDatosSimples:', error);
    res.status(500).json({ mensaje: 'Error al probar datos', error: error.message });
  }
};

// Endpoint de prueba simple para responsables
export const probarResponsables = async (req, res) => {
  try {
    console.log('🔍 Probando JOIN con responsables...');
    
    // Obtener un siniestro
    const siniestro = await Siniestro.findOne();
    console.log('🔍 Siniestro encontrado:', {
      _id: siniestro?._id,
      codiRespnsble: siniestro?.codiRespnsble
    });

    // Obtener un responsable
    const responsable = await Responsable.findOne();
    console.log('🔍 Responsable encontrado:', {
      _id: responsable?._id,
      codiRespnsble: responsable?.codiRespnsble,
      nmbrRespnsble: responsable?.nmbrRespnsble
    });

    // Probar el JOIN simple
    const pipeline = [
      { $limit: 1 },
      {
        $lookup: {
          from: 'gsk3cAppresponsable',
          localField: 'codiRespnsble',
          foreignField: 'codiRespnsble',
          as: 'responsableInfo'
        }
      },
      {
        $unwind: {
          path: '$responsableInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          nombreResponsable: '$responsableInfo.nmbrRespnsble'
        }
      }
    ];

    const resultado = await Siniestro.aggregate(pipeline);
    console.log('🔍 Resultado del JOIN:', resultado);

    res.json({
      siniestro: siniestro ? {
        _id: siniestro._id,
        codiRespnsble: siniestro.codiRespnsble
      } : null,
      responsable: responsable ? {
        _id: responsable._id,
        codiRespnsble: responsable.codiRespnsble,
        nmbrRespnsble: responsable.nmbrRespnsble
      } : null,
      resultadoJoin: resultado
    });
  } catch (error) {
    console.error('Error en probarResponsables:', error);
    res.status(500).json({ mensaje: 'Error al probar responsables', error: error.message });
  }
};
