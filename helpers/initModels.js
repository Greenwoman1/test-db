const sequelize = require("../sequelize");
const { Product, Variant, GroupOption, Option, Topons, Combo, ComboItem, SKURule, GroupRule, User, VariantOptions,
    VariantTopons,
    SKU,
    ComboItemProduct, } = require("../src");

async function initModels() {
    const models = [
        ComboItem,

        Product,
        Variant,
        GroupOption,
        Option,
        Topons,
        Combo,
        SKURule,
        GroupRule,
        VariantTopons,
        User,
        SKU,
        ComboItemProduct

    ];

    for (const model of models) {
        // console.log(`Initializing model: ${model}`);
        model.initModel();
        // console.log(`Model init finish`);
    }
}

async function associateModels() {
    const models = {
        'Product': Product,
        'Variant': Variant,
        'GroupOption': GroupOption,
        'Option': Option,
        'Topons': Topons,
        "Combo": Combo,
        'ComboItem': ComboItem,
        'SKURule': SKURule,
        'GroupRule': GroupRule,
        'VariantTopons': VariantTopons,
        'User': User,
        'SKU': SKU,
        'ComboItemProduct': ComboItemProduct
    }

    for (const [key, model] of Object.entries(models)) {
        console.log(`Associating model: ${key}`);
        if (model.associateModel) {
            model.associateModel(models);
            console.log(`Model associate finish for: ${key}`);
        } else {
            console.warn(`associateModel nije definiran za model ${key}`);
        }
    }
}


const init = async () => {
    await initModels();
    await associateModels();
}
module.exports = init;
