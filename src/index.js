if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const app = require('./app');
require('./database');

app.listen(app.get('port'), _ =>{
    console.log(`server on port ${app.get('port')}`);
});