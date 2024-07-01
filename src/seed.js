const { saveProductFromJson } = require('./Product/productController');
const { Product, Variant, Topons, GroupOption, Option, GroupRule, SKU, SKURule, Location, VariantLocation } = require('./index');

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


  const productsData = [
    {
      name: 'Palačinke',
      description: 'Ukusne domaće palačinke sa raznovrsnim opcijama',
      type: 'food',
      variants: [
        {
          name: 'Čokoladna palačinka',
          groupOptions: [
            {
              name: 'Čokoladni dodaci',
              type: 'preliv',
              options: [
                { name: 'Nutella' },
                { name: 'Čokoladne mrvice' }
              ]
            }
          ],
          topons: [
            { id: '11111111-1111-1111-1111-111111111111', quantity: 2 },
            { id: '22222222-2222-2222-2222-222222222222', quantity: 3 }
          ],
          locationIds: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb']

        },
        {
          name: 'Obična palačinka',
          groupOptions: [
            {
              name: 'Dodaci za običnu palačinku',
              type: 'preliv',
              options: [
                { name: 'Šećer' },
                { name: 'Limun' }
              ]
            }
          ],
          topons: [
            { id: '33333333-3333-3333-3333-333333333333', quantity: 1 },
            { id: '44444444-4444-4444-4444-444444444444', quantity: 4 }
          ],
          locationIds: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb']

        }
      ]
    },
    {
      name: 'Pizza',
      description: 'Delicious homemade pizzas with various toppings',
      type: 'food',
      variants: [
        {
          name: 'Margherita',
          groupOptions: [
            {
              name: 'Cheese Options',
              type: 'topping',
              options: [
                { name: 'Mozzarella' },
                { name: 'Parmesan' }
              ]
            }
          ],
          topons: [
            { id: '55555555-5555-5555-5555-555555555555', quantity: 5 },
            { id: '66666666-6666-6666-6666-666666666666', quantity: 3 }
          ],
          locationIds: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb']

        },
        {
          name: 'Pepperoni',
          groupOptions: [
            {
              name: 'Cheese Options',
              type: 'topping',
              options: [
                { name: 'Mozzarella' },
                { name: 'Cheddar' }
              ]
            }
          ],
          topons: [
            { id: '77777777-7777-7777-7777-777777777777', quantity: 10 },
            { id: '88888888-8888-8888-8888-888888888888', quantity: 5 }
          ],
          locationIds: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb']

        }
      ]
    },
    {
      name: 'Burger',
      description: 'Juicy homemade burgers with various toppings',
      type: 'food',
      variants: [
        {
          name: 'Cheeseburger',
          groupOptions: [
            {
              name: 'Cheese Types',
              type: 'topping',
              options: [
                { name: 'American Cheese' },
                { name: 'Swiss Cheese' }
              ]
            }
          ],
          topons: [
            { id: '99999999-9999-9999-9999-999999999999', quantity: 1 },
            { id: '66666666-6666-6666-6666-666666666666', quantity: 2 }
          ],
          locationIds: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb']

        },
        {
          name: 'Bacon Burger',
          groupOptions: [
            {
              name: 'Cheese Types',
              type: 'topping',
              options: [
                { name: 'Cheddar Cheese' },
                { name: 'Blue Cheese' }
              ]
            }
          ],
          topons: [
            { id: 'dddddddd-dddd-dddd-dddd-dddddddddddd', quantity: 3 },
            { id: '00000000-0000-0000-0000-000000000000', quantity: 2 }
          ],
          locationIds: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb']

        }
      ]
    },
    {
      name: 'Salad',
      description: 'Fresh and healthy salads with various toppings',
      type: 'food',
      variants: [
        {
          name: 'Caesar Salad',
          groupOptions: [
            {
              name: 'Dressing Options',
              type: 'dressing',
              options: [
                { name: 'Caesar Dressing' },
                { name: 'Ranch Dressing' }
              ]
            }
          ],
          topons: [
            { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', quantity: 10 },
            { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', quantity: 5 }
          ],
          locationIds: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb']

        },
        {
          name: 'Greek Salad',
          groupOptions: [
            {
              name: 'Cheese Options',
              type: 'topping',
              rules: [
                {
                  name: 'Single Select Rule',
                  description: 'Only one option can be selected from this group',
                  ruleType: 'singleSelect',
                  ruleValue: ''
                },
                {
                  name: 'Maximum Select Rule',
                  description: 'Up to three options can be selected from this group',
                  ruleType: 'maxSelect',
                  ruleValue: '3'
                }
              ],
              options: [
                { name: 'Feta Cheese' },
                { name: 'Goat Cheese' }
              ]
            }
          ],
          topons: [
            { id: '88888888-8888-8888-8888-888888888888', minValue: 10 },
            { id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', quantity: 5 }
          ],
          locationIds: ['aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb']


        }
      ]
    }
  ];

  // for (const productJson of productsData) {
  //     const product = await Product.create({
  //         name: productJson.name,
  //         description: productJson.description,
  //         type: productJson.type
  //     });

  //     if (productJson.type === 'combo') {
  //         for (const itemId of productJson.items) {
  //             const item = await Product.findOne({
  //                 where: { id: itemId }
  //             });
  //             await product.addComboItem(item);
  //         }
  //     } else {
  //         for (const variantData of productJson.variants) {
  //             const variant = await Variant.create({
  //                 name: variantData.name,
  //                 ProductId: product.id
  //             });

  //             if (variantData.topons) {
  //                 for (const toponData of variantData.topons) {
  //                     const topon = await Topons.findOne({ where: { id: toponData.id } });
  //                     if (topon) {
  //                         await variant.addTopons(topon);
  //                     }
  //                 }
  //             }

  //             if (variantData.groupOptions) {
  //                 for (const groupOptionData of variantData.groupOptions) {
  //                     const groupOption = await GroupOption.create({
  //                         name: groupOptionData.name,
  //                         type: groupOptionData.type,
  //                         VariantId: variant.id
  //                     });

  //                     if (groupOptionData.rules) {
  //                         for (const ruleData of groupOptionData.rules) {
  //                             await GroupRule.create({
  //                                 name: ruleData.name,
  //                                 description: ruleData.description,
  //                                 ruleType: ruleData.ruleType,
  //                                 ruleValue: ruleData.ruleValue,
  //                                 GroupOptionId: groupOption.id
  //                             });
  //                         }
  //                     }

  //                     if (groupOptionData.options) {
  //                         for (const optionData of groupOptionData.options) {
  //                             await Option.create({
  //                                 name: optionData.name,
  //                                 GroupOptionId: groupOption.id
  //                             });
  //                         }
  //                     }
  //                 }
  //             }

  //             if (variantData.locationIds) {
  //                 for (const locationId of variantData.locationIds) {
  //                     const location = await Location.findOne({ where: { id: locationId } });
  //                     if (location) {
  //                         await variant.addLocation(location);


  //                         const rule = await SKURule.create({
  //                             name: `${variant.name} Rule for ${location.name}`,
  //                             VariantId: variant.id,
  //                             LocationId: location.id
  //                         });

  //                         await SKU.create({
  //                             name: `${variant.name} SKU for ${location.name}`,
  //                             stock: 100, 
  //                             price: 10, 
  //                             SKURuleId: rule.id
  //                         });
  //                     }
  //                 }
  //             }
  //         }
  //     }
  // }


  console.log('All products created');
};

module.exports = { seed };
