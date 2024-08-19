const { name } = require('ejs');
const { getOrderDetails, getOrderSKURules, createOrderJson, updateSKU } = require('./Order/utils');
const { Product, Variant, Topon, GroupOption, Option, GroupRule, SKU, SKURule, Location, ComboVariants, GroupOptions, GroupTopons, PriceHistory, Order, ProductO, ProductT, OrderItemCombo, User, Balance, WarehouseLocation, Warehouse, VariantSKURule, VariantLocation, VariantIngredient, GroupTopon, GroupToponsMid, LinkedVariant, ToponSKURule, ToponLocation, IngredientLocation, UserPayment, UserLocation, OrderItemOption, OrderItemTopons, Category, IngredientSKURule, OrderItem, VariantPrice, Ingredient, Role, Permissions, UserRole, UserPermission, RolePermission } = require('./index');

const { Op, fn, col, literal } = require('sequelize');
const client = require('../clients/elastics');






const createLocation = async (name) => {
  return await Location.create({ name: name });
}

const createProductVariant = async (variant, product) => {
  return await Variant.create({ name: variant, ProductId: product.id });
}

const createCategory = async (name, parent = null) => {
  return await Category.create({ name: name, ParentId: parent });
}



const createProduct = async (name, variants, type = 'single', category) => {
  const product = await Product.create({ name: name, type, description: 'description', CategoryId: category });

  const var1 = await createProductVariant(variants[0], product);
  const var2 = await createProductVariant(variants[1], product);

  return [product, [var1, var2]];
}



const createWarehouse = async (names) => {


  const sku1 = await Warehouse.create({ name: names[0] });
  const sku2 = await Warehouse.create({ name: names[1] });

  return [sku1, sku2];
}



const createSKUs = (name, warehouses) => {
  const skuPromises = warehouses.map(warehouse => {
    return SKU.create({ name: name, WarehouseId: warehouse.id, allowMinus: false, stock: 50 });
  });

  return Promise.all(skuPromises);
};


const addVariantToLocation = async (variant, location, sku) => {

  const vl = await VariantLocation.create({ LocationId: location.id, VariantId: variant.id, disabled: false }); 77
  let skuVariantRule
  if (sku) {
    skuVariantRule = await VariantSKURule.create({ VariantLocationId: vl.id, SKUId: sku.id, unit: 'g', quantity: 1, disabled: false, name: variant.name });
    return [vl, skuVariantRule];
  }


  return [vl];
}

const addWarehouseToLocations = async (warehouses, location) => {

  const locations = warehouses.map(warehouse => {
    return WarehouseLocation.create({ WarehouseId: warehouse.id, LocationId: location.id });
  })
}

const createTopons = async (names) => {
  const toponPromises = names.map(name => {
    return Topon.create({ name: name });
  })

  return Promise.all(toponPromises);

}


const addToponToLocations = async (topons, location) => {
  const locations = topons.map(topon => {
    return ToponLocation.create({ ToponId: topon.id, LocationId: location.id });
  })

  return Promise.all(locations);
}


const createGroup = async (name, variantLocation) => {
  return await GroupTopon.create({ name: name, VariantLocationId: variantLocation.id, rules: "{select: multipleselect}" });
}

const addToponToVariantLocation = async (group, toponLocation, sku) => {

  const gtm = await GroupToponsMid.create({ ToponLocationId: toponLocation.id, GroupToponId: group.id, min: 0, max: 10, default: 0, disabled: false });
  const sr = await ToponSKURule.create({ GroupToponMidId: gtm.id, SKUId: sku.id, unit: 'g', quantity: 1, disabled: false, name: sku.name });


  return gtm
}

const createGroupOptions = async (name, variantLocation) => {
  return await GroupOptions.create({ name: name, VariantLocationId: variantLocation.id, rules: "{select: multipleselect}" });
}

const addOptionToVariantLocation = async (group, options) => {

  for (const option of options) {

    await Option.create({ name: option, GroupOptionId: group.id });
  }

}


const createIngredient = async (names) => {

  const ingredientPromises = names.map(name => {
    return Ingredient.create({ name: name });
  })


  return Promise.all(ingredientPromises);

}


const addIngredientToLocation = async (ingredient, locations) => {

  const ingredientPromises = locations.map(location => {
    return IngredientLocation.create({ LocationId: location.id, IngredientId: ingredient.id });
  })


  return Promise.all(ingredientPromises);

}


const addIngredientToVariant = async (locationIngredient, variantLocation, sku, IngredientDisabled = false) => {

  const vi = await VariantIngredient.create({ IngredientLocationId: locationIngredient.id, VariantLocationId: variantLocation.id });
  const sr = await IngredientSKURule.create({ VariantIngredientId: vi.id, SKUId: sku.id, unit: 'g', quantity: 1, disabled: IngredientDisabled, name: sku.name });


}


const addVariantsToComboVariant = async (variant, variantLocations) => {
  const var1 = await LinkedVariant.create({ VariantId: variant.id, VariantLocationId: variantLocations[0].id });
  const var2 = await LinkedVariant.create({ VariantId: variant.id, VariantLocationId: variantLocations[1].id });


  return [var1, var2];
}



const getVariants = async (productId) => {

  const variants = await Variant.findAll({ where: { ProductId: productId } });
  return variants;

}



const getVariantLocations = async (variantId) => {

  return await Variant.findAll({
    where: { id: variantId },
    include: [
      { model: VariantLocation, as: 'VarLoc', include: [{ model: Location }] }
    ]

  })
}


///api 
const getVariantOptionsAndTopons = async (variantId) => {
  const variant = await Variant.findByPk(variantId, {
    logging: console.log,
    include: [
      {
        model: VariantLocation,
        attributes: [['id', 'id']],
        as: 'VarLoc',
        include: [
          {
            model: GroupOptions,
            required: false,
            attributes: [['name', 'on'], ['rules', 'r']],
            include: [
              {
                model: Option,
                attributes: [['name', 'o']],
              }
            ]
          },
          {
            model: GroupTopon,
            required: false,
            attributes: ['id'],
            include: [
              {
                model: GroupToponsMid,
                attributes: ['id'],
                include: [
                  {
                    model: ToponLocation,
                    attributes: ['id'],
                    include: [
                      {
                        as: 'TopLoc',
                        model: Topon,
                        attributes: [['name', 't']],

                      }
                    ]
                  }
                ]

              }

            ]

          }

        ]
      }
    ]


  });


  return variant
}


// console.log(JSON.stringify(variantLocations, null, 2));
// console.log(JSON.stringify(piletinaVar, null, 2));

const getVariantLocationIngredient = async (variantLocationId) => {

  return await VariantLocation.findAll({
    logging: console.log,
    where: { id: variantLocationId },
    include: [{ model: VariantIngredient, include: [{ model: IngredientLocation, include: [{ model: Ingredient, as: 'InLoc' }] }] }]
  })
}


// const variantLocationIngredient = await getVariantLocationIngredient(piletinaCurryStup.id);
// console.log(JSON.stringify(variantLocationIngredient, null, 2));

const getVariantLocationIngredientRules = async (variantLocationId) => {

  return await VariantLocation.findAll({
    logging: console.log,
    where: { id: variantLocationId },
    include: [{ model: VariantIngredient, include: [{ model: IngredientLocation, include: [{ model: Ingredient, as: 'InLoc' }] }, { model: IngredientSKURule }] }]
  })
}



// const variantLocationIngredientRules = await getVariantLocationIngredientRules(piletinaCurryStup.id);

// console.log(JSON.stringify(variantLocationIngredientRules, null, 2));


// combo rucak ?????????????????????????????????????????????

const isToponAviableatLocation = async (toponId, locationId) => {

  return await ToponLocation.findOne({
    logging: console.log,
    where: { ToponId: toponId, LocationId: locationId }

  })
}





const getToponsVariantLocation = async (variantLocationId) => {
  const topons = await VariantLocation.findAll({
    logging: console.log,
    where: { id: variantLocationId },
    include: [
      {
        model: GroupTopon,
        include: [
          {
            model: GroupToponsMid,
            include: [{ model: ToponLocation, include: [{ model: Topon, as: 'TopLoc' }] }]

          }
        ]
      }
    ]
  }

  )


  return topons
}





const getProductsAtLocation = async (locationId) => {
  const products = await Product.findAll({
    attributes: ['id', 'name'],
    include: [{
      model: Variant,
      attributes: ['id', 'name'],
      include: [{

        model: VariantLocation,
        as: 'VarLoc',
        attributes: [],
        where: { LocationId: locationId }
      }]
    }]
  })

  return products
}


