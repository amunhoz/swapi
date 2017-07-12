module.exports =
    {
        identity: 'Category',
        connection: 'default',
        tableName: 'Category',
        migrate: 'alter',

        attributes: {

            "id":
            {
                "type": "integer",

                "primaryKey": true,

                "unique": true,

                "autoIncrement": true

            },

            "name":
            {
                "type": "string"

            }

        }
    };
