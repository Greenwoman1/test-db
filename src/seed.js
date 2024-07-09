const { name } = require('ejs');
const { saveProductFromJson, createProduct } = require('./Product/productController');
const { Product, Variant, Topons, GroupOption, Option, GroupRule, SKU, SKURule, Location, VariantLocation, ComboVariants, GroupOptions, GroupTopons, PriceHistory, Order, OrderItems, ProductO, ProductT, OrderItemsCombo, User } = require('./index');
const { handleVariants } = require('./Product/utils');
const { Json } = require('sequelize/lib/utils');
const { Sequelize } = require('sequelize');
const sequelize = require('../sequelize');

const seed = async () => {
  const toponsData = [
    { id: '11111111-1111-1111-1111-111111111111', name: 'Banana', minValue: 0, maxValue: 5, defaultValue: 2, stock: 4561, price: 0 },
    { id: '22222222-2222-2222-2222-222222222222', name: 'Jagoda', minValue: 0, maxValue: 5, defaultValue: 2, stock: 4561, price: 0 },
    { id: '33333333-3333-3333-3333-333333333333', name: 'Med', minValue: 0, maxValue: 5, defaultValue: 2, stock: 4561, price: 0 },
    { id: '44444444-4444-4444-4444-444444444444', name: 'Orah', minValue: 0, maxValue: 5, defaultValue: 2, stock: 4561, price: 0 },
    { id: '55555555-5555-5555-5555-555555555555', name: 'Basil', minValue: 0, maxValue: 5, defaultValue: 2, stock: 4561, price: 0 },
    { id: '66666666-6666-6666-6666-666666666666', name: 'Tomato', minValue: 0, maxValue: 5, defaultValue: 2, stock: 4561, price: 0 },
    { id: '77777777-7777-7777-7777-777777777777', name: 'Pepperoni', minValue: 0, maxValue: 5, defaultValue: 2, stock: 4561, price: 0 },
    { id: '88888888-8888-8888-8888-888888888888', name: 'Olives', minValue: 0, maxValue: 5, defaultValue: 2, stock: 4561, price: 0 },
    { id: '99999999-9999-9999-9999-999999999999', name: 'Lettuce', minValue: 0, maxValue: 5, defaultValue: 2, stock: 4561, price: 0 },
    { id: '00000000-0000-0000-0000-000000000000', name: 'Pickles', minValue: 0, maxValue: 5, defaultValue: 2, stock: 4561, price: 0 },
    { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Croutons', minValue: 0, maxValue: 5, defaultValue: 2, stock: 4561, price: 0 },
    { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Parmesan', minValue: 0, maxValue: 5, defaultValue: 2, stock: 4561, price: 0 },
    { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', name: 'Feta Cheese', minValue: 0, maxValue: 5, defaultValue: 2, stock: 4561, price: 0 },
    { id: 'dddddddd-dddd-dddd-dddd-dddddddddddd', name: 'Goat Cheese', minValue: 0, maxValue: 5, defaultValue: 2, stock: 4561, price: 0 },
    { id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', name: 'Cucumber', minValue: 0, maxValue: 5, defaultValue: 2, stock: 4561, price: 0 }
  ];

  const createToponsWithSKUs = async (toponsData) => {
    try {
      for (const toponData of toponsData) {
        const topon = await Topons.create(toponData);

        const rule = await SKURule.create({
          name: topon.name,
          ToponId: topon.id
        });

        await SKU.create({
          name: topon.name,
          stock: toponData.stock,
          price: toponData.price,
          SKURuleId: rule.id
        });
      }

      console.log('Topons and associated SKUs created successfully.');
    } catch (error) {
      console.error('Error creating topons and SKUs:', error);
    }
  };

  await createToponsWithSKUs(toponsData);




  const locationsData = [
    { id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Stup Hadziabdinica' },
    { id: 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Pofalici' }
  ];

  const createLocations = async (locationsData) => {
    try {
      for (const locationData of locationsData) {
        await Location.create(locationData);
      }
      console.log('Locations created successfully.');
    } catch (error) {
      console.error('Error creating locations:', error);
    }
  };

  await createLocations(locationsData);


  const [p1, p2, p3, p4, p5, p6, p7] = await Product.bulkCreate([{
    name: 'P1', type: 'single', description: 'desc'
  }, {
    name: 'P2', type: 'single', description: 'desc'
  }, {
    name: 'P3', type: 'single', description: 'desc'
  }, {
    name: 'P4', type: 'single', description: 'desc'
  }, {
    name: 'P5', type: 'single', description: 'desc'
  }, {
    name: 'P6', type: 'single', description: 'desc'
  },
  { name: 'P7', type: 'combo', description: 'desc' }]);

  const [v1, v2, v3, v4, v5, v6, v7] = await Variant.bulkCreate([{
    name: 'V1',
    ProductId: p1.id
  }, {
    name: 'V2',
    ProductId: p1.id
  }, {
    name: 'V3',
    ProductId: p2.id
  }, {
    name: 'V4',
    ProductId: p2.id
  }, {
    name: 'V5',
    ProductId: p4.id
  }, {
    name: 'V6',
    ProductId: p5.id
  }]);


  for (const p of [p1, p2, p3, p4, p5, p6, p7]) {
    if (p.type === 'combo') {

      const product = await Product.findOne({
        where: { id: p.id },



      })



      await ComboVariants.create({

        ProductId: p.id,
        VariantId: v1.id
      })
    }
  }


  console.log('Products and variants created successfully.');

  const comboProduct = await Product.findOne({
    where: { id: p7.id },
    include: [{
      model: Variant,
      as: 'comboVariants',
      through: {
        attributes: []
      },
      attributes: ['id', 'name'],

    }]
  });

  const JsonProduct = {
    "name": "test dsdsa",
    "description": "Delicious homemade pancakes with various options",
    "type": "food",
    "variants": [
      {
        "name": "Regular Pancake",
        "price": 25,
        "groupOptions": [
          {
            "name": "Add-ons for Regular Pancake",
            "type": "multipleSelect",
            "rules": "{}",
            "options": [
              "butter",
              "maple syrup"
            ]
          }
        ],
        "groupTopons": [
          {
            "name": "Add-ons for Regular Pancake",
            "type": "multipleSelect",
            "rules": "{}",
            "topons": [
              {
                "toponId": "33333333-3333-3333-3333-333333333333",
                "rules": "{}"
              },
              {
                "toponId": "44444444-4444-4444-4444-444444444444",
                "rules": "{}"
              }
            ]
          }
        ],
        "locationIds": [
          "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
        ]
      },
      {
        "name": "Chocolate Pancake",
        "price": 465,
        "groupOptions": [
          {
            "name": "Add-ons for Chocolate Pancake",
            "type": "multipleSelect",
            "rules": "{}",
            "options": [
              "chocolate chips",
              "whipped cream"
            ]
          }
        ],
        "groupTopons": [
          {
            "name": "Add-ons for Chocolate Pancake",
            "type": "multipleSelect",
            "rules": "{}",
            "topons": [
              {
                "toponId": "55555555-5555-5555-8555-555555555555",
                "rules": "{}"
              },
              {
                "toponId": "66666666-6666-6666-6666-666666666666",
                "rules": "{}"
              }
            ]
          }
        ],
        "locationIds": [
          "bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
        ]
      }
    ]
  }
  const result = await sequelize.transaction(async (t) => {

    const product = await createProduct(JsonProduct, t);

    await handleVariants(JsonProduct.variants, product.id, t);

    return product;

  });

  console.log(JSON.stringify(result));


  const getProductSettings = async (productId) => {
    try {

      const product = await Product.findOne({
        where: { id: productId },
        attributes: ['id', 'name', 'description', 'type'],
        include: [
          {
            model: Variant,
            as: 'Variants',
            attributes: ['id', 'name'],
            include: [
              {
                model: GroupOptions,
                as: 'GroupOptions',
                attributes: ['id', 'name', 'type', 'rules'],
                include: [
                  {
                    model: Option,
                    attributes: ['id', 'name'],
                  },
                ],
              },
              {
                model: GroupTopons,
                as: 'GroupTopons',
                attributes: ['id', 'name', 'type', 'rules'],
                include: [
                  {
                    model: Topons,
                    as: 'Topons',
                    attributes: ['id', 'name'],
                    through: {
                      attributes: [],
                    },
                  },
                ],
              },
              {
                model: PriceHistory,
                as: 'Prices',
                attributes: ['price', 'createdAt'],
              },
              {
                model: Location,
                as: 'Locations',
                attributes: ['id', 'name'],
                through: {
                  attributes: [],
                },
              },
            ],
          },
          {
            model: Variant,
            attributes: ['id', 'name'],
            as: 'comboVariants',
            through: {
              attributes: [],
            },
            include: [
              {
                model: GroupOptions,
                as: 'GroupOptions',
                attributes: ['id', 'name', 'type', 'rules'],
                include: [
                  {
                    model: Option,
                    attributes: ['id', 'name'],
                  },
                ],
              },
              {
                model: GroupTopons,
                as: 'GroupTopons',
                attributes: ['id', 'name', 'type', 'rules'],
                include: [
                  {
                    model: Topons,
                    as: 'Topons',
                    attributes: ['id', 'name'],
                    through: {
                      attributes: [],
                    },
                  },
                ],
              },
              {
                model: PriceHistory,
                as: 'Prices',
                attributes: ['price', 'createdAt'],
              },
              {
                model: Location,
                as: 'Locations',
                attributes: ['id', 'name'],
                through: {
                  attributes: [],
                },
              },
            ],
          },
        ],
      });
      return product;
    } catch (error) {
      console.error('Error getting product settings:', error);
      throw error;
    }
  };

  const productSettings = await getProductSettings(
    result.id);

  console.log(JSON.stringify(productSettings));


  /*
    const c1 = await Product.create({
      name: 'piletina',
      description: 'piletina',
      type: 'single',
      price: 50
    })
    const c2 = await Product.create({
      name: 'kola',
      description: 'piletina',
      type: 'single',
      price: 50
    })
    const c3 = await Product.create({
      name: 'fanta',
      description: 'piletina',
      type: 'single',
      price: 50
    })
  
  
    const v1 = await Variant.create({
      name: 'piletina curry ',
      ProductId: c1.id
    })
    const v2 = await Variant.create({
      name: 'piletina bijeli soss ',
      ProductId: c1.id
    })
    const v3 = await Variant.create({
      name: 'kola ',
      ProductId: c2.id
    })
  
    const v4 = await Variant.create({
      name: 'fanta ',
      ProductId: c3.id
    })
  
    const go1 = await GroupOptions.create({
      name: 'sokovi',
      type: 'single',
      VariantId: v1.id,
      rules: "{}"
    })
    const go2 = await GroupOptions.create({
      name: 'sokovi',
      type: 'single',
      VariantId: v2.id,
      rules: "{}"
    })
    const go3 = await GroupOptions.create({
      name: 'sokovi',
      type: 'single',
      VariantId: v3.id,
      rules: "{}"
    })
  
    const gt1 = await GroupTopons.create({
      name: 'sokovi',
      type: 'single',
      VariantId: v1.id,
      rules: "{}"
    })
    const gt2 = await GroupTopons.create({
      name: 'sokovi',
      type: 'single',
      VariantId: v2.id,
      rules: "{}"
    })
    const gt3 = await GroupTopons.create({
      name: 'sokovi',
      type: 'single',
      VariantId: v3.id,
      rules: "{}"
    })
  
  
  
    const o1 = await Option.create({
      name: 'sokovi',
      GroupOptionId: go1.id
    })
    const o2 = await Option.create({
      name: 'sokovi',
      GroupOptionId: go2.id
    })
    const o3 = await Option.create({
      name: 'sokovi',
      GroupOptionId: go3.id
    })
  
    const t1 = await Topons.create({
      name: 'sokovi',
      GroupToponId: gt1.id
    })
    const t2 = await Topons.create({
      name: 'sokovi',
      GroupToponId: gt2.id
    })
    const t3 = await Topons.create({
      name: 'sokovi',
      GroupToponId: gt3.id
    })
  
  
    const order1 = await Order.create({
      userId: "42ce2767-9442-43b6-bc8e-3fa487c83c5d",
      LocationId: "42ce2767-9442-43b6-bc8e-3fa487c83c5d",
      status: "pending",
      totalPrice: 0
  
    })
  
    const orderItems1 = await OrderItems.create({
      OrderId: order1.id,
      VariantId: v1.id,
      quantity: 1
    })
  
    const combo1 = await Product.create({
      name: 'combo1',
      type: 'combo',
      description: 'combo1'
    })
  
    const cv1 = await ComboVariants.create({
      ProductId: combo1.id,
      VariantId: v1.id
    })
    const cv2 = await ComboVariants.create({
      ProductId: combo1.id,
      VariantId: v2.id
    })
  
    const po1 = await ProductO.create({
      OrderItemId: orderItems1.id,
      OptionId: o1.id
    })
  
    const po2 = await ProductO.create({
      OrderItemId: orderItems1.id,
      OptionId: o2.id
    })
  
  
    const pt1 = await ProductT.create({
      OrderItemId: orderItems1.id,
      ToponId: t1.id
    })
    const pt2 = await ProductT.create({
      OrderItemId: orderItems1.id,
      ToponId: t2.id
    })
  
  
  
  
    const order2 = await Order.create({
      userId: "42ce2767-9442-43b6-bc8e-3fa487c83c5d",
      LocationId: "42ce2767-9442-43b6-bc8e-3fa487c83c5d",
      status: "pending",
      totalPrice: 0
    })
  
  
    const oi1 = await OrderItems.create({
      OrderId: order2.id,
      VariantId: v3.id,
      quantity: 1
    })
    const oi2 = await OrderItems.create({
      OrderId: order2.id,
      VariantId: v4.id,
      quantity: 1
    })
  
    const po4 = await ProductO.create({
      OrderItemId: oi1.id,
      OptionId: o3.id
    })
    const po5 = await ProductO.create({
      OrderItemId: oi2.id,
      OptionId: o3.id
    })
  
    const pt4 = await ProductT.create({
      OrderItemId: oi1.id,
      ToponId: t3.id
    })
    const pt5 = await ProductT.create({
      OrderItemId: oi2.id,
      ToponId: t3.id
    })
  
  
    const OrderItemsCombo1 = await OrderItemsCombo.create({
      OrderItemId: oi1.id,
      ComboVariantId: cv1.id
    })
    const OrderItemsCombo2 = await OrderItemsCombo.create({
      OrderItemId: oi2.id,
      ComboVariantId: cv2.id,
      OrderId: order2.id
    })
  
  
    const cpo1 = await ProductO.create({
      OrderItemId: oi1.id,
      OptionId: o1.id
    })
    const cpo2 = await ProductO.create({
      OrderItemId: oi2.id,
      OptionId: o2.id
    })
  
  
    const cpt1 = await ProductT.create({
      OrderItemId: oi1.id,
      ToponId: t1.id
    })
    const cpt2 = await ProductT.create({
      OrderItemId: oi1.id,
      ToponId: t2.id
    })
  
  
  
  
  
    const order = await Order.findOne({
      where: { id: order2.id },
      include: [
        {
          model: User,
          required: false
        },
        {
          model: OrderItems,
          include: [
            {
              model: Variant,
            },
            {
  
              model: Option,
              through: { attributes: [] },
  
            },
            {
  
              model: Topons,
              through: { attributes: [] },
            }
          ]
        },
        {
          model: OrderItemsCombo,
  
          required: false,
          include: [
            {
              model: ComboVariants,
  
            }
          ]
        },
  
  
      ]
    })
  
  
  
  
  
  
  
    console.log(JSON.stringify(order));
  
  
  */
  const chicken = await Product.create({ name: 'Chicken', description: 'Grilled Chicken', type: 'single', price: 50 });
  const coke = await Product.create({ name: 'Coke', description: 'Cold Drink', type: 'single', price: 20 });
  const fanta = await Product.create({ name: 'Fanta', description: 'Cold Drink', type: 'single', price: 20 });
  const mealCombo = await Product.create({ name: 'Meal Combo', description: 'Combo of Chicken and Drink', type: 'combo', price: 70 });

  const chickenCurry = await Variant.create({ name: 'Chicken Curry', ProductId: chicken.id });
  const chickenWhiteSauce = await Variant.create({ name: 'Chicken in White Sauce', ProductId: chicken.id });
  const regularCoke = await Variant.create({ name: 'Regular Coke', ProductId: coke.id });
  const regularFanta = await Variant.create({ name: 'Regular Fanta', ProductId: fanta.id });

  const extraSauceGroup = await GroupOptions.create({ name: 'Extra Sauce', type: 'single', VariantId: chickenCurry.id, rules: "{}" });
  const iceGroupCoke = await GroupOptions.create({ name: 'Ice', type: 'single', VariantId: regularCoke.id, rules: "{}" });
  const iceGroupFanta = await GroupOptions.create({ name: 'Ice', type: 'single', VariantId: regularFanta.id, rules: "{}" });

  const extraCheeseGroup = await GroupTopons.create({ name: 'Extra Cheese', type: 'single', VariantId: chickenCurry.id, rules: "{}" });
  const lemonGroupCoke = await GroupTopons.create({ name: 'Lemon', type: 'single', VariantId: regularCoke.id, rules: "{}" });
  const lemonGroupFanta = await GroupTopons.create({ name: 'Lemon', type: 'single', VariantId: regularFanta.id, rules: "{}" });

  const extraSauce = await Option.create({ name: 'Extra Sauce', GroupOptionId: extraSauceGroup.id });
  const iceOptionCoke = await Option.create({ name: 'Ice', GroupOptionId: iceGroupCoke.id });
  const iceOptionFanta = await Option.create({ name: 'Ice', GroupOptionId: iceGroupFanta.id });

  const extraCheese = await Topons.create({ name: 'Extra Cheese', GroupToponId: extraCheeseGroup.id });
  const lemonCoke = await Topons.create({ name: 'Lemon', GroupToponId: lemonGroupCoke.id });
  const lemonFanta = await Topons.create({ name: 'Lemon', GroupToponId: lemonGroupFanta.id });

  const comboChickenWhiteSauce = await ComboVariants.create({ ProductId: mealCombo.id, VariantId: chickenWhiteSauce.id });
  const comboRegularCoke = await ComboVariants.create({ ProductId: mealCombo.id, VariantId: regularCoke.id });

  const orderAlice = await Order.create({ userId: "user-id-alice", LocationId: "30700db8-d88a-4cf7-8fb8-7ae23efedc70", status: "pending", totalPrice: 0 });
  const orderBob = await Order.create({ userId: "user-id-bob", LocationId: "30700db8-d88a-4cf7-8fb8-7ae23efedc70", status: "pending", totalPrice: 0 });

  const orderItemAliceChicken = await OrderItems.create({ OrderId: orderAlice.id, VariantId: chickenCurry.id, quantity: 1 });
  const orderItemAliceCoke = await OrderItems.create({ OrderId: orderAlice.id, VariantId: regularCoke.id, quantity: 1 });

  await ProductO.create({ OrderItemId: orderItemAliceChicken.id, OptionId: extraSauce.id });
  await ProductT.create({ OrderItemId: orderItemAliceChicken.id, ToponId: extraCheese.id });

  const orderItemBobChickenWhiteSauce = await OrderItems.create({ OrderId: orderBob.id, VariantId: chickenWhiteSauce.id, quantity: 1 });
  const orderItemBobCoke = await OrderItems.create({ OrderId: orderBob.id, VariantId: regularCoke.id, quantity: 1 });

  await ProductO.create({ OrderItemId: orderItemBobChickenWhiteSauce.id, OptionId: extraSauce.id });
  await ProductT.create({ OrderItemId: orderItemBobChickenWhiteSauce.id, ToponId: extraCheese.id });

  await ProductO.create({ OrderItemId: orderItemBobCoke.id, OptionId: iceOptionCoke.id });
  await ProductT.create({ OrderItemId: orderItemBobCoke.id, ToponId: lemonCoke.id });

  await OrderItemsCombo.create({ OrderItemId: orderItemBobChickenWhiteSauce.id, ComboVariantId: comboChickenWhiteSauce.id, OrderId: orderBob.id });
  await OrderItemsCombo.create({ OrderItemId: orderItemBobCoke.id, ComboVariantId: comboRegularCoke.id, OrderId: orderBob.id });

  const orderDetails = await Order.findOne({
    where: { id: orderAlice.id },
    include: [
      { model: User, required: false },
      {
        model: OrderItems,
        include: [
          { model: Variant },
          { model: Option, through: { attributes: [] } },
          { model: Topons, through: { attributes: [] } }
        ]
      },
      {
        model: OrderItemsCombo,
        required: false,
        include: [{ model: ComboVariants, include: [{ model: Variant }] }]
      }
    ]
  });

  console.log(JSON.stringify(orderDetails, null, 2));


  console.log('All products created');
};

module.exports = { seed };
