const { createSKU } = require('./SKU/skuController');
const { Product, Variant, Topons, GroupOption, Option, GroupRule, SKU, SKURule, Location, ComboVariants, GroupOptions, GroupTopons, PriceHistory, Order, OrderItems, ProductO, ProductT, OrderItemsCombo, User, Balance, Ingredients, WarehouseLocations, Warehouse, VariantSKURule, IngredientSKURule, VariantLocations, VariantIngredients, GroupTopon, GroupToponsMid, LinkedVariants, ToponSKURule, ToponLocations, IngredientLocations, UserPayment, UserLocation, OrderItemOptions, OrderItemTopons, Category } = require('./index');

const { Op, fn, col, literal } = require('sequelize');






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

  const vl = await VariantLocations.create({ LocationId: location.id, VariantId: variant.id, disabled: false }); 77
  let skuVariantRule
  if (sku) {
    skuVariantRule = await VariantSKURule.create({ VariantLocationId: vl.id, SKUId: sku.id, unit: 'g', quantity: 1, disabled: false, name: variant.name });
    return [vl, skuVariantRule];
  }


  return [vl];
}

const addWarehouseToLocations = async (warehouses, location) => {

  const locations = warehouses.map(warehouse => {
    return WarehouseLocations.create({ WarehouseId: warehouse.id, LocationId: location.id });
  })
}

const createTopons = async (names) => {
  const toponPromises = names.map(name => {
    return Topons.create({ name: name });
  })

  return Promise.all(toponPromises);

}


const addToponToLocations = async (topons, location) => {
  const locations = topons.map(topon => {
    return ToponLocations.create({ ToponId: topon.id, LocationId: location.id });
  })

  return Promise.all(locations);
}


const createGroup = async (name, variantLocation) => {
  return await GroupTopon.create({ name: name, VariantLocationId: variantLocation.id });
}

const addToponToVariantLocation = async (group, toponLocation, sku) => {

  const gtm = await GroupToponsMid.create({ ToponLocationId: toponLocation.id, GroupToponId: group.id, min: 0, max: 10, default: 0, disabled: false });
  const sr = await ToponSKURule.create({ GroupToponsMidId: gtm.id, SKUId: sku.id, unit: 'g', quantity: 1, disabled: false, name: sku.name });

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
    return Ingredients.create({ name: name });
  })


  return Promise.all(ingredientPromises);

}


const addIngredientToLocation = async (ingredient, locations) => {

  const ingredientPromises = locations.map(location => {
    return IngredientLocations.create({ LocationId: location.id, IngredientId: ingredient.id });
  })


  return Promise.all(ingredientPromises);

}


const addIngredientToVariant = async (locationIngredient, variantLocation, sku, IngredientDisabled = false) => {

  const vi = await VariantIngredients.create({ IngredientLocationId: locationIngredient.id, VariantLocationId: variantLocation.id });
  const sr = await IngredientSKURule.create({ VariantIngredientId: vi.id, SKUId: sku.id, unit: 'g', quantity: 1, disabled: IngredientDisabled, name: sku.name });


}


const addVariantsToComboVariant = async (variant, variantLocations) => {
  const var1 = await LinkedVariants.create({ VariantId: variant.id, VariantLocationId: variantLocations[0].id });
  const var2 = await LinkedVariants.create({ VariantId: variant.id, VariantLocationId: variantLocations[1].id });


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
      { model: VariantLocations, as: 'VL', include: [{ model: Location }] }
    ]

  })
}


