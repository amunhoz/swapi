module.exports = {
          adapters: {
              'default': require('sails-mysql'),
              disk: require('sails-disk')
          },

          connections: {
              default: {
                  adapter: 'disk',
                  filePath: './data/'
              },
              disk: {
                  adapter: 'disk',
				  filePath: './data/'
              }
          }
      };