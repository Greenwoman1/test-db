const { createSKU } = require('./SKU/skuController');
const { Product, Variant, Topons, GroupOption, Option, GroupRule, SKU, SKURule, Location, ComboVariants, GroupOptions, GroupTopons, PriceHistory, Order, OrderItems, ProductO, ProductT, OrderItemsCombo, User, Balance, Ingredients, WarehouseLocations, Warehouse, VariantSKURule, IngredientSKURule, VariantLocations, VariantIngredients, GroupTopon, GroupToponsMid, LinkedVariants, ToponSKURule, ToponLocations, IngredientLocations } = require('./index');



const createLocation = async (name) => {
  return await Location.create({ name: name });
}

const createProductVariant = async (variant, product) => {
  return await Variant.create({ name: variant, ProductId: product.id });
}

const createProduct = async (name, variants) => {
  const product = await Product.create({ name: name, type: 'single', description: 'description', });

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
    return SKU.create({ name: name, WarehouseId: warehouse.id, allowMinus: false, stock: 0 });
  });

  return Promise.all(skuPromises);
};


const addVariantToLocation = async (variant, location, sku) => {

  const vl = await VariantLocations.create({ LocationId: location.id, VariantId: variant.id });
  let skuVariantRule
  if (sku) {
    skuVariantRule = await VariantSKURule.create({ VariantLocationId: vl.id, SKUId: sku.id, unit: 'g', quantity: 1, disabled: false });
    return [vl, skuVariantRule];
  }


  return [vl];
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
  const gtm = await GroupToponsMid.create({ ToponLocationsId: toponLocation.id, GroupToponId: group.id, disabled: false, min: 0, max: 10, default: 0 });
  const sr = await VariantSKURule.create({ GroupToponsMidId: gtm.id, SKUId: sku.id, unit: 'g', quantity: 1, disabled: false });

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


const addIngredientToVariant = async (locationIngredient, variantLocation, sku) => {

  const vi = await VariantIngredients.create({ IngredientLocationId: locationIngredient.id, VariantLocationId: variantLocation.id });
  const sr = await IngredientSKURule.create({ VariantIngredientId: vi.id, SKUId: sku.id, unit: 'g', quantity: 1, disabled: false });


}


const seed = async () => {




  const lokacijaStup = await createLocation('stup');
  const lokacijaHadziabdinica = await createLocation('hadziabdinica');


  const [kafa, [makijato, obicna]] = await createProduct('kafa', ['kafa', 'makijato']);


  const [skladisteStup, skladisteHadziabdinica] = await createWarehouse(['stup', 'hadziabdinica']);


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

  const secerHadziabdinicaSKU = await createSKUs('secer', [skladisteHadziabdinica]);

  const [soHadziabdinicaSKU, soStupSKU] = await createSKUs('so', [skladisteHadziabdinica, skladisteStup]);

  const [biberHadziabdinicaSKU, biberStupSKU] = await createSKUs('biber', [skladisteHadziabdinica, skladisteStup]);

  const limunHadziabdinicaSKU = await createSKUs('limun', [skladisteHadziabdinica]);

  const ledHadziabdinicaSKU = await createSKUs('led', [skladisteHadziabdinica]);




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


  const ingredients = await createIngredient(['brasno', 'piletina', 'curry', 'riza']);


  const [brasno, piletina, curry, riza] = ingredients;

  const [brasnoStup, brasnoHadziabdinica] = await addIngredientToLocation(brasno, [lokacijaStup, lokacijaHadziabdinica]);

  const [piletinaStup, piletinaHadziabdinica] = await addIngredientToLocation(piletina, [lokacijaStup, lokacijaHadziabdinica]);

  const [curryStup, curryHadziabdinica] = await addIngredientToLocation(curry, [lokacijaStup, lokacijaHadziabdinica]);

  const [piletinaMeal, [piletinaObicna, piletinaCurry]] = await createProduct('piletina', ['piletinaObicna', 'piletinaCurry']);




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



  const piletinaVar = await getVariants(piletinaMeal.id);


  const variantLocations = await getVariantLocations(piletinaObicna.id);


  // console.log(JSON.stringify(variantLocations, null, 2));
  // console.log(JSON.stringify(piletinaVar, null, 2));

  const getVariantLocationIngredients = async (variantLocationId) => {

    return await VariantLocations.findAll({
      logging: console.log,
      where: { id: variantLocationId },
      include: [{ model: VariantIngredients, include: [{ model: IngredientLocations,  include: [{ model: Ingredients , as : 'IL' }] }] }]
    })
  }


  // const variantLocationIngredients = await getVariantLocationIngredients(piletinaCurryStup.id);
  // console.log(JSON.stringify(variantLocationIngredients, null, 2));

  const getVariantLocationIngredientsRules = async (variantLocationId) => {

    return await VariantLocations.findAll({
      logging: console.log,
      where: { id: variantLocationId },
      include: [{ model: VariantIngredients, include: [{ model: IngredientLocations,  include: [{ model: Ingredients , as : 'IL' }] }, { model: IngredientSKURule }] }]
    })
  }



  // const variantLocationIngredientsRules = await getVariantLocationIngredientsRules(piletinaCurryStup.id);

  // console.log(JSON.stringify(variantLocationIngredientsRules, null, 2));


  const isToponAviableatLocation = async (toponId, locationId) => {

    return await ToponLocations.findOne({
      logging: console.log,
      where: { ToponId: toponId, LocationId: locationId }

    })
  }

  const aviable = await isToponAviableatLocation(led.id, lokacijaHadziabdinica.id);
  console.log(aviable);

  console.log('All products created');
};

module.exports = { seed };





// const createSingleProduct = async (name) => {
//   return await Product.create({ name: name, type: 'single', description: 'description', });

// }

// ///kreiranje varijante proizvoda
// const createProductVariant = async (name, product) => {
//   return await Variant.create({ name: name, ProductId: product.id });
// }

// const createSingleProductFull = async (name, variants) => {
//   const product = await Product.create({ name: name, type: 'single', description: 'description', });

//   const var1 = await createProductVariant(variants[0], product);
//   const var2 = await createProductVariant(variants[1], product);

//   return [product, [var1, var2]];

// }

// ///kreiranje lokacija
// const createLocation = async (name) => {
//   return await Location.create({ name: name });
// }


// /// kreiranje sastojaka
// const createIngredient = async (name) => {
//   return await Ingredients.create({ name: name });
// }


// /// create user
// const createUser = async (firstName, lastName, password) => {
//   return await User.create({ firstName: firstName, lastName: lastName, password: password });
// }


// ///dodaj satojak na varijantu
// const addIngredientToVariant = async (variant, ingredient) => {
//   return await VariantIngredients.create({ VariantId: variant.id, IngredientId: ingredient.id });
// }

// /// add variant to location
// const addVariantToLocation = async (variant, location) => {
//   return await VariantLocations.create({ LocationId: location.id, VariantId: variant.id });
// }

// ///create warehoue for sku

// const createWarehouse = async (name, sku) => {
//   return await Warehouse.create({ name: name });
// }
// /// create sku
// const createSKU = async (variant, stock, code, warehouse) => {
//   return await SKU.create({ name: variant.name, stock: stock, code: code, WarehouseId: warehouse.id, allowMinus: true });
// }



// ///add warehouse to location
// const addWarehouseToLocation = async (warehouse, location) => {
//   return await WarehouseLocations.create({ LocationId: location.id, WarehouseId: warehouse.id });
// }

// /// add rules for variant for sku

// const createSKURules = async (VariantLocation, VariantIngredient, sku) => {

//   return await SKURule.create({ VariantLocationId: VariantLocation.id, VariantIngredientId: VariantIngredient?.id || null, SKUId: sku.id, unit: 'g', quantity: 1, disabled: false });
// }


// const stup = await createLocation('stup');
// const hadziabdinica = await createLocation('hadziabdinica');

// const proizvodKafa = await createSingleProduct('kafa');
// const proizvodPiletina = await createSingleProduct('piletina ');
// const kolaProizvod = await createSingleProduct('kola');

// const [kafaPiletina, [var1, var2]] = await createSingleProductFull('kafaPiletina', ['kafa', 'piletina ']);


// const kolaLight = await createProductVariant('kolaLight', kolaProizvod);
// const kola = await createProductVariant('kola', kolaProizvod);

// const kolaStup = await addVariantToLocation(kola, stup);
// const kolaHadziabdinica = await addVariantToLocation(kola, hadziabdinica);

// const kolaLightStup = await addVariantToLocation(kolaLight, stup);
// const kolaLightHadziabdinica = await addVariantToLocation(kolaLight, hadziabdinica);


// const stupSkladiste = await createWarehouse('stup');
// const hadziabdinicaSkladiste = await createWarehouse('hadziabdinica');

// await addWarehouseToLocation(stupSkladiste, stup);
// await addWarehouseToLocation(hadziabdinicaSkladiste, hadziabdinica);


// const kolaSKU = await createSKU('kola', 10, 'kola', stupSkladiste);
// const kolaLightSKUHadzi = await createSKU('kolaLight', 10, 'kolaLight', hadziabdinicaSkladiste);
// const kolaLightSKUStup = await createSKU('kolaLight', 10, 'kolaLight', stupSkladiste);


// const kolaRules = await createSKURules(kolaStup, null, kolaSKU);
// const kolaLightRules = await createSKURules(kolaLightStup, null, kolaLightSKUHadzi);
// const kolaLightRulesStup = await createSKURules(kolaLightHadziabdinica, null, kolaLightSKUStup);



// const piletinaProizvod = await createSingleProduct('piletina');

// const piletina = await createIngredient('piletina');
// const riza = await createIngredient('riza');
// const curry = await createIngredient('curry');

// const piletinaObicnaVariant = await createProductVariant('piletinaObicna', piletinaProizvod);
// const piletinaRizaVariant = await createProductVariant('piletinaRiza', piletinaProizvod);
// const piletinaCurryVariant = await createProductVariant('piletinaCurry', piletinaProizvod);


// const piletinaHadzi = await addVariantToLocation(piletinaObicnaVariant, hadziabdinica);
// const piletinaRiza = await addVariantToLocation(piletinaRizaVariant, hadziabdinica);
// const piletinaCurry = await addVariantToLocation(piletinaCurryVariant, hadziabdinica);
// const piletinaStup = await addVariantToLocation(piletinaObicnaVariant, stup);
// const piletinaRizaStup = await addVariantToLocation(piletinaRizaVariant, stup);
// const piletinaCurryStup = await addVariantToLocation(piletinaCurryVariant, stup);

// const piletinaPiletina = await addIngredientToVariant(piletinaObicnaVariant, piletina);
// const pieltinaRizaRiza = await addIngredientToVariant(piletinaRizaVariant, riza);
// const piletinaRizaPiletina = addIngredientToVariant(piletinaRizaVariant, piletina);
// const piletinaCurryCurry = await addIngredientToVariant(piletinaCurryVariant, curry);
// const piletinaCurryPiletina = await addIngredientToVariant(piletinaCurryVariant, piletina);

// const piletinaSkuStup = await createSKU('piletina', 10, 'piletina', stupSkladiste);
// const rizaSKUStup = await createSKU('riza', 10, 'riza', stupSkladiste);
// const currySKUStup = await createSKU('curry', 10, 'curry', stupSkladiste);

// const piletinaHadziSKU = await createSKU('piletina', 10, 'piletina', hadziabdinicaSkladiste);
// const rizaHadziSKU = await createSKU('riza', 10, 'riza', hadziabdinicaSkladiste);
// const curryHadziSKU = await createSKU('curry', 10, 'curry', hadziabdinicaSkladiste);

// await createSKURules(piletinaHadzi, piletinaPiletina, piletinaHadziSKU);
// await createSKURules(piletinaRiza, pieltinaRizaRiza, rizaHadziSKU);
// await createSKURules(piletinaCurry, piletinaCurryPiletina, curryHadziSKU);

// await createSKURules(piletinaStup, piletinaPiletina, piletinaSkuStup);
// await createSKURules(piletinaRizaStup, pieltinaRizaRiza, rizaSKUStup);
// await createSKURules(piletinaCurryStup, piletinaCurryPiletina, currySKUStup);


// const createTopon = async (name) => {
//   return await Topons.create({ name: name });
// }


// const createVariantGroup = async (variantLocation) => {
//   return await GroupTopon.create({ VariantLocationId: variantLocation.id, rules: "{select: multipleselect}" });
// }

// const [secer, mlijeko, so, biber, limun, led] = await Promise.all([
//   createTopon('secer'),
//   createTopon('mlijeko'),
//   createTopon('so'),
//   createTopon('biber'),
//   createTopon('limun'),
//   createTopon('led'),

// ])

// /// rabela groupTopons
// /// kola stup

// const kolaStupGroup = await createVariantGroup(kolaStup);


// const kolaHadziabdinicaGroup = await createVariantGroup(kolaHadziabdinica);

// /// kolaLightStup


// const kolaLightStupGroup = await createVariantGroup(kolaLightStup);

// /// kolalighthadzi

// const kolaLightHadziGroup = await createVariantGroup(kolaLightHadziabdinica)



// const createGroupTopon = async (group, topon) => {

//   return await GroupToponsMid.create({ GroupToponId: group.id, ToponId: topon.id, disabled: false, min: 0, max: 10, default: 0 });

// }



// /// tabela GroupToponsMid

// const groupToponMidMlijeko = await createGroupTopon(kolaStupGroup, mlijeko);
// const groupToponMidSo = await createGroupTopon(kolaStupGroup, so);
// const groupToponMidBiber = await createGroupTopon(kolaStupGroup, biber);
// const groupToponMidLimun = await createGroupTopon(kolaHadziabdinicaGroup, limun);
// const groupToponMidLed = await createGroupTopon(kolaHadziabdinicaGroup, secer);



// const groupToponMidMlijekoLight = await createGroupTopon(kolaLightStupGroup, mlijeko);
// const groupToponMidSoLight = await createGroupTopon(kolaLightStupGroup, so);
// const groupToponMidBiberLight = await createGroupTopon(kolaLightStupGroup, biber);
// const groupToponMidLimunLight = await createGroupTopon(kolaLightStupGroup, limun);
// const groupToponMidLedLight = await createGroupTopon(kolaLightStupGroup, led);

// const groupToponMidMlijekoLightHadzi = await createGroupTopon(kolaLightHadziGroup, mlijeko);
// const groupToponMidSoLightHadzi = await createGroupTopon(kolaLightHadziGroup, so);
// const groupToponMidBiberLightHadzi = await createGroupTopon(kolaLightHadziGroup, biber);
// const groupToponMidLimunLightHadzi = await createGroupTopon(kolaLightHadziGroup, limun);
// const groupToponMidLedLightHadzi = await createGroupTopon(kolaLightHadziGroup, secer);



// const allTopons = await Variant.findAll({

//   include: [
//     {
//       model: VariantLocations,
//       as: 'VL',
//       include: [
//         {
//           model: GroupTopon,
//           include: [
//             {
//               model: GroupToponsMid,
//               include: [
//                 { model: Topons }
//               ]
//             }
//           ]
//         }
//       ]


//     },
//   ]
// });

// // console.log(JSON.stringify(allTopons, null, 2));








// /// daj mi sve iteme koje imam u skladistu na stupu

// const warehouseItems = await SKU.findAll({
//   where: { WarehouseId: hadziabdinicaSkladiste.id },

//   include: [
//     {
//       model: SKURule,
//       attributes: [],
//       as: 'SKURules',
//       include: [
//         {
//           model: VariantLocations,
//           required: false,
//           include: [
//             { model: Variant, as: 'VL' }
//           ]
//         },
//         {
//           model: VariantIngredients,
//           required: false,
//           include: [
//             {
//               model: Ingredients,
//               required: false
//             }
//           ]
//         }

//       ]
//     }

//   ]
// });



// ///

// const createCombo = async (name) => {

//   return await Product.create({ name: name, type: 'combo', description: 'description', })
// }

// const rucak = await createCombo('rucak');

// const rucak1 = await createProductVariant('rucak1', rucak);

// const rucak2 = await createProductVariant('rucak2', rucak);

// const rucak1loc = await addVariantToLocation(rucak1, stup);

// const rucak2loc = await addVariantToLocation(rucak2, hadziabdinica);

// const addVarianttocombo = async (varCombo, varLoc) => {
//   return await LinkedVariants.create({ VariantId: varCombo.id, VariantLocationId: varLoc.id })
// }


// const kolaRucak1 = await addVarianttocombo(rucak1, kolaStup)
// const pieltinaRucak1 = await addVarianttocombo(rucak1, piletinaStup);



// const kolaRucak2 = await addVarianttocombo(rucak2, kolaLightStup)
// const pieltinaRucak2 = await addVarianttocombo(rucak2, piletinaHadzi);


// const rucak1Group = await createVariantGroup(rucak1loc);
// const rucak2Group = await createVariantGroup(rucak2loc);



// const rucak1GroupToponsmlijeko = await createGroupTopon(rucak1Group, mlijeko);
// const rucak1GroupToponsso = await createGroupTopon(rucak1Group, so);


// const rucak2GroupToponsmlijeko = await createGroupTopon(rucak2Group, mlijeko);
// const rucak2GroupToponsso = await createGroupTopon(rucak2Group, so);
// const rucak2GroupToponsbiber = await createGroupTopon(rucak2Group, biber);
// const rucak2GroupToponslimun = await createGroupTopon(rucak2Group, limun);
// const rucak2GroupToponsled = await createGroupTopon(rucak2Group, led);

// const createToponSKURule = async (groupToponMid, SKU) => {
//   return await ToponSKURule.create({ GroupToponsMidId: groupToponMid.id, SKUId: SKU.id, unit: 'kg', quantity: 1, disabled: false })

// }

// const mlijekoSKU = await createSKU('mlijeko', 10, 10, stupSkladiste);
// const soSKU = await createSKU('so', 10, 10, stupSkladiste);
// const biberSKU = await createSKU('biber', 10, 10, stupSkladiste);
// const limunSKU = await createSKU('limun', 10, 10, stupSkladiste);
// const ledSKU = await createSKU('led', 10, 10, stupSkladiste);



// const mlijekoToponSKURule = await createToponSKURule(rucak1GroupToponsmlijeko, mlijekoSKU);
// const soToponSKURule = await createToponSKURule(rucak1GroupToponsso, soSKU);

// const biberToponSKURule = await createToponSKURule(rucak2GroupToponsbiber, biberSKU);
// const limunToponSKURule = await createToponSKURule(rucak2GroupToponslimun, limunSKU);
// const ledToponSKURule = await createToponSKURule(rucak2GroupToponsled, ledSKU);





// const getToponsForVariant = async (variantId) => {

//   return await Topons.findAndCountAll({
//     // subQuery: true,
//     logging: console.log,
//     include: [
//       {
//         model: GroupToponsMid,
//         required: true,
//         include: [
//           {
//             model: GroupTopon,
//             required: true,
//             include: [
//               {
//                 model: VariantLocations,
//                 required: true,
//                 include: [
//                   {
//                     model: Variant,
//                     as: 'VL',
//                     attributes: ['name'],
//                     required: true,
//                     where: { id: variantId },
//                   }
//                 ]

//               }]

//           }
//         ]

//       }
//     ]
//   })
// }


// const toponiZaKolu = await getToponsForVariant(kola.id);


// console.log(JSON.stringify(toponiZaKolu, null, 2));

// const getToponByVariantLocation = async (variantId, locationId) => {

//   return await Topons.findAll({
//     include: [
//       {
//         model: GroupToponsMid,
//         required: true,
//         include: [
//           {
//             model: GroupTopon,
//             required: true,
//             include: [
//               {
//                 model: VariantLocations,
//                 where: { LocationId: locationId },
//                 required: true,
//                 include: [
//                   {
//                     model: Variant,
//                     as: 'VL',
//                     attributes: ['name'],
//                     required: true,
//                     where: { id: variantId },
//                   }
//                 ]

//               }]

//           }
//         ]

//       }
//     ]
//   })

// }


// // const toponsiKolaStup = await getToponByVariantLocation(kola.id, stup.id);

// // console.log(JSON.stringify(toponsiKolaStup, null, 2));


// const getSKURulesForVariantIngredients = async (variantId) => {
//   return await Variant.findAll({
//     where: { id: variantId },
//     include: [
//       {
//         model: VariantIngredients,
//         required: false,
//         include: [
//           { model: Ingredients, required: true },
//           {
//             model: SKURule,
//             required: false
//           }
//         ]
//       }
//     ]
//   })


// }


// const piletinCurrySastojciRules = await getSKURulesForVariantIngredients(piletinaCurryVariant.id);
// // console.log(JSON.stringify(piletinCurrySastojciRules, null, 2));
// // console.log(JSON.stringify(toponiZaKolu, null, 2));


// /// check if is disabled or not

