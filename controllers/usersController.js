let users = [{
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    age: 30,
    city: "delhi"
},
{
   id: 2,
    name: "smith",
    email: "smiths@example.com",
    age: 25,
    city: "mumbai" 
},
{
    id: 3,
    name: "jane",
    email: "janes@example.com",
    age: 28,
    city: "bangalore"
}
];

function getAllUsers(req, res, next) {
    let City = users;
    if (req.query.city) {
        City = users.filter(u => u.city.toLowerCase() === req.query.city.toLowerCase());
    }
    if (req.query.offset && isNaN(req.query.offset) || req.query.offset < 0){
        const err = new Error('Invalid offset value');
        err.status = 400;
        return next(err);
    }
    if (req.query.limit && isNaN(req.query.limit) || req.query.limit <= 0){
        const err = new Error('Invalid limit value');
        err.status = 400;
        return next(err);
    }
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) :  City.length;
    const filteredUsers = City.slice(offset, offset + limit);

    let hasNextpage;
    if (offset + limit >= City.length ){
        hasNextpage = false;
    }
    else {
        hasNextpage = true;
    }
    const nextOffset = hasNextpage === true ? offset + limit : null;
    res.json({ data: filteredUsers ,"offset": offset, "limit": limit, "total": City.length, "hasNextPage": hasNextpage, "nextOffset": nextOffset });
};

function getUserById(req, res, next) {
    if (isNaN(req.params.id)) {
        const err = new Error('Invalid user ID');
        err.status = 400;
        return next(err);
    }
    const userId = Number(req.params.id);
    const user = users.find(u => u.id === userId);
    if (!user) {
        const err = new Error('User not found');
        err.status = 404;
        return next(err);
    }
    res.json(user);
};

function createUser(req, res, next) {
    const user = req.body;
    if (!user.name || !user.email || !user.city) {
        const err = new Error('all fields are required')
        err.status = 400;
        return next(err);
    }
    if (typeof user.age !== 'number' || user.age <= 0) {
        const err = new Error('Age must be a positive number');
        err.status = 400;
        return next(err);
    }
    const existingUser = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (existingUser) {
        const err = new Error('User with this email already exists');
        err.status = 400;
        return next(err);
    }
    const max = users.reduce((x, y) => {
    return Math.max(x, y.id);
    }, 0);

    user.id = max + 1;
    
    users.push(user);
    res.status(201).json({ message: 'User created successfully', user })
};

function updateUser(req, res, next) {
    if (isNaN(req.params.id)) {
        const err = new Error('Invalid user ID');
        err.status = 400;
        return next(err);
    }
    const userId = Number(req.params.id);
    const user = users.find(u => u.id === userId);
    if (!user) {
        const err = new Error('User not found');
        err.status = 404;
        return next(err);
    }
    if (!req.body.name || !req.body.email || !req.body.city) {
        const err = new Error('Name, email, and city are required');
        err.status = 400;
        return next(err);
    }
    if (typeof req.body.age !== 'number' || req.body.age <= 0) {
        const err = new Error('Age must be a positive number');
        err.status = 400;
        return next(err);
    }
    const existingUser = users.find(u => u.email.toLowerCase() === req.body.email.toLowerCase() && u.id !== userId);
    if (existingUser) {
        const err = new Error('User with this email already exists');
        err.status = 400;
        return next(err); 
    }
    user.name = req.body.name;
    user.email = req.body.email;
    user.age = req.body.age;
    user.city = req.body.city;
    res.json(user);
};

function updateUser2(req, res, next) {
    if (isNaN(req.params.id)) {
        const err = new Error('Invalid user ID');
        err.status = 400;
        return next(err);
    }
    const userId = Number(req.params.id);
    const user = users.find(u => u.id === userId);
    if (!user) {
        const err = new Error('User not found');
        err.status = 404;
        return next(err);
    }
    const { name, email, age, city } = req.body;

    if (email !== undefined) {
        if (typeof email !== 'string' || email.trim() === '') {
            const err = new Error('Email must be a non-empty string');
            err.status = 400;
            return next(err);
        }
        const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== userId);
        if (existingUser) {
            const err = new Error('User with this email already exists');
            err.status = 400;
            return next(err);
        }
    }

    if (name !== undefined && typeof name !== 'string') {
        const err = new Error('Name must be a string');
        err.status = 400;
        return next(err);
    }
        
    if (age !== undefined && (typeof age !== 'number' || age <= 0)) {
            const err = new Error('Age must be a positive number');
            err.status = 400;
            return next(err);
        }
   
    if (city !== undefined && typeof city !== 'string') {
        const err = new Error('City must be a string');
        err.status = 400;
        return next(err);
    }
    if (name !== undefined) {
        user.name = name;
    }
    if (email !== undefined) {
        user.email = email;    
    }
    if (age !== undefined) {
        user.age = age;
    }    
    if (city !== undefined) {
        user.city = city;
    }
    res.json(user);
};

function deleteUser(req, res, next) {
    if (isNaN(req.params.id)) {
        const err = new Error('Invalid user ID');
        err.status = 400;
        return next(err);
    }
    const userId = Number(req.params.id);
    const user = users.find(u => u.id === userId);
    if (!user) {
        const err = new Error('User not found');
        err.status = 404;
        return next(err);
    }
    users = users.filter(u => u.id !== userId);
    res.json({ message: 'User deleted successfully' });
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    updateUser2,
    deleteUser
};