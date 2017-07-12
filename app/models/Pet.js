module.exports = 
{
  identity: 'Pet',
  connection: 'default',
  tableName: 'Pet',
  migrate: 'alter',
 
  attributes: {
  
			"id": 
			{	
				"type":  "integer"  ,
				
				"primaryKey":  true   ,
				
				"unique":  true   ,
				
				"autoIncrement":  true   
				
            },

            "category":
            {
                "model": "category"

            },
   
			"name": 
			{	
				"type":  "string"  
				
			} ,
   
			"photoUrls": 
			{	
				"type":  "array"  
				
            },

            "tag":
            {
                "model": "tag"
            },

            "status":
            {
                type: 'string',
                enum: ['available', 'pending', 'sold']

            },
   
			"complete": 
			{	
				"type":  "boolean"  
				
			} 
   	   
  }
};
