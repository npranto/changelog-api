import prisma from "../db";

// Get a list of all the products for current user
export const getProducts = async (req, res) => {
  const user =
    (await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        products: true,
      },
    })) || null;

  if (!user || !user.products) {
    return res.status(404).json({
      error: "Unable to get all user products at the moment",
    });
  }

  return res.status(200).json({
    data: user?.products,
  });
};

// Get product by id for current user
export const getProduct = async (req, res) => {
  const product = await prisma.product.findFirst({
    where: {
      id: req.params.id,
      belongsToId: req.user.id,
    },
  });

  if (!product) {
    return res.status(404).json({
      error: `No product found with id [${req.params.id}]`,
    });
  }

  return res.status(200).json({
    data: product,
  });
};

// Create product for current user
export const createProduct = async (req, res) => {
  const { name } = req.body;

  const product = await prisma.product.create({
    data: {
      name,
      belongsToId: req.user.id,
    },
  });

  return res.status(201).json({
    product,
  });
};
// Update product for current user
export const updateProduct = async (req, res) => {
  const updatedProduct = await prisma.product.update({
    where: {
      id_belongsToId: {
        id: req.params.id,
        belongsToId: req.user.id,
      },
    },
    data: {
      name: req.body.name,
    },
  });

  return res.status(200).json({
    data: {
      product: updatedProduct,
    },
  });
};
// Delete product for current user
export const deleteProduct = async (req, res) => {
  const deletedProduct = await prisma.product.delete({
    where: {
      id_belongsToId: {
        id: req.params.id,
        belongsToId: req.user.id,
      },
    },
  });

  return res.status(202).json({
    data: {
      product: deletedProduct,
    },
  });
};
