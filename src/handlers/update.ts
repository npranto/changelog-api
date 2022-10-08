import flatten from "lodash.flatten";
import prisma from "../db";

export const getUpdates = async (req, res) => {
  const products =
    (await prisma.product.findMany({
      where: {
        belongsToId: req.user.id,
      },
      include: {
        updates: true,
      },
    })) || null;

  if (!products) {
    return res.status(200).json({
      data: [],
    });
  }

  const updates = flatten(products.map((product) => product?.updates || []));

  return res.status(200).json({
    data: updates,
  });
};
export const getUpdate = async (req, res) => {
  const products =
    (await prisma.product.findMany({
      where: {
        belongsToId: req.user.id,
      },
      include: {
        updates: true,
      },
    })) || null;

  if (!products) {
    return res.status(200).json({
      data: null,
    });
  }

  const updates = flatten(products.map((product) => product?.updates || []));

  const matchingUpdate = updates.find((update) => {
    return update.id === req.params.id;
  });

  if (!matchingUpdate) {
    return res.status(200).json({
      data: null,
    });
  }

  return res.status(200).json({
    data: matchingUpdate,
  });
};
export const createUpdate = async (req, res) => {
  const product =
    (await prisma.product.findFirst({
      where: {
        id: req.body.productId,
        belongsToId: req.user.id,
      },
    })) || null;

  if (!product) {
    return res.status(401).json({
      error: "Passed `productId` does not belong to you",
    });
  }

  const update =
    (await prisma.update.create({
      data: req.body,
    })) || null;

  if (!update) {
    return res.status(500).json({
      error: "Unable to create update at the moment",
    });
  }

  return res.status(201).json({
    data: update,
  });
};
export const updateUpdate = async (req, res) => {
  const products =
    (await prisma.product.findMany({
      where: {
        belongsToId: req.user.id,
      },
      include: {
        updates: true,
      },
    })) || null;

  if (!products) {
    return res.status(200).json({
      error: "You do not have any updates to update",
    });
  }

  const updates = flatten(products.map((product) => product?.updates || []));

  const matchingUpdate = updates.find((update) => {
    return update.id === req.params?.id;
  });

  if (!matchingUpdate) {
    return res.status(200).json({
      data: `No updates exist with id - [${req.params.id}]`,
    });
  }

  const updatedUpdate =
    (await prisma.update.update({
      where: {
        id: req.params?.id,
      },
      data: req.body,
    })) || null;

  if (!updatedUpdate) {
    return res.status(500).json({
      error: "Unable to update an update at the moment",
    });
  }

  return res.status(200).json({
    data: updatedUpdate,
  });
};

export const deleteUpdate = async (req, res) => {
  const products =
    (await prisma.product.findMany({
      where: {
        belongsToId: req.user.id,
      },
      include: {
        updates: true,
      },
    })) || null;

  if (!products) {
    return res.status(200).json({
      error: "You do not have any updates to delete",
    });
  }

  const updates = flatten(products.map((product) => product?.updates || []));

  const matchingUpdate = updates.find((update) => {
    return update.id === req.params?.id;
  });

  if (!matchingUpdate) {
    return res.status(200).json({
      data: `No updates exist with id - [${req.params.id}]`,
    });
  }

  const updatedUpdate =
    (await prisma.update.delete({
      where: {
        id: req.params?.id,
      },
    })) || null;

  if (!updatedUpdate) {
    return res.status(500).json({
      error: "Unable to update an update at the moment",
    });
  }

  return res.status(200).json({
    data: updatedUpdate,
  });
};
