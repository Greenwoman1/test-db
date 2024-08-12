const fakePromise = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ name: 'Test' });
        }, 1000);
    });
}

const orgObj = {
    items: [
        {
            id: 1,
            type: 'combo',
            location: 1,
            quantity: 1,
            options: [1, 2, 3],
            topons: [
                {
                    id: 1,
                    quantity: 1,
                },
                {
                    id: 1,
                    quantity: 1,
                }
            ]
        }
    ]
}


const func = async () => {

    const promises = []
    for (const item of orgObj.items) {

        const tempPromise = fakePromise().then(res => {
            item.data = res;
            return res;
        });
        promises.push(tempPromise);

        for (let topon of item.topons) {

            const tempPromise = fakePromise().then(res => {
                topon.data = res;
                return res;
            });
            promises.push(tempPromise);
        }
    }

    await Promise.all(promises)

    console.log(2)

    console.log(orgObj)

    orgObj.items.forEach(item => {
        console.log(item.data)
    });

}

func()



const singleProductIngredientPromise = (id, orderId) => {
  return new Promise((resolve, reject) => {
    VariantLocation.findOne({
      where: { id: id },
      attributes: ['id'],
      include: [
        {
          model: VariantIngredient,
          required: false,
          attributes: ['id'],
        }
      ]
    })
    .then(async (Ingredient) => {
      const ingredientPromises = Ingredient.VariantIngredient.map(ingredient => 
        OrderItemIngredient.create({ OrderItemId: orderId, VariantIngredientId: ingredient.id })
      );
      
      try {
        await Promise.all(ingredientPromises);
        resolve();
      } catch (err) {
        reject(err);
      }
    })
    .catch((err) => reject(err));
  });
};

const comboProductIngredientPromise = (id, orderId) => {
  return new Promise((resolve, reject) => {
    VariantLocation.findOne({
      where: { id: id },
      attributes: ['id'],
      include: [
        {
          model: Variant,
          as: 'VarLoc',
          attributes: ['id'],
          include: [{
            model: LinkedVariant,
            required: false,
            attributes: ['id'],
            include: [{
              model: VariantLocation,
              attributes: ['id'],
              include: [
                {
                  required: false,
                  attributes: ['id'],
                  model: VariantIngredient
                }]
            }]
          }],
        }
      ]
    })
    .then(async (variantLocationsInOrderItem) => {
      const promises = variantLocationsInOrderItem.VarLoc.LinkedVariant.map(vl => {
        const ingredientPromises = vl.VariantLocation.VariantIngredient.map(ingredient => 
          OrderItemIngredient.create({ OrderItemId: orderId, VariantIngredientId: ingredient.id })
        );
        return Promise.all(ingredientPromises);
      });

      try {
        await Promise.all(promises);
        resolve();
      } catch (err) {
        reject(err);
      }
    })
    .catch((err) => reject(err));
  });
};

const processOrderItemIngredient = async (pType, item, OI) => {
  try {
    switch (pType.type) {
      case 'single':
        await singleProductIngredientPromise(item.vlId, OI.id);
        break;

      case 'combo':
        await comboProductIngredientPromise(item.vlId, OI.id);
        break;
    }
  } catch (err) {
    console.error(err);
  }
};

// Usage
const ingredientPromises = [];

// Assuming pType, item, and OI are already defined and available
ingredientPromises.push(processOrderItemIngredient(pType, item, OI));

Promise.all(ingredientPromises)
  .then(() => {
    console.log('All Ingredient processed successfully.');
  })
  .catch((err) => {
    console.error('Error processing Ingredient:', err);
  });
