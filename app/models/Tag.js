module.exports =
    {
        identity: 'Tag',
        connection: 'default',
        tableName: 'Tag',
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
