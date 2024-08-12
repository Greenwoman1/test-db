[{
  "name": "kafa",
  "type": "single",
  "description": "kafa",
  "CategoryId": 1,
  "variants": [
    {
      "name": "obicna",
      "locations": [
        {
          "LocationId": 1,
          "Ingredient": [
            {
              "id": 5,
              "skuRules": {
                "name": "kafa",
                "unit": "g",
                "quantity": 1,
                "disabled": false,
                "SKUId": 1
              }
            }
          ],
          "topons": [
            {
              "interfaceRules": "{'single select'}",
              "minTopon": 1,
              "maxTopon": 1,
              "topons": [
                {
                  "ToponId": 1,
                  "skuRules": {
                    "name": "kafa",
                    "unit": "g",
                    "quantity": 1,
                    "disabled": false,
                    "SKUId": 1
                  },
                  "min": 0,
                  "max": 10,
                  "default": 0
                },
                {
                  "ToponId": 1,
                  "skuRules": {
                    "name": "kafa",
                    "unit": "g",
                    "quantity": 1,
                    "disabled": false,
                    "SKUId": 1
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




{
  "name": "kafa",
  "type": "single",
  "description": "kafa",
  "CategoryId": 1,
  "variants": [
    {
      "name": "obicna",
      "locations": [
        {
          "LocationId": 1,
          "skuRules": {
            "name": "kafa",
            "unit": "g",
            "quantity": 1,
            "disabled": false,
            "skuId": 1,
          },
          "topons": [
            {
              "interfaceRules": "{'single select'}",
              "minTopon": 1,
              "maxTopon": 1,
              "skuRules": {
                "name": "kafa",
                "unit": "g",
                "quantity": 1,
                "disabled": false,
                "SKUId": 3
              },
              "topons": [
                "t1Id",
                "t2Id"
              ]
            }
          ],
          "options": [
            {
              "rules": "{'select': 'multipleselect'}",
              "options": [
                "o1Id",
                "o2Id"
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "makijato"
    }
  ]
}



{
  "name": "kafa",
  "type": "single",
  "description": "piletina",
  "CategoryId": hrana.id,
  "variants": [
    {
      "name": "obicna",
      "locations": [
        {
          "LocationId": lokacijaStup.id,
          "Ingredient": [
            {
              "id": piletinaStup.id,
              "skuRules": {
                "name": "ciketina",
                "unit": "g",
                "quantity": 1,
                "disabled": false,
                "SKUId": piletinaStupSKU.id
              }
            }
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




{
  "userId": 1,
  "locationId": 2,
  "force": true,
  "OrderItem": [
    {
      "productId": 1,
      "variantLocationId": 1,
      "type" : "single",
      "quantity": 1,
      "options": [
        1,
        2,
        3
      ],
      "topons": [
        {
          "toponId": 1,
          "quantity": 1

        },

        {
          "toponId": 2,
          "quantity": 1
        }
      ]
    }
  ]
}
  ,

{
  "id": "a6d6c119-7dc9-4f7b-af50-c11dc416fec7",
  "status": "pending",
  "totalPrice": "13.50",
  "LocationId": "a30e8189-966f-4348-98dd-ddb3f0a533bf",
  "UserId": "bdb58899-ba46-4934-9191-820da6f530c0",
  "User": {
    "id": "bdb58899-ba46-4934-9191-820da6f530c0",
    "firstName": "Sara",
    "lastName": "Sara prezime"
  },
  "OrderItem": [
    {
      "id": "0c4a3908-abd5-4885-8190-756dac891f3b",
      "quantity": null,
      "OrderId": "a6d6c119-7dc9-4f7b-af50-c11dc416fec7",
      "VariantLocationId": "7d415bbe-54d4-440e-a1ac-5ae488e00654",
      "ProductId": "29d04f2a-ba3c-4e54-a3ba-bf6389c21b1d",
      "VariantLocation": {
        "id": "7d415bbe-54d4-440e-a1ac-5ae488e00654"
      },
      "OrderItemOption": [],
      "OrderItemTopons": [
        {
          "id": "628098dc-5550-4cf1-8988-c689cb4323a2",
          "ToponLocation": {
            "id": "0aacf957-9c8b-4be2-8052-42cb2edabba6",
            "TopLoc": {
              "id": "6a049b58-ec27-425f-b874-3738270873b9",
              "name": "so"
            }
          }
        },
        {
          "id": "2f57cb60-4e7e-4b4c-a49f-0fd7602f3125",
          "ToponLocation": {
            "id": "27406dcc-4664-4b82-ac02-e4efe405b621",
            "TopLoc": {
              "id": "f0c02c6a-cd27-48bd-8fbc-a8afe84489a7",
              "name": "biber"
            }
          }
        }
      ]
    },
    {
      "id": "692a7a74-efec-4802-bc0e-eab7eb37a095",
      "quantity": null,
      "OrderId": "a6d6c119-7dc9-4f7b-af50-c11dc416fec7",
      "VariantLocationId": "c69a4a68-9517-4eb3-bb70-5167bff78641",
      "ProductId": "8b35d1dd-b33e-4389-a04f-f1a28c34a02f",
      "VariantLocation": {
        "id": "c69a4a68-9517-4eb3-bb70-5167bff78641"
      },
      "OrderItemOption": [],
      "OrderItemTopons": []
    }
  ]
}]