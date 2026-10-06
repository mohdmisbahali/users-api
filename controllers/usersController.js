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
        return res.status(400).json({ message: 'Invalid offset value' });
    }
    if (req.query.limit && isNaN(req.query.limit) || req.query.limit <= 0){
        return res.status(400).json({ message: 'Invalid limit value' });
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

function getUserById(req, res) {
    if (isNaN(req.params.id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    const userId = Number(req.params.id);
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
};

function createUser(req, res) {
    const user = req.body;
    if (!user.name || !user.email || !user.city) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (typeof user.age !== 'number' || user.age <= 0) {
        return res.status(400).json({ message: 'Age must be a positive number' });
    } 
    const existingUser = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
    }
    const max = users.reduce((x, y) => {
    return Math.max(x, y.id);
    }, 0);

    user.id = max + 1;
    
    users.push(user);
    res.status(201).json({ message: 'User created successfully', user })
};

function updateUser(req, res) {
    if (isNaN(req.params.id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    const userId = Number(req.params.id);
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (!req.body.name || !req.body.email || !req.body.city) {
        return res.status(400).json({ message: 'Name, email, and city are required' });
    }
    if (typeof req.body.age !== 'number' || req.body.age <= 0) {
        return res.status(400).json({ message: 'Age must be a positive number' });
    }
    const existingUser = users.find(u => u.email.toLowerCase() === req.body.email.toLowerCase() && u.id !== userId);
    if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
    }
    user.name = req.body.name;
    user.email = req.body.email;
    user.age = req.body.age;
    user.city = req.body.city;
    res.json(user);
};

function updateUser2(req, res) {
    if (isNaN(req.params.id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    const userId = Number(req.params.id);
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (req.body.name) {
        user.name = req.body.name;
    }
    if (req.body.email) {
        const existingUser = users.find(u => u.email.toLowerCase() === req.body.email.toLowerCase() && u.id !== userId);
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        user.email = req.body.email;
    }
    if (req.body.age !== undefined) {
        if (typeof req.body.age !== 'number' || req.body.age <= 0) {
            return res.status(400).json({ message: 'Age must be a positive number' });
        }
        user.age = req.body.age;
    }
    
    if (req.body.city) {
        user.city = req.body.city;
    }
    res.json(user);
};

function deleteUser(req, res) {
    if (isNaN(req.params.id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    const userId = Number(req.params.id);
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
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