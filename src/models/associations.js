const User = require('./User');
const Product = require('./Product');

const Variant = require('./Variant');
const SKU = require('./SKU');
const Options = require('./Options');
const VariantOptions = require('./VariantOptions');
const Combo = require('./Combo');
const ComboItems = require('./ComboItems');
const SKURule = require('./SKURule');
const GroupOptions = require('./GroupOptions');
const VariantTopons = require('./VariantTopons');
const Topons = require('./Topons');





Product.hasMany(Combo);
Combo.belongsTo(Product);

Product.hasMany(Variant);
Variant.belongsTo(Product);


Combo.belongsToMany(Variant, { through: 'ComboItems' });
Variant.belongsToMany(Combo, { through: 'ComboItems' });


Variant.hasMany(GroupOptions);
GroupOptions.belongsTo(Variant);

Variant.hasOne(SKURule);
SKURule.belongsTo(Variant);

GroupOptions.belongsToMany(Options, { through: 'VariantOptions' });
Options.belongsToMany(GroupOptions, { through: 'VariantOptions' });


Topons.hasOne(SKURule);
SKURule.belongsTo(Topons);


SKURule.hasOne(SKU);
SKU.belongsTo(SKURule);


Variant.belongsToMany(Topons, { through: 'VariantTopons' });


Topons.belongsToMany(Variant, { through: 'VariantTopons' });

GroupOptions.belongsToMany(Options, { through: 'VariantOptions' });
Options.belongsToMany(GroupOptions, { through: 'VariantOptions' });

module.exports = { User, Product, Variant, SKU, Options, VariantOptions, Combo, ComboItems, SKURule, GroupOptions, VariantTopons, Topons };
