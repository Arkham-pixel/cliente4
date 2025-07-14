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
    const { page = 1, limit = 10, ...filters } = req.query;
    
    // Construir filtros dinámicamente
    const matchStage = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) matchStage[key] = { $regex: filters[key], $options: 'i' };
    });

    const pipeline = [
      // Match stage para filtros
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      
      // Lookup para unir con la colección de responsables
      {
        $lookup: {
          from: 'gsk3cAppresponsable',
          localField: 'codiRespnsble',
          foreignField: 'codiRespnsble',
          as: 'responsableInfo'
        }
      },
      
      // Lookup para unir con la colección de funcionarios de aseguradora
      // Cambiamos para usar codiAsgrdra en lugar de id
      {
        $lookup: {
          from: 'gsk3cAppcontactoscli',
          localField: 'codiAsgrdra',
          foreignField: 'codiAsgrdra',
          as: 'funcionarioInfo'
        }
      },
      
      // Unwind para aplanar el array de responsableInfo
      {
        $unwind: {
          path: '$responsableInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      
      // Unwind para aplanar el array de funcionarioInfo
      {
        $unwind: {
          path: '$funcionarioInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      
      // Agregar campos con nombres
      {
        $addFields: {
          nombreResponsable: '$responsableInfo.nmbrRespnsble',
          nombreFuncionario: '$funcionarioInfo.nmbrFuncionario'
        }
      },
      
      // Proyectar solo los campos que necesitamos
      {
        $project: {
          responsableInfo: 0,
          funcionarioInfo: 0
        }
      }
    ];

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

    const [siniestros, totalResult] = await Promise.all([
      Siniestro.aggregate(pipeline),
      Siniestro.aggregate(totalPipeline)
    ]);

    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    // Debug: Log para verificar los datos
    console.log('🔍 Debug - Primer siniestro:', siniestros[0]);
    console.log('🔍 Debug - Campos disponibles:', Object.keys(siniestros[0] || {}));
    
    // Debug específico para funcionarios
    if (siniestros.length > 0) {
      console.log('🔍 Debug - codiAsgrdra del primer siniestro:', siniestros[0].codiAsgrdra);
      console.log('🔍 Debug - nombreFuncionario del primer siniestro:', siniestros[0].nombreFuncionario);
      
      // Verificar si hay funcionarios en la base de datos
      const funcionarios = await FuncionarioAseguradora.find({ codiAsgrdra: siniestros[0].codiAsgrdra });
      console.log('🔍 Debug - Funcionarios encontrados con codiAsgrdra', siniestros[0].codiAsgrdra, ':', funcionarios);
    }

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
          localField: 'codiAsgrdra',
          foreignField: 'codiAsgrdra',
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
          nombreFuncionario: '$funcionarioInfo.nmbrFuncionario'
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
        codiAsgrdra: f.codiAsgrdra,
        nmbrFuncionario: f.nmbrFuncionario,
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
    
    // Probar JOIN manual
    const pipeline = [
      { $limit: 1 },
      {
        $lookup: {
          from: 'gsk3cAppcontactoscli',
          localField: 'codiAsgrdra',
          foreignField: 'codiAsgrdra',
          as: 'funcionarioInfo'
        }
      }
    ];
    
    const resultado = await Siniestro.aggregate(pipeline);
    console.log('🔍 Resultado del JOIN manual:', resultado);
    
    res.json({
      funcionarios: funcionarios.map(f => ({
        _id: f._id,
        codiAsgrdra: f.codiAsgrdra,
        nmbrFuncionario: f.nmbrFuncionario,
        email: f.email
      })),
      codiAsgrdraEnSiniestros: siniestros.map(s => s.codiAsgrdra),
      resultadoJoin: resultado
    });
  } catch (error) {
    console.error('Error en verificarFuncionarios:', error);
    res.status(500).json({ mensaje: 'Error al verificar funcionarios', error: error.message });
  }
};
