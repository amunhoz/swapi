module.exports =
    {
        identity: 'User',
        connection: 'default',
        tableName: 'User',
        migrate: 'alter',

        attributes: {

            "id":
            {
                "type": "integer",

                "primaryKey": true,

                "unique": true,

                "autoIncrement": true

            },

            "username":
            {
                "type": "string"

            },
            "firstName":
            {
                "type": "string"

            },
            "lastName":
            {
                "type": "string"

            },
            "email":
            {
                "type": "string"

            },
            "password":
            {
                "type": "string"

            },
            "phone":
            {
                "type": "string"

            },
            "userStatus":
            {
                "type": "integer"

            }

        }
    };