///api 
const getVariantOptionsAndTopons = async (variantId) => {
  const variant = await Variant.findByPk(variantId, {
    logging: console.log,
    include: [
      {
        model: VariantLocations,
        attributes: ['id'],
        as: 'VL',
        include: [
          {
            model: GroupOptions,
            required: false,
            attributes: ['name', 'rules'],
            include: [
              {
                model: Option,
                attributes: ['name']
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
                    model: ToponLocations,
                    attributes: ['id'],
                    include: [
                      {
                        as: 'TL',
                        model: Topons,
                        attributes: ['name']

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

const getVariantLocationIngredients = async (variantLocationId) => {

  return await VariantLocations.findAll({
    logging: console.log,
    where: { id: variantLocationId },
    include: [{ model: VariantIngredients, include: [{ model: IngredientLocations, include: [{ model: Ingredients, as: 'IL' }] }] }]
  })
}


// const variantLocationIngredients = await getVariantLocationIngredients(piletinaCurryStup.id);
// console.log(JSON.stringify(variantLocationIngredients, null, 2));

const getVariantLocationIngredientsRules = async (variantLocationId) => {

  return await VariantLocations.findAll({
    logging: console.log,
    where: { id: variantLocationId },
    include: [{ model: VariantIngredients, include: [{ model: IngredientLocations, include: [{ model: Ingredients, as: 'IL' }] }, { model: IngredientSKURule }] }]
  })
}



// const variantLocationIngredientsRules = await getVariantLocationIngredientsRules(piletinaCurryStup.id);

// console.log(JSON.stringify(variantLocationIngredientsRules, null, 2));


// combo rucak ?????????????????????????????????????????????

const isToponAviableatLocation = async (toponId, locationId) => {

  return await ToponLocations.findOne({
    logging: console.log,
    where: { ToponId: toponId, LocationId: locationId }

  })
}





const getToponsVariantLocation = async (variantLocationId) => {
  const topons = await VariantLocations.findAll({
    logging: console.log,
    where: { id: variantLocationId },
    include: [
      {
        model: GroupTopon,
        include: [
          {
            model: GroupToponsMid,
            include: [{ model: ToponLocations, include: [{ model: Topons, as: 'TL' }] }]

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

        model: VariantLocations,
        as: 'VL',
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
      model: VariantLocations,
      as: 'VL',
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
      [literal('"VL->Location"."name"'), 'Location']],
    include: [
      {
        model: VariantLocations,
        attributes: [],
        as: 'VL',
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
            model: VariantIngredients,
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
          '$VL.VariantSKURule.SKU.id$': {
            [Op.ne]: null
          }
        },
        {
          '$VL.VariantIngredients.IngredientSKURule.SKU.id$': {
            [Op.ne]: null
          }
        }
      ]
    },
    group: ['Variant.id', 'Variant.name', 'VL->Location.id', 'VL->Location.name'],
    having: literal('COUNT(CASE WHEN "VL->VariantIngredients->IngredientSKURule"."disabled" = TRUE THEN 1 ELSE NULL END) = 0')
  });

  return availableVariants

};



const getAviableVariants = async () => {
  const availableVariants = await Variant.findAll({
    logging: console.log,
    attributes: [
      'id',
      'name',
      [literal('"VL->Location"."name"'), 'Location']],
    include: [
      {
        model: VariantLocations,
        attributes: [],
        as: 'VL',
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
        model: VariantLocations,
        attributes: ['id'],
        as: 'VL',
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
        model: VariantLocations,
        as: 'VL',
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
            model: VariantLocations, include: [{
              model: Variant, as: 'VL',
            }]
          }
        ]
      },
      {
        model: IngredientSKURule,
        required: false,
        include: [
          {
            model: VariantIngredients,
            required: false,
            include: [{
              model: VariantLocations,
              include: [{
                model: Variant, as: 'VL',
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

  // const proizvodi = await Ingredients.findAll({
  //   logging: console.log,
  //   where: { id: ingredientId },
  //   // raw: true,
  //   attributes: [


  //     [literal('"IL->VariantIngredients->VariantLocation->VL->Product"."id"'), 'id'],
  //     [literal('"IL->VariantIngredients->VariantLocation->VL->Product"."name"'), 'name'],

  //   ],
  //   include: [{
  //     model: IngredientLocations,
  //     attributes: [],
  //     as: 'IL',
  //     include: [
  //       {
  //         model: VariantIngredients,
  //         required: true,
  //         attributes: [],
  //         include: [{
  //           attributes: [],
  //           model: VariantLocations,
  //           include: [{
  //             attributes: [],
  //             model: Variant, as: 'VL',
  //             include: [{ model: Product, attributes: ['id', 'name'] }]
  //           }]
  //         }]
  //       },
  //     ]
  //   }],
  //   group: ['IL->VariantIngredients->VariantLocation->VL->Product.id', 'IL->VariantIngredients->VariantLocation->VL->Product.name', 'Ingredients.id', 'Ingredients.name'],
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
        model: VariantLocations,
        attributes: [],
        required: true,
        as: 'VL',
        include: [{
          model: VariantIngredients,
          attributes: [],
          required: true,
          include: [{
            model: IngredientLocations,
            attributes: [],
            where: { IngredientId: ingredientId },
            include: [{
              as: 'IL',
              attributes: [],
              model: Ingredients
            }]

          }]
        }]
      }]
    }],



  })

  return proizvodi
}


const getProductByTopon = async (toponId) => {

  const proizvodi = await Topons.findAll({
    logging: console.log,
    where: { id: toponId },
    attributes: [

      [literal(`"TL->GroupToponsMids->GroupTopon->VariantLocation->VL->Product"."name"`), 'name'],
      [literal(`"TL->GroupToponsMids->GroupTopon->VariantLocation->VL->Product"."id"`), 'id']],


    include: [{
      model: ToponLocations,
      attributes: [],
      as: 'TL',
      include: [
        {
          model: GroupToponsMid,
          attributes: [],
          include: [
            {
              model: GroupTopon,
              attributes: [],
              include: [{
                model: VariantLocations, attributes: [], include: [{
                  model: Variant, as: 'VL', attributes: [], include: [{
                    model: Product, attributes: []
                  }]
                }]
              }]
            }
          ]
        },
      ]
    }],
    group: ['TL->GroupToponsMids->GroupTopon->VariantLocation->VL->Product.id', 'TL->GroupToponsMids->GroupTopon->VariantLocation->VL->Product.name', 'Topons.id', 'Topons.name'],
  })
  return proizvodi
}


const gettoponLocations = async (toponId) => {

  const topons = await Topons.findAll({
    attributes: ['id', 'name'],
    raw: true,
    where: { id: toponId },
    include: [{
      model: ToponLocations,
      attributes: [],
      as: 'TL',
      include: [{
        model: Location,
        attributes: [['name', 'Location']],
      }]
    }]
  })
  return topons

}


const getToponsAtLocation = async (locationId) => {

  const topons = await Topons.findAll({
    attributes: ['id', 'name'],
    raw: true,
    include: [{
      model: ToponLocations,
      where: { LocationId: locationId },

      attributes: [],
      as: 'TL',

    }]
  })


  return topons
}


const getToponGroups = async (toponId) => {

  const topons = await Topons.findAll({
    logging: console.log,
    attributes: [
      [literal('"TL->GroupToponsMids->GroupTopon->VariantLocation->VL"."id"'), 'id'],
      [literal('"TL->GroupToponsMids->GroupTopon->VariantLocation->VL"."name"'), 'name'],
      [literal('"TL->GroupToponsMids->GroupTopon->VariantLocation->Location"."name"'), 'Location'],],
    where: { id: toponId },
    include: [{
      model: ToponLocations,
      attributes: [],
      as: 'TL',
      include: [{
        model: GroupToponsMid,
        attributes: [],
        include: [{
          model: GroupTopon,
          attributes: [],
          include: [{
            model: VariantLocations,
            attributes: [],
            include: [{

              model: Variant,
              as: 'VL',

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
    group: ['TL->GroupToponsMids->GroupTopon->VariantLocation->VL.id', 'TL->GroupToponsMids->GroupTopon->VariantLocation->VL.name', 'Topons.id', 'Topons.name', 'TL->GroupToponsMids->GroupTopon->VariantLocation->Location.id', 'TL->GroupToponsMids->GroupTopon->VariantLocation->Location.name'],
  })


  return topons
}


const getVariantIngredients = async (variantId) => {

  const ingredients = await Ingredients.findAll({
    raw: true,
    logging: console.log,
    // attributes: [[literal(), 'id'], [literal(), 'name']],
    attributes: ['id', 'name', [literal('"IL->VariantIngredients->VariantLocation->Location"."name"'), "VariantLocation"]],
    include: [{
      as: 'IL',
      model: IngredientLocations,
      required: true,
      attributes: [],
      include: [{
        attributes: [],
        required: true,
        model: VariantIngredients,
        include: [{
          attributes: [],
          required: true,
          model: VariantLocations,
          attributes: [],
          where: { VariantId: variantId },
          include: [{
            required: true,
            attributes: [],
            model: Variant,
            as: 'VL',

          },
          { model: Location, attributes: [] }]

        }]
      }]
    }

    ],

    group: ["IL->VariantIngredients->VariantLocation->Location.name", "Ingredients.id", "Ingredients.name"],


  })
  return ingredients




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


const addOrderItems = async (order, items) => {

  let orderitems = [];
  for (const item of items) {
    console.log(JSON.stringify(item, null, 2));
    const OI = await OrderItems.create({ OrderId: order.id, VariantLocationId: item.vlId, ProductId: item.productId, quantity: item.quantity });
    orderitems.push(OI);
  }
  return orderitems
}

const addOptionsToOrderItem = async (orderItem, options) => {

  for (const option of options) {
    await OrderItemOptions.create({ OrderItemId: orderItem.id, OptionId: option.id });
  }
}

const addToponToOrderItem = async (orderItem, topons) => {

  for (const topon of topons) {
    await OrderItemTopons.create({ OrderItemId: orderItem.id, ToponLocationId: topon.id });
  }

}



// #endregion


const getProductRules = async (productId) => {

  const rules = await Product.findAll({

    logging: console.log,

    where: { id: productId },
    include: [{


      model: Variant,
      include: [{


        model: VariantLocations,
        as: 'VL',
        include: [{
          required: false,
          model: VariantSKURule
        },
        {
          required: false,

          model: VariantIngredients, include: [{ model: IngredientSKURule }]
        }


        ]
      },
      {
        model: LinkedVariants,

        include: [{

          model: VariantLocations,
          include: [{
            required: false,
            model: VariantSKURule
          },
          {
            required: false,

            model: VariantIngredients, include: [{ model: IngredientSKURule }]
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

const createProdct = async (settings) => {k


  const { name, type, variants, description, CategoryId } = settings


  const product = await Product.create({ name, type, description, CategoryId: CategoryId })

  for (const variant of variants) {

    const variante = await Variant.create({ name: variant.name, ProductId: product.id })
    for (const varLoc of variant.locations) {

      const { LocationId, skuRules, ingredients, topons, options, comboItems } = varLoc
      const varloc = await VariantLocations.create({ VariantId: variante.id, LocationId, disabled: false })
      if (skuRules) {
        const { name, unit, quantity, disabled, skuId } = skuRules

        await VariantSKURule.create({ VariantLocationId: varloc.id, name, unit, quantity, disabled, SKUId: skuId })


      }


      if (comboItems) {

        for (const item of comboItems) {

          console.log(item)
          await LinkedVariants.create({ VariantId: variante.id, VariantLocationId: item })
        }

      }
      if (ingredients) {

        for (const ing of ingredients) {
          const varing = await VariantIngredients.create({ VariantLocationId: varloc.id, IngredientId: ing.id })
          const { name, unit, quantity, disabled, SKUId } = ing.skuRules

          await IngredientSKURule.create({ VariantIngredientId: varing.id, name, unit, quantity, disabled, SKUId: SKUId })

        }
      }

      if (topons) {

        for (const top of topons) {
          const { interfaceRules, minTopon, maxTopon, topons } = top

          const gt = await GroupTopon.create({ VariantLocationId: varloc.id, rules: interfaceRules })

          for (const t of topons) {
            const gtmid = await GroupToponsMid.create({ GroupToponId: gt.id, ToponLocationId: t.ToponId, min: minTopon, max: maxTopon, default: 0, disabled: false })

            const { name, unit, quantity, disabled, SKUId } = t.skuRules

            await ToponSKURule.create({ GroupToponsMidId: gtmid.id, name, unit, quantity, disabled, SKUId: SKUId })
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


  await addToponToVariantLocation(malijatoStupGroup, mlijekoStup, mlijekoStupSKU);
  await addToponToVariantLocation(malijatoHadziabdinicaGroup, mlijekoHadziabdinica, mlijekoHadziabdinicaSKU);






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


  const ingredients = await createIngredient(['brasno', 'piletina', 'curry', 'riza']);


  const [brasno, piletina, curry, riza] = ingredients;

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


  await addToponToVariantLocation(groupRucakStup, soStup, soStupSKU)

  await addToponToVariantLocation(groupRucakHadziabdinica, soHadziabdinica, soHadziabdinicaSKU)


  await addToponToVariantLocation(groupRucakStup, biberStup, biberStupSKU)

  await addToponToVariantLocation(groupRucakHadziabdinica, biberHadziabdinica, biberHadziabdinicaSKU)





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




  const saraKolaOrderItem = await addOrderItems(orderSaraKolaRucak, [
    { vlId: kolaStup.id, productId: kola.id },
    { vlId: rucakStup.id, productId: rucak.id },
  ])


  const [orderItemKola, orderItemRucak] = saraKolaOrderItem




  await addToponToOrderItem(orderItemRucak, [soStup, biberStup])



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
  

  console.log(JSON.stringify(productVariantAndTopon, null, 2))


  // const RucakRules = await getProductRules(kola.id);


  // console.log(JSON.stringify(RucakRules, null, 2))



  // const order = await getOrderInfo(orderSaraKolaRucak.id);


  // console.log(JSON.stringify(order, null, 2))



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


  // const lokacijeSecera = await gettoponLocations(secer.id);
  // console.log(JSON.stringify(lokacijeSecera, null, 2))


  // const toponiNaStupu = await getToponsAtLocation(lokacijaStup.id);

  // console.log(JSON.stringify(toponiNaStupu, null, 2))

  // const grupeZaSoStup = await getToponGroups(so.id);


  // console.log(JSON.stringify(grupeZaSoStup, null, 2))

  // const palacinkeIngredients = await getVariantIngredients(palacinkeLight.id);


  // console.log(JSON.stringify(palacinkeIngredients, null, 2))

  // const proizvodiSaSecerom = await getProductByTopon(biber.id);

  // console.log(JSON.stringify(proizvodiSaSecerom, null, 2))

  // const itemsAtStupWarehouse = await getProductsFromWarehouse(skladisteStup.id);

  // console.log(JSON.stringify(itemsAtStupWarehouse, null, 2))

  // const topons = await getToponsVariantLocation(rucakStup.id);


  // console.log(JSON.stringify(topons, null, 2));


  console.log('All products created');
};

module.exports = { seed };


