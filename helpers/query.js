const { Product, Variant, GroupOption, Option, Topons } = require('../src/index');


const productsJson = [
    {
        "name": "Palačinke",
        "description": "Ukusne domaće palačinke sa raznovrsnim opcijama",
        "type": "food",
        "variants": [
            {
                "name": "Čokoladna palačinka",
                "groupOptions": [
                    {
                        "name": "Čokoladni dodaci",
                        "type": "preliv",
                        "rule": "any",
                        "options": [
                            { "name": "Nutella" },
                            { "name": "Čokoladne mrvice" }
                        ]
                    }
                ],
                "topons": [
                    { "name": "Banana", "quantity": 2 },
                    { "name": "Jagoda", "quantity": 3 }
                ]
            },
            {
                "name": "Obična palačinka",
                "groupOptions": [
                    {
                        "name": "Dodaci za običnu palačinku",
                        "type": "preliv",
                        "rule": "any",
                        "options": [
                            { "name": "Šećer" },
                            { "name": "Limun" }
                        ]
                    }
                ],
                "topons": [
                    { "name": "Med", "quantity": 1 },
                    { "name": "Orah", "quantity": 4 }
                ]
            }
        ]
    },
    {
        "name": "Pizza",
        "description": "Delicious homemade pizzas with various toppings",
        "type": "food",
        "variants": [
            {
                "name": "Margherita",
                "groupOptions": [
                    {
                        "name": "Cheese Options",
                        "type": "topping",
                        "rule": "any",
                        "options": [
                            { "name": "Mozzarella" },
                            { "name": "Parmesan" }
                        ]
                    }
                ],
                "topons": [
                    { "name": "Basil", "quantity": 5 },
                    { "name": "Tomato", "quantity": 3 }
                ]
            },
            {
                "name": "Pepperoni",
                "groupOptions": [
                    {
                        "name": "Cheese Options",
                        "type": "topping",
                        "rule": "any",
                        "options": [
                            { "name": "Mozzarella" },
                            { "name": "Cheddar" }
                        ]
                    }
                ],
                "topons": [
                    { "name": "Pepperoni", "quantity": 10 },
                    { "name": "Olives", "quantity": 5 }
                ]
            }
        ]
    },
    {
        "name": "Burger",
        "description": "Juicy homemade burgers with various toppings",
        "type": "food",
        "variants": [
            {
                "name": "Cheeseburger",
                "groupOptions": [
                    {
                        "name": "Cheese Types",
                        "type": "topping",
                        "rule": "any",
                        "options": [
                            { "name": "American Cheese" },
                            { "name": "Swiss Cheese" }
                        ]
                    }
                ],
                "topons": [
                    { "name": "Lettuce", "quantity": 1 },
                    { "name": "Tomato", "quantity": 2 }
                ]
            },
            {
                "name": "Bacon Burger",
                "groupOptions": [
                    {
                        "name": "Cheese Types",
                        "type": "topping",
                        "rule": "any",
                        "options": [
                            { "name": "Cheddar Cheese" },
                            { "name": "Blue Cheese" }
                        ]
                    }
                ],
                "topons": [
                    { "name": "Bacon", "quantity": 3 },
                    { "name": "Pickles", "quantity": 2 }
                ]
            }
        ]
    },
    {
        "name": "Salad",
        "description": "Fresh and healthy salads with various toppings",
        "type": "food",
        "variants": [
            {
                "name": "Caesar Salad",
                "groupOptions": [
                    {
                        "name": "Dressing Options",
                        "type": "dressing",
                        "rule": "any",
                        "options": [
                            { "name": "Caesar Dressing" },
                            { "name": "Ranch Dressing" }
                        ]
                    }
                ],
                "topons": [
                    { "name": "Croutons", "quantity": 10 },
                    { "name": "Parmesan", "quantity": 5 }
                ]
            },
            {
                "name": "Greek Salad",
                "groupOptions": [
                    {
                        "name": "Cheese Options",
                        "type": "topping",
                        "rule": "any",
                        "options": [
                            { "name": "Feta Cheese" },
                            { "name": "Goat Cheese" }
                        ]
                    }
                ],
                "topons": [
                    { "name": "Olives", "quantity": 10 },
                    { "name": "Cucumber", "quantity": 5 }
                ]
            }
        ]
    }
];



async function getProductSettings(productName) {
    try {
        const product = await Product.findOne({
            where: { name: productName },
            include: [
                {
                    model: Variant,
                    include: [
                        {
                            model: GroupOption,
                            include: [Option]
                        },
                        Topons
                    ]
                }
            ]
        });

        if (!product) {
            throw new Error(`Product "${productName}" not found`);
        }

        const result = {
            product: {
                name: product.name,
                description: product.description,
                type: product.type,
                variants: product.Variants.map(variant => ({
                    name: variant.name,
                    groupOptions: variant.GroupOptions.map(groupOption => ({
                        name: groupOption.name,
                        options: groupOption.Options.map(option => ({
                            name: option.name
                        }))
                    })),
                    topons: variant.Topons.map(topon => ({
                        name: topon.name,
                        quantity: topon.quantity
                    }))
                }))
            }
        };

        return result;
    } catch (error) {
        console.error(`Error fetching product settings for ${productName}:`, error);
        throw error;
    }
}

module.exports = {
    getProductSettings
};