const getVariantsAtLocation = async (locationId) => {

  const variants = await Variant.findAll({
    attributes: ['id', 'name'],
    include: [{
      model: VariantLocation,
      as: 'VarLoc',
      attributes: [],
      where: { LocationId: locationId }
    }]
  }
  )

}


/// koje su varijante dostupne na lokaciji


const getAvailableVariantsManual = async () => {
  const availableVariants = await Variant.findAll({
    logging: console.log,
    attributes: [
      'id',
      'name',
      [literal('"VarLoc->Location"."name"'), 'Location']],
    include: [
      {
        model: VariantLocation,
        attributes: [],
        as: 'VarLoc',
        include: [
          {
            model: Location,
            attributes: [],
            required: true
          },
          {
            model: VariantSKURule,
            attributes: [],
            required: false,
            where: { disabled: false },
            include: [
              {
                model: SKU,
                attributes: [],
                required: true,
                where: {
                  [Op.and]: [
                    { allowMinus: false },
                    {
                      stock: {
                        [Op.gt]: 0
                      }
                    }
                  ]
                }
              }
            ]
          },
          {
            model: VariantIngredient,
            required: false,
            attributes: [],
            include: [
              {
                model: IngredientSKURule,
                attributes: [],
                required: true,
                include: [
                  {
                    model: SKU,
                    attributes: [],
                    required: true
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    where: {
      [Op.or]: [
        {
          '$VarLoc.VariantSKURule.SKU.id$': {
            [Op.ne]: null
          }
        },
        {
          '$VarLoc.VariantIngredient.IngredientSKURule.SKU.id$': {
            [Op.ne]: null
          }
        }
      ]
      },
      group: ['Variant.id', 'Variant.name', 'VarLoc->Location.id', 'VarLoc->Location.name'],
      having: literal('COUNT(CASE WHEN "VarLoc->VariantIngredient->IngredientSKURule"."disabled" = TRUE THEN 1 ELSE NULL END) = 0')
  });

  return availableVariants

};



const getAviableVariants = async () => {
  const availableVariants = await Variant.findAll({
    logging: console.log,
    attributes: [
      'id',
      'name',
      [literal('"VarLoc->Location"."name"'), 'Location']],
    include: [
      {
        model: VariantLocation,
        attributes: [],
        as: 'VarLoc',
        include: [
          {
            model: Location,
            attributes: [],
            required: true
          },


        ]
      }
    ],

  });
}

const getAviableVariantsAtLocation = async (locationId) => {
  const availableVariants = await Variant.findAll({
    logging: console.log,
    attributes: ['name'],
    include: [
      {
        model: VariantLocation,
        attributes: ['id'],
        as: 'VarLoc',
        where: { LocationId: locationId },
      }
    ],
    group: ['name'],


  });


  return availableVariants

}



const getProductByLocation = async (LocationId) => {
  const proizvodi = await Product.findAll({
    attributes: ['id', 'name'],
    include: [{
      model: Variant,
      include: [{
        model: VariantLocation,
        as: 'VarLoc',
        where: { LocationId: LocationId }
      }]
    }]

  })



}



const getProductsFromWarehouse = async (warehouseId) => {

  const items = await SKU.findAll({

    where: { WarehouseId: warehouseId },
    include: [
      {
        model: VariantSKURule,
        required: false,
        include: [
          {
            model: VariantLocation, include: [{
              model: Variant, as: 'VarLoc',
            }]
          }
        ]
      },
      {
        model: IngredientSKURule,
        required: false,
        include: [
          {
            model: VariantIngredient,
            required: false,
            include: [{
              model: VariantLocation,
              include: [{
                model: Variant, as: 'VarLoc',
              }]
            }]
          }
        ]
      }
    ]
  })



  return items
}



const getProductByIngredient = async (ingredientId) => {

  // const proizvodi = await Ingredient.findAll({
  //   logging: console.log,
  //   where: { id: ingredientId },
  //   // raw: true,
  //   attributes: [


  //     [literal('"InLoc->VariantIngredient->VariantLocation->VarLoc->Product"."id"'), 'id'],
  //     [literal('"InLoc->VariantIngredient->VariantLocation->VarLoc->Product"."name"'), 'name'],

  //   ],
  //   include: [{
  //     model: IngredientLocation,
  //     attributes: [],
  //     as: 'InLoc',
  //     include: [
  //       {
  //         model: VariantIngredient,
  //         required: true,
  //         attributes: [],
  //         include: [{
  //           attributes: [],
  //           model: VariantLocation,
  //           include: [{
  //             attributes: [],
  //             model: Variant, as: 'VarLoc',
  //             include: [{ model: Product, attributes: ['id', 'name'] }]
  //           }]
  //         }]
  //       },
  //     ]
  //   }],
  //   group: ['InLoc->VariantIngredient->VariantLocation->VarLoc->Product.id', 'InLoc->VariantIngredient->VariantLocation->VarLoc->Product.name', 'Ingredient.id', 'Ingredient.name'],
  // })

  const proizvodi = await Product.findAll({
    logging: console.log,
    attributes: [
      'id', 'name'
    ],
    include: [{
      model: Variant,
      attributes: [],
      required: true,
      include: [{
        model: VariantLocation,
        attributes: [],
        required: true,
        as: 'VarLoc',
        include: [{
          model: VariantIngredient,
          attributes: [],
          required: true,
          include: [{
            model: IngredientLocation,
            attributes: [],
            where: { IngredientId: ingredientId },
            include: [{
              as: 'InLoc',
              attributes: [],
              model: Ingredient
            }]

          }]
        }]
      }]
    }],



  })

  return proizvodi
}


const getProductByTopon = async (toponId) => {

  const proizvodi = await Topon.findAll({
    logging: console.log,
    where: { id: toponId },
    attributes: [

      [literal(`"TopLoc->GroupToponsMids->GroupTopon->VariantLocation->VarLoc->Product"."name"`), 'name'],
      [literal(`"TopLoc->GroupToponsMids->GroupTopon->VariantLocation->VarLoc->Product"."id"`), 'id']],


    include: [{
      model: ToponLocation,
      attributes: [],
      as: 'TopLoc',
      include: [
        {
          model: GroupToponsMid,
          attributes: [],
          include: [
            {
              model: GroupTopon,
              attributes: [],
              include: [{
                model: VariantLocation, attributes: [], include: [{
                  model: Variant, as: 'VarLoc', attributes: [], include: [{
                    model: Product, attributes: []
                  }]
                }]
              }]
            }
          ]
        },
      ]
    }],
    group: ['TopLoc->GroupToponsMids->GroupTopon->VariantLocation->VarLoc->Product.id', 'TopLoc->GroupToponsMids->GroupTopon->VariantLocation->VarLoc->Product.name', 'Topon.id', 'Topon.name'],
  })
  return proizvodi
}


const getToponLocation = async (toponId) => {

  const topons = await Topon.findAll({
    attributes: ['id', 'name'],
    raw: true,
    where: { id: toponId },
    include: [{
      model: ToponLocation,
      attributes: [],
      as: 'TopLoc',
      include: [{
        model: Location,
        attributes: [['name', 'Location']],
      }]
    }]
  })
  return topons

}


const getToponsAtLocation = async (locationId) => {

  const topons = await Topon.findAll({
    attributes: ['id', 'name'],
    raw: true,
    include: [{
      model: ToponLocation,
      where: { LocationId: locationId },

      attributes: [],
      as: 'TopLoc',

    }]
  })


  return topons
}


const getToponGroups = async (toponId) => {

  const topons = await Topon.findAll({
    logging: console.log,
    attributes: [
      [literal('"TopLoc->GroupToponsMids->GroupTopon->VariantLocation->VarLoc"."id"'), 'id'],
      [literal('"TopLoc->GroupToponsMids->GroupTopon->VariantLocation->VarLoc"."name"'), 'name'],
      [literal('"TopLoc->GroupToponsMids->GroupTopon->VariantLocation->Location"."name"'), 'Location'],],
    where: { id: toponId },
    include: [{
      model: ToponLocation,
      attributes: [],
      as: 'TopLoc',
      include: [{
        model: GroupToponsMid,
        attributes: [],
        include: [{
          model: GroupTopon,
          attributes: [],
          include: [{
            model: VariantLocation,
            attributes: [],
            include: [{

              model: Variant,
              as: 'VarLoc',

            },

            {
              model: Location,
              attributes: ['name']
            }

            ]
          }]
        }]
      }]
    }],
    group: ['TopLoc->GroupToponsMids->GroupTopon->VariantLocation->VarLoc.id', 'TopLoc->GroupToponsMids->GroupTopon->VariantLocation->VarLoc.name', 'Topon.id', 'Topon.name', 'TopLoc->GroupToponsMids->GroupTopon->VariantLocation->Location.id', 'TopLoc->GroupToponsMids->GroupTopon->VariantLocation->Location.name'],
  })


  return topons
}


const getVariantIngredient = async (variantId) => {

  const Ingredient = await Ingredient.findAll({
    raw: true,
    logging: console.log,
    // attributes: [[literal(), 'id'], [literal(), 'name']],
    attributes: ['id', 'name', [literal('"InLoc->VariantIngredient->VariantLocation->Location"."name"'), "VariantLocation"]],
    include: [{
      as: 'InLoc',
      model: IngredientLocation,
      required: true,
      attributes: [],
      include: [{
        attributes: [],
        required: true,
        model: VariantIngredient,
        include: [{
          attributes: [],
          required: true,
          model: VariantLocation,
          attributes: [],
          where: { VariantId: variantId },
          include: [{
            required: true,
            attributes: [],
            model: Variant,
            as: 'VarLoc',

          },
          { model: Location, attributes: [] }]

        }]
      }]
    }

    ],

    group: ["InLoc->VariantIngredient->VariantLocation->Location.name", "Ingredient.id", "Ingredient.name"],


  })
  return Ingredient




}




// #region user


const createUser = async (name, locations) => {
  const payment = await UserPayment.create({ method: 'balance', primary: true, active: true });


  const user = User.create({ firstName: name, lastName: `${name} prezime`, email: `${name}@test.com`, role: 'admin', password: 'password', shippingAdress: 'adresa', PaymentId: payment.id });


  await UserLocation.bulkCreate(locations.map((l) => { return { LocationId: l.id, UserId: user.id, department: '0', office: '0' } }))


  const balance = await Balance.create({ amount: 500, UserId: user.id, date: new Date(), reason: 'create' });


  return user;
}





// #endregion



// #region order

const createOrder = async (user, location) => {
  return await Order.create({ UserId: user.id, LocationId: location.id, status: 'pending', totalPrice: 13.5 });
}


const addOrderItem = async (order, items) => {

  let OrderItems = [];
  for (const item of items) {
    const OI = await OrderItem.create({ OrderId: order.id, VariantLocationId: item.vlId, ProductId: item.productId, quantity: item.quantity || 1 });
    OrderItems.push(OI);
  }
  return OrderItems
}

const addOptionsToOrderItem = async (orderItem, options) => {

  for (const option of options) {
    await OrderItemOption.create({ OrderItemId: orderItem.id, OptionId: option.id });
  }
}

const addToponToOrderItem = async (orderItem, topons) => {

  for (const topon of topons) {
    await OrderItemTopons.create({ OrderItemId: orderItem.id, GroupToponsMidId: topon.id });
  }

}



// const createOrderJson = async (order) => {
//   const o = await Order.create({ UserId: order.userId, LocationId: order.locationId, status: 'pending', totalPrice: 13.5 });

//   for (const item of order.items) {
//     const OI = await OrderItem.create({ OrderId: o.id, VariantLocationId: item.vlId, ProductId: item.productId, quantity: item.quantity });
//     for (const option of item.options) {


//       await OrderItemOption.create({ OrderItemId: OI.id, OptionId: option });
//     }
//     for (const topon of item.topons) {
//       await OrderItemTopons.create({ OrderItemId: OI.id, GroupToponsMidId: topon.id, quantity: topon.quantity });
//     }
//   }

// }



// #endregion


const getProductRules = async (productId) => {

  const rules = await Product.findAll({

    logging: console.log,

    where: { id: productId },
    include: [{


      model: Variant,
      include: [{


        model: VariantLocation,
        as: 'VarLoc',
        include: [{
          required: false,
          model: VariantSKURule
        },
        {
          required: false,

          model: VariantIngredient, include: [{ model: IngredientSKURule }]
        }


        ]
      },
      {
        model: LinkedVariant,
        as: 'LinkVar',

        include: [{

          model: VariantLocation,
          as: 'LinkVarLoc',
          include: [{
            required: false,
            model: VariantSKURule
          },
          {
            required: false,

            model: VariantIngredient, include: [{ model: IngredientSKURule }]
          }]

        }]
      }]

    }]
  })

  return rules
}

/*


  product 

    var 1

      
      loc 1 

          group options 

          [ 

              {
                  gorup name
                  group rules 

                  options [ 1,2,3,...]
              
              }
              {
                  group name 
                  group rules 

                  options [ 1,2,3,...]
              
              
              }          
          ]




          group topons 

          [


              {

                  toponi [1,2,3,4,5]
              }
              {
              }
          
          ]


      loc 2


    var 2 

      var loc 3

      var loc 4 


*/

const createProdct = async (settings) => {


  const { name, type, variants, description, CategoryId } = settings


  const product = await Product.create({ name, type, description, CategoryId: CategoryId })

  for (const variant of variants) {

    const variante = await Variant.create({ name: variant.name, ProductId: product.id })
    for (const varLoc of variant.locations) {

      const { LocationId, skuRules, Ingredient, topons, options, comboItems } = varLoc
      const varloc = await VariantLocation.create({ VariantId: variante.id, LocationId, disabled: false })
      if (skuRules) {
        const { name, unit, quantity, disabled, skuId } = skuRules

        await VariantSKURule.create({ VariantLocationId: varloc.id, name, unit, quantity, disabled, SKUId: skuId })


      }


      if (comboItems) {

        for (const item of comboItems) {
          await LinkedVariant.create({ VariantId: variante.id, VariantLocationId: item })
        }

      }
      if (Ingredient) {

        for (const ing of Ingredient) {
          const varing = await VariantIngredient.create({ VariantLocationId: varloc.id, IngredientId: ing.id })
          const { name, unit, quantity, disabled, SKUId } = ing.skuRules

          await IngredientSKURule.create({ VariantIngredientId: varing.id, name, unit, quantity, disabled, SKUId: SKUId })

        }
      }

      if (topons) {

        for (const top of topons) {
          const { interfaceRules, minTopon, maxTopon, topons } = top

          const gt = await GroupTopon.create({ VariantLocationId: varloc.id, rules: interfaceRules })

          for (const t of topons) {
            console.log(minTopon, maxTopon)
            
            const gtmid = await GroupToponsMid.create({ GroupToponId: gt.id, ToponLocationId: t.ToponId, min: minTopon || 0, max: maxTopon || 0, default: 0, disabled: false })

            const { name, unit, quantity, disabled, SKUId } = t.skuRules

            await ToponSKURule.create({ GroupToponMidId: gtmid.id, name, unit, quantity, disabled, SKUId: SKUId })
          }
        }


      }

      if (options) {


        for (const opt of options) {

          const go = await GroupOptions.create({ VariantLocationId: varloc.id, name: opt.name, rules: opt.rules })
          for (const o of opt.options) {
            await Option.create({ name: o, GroupOptionId: go.id })


          }


        }


      }

    }
  }

  return product

}


const getProductVariants = async (ProductId) => {

  const variants = await Variant.findAll({
    where: { ProductId },
  })


  return variants
}


const seed = async () => {

  await Category.create({
    id: "b51ca570-08a4-4e2d-9d5c-6c1b7c9f014e",
    name: 'test'
  });

  await Product.create({
    id: "ac2ea779-854c-4037-a1e1-61dd1df632ef",
    name: 'test',
    type: 'test',
    description: 'test',
    CategoryId: "b51ca570-08a4-4e2d-9d5c-6c1b7c9f014e"
  });

  await Variant.create({
    id: "694bb114-b49f-440e-8219-ef91f35f4610",
    name: 'test',
    ProductId: 'ac2ea779-854c-4037-a1e1-61dd1df632ef'
  });

  await Location.create({
    id: "4d02d20c-26ae-42bb-a331-3f69a8a9fcdd",
    name: 'test'
  });
  await Ingredient.create({
    id: "ddeeff00-1122-3344-5566-77889900bbcc",
    name: 'test'
  });

  await VariantLocation.create({
    id: "7e9b6e7b-0c0d-4c5b-9f9a-7b9e9c9c9c9c",
    VariantId: '694bb114-b49f-440e-8219-ef91f35f4610',
    LocationId: '4d02d20c-26ae-42bb-a331-3f69a8a9fcdd',
    disabled: false
  });



  await GroupOptions.create({
    id: "c0f1b688-3f19-4236-826b-3a7be97d64d8",
    name: 'test',
    VariantLocationId: '7e9b6e7b-0c0d-4c5b-9f9a-7b9e9c9c9c9c',
    rules: "{}"
  });

  await GroupTopon.create({
    id: "bcaad97b-75d5-4e89-baf9-761be7ec6376",
    VariantLocationId: '7e9b6e7b-0c0d-4c5b-9f9a-7b9e9c9c9c9c',
    rules: 'test'
  });



  await IngredientLocation.create({
    id: "ffeeddcc-1122-3344-5566-77889900aacc",
    IngredientId: 'ddeeff00-1122-3344-5566-77889900bbcc',
    LocationId: '4d02d20c-26ae-42bb-a331-3f69a8a9fcdd'
  });

  await SKU.create({
    id: "7e9b6e7b-0c0d-4c5b-9f9a-7b9e9c9c9c9c",
    name: 'test',
    allowMinus: true,
    stock: 0,
  });

  await VariantIngredient.create({
    id: "aabbff00-3344-5566-7788-9900aabbff00",
    IngredientLocationId: 'ffeeddcc-1122-3344-5566-77889900aacc',
    VariantId: '7e9b6e7b-0c0d-4c5b-9f9a-7b9e9c9c9c9c'
  });

  await IngredientSKURule.create({
    id: "aabbccdd-3344-5566-7788-9900aabbccdd",
    name: 'test',
    SKUId: '7e9b6e7b-0c0d-4c5b-9f9a-7b9e9c9c9c9c',
    VariantIngredientId: 'aabbff00-3344-5566-7788-9900aabbff00',
    unit: 'g',
    quantity: 1,
    disabled: false
  });

  await LinkedVariant.create({
    id: "bbaaddcc-3344-5566-7788-9900bbaaddcc",
    VariantId: '694bb114-b49f-440e-8219-ef91f35f4610',
    VariantLocationId: '7e9b6e7b-0c0d-4c5b-9f9a-7b9e9c9c9c9c'
  });

  await Option.create({
    id: "ccddeeff-3344-5566-7788-9900ccddeeff",
    name: 'test'
  });

  await SKU.create({
    id: "ddccbbaa-3344-5566-7788-9900ddccbbaa",
    name: 'test',
    allowMinus: true,
    stock: 0,
  });

  await Topon.create({
    id: "eeffccaa-3344-5566-7788-9900eeffccaa",
    name: 'test'
  });

  await ToponLocation.create({
    id: "ffeecbdd-3344-5566-7788-9900ffeecbdd",
    ToponId: 'eeffccaa-3344-5566-7788-9900eeffccaa',
    LocationId: '4d02d20c-26ae-42bb-a331-3f69a8a9fcdd'
  });


  await GroupToponsMid.create({
    id: "aabbccdd-1122-3344-5566-77889900aabb",
    GroupToponId: 'bcaad97b-75d5-4e89-baf9-761be7ec6376',
    ToponLocationId: 'ffeecbdd-3344-5566-7788-9900ffeecbdd',
    min: 0,
    max: 10,
    default: 0,
    disabled: false
  });



  await VariantSKURule.create({
    id: "bbaaddff-3344-5566-7788-9900bbaaddff",
    SKUId: '7e9b6e7b-0c0d-4c5b-9f9a-7b9e9c9c9c9c',
    name: 'test',
    VariantId: '7e9b6e7b-0c0d-4c5b-9f9a-7b9e9c9c9c9c',
    unit: 'g',
    quantity: 1,
    disabled: false
  });


  await User.create({
    id: "11111111-1111-1111-1111-111111111111",
    firstName: 'test',
    lastName: 'test',
    email: 'test',
    password: 'test',
    role: 'admin'
  });


  await User.create({
    id: "edd79db1-27b6-48a4-9edb-5bc19f3a1a79",
    firstName: 'testdf',
    lastName: 'testds',
    email: 'testdds',
    password: 'test',
    role: 'admin'
  });



  const hrana = await createCategory('hrana');
  const sendvic = await createCategory('sendvic', hrana.id);
  const pileci = await createCategory('pileci sendvic', sendvic.id);

  const ostalo = await createCategory('ostalo');


  const lokacijaStup = await createLocation('stup');
  const lokacijaHadziabdinica = await createLocation('hadziabdinica');


  const [kafa, [makijato, obicna]] = await createProduct('kafa', ['makijato', 'obicna']);


  const [skladisteStup, skladisteHadziabdinica] = await createWarehouse(['stup', 'hadziabdinica']);


  await addWarehouseToLocations([skladisteStup, skladisteHadziabdinica], lokacijaStup);


  const [skuStupMakijato, skuHadziabdinicaMakijato] = await createSKUs('makijato', [skladisteStup, skladisteHadziabdinica]);


  const [skuStupObicna, skuHadziabdinicaObicna] = await createSKUs('obicna', [skladisteStup, skladisteHadziabdinica]);




  const [vlStupMakijato, skuVariantRuleStupMakijato] = await addVariantToLocation(makijato, lokacijaStup, skuStupMakijato);
  const [vlHadziabdinicaMakijato, skuVariantRuleHadziabdinicaMakijato] = await addVariantToLocation(makijato, lokacijaHadziabdinica, skuHadziabdinicaMakijato);
  const [vlStupObicna, skuVariantRuleStupObicna] = await addVariantToLocation(obicna, lokacijaStup, skuStupObicna);
  const [vlHadziabdinicaObicna, skuVariantRuleHadziabdinicaObicna] = await addVariantToLocation(obicna, lokacijaHadziabdinica, skuHadziabdinicaObicna);





  const [mlijeko, secer, so, biber, limun, led] = await createTopons(['mlijeko', 'secer', 'so', 'biber', 'limun', 'led']);


  const [mlijekoStup, secerStup, soStup, biberStup, limunStup, ledStup] = await addToponToLocations([mlijeko, secer, so, biber, limun, led], lokacijaStup);


  const [mlijekoHadziabdinica, secerHadziabdinica, soHadziabdinica, biberHadziabdinica, limunHadziabdinica] = await addToponToLocations([mlijeko, secer, so, biber, limun], lokacijaHadziabdinica);



  const [mlijekoStupSKU, mlijekoHadziabdinicaSKU] = await createSKUs('mlijeko', [skladisteStup, skladisteHadziabdinica]);

  const [secerHadziabdinicaSKU] = await createSKUs('secer', [skladisteHadziabdinica]);

  const [soHadziabdinicaSKU, soStupSKU] = await createSKUs('so', [skladisteHadziabdinica, skladisteStup]);

  const [biberHadziabdinicaSKU, biberStupSKU] = await createSKUs('biber', [skladisteHadziabdinica, skladisteStup]);

  const [limunHadziabdinicaSKU] = await createSKUs('limun', [skladisteHadziabdinica]);

  const [ledHadziabdinicaSKU] = await createSKUs('led', [skladisteHadziabdinica]);




  const malijatoStupGroup = await createGroup('malijato', vlStupMakijato);
  const malijatoHadziabdinicaGroup = await createGroup('malijato', vlHadziabdinicaMakijato);


  const mlijekoStupGroupTopon = await addToponToVariantLocation(malijatoStupGroup, mlijekoStup, mlijekoStupSKU);

  const mlijekoHadziabdinicaGroupTopon = await addToponToVariantLocation(malijatoHadziabdinicaGroup, mlijekoHadziabdinica, mlijekoHadziabdinicaSKU);






  const obicnaStupGroup = await createGroup('obicna', vlStupObicna);
  const obicnaHadziabdinicaGroup = await createGroup('obicna', vlHadziabdinicaObicna);


  await addToponToVariantLocation(obicnaStupGroup, soStup, soStupSKU);
  await addToponToVariantLocation(obicnaHadziabdinicaGroup, soHadziabdinica, soHadziabdinicaSKU);

  await addToponToVariantLocation(obicnaStupGroup, biberStup, biberStupSKU);
  await addToponToVariantLocation(obicnaHadziabdinicaGroup, biberHadziabdinica, biberHadziabdinicaSKU);


  const groupOptionObicnaStup = await createGroupOptions('obicna', vlStupObicna);

  await addOptionToVariantLocation(groupOptionObicnaStup, ['duza', 'velika solja', 'sa hladnim']);


  const groupOptionMakijatoStup = await createGroupOptions('manolo', vlStupMakijato);



  await addOptionToVariantLocation(groupOptionMakijatoStup, ['duza', 'za ponijeti', 'sa hladnim']);


  const Ingredients = await createIngredient(['brasno', 'piletina', 'curry', 'riza']);


  const [brasno, piletina, curry, riza] = Ingredients;

  const [brasnoStup, brasnoHadziabdinica] = await addIngredientToLocation(brasno, [lokacijaStup, lokacijaHadziabdinica]);

  const [piletinaStup, piletinaHadziabdinica] = await addIngredientToLocation(piletina, [lokacijaStup, lokacijaHadziabdinica]);

  const [curryStup, curryHadziabdinica] = await addIngredientToLocation(curry, [lokacijaStup, lokacijaHadziabdinica]);

  const [piletinaMeal, [piletinaObicna, piletinaCurry]] = await createProduct('piletina', ['piletinaObicna', 'piletinaCurry'], '', pileci.id);




  const [piletinaStupSKU, piletinaHadziabdinicaSKU] = await createSKUs('piletina', [skladisteStup, skladisteHadziabdinica]);

  const [curryStupSKU, curryHadziabdinicaSKU] = await createSKUs('curry', [skladisteStup, skladisteHadziabdinica]);

  const [rizaStupSKU, rizaHadziabdinicaSKU] = await createSKUs('riza', [skladisteStup, skladisteHadziabdinica]);

  const [piletinaObicnaStup, piletinaObicnaStupSKURule] = await addVariantToLocation(piletinaObicna, lokacijaStup);

  const [piletinaCurryStup, piletinaCurryStupSKURule] = await addVariantToLocation(piletinaCurry, lokacijaStup);

  // const [piletinaRizaStup, piletinaRizaStupSKURule] = await addVariantToLocation(piletinaObicna, lokacijaStup);


  await addIngredientToVariant(piletinaStup, piletinaObicnaStup, piletinaStupSKU);

  await addIngredientToVariant(curryStup, piletinaCurryStup, curryStupSKU);

  await addIngredientToVariant(piletinaStup, piletinaCurryStup, rizaStupSKU);

  // await addIngredientToVariant(piletinaStup, piletinaObicnaStup, piletinaStupSKU);
  // await addIngredientToVariant(curryStup, piletinaCurryStup, curryStupSKU);

  // await addIngredientToVariant(piletinaStup, piletinaCurry, rizaStupSKU);


  const piletinaVar = await getVariants(piletinaMeal.id);


  const variantLocations = await getVariantLocations(piletinaObicna.id);


  // const aviable = await isToponAviableatLocation(led.id, lokacijaHadziabdinica.id);
  // console.log(aviable);
  const [kola, [kola1, kola2]] = await createProduct('kola', ["kola1", "kola2"]);

  const [kolaStupSKU, kolaHadziSKU] = await createSKUs('kola', [skladisteStup, skladisteHadziabdinica]);

  const [kolaStup] = await addVariantToLocation(kola1, lokacijaStup, kolaStupSKU);
  const [kolaHadziabdinica] = await addVariantToLocation(kola2, lokacijaHadziabdinica, kolaHadziSKU);

  const [rucak, [rucakS, rucakH]] = await createProduct('rucak', ["rucak1 stup", "rucak 1 hadzi"], 'combo');


  const [rucak1Kafa, rucak1Piletina] = await addVariantsToComboVariant(rucakS, [vlStupMakijato, piletinaObicnaStup])

  const [rucak2Kafa, rucak2Piletina] = await addVariantsToComboVariant(rucakH, [vlHadziabdinicaMakijato, piletinaCurryStup])


  const [rucakStup, skuRuleRucakStup] = await addVariantToLocation(rucakS, lokacijaStup, null);


  const [rucakHadziabdinica, skuRuleRucakHadziabdinica] = await addVariantToLocation(rucakH, lokacijaHadziabdinica, null);


  const groupRucakStup = await createGroup('rucakStup', rucakStup);

  const groupRucakHadziabdinica = await createGroup('rucakHadziabdinica', rucakHadziabdinica);


  const soRucakStup = await addToponToVariantLocation(groupRucakStup, soStup, soStupSKU)

  const soRucakHadziabdinica = await addToponToVariantLocation(groupRucakHadziabdinica, soHadziabdinica, soHadziabdinicaSKU)


  const biberRucakStup = await addToponToVariantLocation(groupRucakStup, biberStup, biberStupSKU)

  const biberRucakHadziabdinica = await addToponToVariantLocation(groupRucakHadziabdinica, biberHadziabdinica, biberHadziabdinicaSKU)





  /// palacinke 



  const palacinkeSastojci = await createIngredient(['ulje', 'kakao', 'pzp', 'bijeliKrem', 'mrvice']);

  const [ulje, kakao, pzp, bijeliKrem, mrvice] = palacinkeSastojci;

  const [uljeStup, uljeHadziabdinica] = await addIngredientToLocation(ulje, [lokacijaStup, lokacijaHadziabdinica]);

  const [kakaoStup, kakaoHadziabdinica] = await addIngredientToLocation(kakao, [lokacijaStup, lokacijaHadziabdinica]);

  const [pzpStup, pzpHadziabdinica] = await addIngredientToLocation(pzp, [lokacijaStup, lokacijaHadziabdinica]);

  const [bijeliKremHadziabdinica, bijelKremStup] = await addIngredientToLocation(bijeliKrem, [lokacijaHadziabdinica, lokacijaStup]);

  const [mrviceStup] = await addIngredientToLocation(mrvice, [lokacijaHadziabdinica]);



  const [uljeStupSKU, uljeHadziabdinicaSKU] = await createSKUs('ulje', [skladisteStup, skladisteHadziabdinica]);

  const [kakaoStupSKU, kakaoHadziabdinicaSKU] = await createSKUs('kakao', [skladisteStup, skladisteHadziabdinica]);

  const [pzpStupSKU, pzpHadziabdinicaSKU] = await createSKUs('pzp', [skladisteStup, skladisteHadziabdinica]);

  const [bijeliKremHadziabdinicaSKU] = await createSKUs('bijeliKrem', [skladisteHadziabdinica]);

  const [mrviceStupSKU] = await createSKUs('mrvice', [skladisteStup]);



  const [palacinke, [palacinkeLight, palacinkeCockolate]] = await createProduct('palacinke', ["palacinkeLight", "palacinkeCockolate"]);


  const [palacinkeLightStup, palacinkeLightStupSKU] = await addVariantToLocation(palacinkeLight, lokacijaStup, null);

  const [palacinkeCockolateStup, palacinkeCockolateStupSKU] = await addVariantToLocation(palacinkeCockolate, lokacijaStup, null);


  const [palacinkeLightHadziabdinica, palacinkeLightHadziabdinicaSKU] = await addVariantToLocation(palacinkeLight, lokacijaHadziabdinica, null);




  await addIngredientToVariant(uljeStup, palacinkeLightStup, uljeStupSKU);


  await addIngredientToVariant(kakaoStup, palacinkeLightStup, kakaoStupSKU, true);

  await addIngredientToVariant(pzpStup, palacinkeLightStup, pzpStupSKU, true);

  await addIngredientToVariant(bijeliKremHadziabdinica, palacinkeCockolateStup, bijeliKremHadziabdinicaSKU, true);

  await addIngredientToVariant(mrviceStup, palacinkeLightHadziabdinica, mrviceStupSKU);

  await addIngredientToVariant(piletinaStup, palacinkeCockolateStup, piletinaStupSKU);


  await addIngredientToVariant(uljeHadziabdinica, palacinkeLightHadziabdinica, uljeHadziabdinicaSKU);

  await addIngredientToVariant(kakaoHadziabdinica, palacinkeLightHadziabdinica, kakaoHadziabdinicaSKU);

  await addIngredientToVariant(pzpHadziabdinica, palacinkeLightHadziabdinica, pzpHadziabdinicaSKU);

  await addIngredientToVariant(bijeliKremHadziabdinica, palacinkeLightHadziabdinica, bijeliKremHadziabdinicaSKU);




  await addIngredientToVariant(uljeStup, palacinkeCockolateStup, uljeStupSKU);

  await addIngredientToVariant(kakaoStup, palacinkeCockolateStup, kakaoStupSKU);

  await addIngredientToVariant(pzpStup, palacinkeCockolateStup, pzpStupSKU);





  const groupPalacinkeLightStup = await createGroup('palacinkeLight', palacinkeLightStup);

  const groupPalacinkeCockolateStup = await createGroup('palacinkeCockolate', palacinkeCockolateStup);

  const groupPalacinkeLightHadziabdinica = await createGroup('palacinkeLight', palacinkeLightHadziabdinica);


  await addToponToVariantLocation(groupPalacinkeLightHadziabdinica, secerHadziabdinica, secerHadziabdinicaSKU)
  await addToponToVariantLocation(groupPalacinkeLightHadziabdinica, limunHadziabdinica, limunHadziabdinicaSKU)
  await addToponToVariantLocation(groupPalacinkeLightStup, soStup, soStupSKU);

  const sara = await createUser('Sara', [lokacijaStup, lokacijaHadziabdinica]);


  const orderSaraKolaRucak = await createOrder(sara, lokacijaStup);




  const saraKolaOrderItem = await addOrderItem(orderSaraKolaRucak, [
    { vlId: kolaStup.id, productId: kola.id },
    { vlId: rucakStup.id, productId: rucak.id },
  ])


  const [orderItemKola, orderItemRucak] = saraKolaOrderItem




  await addToponToOrderItem(orderItemRucak, [soRucakStup, biberRucakStup])



  // const kafaMakijato = await getVariantOptionsAndTopons(obicna.id);


  // console.log(JSON.stringify(kafaMakijato, null, 2))




  const product = await createProdct(
    {
      "name": "kafa",
      "type": "combo",
      "description": "piletina",
      "CategoryId": hrana.id,
      "variants": [
        {
          "name": "obicna",
          "locations": [
            {
              "LocationId": lokacijaStup.id,
              "comboItems": [
                piletinaObicnaStup.id,
                kolaStup.id
              ],

              "topons": [
                {
                  "interfaceRules": "{'single select'}",
                  "minTopon": 1,
                  "maxTopon": 1,
                  "topons": [
                    {
                      "ToponId": soStup.id,
                      "skuRules": {
                        "name": "kafa",
                        "unit": "g",
                        "quantity": 1,
                        "disabled": false,
                        "SKUId": soStupSKU.id
                      },
                      "min": 0,
                      "max": 10,
                      "default": 0
                    },
                    {
                      "ToponId": biberStup.id,
                      "skuRules": {
                        "name": "kafa",
                        "unit": "g",
                        "quantity": 1,
                        "disabled": false,
                        "SKUId": biberStupSKU.id
                      },
                      "min": 0,
                      "max": 10,
                      "default": 0
                    }
                  ]
                }
              ],
              "options": [
                {
                  "name": "kafa",
                  "rules": "{'select': 'multipleselect'}",
                  "options": [
                    "name1",
                    "name2"
                  ]
                }
              ]
            }
          ]
        }
      ]
    }


  )

  const variants = await getProductVariants(product.id);


  const productVariantAndTopon = await getVariantOptionsAndTopons(variants[0].id);
  const order = {
    "userId": sara.id,
    "locationId": lokacijaStup.id,

    "items": [
      {
        "vlId": kolaStup.id,
        "productId": kola.id,
        "quantity": 1,
        "options": [],
        "topons": [



        ]
      },
      {
        "productId": rucak.id,
        "vlId": rucakStup.id,
        "quantity": 1,
        "options": [],
        "topons": [
          {
            "toponId": soRucakStup.id,
            "quantity": 1,
          },


        ]
      }

    ]
  }

  const order1 = await createOrderJson(order);

  const order1details = await getOrderDetails(order1.id);

  const items = await updateSKU(order1details.items)


  // const orderItem = await VariantLocation.findOne({
  //   // logging: console.log,
  //   where: { id: rucakStup.id },
  //   attributes: ['id'],
  //   include: [
  //     {
  //       model: Variant, // Referencing the model directly
  //       as: 'VarLoc', // Using the alias defined in the association
  //       required: false,
  //       attributes: ['id'],
  //       include: [
  //         {
  //           model: LinkedVariant, // Referencing the model directly
  //           as: 'LinkVar', // Using the alias defined in the association
  //           attributes: ['id', 'quantity'],
  //           include: [
  //             {
  //               model: VariantLocation, // Referencing the model directly
  //               as: 'LinkVarLoc', // Using the alias defined in the association
  //               attributes: ['id'],
  //               include: [
  //                 {
  //                   model: VariantSKURule, // Referencing the model directly
  //                   as: 'Loc_Rule', // Using the alias defined in the association
  //                   required: false,
  //                   attributes: ['id', 'quantity', 'SKUId', 'unit']
  //                 },
  //                 {
  //                   model: VariantIngredient, // Referencing the model directly
  //                   as: 'VarLocIng', // Using the alias defined in the association
  //                   required: false,
  //                   attributes: ['id'],
  //                   include: [
  //                     {
  //                       model: IngredientSKURule, // Referencing the model directly
  //                       as: 'VRule', // Using the alias defined in the association
  //                       attributes: ['id', 'quantity', 'SKUId', 'unit']
  //                     }
  //                   ]
  //                 }
  //               ]
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   ],
  // });


  const orderItem = await VariantLocation.findOne({
    // logging: console.log,
    where: { id: rucakStup.id },
    attributes: ['id'],
    include: [
      {
        association: VariantLocation.associations.VarLoc,
        required: false,
        attributes: ['id'],
        include: [
          {
            association: Variant.associations.LinkVar,
            attributes: ['id', 'quantity'],
            include: [
              {
                association: LinkedVariant.associations.LinkVarLoc,
                attributes: ['id'],
                include: [
                  {
                    association: VariantLocation.associations.VarLocRule,
                    required: false,
                    attributes: ['id', 'quantity', 'SKUId', 'unit']
                  },
                  {
                    association: VariantLocation.associations.VarLocIng,
                    required: false,
                    attributes: ['id'],
                    include: [
                      {
                        association: VariantIngredient.associations.VarIngRule,
                        attributes: ['id', 'quantity', 'SKUId', 'unit']
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
  });


  const var1 = await VariantLocation.findOne({
    // logging: console.log,
    where: { id: vlStupMakijato.id },
    include: [
      {
        model: Variant,
        as: 'VarLoc',
        attributes: ['id'],


      }
    ]
  })


  // console.log(JSON.stringify(var1, null, 2))

  await VariantPrice.create({ price: 1000, VariantId: var1.VariantId, date: new Date() });

  const price1 = await VariantPrice.getPriceByDate(var1.VariantId);

  const products = await Product.findAll({
    attributes: ['id', 'name'],
    include: [{
      model: Variant,
      attributes: ['id', 'name'],
      include: [{

        model: VariantLocation,
        as: 'VarLoc',
        attributes: ['id'],
        where: { LocationId: lokacijaStup.id }
      }]
    }]
  })

  // console.log(JSON.stringify(products, null, 2))

  // console.log("OrderItem", JSON.stringify(orderItem, null, 2))
  // console.log(JSON.stringify(orderItem, null, 2))

  // const orderInfo = await getOrderDetails(order1.id);

  // console.log(JSON.stringify(orderInfo, null, 2))
  // console.log(JSON.stringify(productVariantAndTopon, null, 2))


  // const RucakRules = await getProductRules(kola.id);


  // console.log(JSON.stringify(RucakRules, null, 2))



  // const order = await getOrderDetails(orderSaraKolaRucak.id);


  // console.log(JSON.stringify(order, null, 2))


  // const orderSKURules = await getOrderSKURules(orderSaraKolaRucak.id);

  // const getProductType = async (id) => {

  //   const product = await Product.findByPk(id, {

  //     logging: console.log,
  //     attributes: [

  //       'type'
  //     ]

  //   })

  //   return product.type



  // }





  // const variantLocationsInOrderItem = await VariantLocation.findOne({
  //   where: { id: rucakStup.id },
  //   include: [
  //     {
  //       model: Variant,
  //       as: 'VarLoc',
  //       attributes: ['id'],
  //       include: [{ 
  //         model: LinkedVariant,
  //         required: false,
  //         attributes: ['id'],
  //         include: [{

  //           model: VariantLocation,
  //           attributes: ['id'], 
  //           include: [
  //             {
  //               required: false,
  //               attributes: ['id'],
  //               model: VariantIngredient
  //             }]

  //         }]
  //       }],

  //     }
  //   ]
  // });

  // console.log(JSON.stringify(variantLocationsInOrderItem, null, 2))

  // const productType = await getProductType(kola.id);


  // console.log(JSON.stringify(productType, null, 2))
  //   const proizvodiStup = await getProductsAtLocation(lokacijaStup.id);

  // console.log(JSON.stringify(proizvodiStup, null, 2))
  // const varijanteStup = await getVariantsAtLocation(lokacijaStup.id);


  // const aviableVariants = await getAvailableVariantsManual();

  // console.log(JSON.stringify(aviableVariants, null, 2))

  // const aviableVariantsAtStup = await getAviableVariantsAtLocation(lokacijaStup.id);


  // console.log(JSON.stringify(aviableVariantsAtStup, null, 2))


  // const proizvodiHadziabdinica = await getProductByLocation(lokacijaHadziabdinica.id);

  // console.log(JSON.stringify(proizvodiHadziabdinica, null, 2))

  // const proizvodiSaPiletinom = await getProductByIngredient(piletina.id);

  // console.log(JSON.stringify(proizvodiSaPiletinom, null, 2))


  // const lokacijeSecera = await getToponLocation(secer.id);
  // console.log(JSON.stringify(lokacijeSecera, null, 2))


  // const toponiNaStupu = await getToponsAtLocation(lokacijaStup.id);

  // console.log(JSON.stringify(toponiNaStupu, null, 2))

  // const grupeZaSoStup = await getToponGroups(so.id);


  // console.log(JSON.stringify(grupeZaSoStup, null, 2))

  // const palacinkeIngredient = await getVariantIngredient(palacinkeLight.id);


  // console.log(JSON.stringify(palacinkeIngredient, null, 2))

  // const proizvodiSaSecerom = await getProductByTopon(biber.id);

  // console.log(JSON.stringify(proizvodiSaSecerom, null, 2))

  // const itemsAtStupWarehouse = await getProductsFromWarehouse(skladisteStup.id);

  // console.log(JSON.stringify(itemsAtStupWarehouse, null, 2))

  // const topons = await getToponsVariantLocation(rucakStup.id);


  // console.log(JSON.stringify(topons, null, 2));


  
  
  
  console.log('All products created');
};


const seedRoles = async () => {
  
  
  
  const roles = await Role.bulkCreate([
    { name: 'admin', description: 'admin role' },
    { name: 'user', description: 'user role' },
    { name: 'waiter', description: 'waiter role' },
    { name: 'kitchenStuff', description: 'kitchenStuff role' },]);

  const permissions = await Permissions.bulkCreate([
    { name: 'create', description: 'create permission' },
    { name: 'read', description: 'read permission' },
    { name: 'update', description: 'update permission' },
    { name: 'delete', description: 'delete permission' },
  ]);
  
  
  const [adminRole, userRole, waiterRole, kitchenStuffRole] = roles;
  
  
  const [createPermission, readPermission, updatePermission, deletePermission] = permissions;
  
  
  const workers = await User.bulkCreate([
    
    {
      
      firstName: 'admin1',
      lastName: 'admin1',
      email: 'admin@admin1',
      password: 'password',
      shippingAdress: 'adresa',
      role: adminRole.id
      
    },
    {
      
      firstName: 'konobar1',
      lastName: 'konobar1',
      email: 'konobar1@konobar1',
      password: 'password',
      shippingAdress: 'adresa',
      role: waiterRole.id
    },
    
    {
      firstName: 'konobar2',
      lastName: 'konobar2',
      email: 'konobar2@konobar2',
      password: 'password',
      shippingAdress: 'adresa',
      
      role: waiterRole.id
    },
    
    {
      firstName: 'kuhar1',
      lastName: 'kuhar1',
      email: 'kuhar1@kuhar1',
      password: 'password',
      shippingAdress: 'adresa',
      
      role: kitchenStuffRole.id
    },

  ]);
  
  
  await UserRole.bulkCreate([
    { UserId: workers[0].id, RoleId: adminRole.id },
    { UserId: workers[1].id, RoleId: waiterRole.id },
    { UserId: workers[2].id, RoleId: waiterRole.id },
    { UserId: workers[3].id, RoleId: kitchenStuffRole.id },
  ]);
  
  
  await RolePermission.bulkCreate([
    
    { RoleId: adminRole.id, PermissionId: createPermission.id },
    { RoleId: adminRole.id, PermissionId: readPermission.id },
    { RoleId: adminRole.id, PermissionId: updatePermission.id },
    { RoleId: adminRole.id, PermissionId: deletePermission.id },
    
    { RoleId: waiterRole.id, PermissionId: createPermission.id },
    { RoleId: waiterRole.id, PermissionId: readPermission.id },
    { RoleId: waiterRole.id, PermissionId: updatePermission.id },
    { RoleId: waiterRole.id, PermissionId: deletePermission.id },
    
    { RoleId: kitchenStuffRole.id, PermissionId: createPermission.id },
    { RoleId: kitchenStuffRole.id, PermissionId: readPermission.id },
    { RoleId: kitchenStuffRole.id, PermissionId: updatePermission.id },
    { RoleId: kitchenStuffRole.id, PermissionId: deletePermission.id },
    
  ]);
  
  
  
  const isAnyWaiterAviable = await User.findOne({ where: { role: waiterRole.id } });
  
  
  
  
  

}

const seedProducts = async () => {
  const p = [
    
      {"name": "Mlijeko Dukat", "description": "Svježe mlijeko u pakovanju od 1 litre.", "type": "Mlijeko"},
      {"name": "Kisela Voda Jana", "description": "Gazirana mineralna voda u boci od 1.5 litre.", "type": "Voda"},
      {"name": "Hleb Bačvi", "description": "Svježi pšenični hleb, 500 grama.", "type": "Pekarski proizvodi"},
      {"name": "Kafa Barcaffe", "description": "Mljevena kafa u pakovanju od 250 grama.", "type": "Kafa"},
      {"name": "Sir Gauda", "description": "Kockice sira Gauda, 200 grama.", "type": "Sir"},
      {"name": "Jogurt Imlek", "description": "Kiselkasti jogurt u pakovanju od 400 grama.", "type": "Jogurt"},
      {"name": "Čokolada Milka", "description": "Mliječna čokolada sa lješnicima, 100 grama.", "type": "Slatkiši"},
      {"name": "Keksi Plazma", "description": "Keksi Plazma, 200 grama.", "type": "Grickalice"},
      {"name": "Sok Cappy", "description": "Voćni sok od narandže u boci od 1 litre.", "type": "Sokovi"},
      {"name": "Pasta Barilla", "description": "Špageti pasta, 500 grama.", "type": "Pasta"},
      {"name": "Konzervirana Riba Tuna", "description": "Tuna u konzervi, 200 grama.", "type": "Konzerve"},
      {"name": "Maslinovo Ulje Bjelas", "description": "Extra djevičansko maslinovo ulje u boci od 500 mililitara.", "type": "Ulje"},
      {"name": "Kvasac Dr. Oetker", "description": "Suhi kvasac u pakovanju od 7 grama.", "type": "Kvasac"},
      {"name": "Margo Marmelada", "description": "Marmelada od jagode, 370 grama.", "type": "Marmelada"},
      {"name": "Mleko UHT", "description": "Trajno mlijeko u pakovanju od 1 litre.", "type": "Mlijeko"},
      {"name": "Kola Coca-Cola", "description": "Gazirani napitak Coca-Cola, 2 litre.", "type": "Pića"},
      {"name": "Čips Lay's", "description": "Krompir čips sa ukusom luka i pavlake, 150 grama.", "type": "Grickalice"},
      {"name": "Voće Jabuke", "description": "Svježe jabuke, 1 kilogram.", "type": "Voće"},
      {"name": "Piletina File", "description": "Piletina file u pakovanju od 500 grama.", "type": "Meso"},
      {"name": "Kvasac Suhi", "description": "Suhi kvasac u pakovanju od 10 grama.", "type": "Kvasac"},
      {"name": "Makaroni", "description": "Makaroni pasta, 500 grama.", "type": "Pasta"},
      {"name": "Rezana Šunka", "description": "Šunka rezana, 200 grama.", "type": "Meso"},
      {"name": "Lazanje", "description": "Lazanje u pakovanju od 250 grama.", "type": "Pasta"},
      {"name": "Kvasac Svježi", "description": "Svježi kvasac u pakovanju od 42 grama.", "type": "Kvasac"},
      {"name": "Sok od Jabuke", "description": "Sok od jabuke, 1 litra.", "type": "Sokovi"},
      {"name": "Maslac", "description": "Maslac u pakovanju od 250 grama.", "type": "Mlijeko"},
      {"name": "Kesten Pasta", "description": "Pasta od kestena, 200 grama.", "type": "Grickalice"},
      {"name": "Pivo Heineken", "description": "Pivo Heineken, 0.5 litra.", "type": "Pića"},
      {"name": "Vino Chardonnay", "description": "Bijelo vino Chardonnay, 750 mililitara.", "type": "Pića"},
      {"name": "Sir Mozzarella", "description": "Sir Mozzarella, 200 grama.", "type": "Sir"},
      {"name": "Maslinovo Ulje", "description": "Maslinovo ulje u pakovanju od 1 litre.", "type": "Ulje"},
      {"name": "Voda Bez Gasova", "description": "Negazirana mineralna voda, 1.5 litre.", "type": "Voda"},
      {"name": "Grčki Jogurt", "description": "Grčki jogurt, 400 grama.", "type": "Jogurt"},
      {"name": "Pršut", "description": "Sušeni pršut, 150 grama.", "type": "Meso"},
      {"name": "Kvasac Svježi", "description": "Svježi kvasac, 40 grama.", "type": "Kvasac"},
      {"name": "Sok od Narandže", "description": "Sok od narandže, 1 litra.", "type": "Sokovi"},
      {"name": "Čokolada Ritter Sport", "description": "Čokolada Ritter Sport sa lješnicima, 100 grama.", "type": "Slatkiši"},
      {"name": "Grickalice Pringles", "description": "Krompir čips Pringles, 200 grama.", "type": "Grickalice"},
      {"name": "Mlijeko UHT", "description": "UHT mlijeko, 1 litra.", "type": "Mlijeko"},
      {"name": "Kola Pepsi", "description": "Gazirani napitak Pepsi, 2 litre.", "type": "Pića"},
      {"name": "Hleb Integralni", "description": "Integralni hleb, 500 grama.", "type": "Pekarski proizvodi"},
      {"name": "Sok od Jabuke", "description": "Sok od jabuke, 1 litra.", "type": "Sokovi"},
      {"name": "Jogurt sa Voćem", "description": "Jogurt sa komadićima voća, 400 grama.", "type": "Jogurt"},
      {"name": "Kafa Jacobs", "description": "Mljevena kafa Jacobs, 250 grama.", "type": "Kafa"},
      {"name": "Margarina", "description": "Margarina u pakovanju od 250 grama.", "type": "Mlijeko"},
      {"name": "Keks Digestive", "description": "Digestive keks, 200 grama.", "type": "Grickalice"},
      {"name": "Pasta za Zube Colgate", "description": "Pasta za zube Colgate, 100 mililitara.", "type": "Higijena"},
      {"name": "Šećer Cukrin", "description": "Šećer u pakovanju od 1 kilogram.", "type": "Šećer"},
      {"name": "Sol Himalajska", "description": "Himalajska so u pakovanju od 500 grama.", "type": "Začini"},
      {"name": "Lazanja", "description": "Lazanja u pakovanju od 250 grama.", "type": "Pasta"},
      {"name": "Jaja", "description": "Jaja u pakovanju od 10 komada.", "type": "Jaja"},
      {"name": "Maslac za Pečenje", "description": "Maslac za pečenje, 250 grama.", "type": "Mlijeko"},
      {"name": "Čokoladni Musli", "description": "Musli sa čokoladom, 500 grama.", "type": "Grickalice"},
      {"name": "Sir Feta", "description": "Sir Feta, 200 grama.", "type": "Sir"},
      {"name": "Zeleni Čaj", "description": "Zeleni čaj u pakovanju od 20 kesica.", "type": "Čajevi"},
      {"name": "Pita sa Sirom", "description": "Pita sa sirom, 300 grama.", "type": "Pekarski proizvodi"},
      {"name": "Suvo Grožđe", "description": "Suvo grožđe u pakovanju od 200 grama.", "type": "Grickalice"},
      {"name": "Med", "description": "Prirodni med u staklenki od 250 grama.", "type": "Slatkiši"},
      {"name": "Pita sa Jabukama", "description": "Pita sa jabukama, 350 grama.", "type": "Pekarski proizvodi"},
      {"name": "Crni Biber", "description": "Crni biber u pakovanju od 100 grama.", "type": "Začini"},
      {"name": "Kukuruz za Kokice", "description": "Kukuruz za kokice, 250 grama.", "type": "Grickalice"},
      {"name": "Voda sa Limunom", "description": "Voda sa okusom limuna, 1.5 litre.", "type": "Pića"},
      {"name": "Arašidi", "description": "Pečeni arašidi u pakovanju od 200 grama.", "type": "Grickalice"},
      {"name": "Sok od Grožđa", "description": "Sok od grožđa, 1 litra.", "type": "Sokovi"},
      {"name": "Prašak za Pecivo", "description": "Prašak za pecivo u pakovanju od 10 grama.", "type": "Začini"},
      {"name": "Rizoto", "description": "Rizoto u pakovanju od 250 grama.", "type": "Pasta"},
      {"name": "Čokoladni Napitak", "description": "Čokoladni napitak u pakovanju od 500 mililitara.", "type": "Pića"},
      {"name": "Sir Edam", "description": "Sir Edam, 200 grama.", "type": "Sir"},
      {"name": "Kvasac za Hleb", "description": "Kvasac za hleb u pakovanju od 11 grama.", "type": "Kvasac"},
      {"name": "Pasta Bolognese", "description": "Pasta Bolognese u konzervi, 400 grama.", "type": "Konzerve"},
      {"name": "Keks sa Čokoladom", "description": "Keks sa komadićima čokolade, 250 grama.", "type": "Grickalice"},
      {"name": "Jagode", "description": "Svježe jagode, 250 grama.", "type": "Voće"},
      {"name": "Rafinisano Ulje", "description": "Rafinisano biljno ulje u boci od 1 litre.", "type": "Ulje"},
      {"name": "Špageti", "description": "Špageti pasta, 500 grama.", "type": "Pasta"},
      {"name": "Sir Camembert", "description": "Sir Camembert, 150 grama.", "type": "Sir"},
      {"name": "Orašasti Plodovi", "description": "Mješavina orašastih plodova, 200 grama.", "type": "Grickalice"},
      {"name": "Zeleni Čaj sa Narančom", "description": "Zeleni čaj sa okusom naranče, 20 kesica.", "type": "Čajevi"},
      {"name": "Kvasac za Hleb", "description": "Kvasac za hleb u pakovanju od 7 grama.", "type": "Kvasac"},
      {"name": "Kolača", "description": "Razni kolači u pakovanju od 200 grama.", "type": "Pekarski proizvodi"},
      {"name": "Hleb Bez Glutena", "description": "Bezglutenski hleb, 500 grama.", "type": "Pekarski proizvodi"},
      {"name": "Sušeno Voće", "description": "Sušeno voće u pakovanju od 150 grama.", "type": "Grickalice"},
      {"name": "Čokoladni Bomboni", "description": "Bomboni sa čokoladom, 200 grama.", "type": "Slatkiši"},
      {"name": "Voda sa Limunom", "description": "Voda sa okusom limuna, 1 litra.", "type": "Pića"},
      {"name": "Mliječni Napitak", "description": "Mliječni napitak u pakovanju od 250 mililitara.", "type": "Pića"},
      {"name": "Sok od Grožđa", "description": "Sok od grožđa, 1 litra.", "type": "Sokovi"},
      {"name": "Brza Hrana", "description": "Brza hrana u pakovanju od 300 grama.", "type": "Brza hrana"},
      {"name": "Kolač sa Voćem", "description": "Kolač sa voćem u pakovanju od 250 grama.", "type": "Pekarski proizvodi"},
      {"name": "Kuhinja", "description": "Kuhinja za pripremu hrane u pakovanju od 1 kilogram.", "type": "Začini"},
      {"name": "Pita sa Krompirom", "description": "Pita sa krompirom, 300 grama.", "type": "Pekarski proizvodi"},
      {"name": "Maslac od Kikirikija", "description": "Maslac od kikirikija u pakovanju od 250 grama.", "type": "Grickalice"},
      {"name": "Voćni Jogurt", "description": "Voćni jogurt u pakovanju od 400 grama.", "type": "Jogurt"},
      {"name": "Konzervirani Grašak", "description": "Konzervirani grašak u pakovanju od 400 grama.", "type": "Konzerve"},
      {"name": "Čokoladna Kolača", "description": "Čokoladni kolač u pakovanju od 200 grama.", "type": "Pekarski proizvodi"},
      {"name": "Griz", "description": "Griz za pripremu, 500 grama.", "type": "Pekarski proizvodi"},
      {"name": "Sok od Maline", "description": "Sok od maline u pakovanju od 1 litre.", "type": "Sokovi"},
      {"name": "Svježe Meso", "description": "Svježe meso u pakovanju od 500 grama.", "type": "Meso"},
      {"name": "Sir Gouda", "description": "Sir Gouda, 200 grama.", "type": "Sir"},
      {"name": "Kvasac Instant", "description": "Instant kvasac u pakovanju od 10 grama.", "type": "Kvasac"},
      {"name": "Keks sa Komadićima Čokolade", "description": "Keks sa komadićima čokolade, 200 grama.", "type": "Grickalice"},
      {"name": "Meso za Roštilj", "description": "Meso za roštilj u pakovanju od 500 grama.", "type": "Meso"},
      {"name": "Brza Hrana", "description": "Brza hrana u pakovanju od 300 grama.", "type": "Brza hrana"},
      {"name": "Kakao u Prahu", "description": "Kakao u prahu u pakovanju od 200 grama.", "type": "Kakao"},
      {"name": "Pita sa Jagodama", "description": "Pita sa jagodama u pakovanju od 300 grama.", "type": "Pekarski proizvodi"}
    ]
    
  
  

  const filtered = p.map(product => {
    const { name, description, type } = product
    return { name, description, type: 'single' }
  });
  
  await Product.bulkCreate(filtered);


  await client.bulk({
    index: 'products',
    body: filtered.flatMap(doc => [{ index: { _index: 'products' } }, doc])
  });  
}
  module.exports = { seed, seedRoles, seedProducts };
