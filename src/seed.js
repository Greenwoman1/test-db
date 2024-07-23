const { name } = require('ejs');
const { saveProductFromJson, createProduct } = require('./Product/productController');
const { Product, Variant, Topons, GroupOption, Option, GroupRule, SKU, SKURule, Location, ComboVariants, GroupOptions, GroupTopons, PriceHistory, Order, OrderItems, ProductO, ProductT, OrderItemsCombo, User, Balance, Ingredients, WarehouseLocations, Warehouse, VariantSKURule, IngredientSKURule, VariantLocations, VariantIngredients, GroupTopon, GroupToponsMid, LinkedVariants, ToponSKURule } = require('./index');
const { handleVariants } = require('./Product/utils');
const { Json } = require('sequelize/lib/utils');
const { Sequelize } = require('sequelize');
const sequelize = require('../sequelize');

const redisClient = require('../redisClient');
const { AcceptOrder } = require('./Order/utils');
const { describe, min } = require('./User/User');

const seed = async () => {


  // const locationsData = [
  //   { id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Stup Hadziabdinica' },
  //   { id: 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Pofalici' }
  // ];

  // const toponsData = [
  //   { id: '11111111-1111-1111-1111-111111111111', name: 'Banana', locations: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb'] },
  //   { id: '22222222-2222-2222-2222-222222222222', name: 'Jagoda', locations: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb'] },
  //   { id: '33333333-3333-3333-3333-333333333333', name: 'Med', locations: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb'] },
  //   { id: '44444444-4444-4444-4444-444444444444', name: 'Orah', locations: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb'] },
  //   { id: '55555555-5555-5555-5555-555555555555', name: 'Basil', locations: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb'] },
  //   { id: '66666666-6666-6666-6666-666666666666', name: 'Tomato', locations: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb'] },
  //   { id: '77777777-7777-7777-7777-777777777777', name: 'Pepperoni', locations: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb'] },
  //   { id: '88888888-8888-8888-8888-888888888888', name: 'Olives', locations: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb'] },
  //   { id: '99999999-9999-9999-9999-999999999999', name: 'Lettuce', locations: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb'] },
  //   { id: '00000000-0000-0000-0000-000000000000', name: 'Pickles', locations: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb'] },
  //   { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Croutons', locations: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb'] },
  //   { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Parmesan', locations: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb'] },
  //   { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', name: 'Feta Cheese', locations: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb'] },
  //   { id: 'dddddddd-dddd-dddd-dddd-dddddddddddd', name: 'Goat Cheese', locations: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb'] },
  //   { id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', name: 'Cucumber', locations: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb'] }
  // ];




  // const createLocations = async (locationsData) => {
  //   try {
  //     for (const locationData of locationsData) {
  //       await Location.create(locationData);
  //     }
  //   } catch (error) {
  //     console.error('Error creating locations:', error);
  //   }
  // };

  // await createLocations(locationsData);


  // const createToponsWithSKUs = async (toponsData) => {
  //   try {

  //     for (const toponData of toponsData) {
  //       const { id, name, locations } = toponData;
  //       const topon = await Topons.create({ id, name });

  //       for (const locationId of locations) {
  //         const location = await Location.findOne({ where: { id: locationId } });

  //         console.log(location)
  //         const sku = await SKU.create({
  //           name: topon.name,
  //           stock: toponData.stock || 5,
  //           price: toponData.price,
  //           LocationId: location.id
  //         });

  //         await topon.addSKU(sku);

  //         const rule = await SKURule.create({
  //           name: topon.name,
  //           SKUId: sku.id
  //         });
  //       }




  //     }

  //   } catch (error) {
  //     console.error('Error creating topons and SKUs:', error);
  //   }
  // };

  // await createToponsWithSKUs(toponsData);




  // const [p1, p2, p3, p4, p5, p6, p7] = await Product.bulkCreate([{
  //   name: 'P1', type: 'single', description: 'desc'
  // }, {
  //   name: 'P2', type: 'single', description: 'desc'
  // }, {
  //   name: 'P3', type: 'single', description: 'desc'
  // }, {
  //   name: 'P4', type: 'single', description: 'desc'
  // }, {
  //   name: 'P5', type: 'single', description: 'desc'
  // }, {
  //   name: 'P6', type: 'single', description: 'desc'
  // },
  // { name: 'P7', type: 'combo', description: 'desc' }]);

  // const [v1, v2, v3, v4, v5, v6, v7] = await Variant.bulkCreate([{
  //   name: 'V1',
  //   ProductId: p1.id
  // }, {
  //   name: 'V2',
  //   ProductId: p1.id
  // }, {
  //   name: 'V3',
  //   ProductId: p2.id
  // }, {
  //   name: 'V4',
  //   ProductId: p2.id
  // }, {
  //   name: 'V5',
  //   ProductId: p4.id
  // }, {
  //   name: 'V6',
  //   ProductId: p5.id
  // }]);


  // for (const p of [p1, p2, p3, p4, p5, p6, p7]) {
  //   if (p.type === 'combo') {

  //     const product = await Product.findOne({
  //       where: { id: p.id },



  //     })



  //     await ComboVariants.create({

  //       ProductId: p.id,
  //       VariantId: v1.id
  //     })
  //   }
  // }



  // const comboProduct = await Product.findOne({
  //   where: { id: p7.id },
  //   include: [{
  //     model: Variant,
  //     as: 'comboVariants',
  //     through: {
  //       attributes: []
  //     },
  //     attributes: ['id', 'name'],

  //   }]
  // });

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
  // const result = await sequelize.transaction(async (t) => {

  //   const product = await createProduct(JsonProduct, t);

  //   await handleVariants(JsonProduct.variants, product.id, t);

  //   return product;

  // });



  // const getProductSettings = async (productId) => {
  //   try {

  //     const product = await Product.findOne({
  //       where: { id: productId },
  //       attributes: ['id', 'name', 'description', 'type'],
  //       include: [
  //         {
  //           model: Variant,
  //           as: 'Variants',
  //           attributes: ['id', 'name'],
  //           include: [
  //             {
  //               model: GroupOptions,
  //               as: 'GroupOptions',
  //               attributes: ['id', 'name', 'type', 'rules'],
  //               include: [
  //                 {
  //                   model: Option,
  //                   attributes: ['id', 'name'],
  //                 },
  //               ],
  //             },
  //             {
  //               model: GroupTopons,
  //               as: 'GroupTopons',
  //               attributes: ['id', 'name', 'type', 'rules'],
  //               include: [
  //                 {
  //                   model: Topons,
  //                   as: 'Topons',
  //                   attributes: ['id', 'name'],
  //                   through: {
  //                     attributes: [],
  //                   },
  //                 },
  //               ],
  //             },
  //             {
  //               model: PriceHistory,
  //               as: 'Prices',
  //               attributes: ['price', 'createdAt'],
  //             },
  //             {
  //               model: Location,
  //               as: 'Locations',
  //               attributes: ['id', 'name'],
  //               through: {
  //                 attributes: [],
  //               },
  //             },
  //           ],
  //         },
  //         {
  //           model: Variant,
  //           attributes: ['id', 'name'],
  //           as: 'comboVariants',
  //           through: {
  //             attributes: [],
  //           },
  //           include: [
  //             {
  //               model: GroupOptions,
  //               as: 'GroupOptions',
  //               attributes: ['id', 'name', 'type', 'rules'],
  //               include: [
  //                 {
  //                   model: Option,
  //                   attributes: ['id', 'name'],
  //                 },
  //               ],
  //             },
  //             {
  //               model: GroupTopons,
  //               as: 'GroupTopons',
  //               attributes: ['id', 'name', 'type', 'rules'],
  //               include: [
  //                 {
  //                   model: Topons,
  //                   as: 'Topons',
  //                   attributes: ['id', 'name'],
  //                   through: {
  //                     attributes: [],
  //                   },
  //                 },
  //               ],
  //             },
  //             {
  //               model: PriceHistory,
  //               as: 'Prices',
  //               attributes: ['price', 'createdAt'],
  //             },
  //             {
  //               model: Location,
  //               as: 'Locations',
  //               attributes: ['id', 'name'],
  //               through: {
  //                 attributes: [],
  //               },
  //             },
  //           ],
  //         },
  //       ],
  //     });
  //     return product;
  //   } catch (error) {
  //     console.error('Error getting product settings:', error);
  //     throw error;
  //   }
  // };

  // const productSettings = await getProductSettings(
  //   result.id);



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
  /*   const createSingleProduct = async (name) => {
  
      return Product.create({
        name, describe: 'NIJE BITNO', type: 'single', price: Math.random(Math.random() * 1000)
      })
    }
  
    const cocalCola = await createSingleProduct('cocaCola')
  
   const attachVariantToLocation = async (product, variant) => {
  
    return product.createProductVarian({variantId: variant.id, dodatnaKolona: false})
  
   } */

  // const chicken = await Product.create({ name: 'Chicken', description: 'Grilled Chicken', type: 'single', price: 50 });
  // const coke = await Product.create({ name: 'Coke', description: 'Cold Drink', type: 'single', price: 20 });
  // const fanta = await Product.create({ name: 'Fanta', description: 'Cold Drink', type: 'single', price: 20 });
  // const mealCombo = await Product.create({ name: 'Meal Combo', description: 'Combo of Chicken and Drink', type: 'combo', price: 70 });

  // const chickenCurry = await Variant.create({ name: 'Chicken Curry', ProductId: chicken.id });
  // const chickenWhiteSauce = await Variant.create({ name: 'Chicken in White Sauce', ProductId: chicken.id });
  // const regularCoke = await Variant.create({ name: 'Regular Coke', ProductId: coke.id });
  // const regularFanta = await Variant.create({ name: 'Regular Fanta', ProductId: fanta.id });

  // const extraSauceGroup = await GroupOptions.create({ name: 'Extra Sauce', type: 'single', VariantId: chickenCurry.id, rules: "{}" });
  // const iceGroupCoke = await GroupOptions.create({ name: 'Ice', type: 'single', VariantId: regularCoke.id, rules: "{}" });
  // const iceGroupFanta = await GroupOptions.create({ name: 'Ice', type: 'single', VariantId: regularFanta.id, rules: "{}" });

  // const extraCheeseGroup = await GroupTopons.create({ name: 'Extra Cheese', type: 'single', VariantId: chickenCurry.id, rules: "{}" });
  // const lemonGroupCoke = await GroupTopons.create({ name: 'Lemon', type: 'single', VariantId: regularCoke.id, rules: "{}" });
  // const lemonGroupFanta = await GroupTopons.create({ name: 'Lemon', type: 'single', VariantId: regularFanta.id, rules: "{}" });

  // const extraSauce = await Option.create({ name: 'Extra Sauce', GroupOptionId: extraSauceGroup.id });
  // const iceOptionCoke = await Option.create({ name: 'Ice', GroupOptionId: iceGroupCoke.id });
  // const iceOptionFanta = await Option.create({ name: 'Ice', GroupOptionId: iceGroupFanta.id });

  // const extraCheese = await Topons.create({ name: 'Extra Cheese', GroupToponId: extraCheeseGroup.id });
  // const lemonCoke = await Topons.create({ name: 'Lemon', GroupToponId: lemonGroupCoke.id });
  // const lemonFanta = await Topons.create({ name: 'Lemon', GroupToponId: lemonGroupFanta.id });

  // const comboChickenWhiteSauce = await ComboVariants.create({ ProductId: mealCombo.id, VariantId: chickenWhiteSauce.id });
  // const comboRegularCoke = await ComboVariants.create({ ProductId: mealCombo.id, VariantId: regularCoke.id });

  // const orderAlice = await Order.create({ userId: "user-id-alice", LocationId: "30700db8-d88a-4cf7-8fb8-7ae23efedc70", status: "pending", totalPrice: 0 });
  // const orderBob = await Order.create({ userId: "user-id-bob", LocationId: "30700db8-d88a-4cf7-8fb8-7ae23efedc70", status: "pending", totalPrice: 0 });

  // const orderItemAliceChicken = await OrderItems.create({ OrderId: orderAlice.id, VariantId: chickenCurry.id, quantity: 1 });
  // const orderItemAliceCoke = await OrderItems.create({ OrderId: orderAlice.id, VariantId: regularCoke.id, quantity: 1 });

  // await ProductO.create({ OrderItemId: orderItemAliceChicken.id, OptionId: extraSauce.id });
  // await ProductT.create({ OrderItemId: orderItemAliceChicken.id, ToponId: extraCheese.id });

  // const orderItemBobChickenWhiteSauce = await OrderItems.create({ OrderId: orderBob.id, VariantId: chickenWhiteSauce.id, quantity: 1 });
  // const orderItemBobCoke = await OrderItems.create({ OrderId: orderBob.id, VariantId: regularCoke.id, quantity: 1 });

  // await ProductO.create({ OrderItemId: orderItemBobChickenWhiteSauce.id, OptionId: extraSauce.id });
  // await ProductT.create({ OrderItemId: orderItemBobChickenWhiteSauce.id, ToponId: extraCheese.id });

  // await ProductO.create({ OrderItemId: orderItemBobCoke.id, OptionId: iceOptionCoke.id });
  // await ProductT.create({ OrderItemId: orderItemBobCoke.id, ToponId: lemonCoke.id });

  // await OrderItemsCombo.create({ OrderItemId: orderItemBobChickenWhiteSauce.id, ComboVariantId: comboChickenWhiteSauce.id, OrderId: orderBob.id });
  // await OrderItemsCombo.create({ OrderItemId: orderItemBobCoke.id, ComboVariantId: comboRegularCoke.id, OrderId: orderBob.id });

  // const orderDetails = await Order.findOne({
  //   where: { id: orderAlice.id },
  //   include: [
  //     { model: User, required: false },
  //     {
  //       model: OrderItems,
  //       include: [
  //         { model: Variant },
  //         { model: Option, through: { attributes: [] } },
  //         { model: Topons, through: { attributes: [] } }
  //       ]
  //     },
  //     {
  //       model: OrderItemsCombo,
  //       required: false,
  //       include: [{ model: ComboVariants, include: [{ model: Variant }] }]
  //     }
  //   ]
  // });


  // const user = await User.create({ firstName: "Alice", lastName: "a@a.com", password: "a" });

  // const newBalance = await Balance.create({
  //   UserId: user.id,
  //   amount: 151,
  //   date: new Date(),
  //   reason: 'Initial Balance',
  //   comment: 'New balance added',
  // });

  // const totalBalance = await Balance.sum('amount', { where: { UserId: user.id } });

  // await redisClient.set(`user_balance_${user.id}`, JSON.stringify(totalBalance), 'EX', 36000);

  // const cacheKey = `user_balance_${user.id}`;

  // const cachedBalance = await redisClient.get(cacheKey);
  // console.log(cachedBalance);




  // const variants = await AcceptOrder("04aa29a0-0ff2-4b34-af04-2809871caa8d");


  // await PriceHistory.create({ itemId: '22222222-2222-2222-2222-222222222222', itemType: 'topon', price: 10 });
  // await PriceHistory.create({ itemId: '33333333-3333-3333-3333-333333333333', itemType: 'topon', price: 5 });

  /// kreiranje single proizvoda
  const createSingleProduct = async (name) => {
    return await Product.create({ name: name, type: 'single', description: 'description', });

  }

  ///kreiranje varijante proizvoda
  const createProductVariant = async (name, product) => {
    return await Variant.create({ name: name, ProductId: product.id });
  }

  ///kreiranje lokacija 
  const createLocation = async (name) => {
    return await Location.create({ name: name });
  }


  /// kreiranje sastojaka 
  const createIngredient = async (name) => {
    return await Ingredients.create({ name: name });
  }


  /// create user 
  const createUser = async (firstName, lastName, password) => {
    return await User.create({ firstName: firstName, lastName: lastName, password: password });
  }


  ///dodaj satojak na varijantu 
  const addIngredientToVariant = async (variant, ingredient) => {
    return await VariantIngredients.create({ VariantId: variant.id, IngredientId: ingredient.id });
  }

  /// add variant to location 
  const addVariantToLocation = async (variant, location) => {
    return await VariantLocations.create({ LocationId: location.id, VariantId: variant.id });
  }


  /// create sku
  const createSKU = async (name, stock, code, warehouse) => {
    return await SKU.create({ name: name, stock: stock, code: code, WarehouseId: warehouse.id, allowMinus: true });
  }

  ///create warehoue for sku 
  const createWarehouse = async (name, sku) => {
    return await Warehouse.create({ name: name });
  }

  ///add warehouse to location 
  const addWarehouseToLocation = async (warehouse, location) => {
    return await WarehouseLocations.create({ LocationId: location.id, WarehouseId: warehouse.id });
  }

  /// add rules for variant for sku

  const createSKURules = async (VariantLocation, VariantIngredient, sku) => {

    return await SKURule.create({ VariantLocationId: VariantLocation.id, VariantIngredientId: VariantIngredient?.id || null, SKUId: sku.id, unit: 'g', quantity: 1, disabled: false });
  }


  const stup = await createLocation('stup');
  const hadziabdinica = await createLocation('hadziabdinica');

  const proizvodKafa = await createSingleProduct('kafa');
  const proizvodPiletina = await createSingleProduct('piletina ');
  const kolaProizvod = await createSingleProduct('kola');


  const kolaLight = await createProductVariant('kolaLight', kolaProizvod);
  const kola = await createProductVariant('kola', kolaProizvod);

  const kolaStup = await addVariantToLocation(kola, stup);
  const kolaHadziabdinica = await addVariantToLocation(kola, hadziabdinica);

  const kolaLightStup = await addVariantToLocation(kolaLight, stup);
  const kolaLightHadziabdinica = await addVariantToLocation(kolaLight, hadziabdinica);


  const stupSkladiste = await createWarehouse('stup');
  const hadziabdinicaSkladiste = await createWarehouse('hadziabdinica');

  await addWarehouseToLocation(stupSkladiste, stup);
  await addWarehouseToLocation(hadziabdinicaSkladiste, hadziabdinica);


  const kolaSKU = await createSKU('kola', 10, 'kola', stupSkladiste);
  const kolaLightSKUHadzi = await createSKU('kolaLight', 10, 'kolaLight', hadziabdinicaSkladiste);
  const kolaLightSKUStup = await createSKU('kolaLight', 10, 'kolaLight', stupSkladiste);


  const kolaRules = await createSKURules(kolaStup, null, kolaSKU);
  const kolaLightRules = await createSKURules(kolaLightStup, null, kolaLightSKUHadzi);
  const kolaLightRulesStup = await createSKURules(kolaLightHadziabdinica, null, kolaLightSKUStup);



  const piletinaProizvod = await createSingleProduct('piletina');

  const piletina = await createIngredient('piletina');
  const riza = await createIngredient('riza');
  const curry = await createIngredient('curry');

  const piletinaObicnaVariant = await createProductVariant('piletinaObicna', piletinaProizvod);
  const piletinaRizaVariant = await createProductVariant('piletinaRiza', piletinaProizvod);
  const piletinaCurryVariant = await createProductVariant('piletinaCurry', piletinaProizvod);


  const piletinaHadzi = await addVariantToLocation(piletinaObicnaVariant, hadziabdinica);
  const piletinaRiza = await addVariantToLocation(piletinaRizaVariant, hadziabdinica);
  const piletinaCurry = await addVariantToLocation(piletinaCurryVariant, hadziabdinica);
  const piletinaStup = await addVariantToLocation(piletinaObicnaVariant, stup);
  const piletinaRizaStup = await addVariantToLocation(piletinaRizaVariant, stup);
  const piletinaCurryStup = await addVariantToLocation(piletinaCurryVariant, stup);

  const piletinaPiletina = await addIngredientToVariant(piletinaObicnaVariant, piletina);
  const pieltinaRizaRiza = await addIngredientToVariant(piletinaRizaVariant, riza);
  const piletinaRizaPiletina = addIngredientToVariant(piletinaRizaVariant, piletina);
  const piletinaCurryCurry = await addIngredientToVariant(piletinaCurryVariant, curry);
  const piletinaCurryPiletina = await addIngredientToVariant(piletinaCurryVariant, piletina);

  const piletinaSkuStup = await createSKU('piletina', 10, 'piletina', stupSkladiste);
  const rizaSKUStup = await createSKU('riza', 10, 'riza', stupSkladiste);
  const currySKUStup = await createSKU('curry', 10, 'curry', stupSkladiste);

  const piletinaHadziSKU = await createSKU('piletina', 10, 'piletina', hadziabdinicaSkladiste);
  const rizaHadziSKU = await createSKU('riza', 10, 'riza', hadziabdinicaSkladiste);
  const curryHadziSKU = await createSKU('curry', 10, 'curry', hadziabdinicaSkladiste);

  await createSKURules(piletinaHadzi, piletinaPiletina, piletinaHadziSKU);
  await createSKURules(piletinaRiza, pieltinaRizaRiza, rizaHadziSKU);
  await createSKURules(piletinaCurry, piletinaCurryPiletina, curryHadziSKU);

  await createSKURules(piletinaStup, piletinaPiletina, piletinaSkuStup);
  await createSKURules(piletinaRizaStup, pieltinaRizaRiza, rizaSKUStup);
  await createSKURules(piletinaCurryStup, piletinaCurryPiletina, currySKUStup);


  const createTopon = async (name) => {
    return await Topons.create({ name: name });
  }


  const createVariantGroup = async (variantLocation) => {
    return await GroupTopon.create({ VariantLocationId: variantLocation.id, rules: "{select: multipleselect}" });
  }

  const [secer, mlijeko, so, biber, limun, led] = await Promise.all([
    createTopon('secer'),
    createTopon('mlijeko'),
    createTopon('so'),
    createTopon('biber'),
    createTopon('limun'),
    createTopon('led'),

  ])

  /// rabela groupTopons
  /// kola stup

  const kolaStupGroup = await createVariantGroup(kolaStup);


  const kolaHadziabdinicaGroup = await createVariantGroup(kolaHadziabdinica);

  /// kolaLightStup


  const kolaLightStupGroup = await createVariantGroup(kolaLightStup);

  /// kolalighthadzi

  const kolaLightHadziGroup = await createVariantGroup(kolaLightHadziabdinica)



  const createGroupTopon = async (group, topon) => {

    return await GroupToponsMid.create({ GroupToponId: group.id, ToponId: topon.id, disabled: false, min: 0, max: 10, default: 0 });

  }



  /// tabela GroupToponsMid

  const groupToponMidMlijeko = await createGroupTopon(kolaStupGroup, mlijeko);
  const groupToponMidSo = await createGroupTopon(kolaStupGroup, so);
  const groupToponMidBiber = await createGroupTopon(kolaStupGroup, biber);
  const groupToponMidLimun = await createGroupTopon(kolaHadziabdinicaGroup, limun);
  const groupToponMidLed = await createGroupTopon(kolaHadziabdinicaGroup, secer);



  const groupToponMidMlijekoLight = await createGroupTopon(kolaLightStupGroup, mlijeko);
  const groupToponMidSoLight = await createGroupTopon(kolaLightStupGroup, so);
  const groupToponMidBiberLight = await createGroupTopon(kolaLightStupGroup, biber);
  const groupToponMidLimunLight = await createGroupTopon(kolaLightStupGroup, limun);
  const groupToponMidLedLight = await createGroupTopon(kolaLightStupGroup, led);

  const groupToponMidMlijekoLightHadzi = await createGroupTopon(kolaLightHadziGroup, mlijeko);
  const groupToponMidSoLightHadzi = await createGroupTopon(kolaLightHadziGroup, so);
  const groupToponMidBiberLightHadzi = await createGroupTopon(kolaLightHadziGroup, biber);
  const groupToponMidLimunLightHadzi = await createGroupTopon(kolaLightHadziGroup, limun);
  const groupToponMidLedLightHadzi = await createGroupTopon(kolaLightHadziGroup, secer);



  const allTopons = await Variant.findAll({

    include: [
      {
        model: VariantLocations,
        as: 'VL',
        include: [
          {
            model: GroupTopon,
            include: [
              {
                model: GroupToponsMid,
                include: [
                  { model: Topons }
                ]
              }
            ]
          }
        ]


      },
    ]
  });

  // console.log(JSON.stringify(allTopons, null, 2));








  /// daj mi sve iteme koje imam u skladistu na stupu

  const warehouseItems = await SKU.findAll({
    where: { WarehouseId: hadziabdinicaSkladiste.id },

    include: [
      {
        model: SKURule,
        attributes: [],
        as: 'SKURules',
        include: [
          {
            model: VariantLocations,
            required: false,
            include: [
              { model: Variant, as: 'VL' }
            ]
          },
          {
            model: VariantIngredients,
            required: false,
            include: [
              {
                model: Ingredients,
                required: false
              }
            ]
          }

        ]
      }

    ]
  });



  /// 

  const createCombo = async (name) => {

    return await Product.create({ name: name, type: 'combo', description: 'description', })
  }

  const rucak = await createCombo('rucak');

  const rucak1 = await createProductVariant('rucak1', rucak);

  const rucak2 = await createProductVariant('rucak2', rucak);

  const rucak1loc = await addVariantToLocation(rucak1, stup);

  const rucak2loc = await addVariantToLocation(rucak2, hadziabdinica);

  const addVarianttocombo = async (varCombo, varLoc) => {
    return await LinkedVariants.create({ VariantId: varCombo.id, VariantLocationId: varLoc.id })
  }


  const kolaRucak1 = await addVarianttocombo(rucak1, kolaStup)
  const pieltinaRucak1 = await addVarianttocombo(rucak1, piletinaStup);



  const kolaRucak2 = await addVarianttocombo(rucak2, kolaLightStup)
  const pieltinaRucak2 = await addVarianttocombo(rucak2, piletinaHadzi);


  const rucak1Group = await createVariantGroup(rucak1loc);
  const rucak2Group = await createVariantGroup(rucak2loc);



  const rucak1GroupToponsmlijeko = await createGroupTopon(rucak1Group, mlijeko);
  const rucak1GroupToponsso = await createGroupTopon(rucak1Group, so);


  const rucak2GroupToponsmlijeko = await createGroupTopon(rucak2Group, mlijeko);
  const rucak2GroupToponsso = await createGroupTopon(rucak2Group, so);
  const rucak2GroupToponsbiber = await createGroupTopon(rucak2Group, biber);
  const rucak2GroupToponslimun = await createGroupTopon(rucak2Group, limun);
  const rucak2GroupToponsled = await createGroupTopon(rucak2Group, led);

  const createToponSKURule = async (groupToponMid, SKU) => {
    return await ToponSKURule.create({ GroupToponsMidId: groupToponMid.id, SKUId: SKU.id, unit: 'kg', quantity: 1, disabled: false })

  }

  const mlijekoSKU = await createSKU('mlijeko', 10, 10, stupSkladiste);
  const soSKU = await createSKU('so', 10, 10, stupSkladiste);
  const biberSKU = await createSKU('biber', 10, 10, stupSkladiste);
  const limunSKU = await createSKU('limun', 10, 10, stupSkladiste);
  const ledSKU = await createSKU('led', 10, 10, stupSkladiste);



  const mlijekoToponSKURule = await createToponSKURule(rucak1GroupToponsmlijeko, mlijekoSKU);
  const soToponSKURule = await createToponSKURule(rucak1GroupToponsso, soSKU);

  const biberToponSKURule = await createToponSKURule(rucak2GroupToponsbiber, biberSKU);
  const limunToponSKURule = await createToponSKURule(rucak2GroupToponslimun, limunSKU);
  const ledToponSKURule = await createToponSKURule(rucak2GroupToponsled, ledSKU);





  const getToponsForVariant = async (variantId) => {

    return await Topons.findAll({
      include: [
        {
          model: GroupToponsMid,
          required: true,
          include: [
            {
              model: GroupTopon,
              required: true,
              include: [
                {
                  model: VariantLocations,
                  required: true,
                  include: [
                    {
                      model: Variant,
                      as: 'VL',
                      attributes: ['name'],
                      required: true,
                      where: { id: variantId },
                    }
                  ]

                }]

            }
          ]

        }
      ]
    })
  }


  const toponiZaKolu = await getToponsForVariant(kola.id);




  const getToponByVariantLocation = async (variantId, locationId) => {

    return await Topons.findAll({
      include: [
        {
          model: GroupToponsMid,
          required: true,
          include: [
            {
              model: GroupTopon,
              required: true,
              include: [
                {
                  model: VariantLocations,
                  where: { LocationId: locationId },
                  required: true,
                  include: [
                    {
                      model: Variant,
                      as: 'VL',
                      attributes: ['name'],
                      required: true,
                      where: { id: variantId },
                    }
                  ]

                }]

            }
          ]

        }
      ]
    })

  }


  // const toponsiKolaStup = await getToponByVariantLocation(kola.id, stup.id);

  // console.log(JSON.stringify(toponsiKolaStup, null, 2));


  const getSKURulesForVariantIngredients = async (variantId) => {
    return await Variant.findAll({
      where: { id: variantId },
      include: [
        {
          model: VariantIngredients,
          required: false,
          include: [
            { model: Ingredients, required: true },
            {
              model: SKURule,
              required: false
            }
          ]
        }
      ]
    })


  }


  const piletinCurrySastojciRules = await getSKURulesForVariantIngredients(piletinaCurryVariant.id);
  // console.log(JSON.stringify(piletinCurrySastojciRules, null, 2));
  // console.log(JSON.stringify(toponiZaKolu, null, 2));


  /// check if is disabled or not


  console.log('All products created');
};

module.exports = { seed };
