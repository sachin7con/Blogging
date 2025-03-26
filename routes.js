const express = require('express')
const router = express.Router()
const {signup, loginPage, register, login, allUsers, logout } = require('./controllers/userController.js');
const {home, myBlogs, addBlog, createBlog, deleteBlog, editBlog, updateBlog } = require('./controllers/blogController.js');
const {requireAuth, checAuth } = require('./utils/Auth')

router.get('/register', signup)

router.get('/login', loginPage)

router.post('/register', register)

router.post('/login', login)
router.get('/allUsers', requireAuth, allUsers);

router.get('/logout', logout);

router.get('/', home);
router.get('/home', home);

router.get('/myblogs', checAuth, myBlogs);
router.get('/addblog', checAuth,  addBlog);
router.post('/createblog', requireAuth, createBlog);
router.post('/updateblog', updateBlog )
router.get('/deleteblog', requireAuth, deleteBlog);

router.get('/editblog',checAuth, editBlog);



module.exports = router



