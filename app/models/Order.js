module.exports = 
{
  identity: 'Order',
  connection: 'default',
  tableName: 'Order',
  migrate: 'alter',
 
  attributes: {
  
			"id": 
			{	
				"type":  "integer"  ,
				
				"primaryKey":  true   ,
				
				"unique":  true   ,
				
				"autoIncrement":  true   
				
			} ,
   
			"petId": 
			{	
				"type":  "integer"  
				
			} ,
   
			"quantity": 
			{	
				"type":  "integer"  
				
            },

            "shipDate":
            {
                "type": "datetime"
            } ,
   
			"status": 
			{	
                type: 'string',
                enum: ['placed', 'approved', 'delivered']
				
			} ,
   
			"complete": 
			{	
				"type":  "boolean"  
				
			} 
   	   
  }
};
