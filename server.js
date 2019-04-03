//require the dotenv module and invoke it's config() method to read the .env file. do this as early in our application as possible
require('dotenv').config()
const express = require('express');
const morgan = require('morgan');

//temporarily adding a log statement that logs this new variable
console.log(process.env.API_TOKEN)

const app = express();
app.use(morgan('dev'));


// use the app.get method to construct our endpoint and create a separate middleware function to handle the request
//building your endpoints by writing the callback as an anonymous function is still valid but here i am separating the callback out into a named function for modularity and reusability

//hardcoding the array of valid types
const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychich`, `Rock`, `Steel`, `Water`]

//The validateBearerToken middleware will take 3 parameters instead of 2. In addition to req and res, validateBearerToken will also take a callback function as the third parameter
app.use(function validateBearerToken(req, res, next) {
    //to read a request header in express you use req.get('header-name')
    //We only care about the token for this header so let's split the value over the empty space: 
    //now there is an array with the token in the second position, so we can get the token: 
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');
    //when tokens dont match there needs to be a response with an unauthorized status code and error message
    //we need to check for the presence of the token header before we split it. If the token isn't present, we want to respond with the same error for when the token is present but invalid instead of "TypeError: Cannot read property 'split' of undefined"
    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
        //move to the next() middleware
    }
//invoking the next callback at the end of the middleware is to move to the next middleware. if this does not happen the request would hang and there would be no visible response until a timeout
    next()
});

function handleGetTypes(req, res) {
    //sending it back as JSON within the request handler for GET/types
    res.json(validTypes);
};


// For the endpoint, we can pass the path of /types as the first argument and our handleGetTypes middleware function as the second argument. This second argument is a callback - a function passed into another function as an argument
app.get('/types', handleGetTypes);

//api token is in place and can now be used to validate every request that comes into the server
function handleGetPokemon(req, res) {
    res.send('Hello, Pokemon');
};
app.get('/pokemon', handleGetPokemon);

//validation should happen before either handleGetTypes or handleGetPokemon requests handlers
//these request handlers are called middleware and can be composed in different sequences and configurations through Express

//there are two solutions to add new middleware to validate requests:
//this solution adds the validateBearerToken before each .get()
// app.get('/types', validateBearerToken, handleGetTypes);
// app.get('/pokemon', validateBearerToken, handleGetPokemon);

//this solution is only adding the validate middleware once and validating every request before it gets to the next handler middlewares:
// const app = express()
// app.use(morgan('dev'))
// app.use(validateBearerToken)
// app.get('/types', handleGetTypes);
// app.get('/pokemon', handleGetPokemon);
// app.listen(PORT, cb)



const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});