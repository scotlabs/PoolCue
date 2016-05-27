 'use strict';

 /* NPM Packages*/

 /* Imports */

 /* Variables */

 /* Routes */
 module.exports = function(Router) {

     Router.get('/', function(request, response) {
          response.render('../app/views/index.ejs');
      });

};
