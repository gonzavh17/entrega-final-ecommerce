import productModel from '../models/products.model.js'
import EErrors from '../services/errors/enums.js';
import CustomError from '../services/errors/CustomErrors.js';

import { generateProductErrorInfo } from '../services/errors/info.js';

const getProducts = async (req, res) => {
  const { limit, page, sort, category, status } = req.query;
  let sortOption;
  sort == "asc" && (sortOption = "price");
  sort == "desc" && (sortOption = "-price");

 const options = {
  limit: limit || 10,
  page: page || 1,
  sort: sortOption || null,
}

  const query = {};
	category && (query.category = category);
	status && (query.status = status);

	try {
		const prods = await productModel.paginate(query, options);
		res.status(200).send({ resultado: 'OK', message: prods });
	} catch (error) {
		res.status(400).send({ error: `Error al consultar productos: ${error}` });
	}
}

const getProduct = async (req, res) => {
  const { pid } = req.params;

  try {
    const prod = await productModel.findById(pid);
    if (prod) res.status(200).send({ resultado: "OK", message: prod });
    else res.status(404).send({ resultado: "Not Found", message: prod });
  } catch (error) {
    res.status(500).send({ error: `Error al consultar productos ${error}` });
  }
}

const validateProductData = (req, res, next) => {
  const { title, description, price, stock, code, category } = req.body;
  try {
      if (!title || !description || !price || !stock || !code || !category) {
          CustomError.createError({
              name: "Product creation error",
              cause: generateProductErrorInfo({ title, description, price, stock, code, category }),
              message: "One or more properties were incomplete or not valid.",
              code: EErrors.INVALID_PRODUCT_ERROR
          })
      }
      next();
  } catch (error) {
      next(error);
  }
}

const postProduct = async (req, res) => {
  const { title, description, price, thumbnail, stock, code, category, status } = req.body;

  try {
    const respuesta = await productModel.create({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    });

    res.status(201).send({ resultado: 'OK', message: 'Producto creado exitosamente', data: respuesta });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).send({ error: 'Error interno al crear producto' });
  }
};

const putProduct = async (req, res) => {
  const { pid } = req.params;
  const { title, description, stock, code, price, category, status } = req.body;

  try {
    const respuesta = await productModel.findByIdAndUpdate(pid, {
      title,
      description,
      stock,
      code,
      price,
      category,
      status,
    });
    if (prod) res.status(200).send({ resultado: "OK", message: respuesta });
    else res.status(404).send({ resultado: "Not Found", message: respuesta });
  } catch (error) {
    res.status(400).send({ error: `Error al consultar productos ${error}` });
  }
}

const deleteProduct = async (req, res) => {
  const { pid } = req.params;

  try {
    const respuesta = await productModel.findByIdAndDelete(pid);

    if (prod) res.status(200).send({ resultado: "OK", message: respuesta });
    else res.status(404).send({ resultado: "Not Found", message: respuesta });
  } catch (error) {
    res.status(400).send({ error: `Error al consultar productos ${error}` });
  }
}

const productsController = {
  getProducts,
	getProduct,
	postProduct,
	putProduct,
	deleteProduct,
  validateProductData
}

export default productsController