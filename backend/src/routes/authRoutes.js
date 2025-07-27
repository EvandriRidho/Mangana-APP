import express from 'express';


const router = express.Router();


router.post('/register', async (req, res) => {
    // Handle registration logic here
    res.send('Register endpoint');
});

router.post('/login', async (req, res) => {
    // Handle login logic here
    res.send('Login endpoint');
});



export default router;