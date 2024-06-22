
const {Product, Variant, Topons, GroupOption, Option, GroupRule} = require("../../index");


const createProduct = async (productJson) => {
    return await Product.create({
        name: productJson.name,
        description: productJson.description,
        type: productJson.type
    });
};

const handleComboItems = async (product, items) => {
    for (const itemId of items) {
        const item = await Product.findOne({
            where: { id: itemId }
        });
        if (item) {
            await product.addComboItem(item);
        }
    }
};

const createVariant = async (variantData, productId) => {
    return await Variant.create({
        name: variantData.name,
        ProductId: productId
    });
};

const handleTopons = async (variant, topons) => {
    for (const toponData of topons) {
        const topon = await Topons.findOne({ where: { id: toponData.toponId } });
        if (topon) {
            await variant.addTopon(topon);
        }
    }
};

const createGroupOption = async (groupOptionData, variantId) => {
    const groupOption = await GroupOption.create({
        name: groupOptionData.name,
        type: groupOptionData.type,
        VariantId: variantId
    });

    if (groupOptionData.rules) {
        for (const ruleData of groupOptionData.rules) {
            await GroupRule.create({
                name: ruleData.name,
                description: ruleData.description,
                ruleType: ruleData.ruleType,
                ruleValue: ruleData.ruleValue,
                GroupOptionId: groupOption.id
            });
        }
    }

    if (groupOptionData.options) {
        for (const optionData of groupOptionData.options) {
            await Option.create({
                name: optionData.name,
                GroupOptionId: groupOption.id
            });
        }
    }
};

const handleVariants = async (variants, productId) => {
    for (const variantData of variants) {
        const variant = await createVariant(variantData, productId);

        if (variantData.topons) {
            await handleTopons(variant, variantData.topons);
        }

        if (variantData.groupOptions) {
            for (const groupOptionData of variantData.groupOptions) {
                await createGroupOption(groupOptionData, variant.id);
            }
        }
    }
};

async function updateProduct(productData) {
    try {
        let product = await Product.findByPk(productData.id);

        if (!product) {
            console.log(`Product with ID ${productData.id} not found.`);
            return;
        }
        

    } catch (error) {
        console.error(`Error updating product with ID ${productData.id}:`, error);
        throw error; 
    }
}

module.exports = {
    createProduct,
    handleComboItems,
    handleVariants,
    handleTopons,
    createGroupOption,
    handleVariants,
    updateProduct

}