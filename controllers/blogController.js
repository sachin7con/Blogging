const Blogs = require('../Models/Blogs.js');
const { response } = require('express');


const home = async (req, res) => {
        const perpage = 5;
        const page = req.query.page || 1;
        const sort = req.query.sort || 'title';
        const search = req.query.search || '';
        
    try{
        const searchFilter = search 
        ? {title : { $regex: search, $options: "i" }}
        : {}
        const blogs = await Blogs.find(searchFilter)
         .sort({[sort] : 1})
         .skip((perpage * page) - perpage)
         .limit(perpage)

        const count = await Blogs.countDocuments(searchFilter);
        const totalPages = Math.ceil(count/perpage)

        
        res.render('home', {message: null, blogData : blogs, pages: totalPages, current: parseInt(page), sort: sort, search : search })
    }
    catch(error) {
        res.render('home', {message: null, blogData: null})
    }
    
}

const addBlog = (req, res) => {
    res.render('addBlog', {message: null})
}

const editBlog = async (req, res) => {
    try{
        const {blogId} = req.query
        const blogData = await Blogs.findOne({_id: blogId})
        res.render('editblog', {message: null, blogData })
    }
    catch(error) {
        console.log(error);
        res.render('editblog', { message: "Error fetching blog data", blogData: null });

    }
    
}

const updateBlog = async (req, res) => {
    try
    {
    const { blogId } = req.body
    const { title, body } = req.body 

    const updatedBlog = await Blogs.findByIdAndUpdate(blogId, { title, body }, {new: true});
    if(!updatedBlog){
        res.render('editblog', { message: "Blog not found", blogData: null })
    } 

    res.redirect('myblogs');
}
catch(err){
        console.log(err);
        res.render('editblog', {message: "error in updating blog", blogData: null})
}
}

const myBlogs = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.redirect('/login');
        }

        const myBlogsList = await Blogs.find({ userId });
        console.log("Fetched Blogs:", myBlogsList); // for Debugging

        res.render('myblogs', { message: null, blogData: myBlogsList }); 
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).send("Internal Server Error");
    }
};

const createBlog = async (req, res) => {
    try {
        const { title, body } = req.body;
        const newBlog = new Blogs({ title, body, userId: req.session.userId });
        await newBlog.save(); 
        res.redirect('/myblogs');
    } catch (err) {
        res.render('addBlog', { message: "Blog cannot be saved, please try again later." });
    }
};

const deleteBlog = (req, res) => {
    try {   
        const {blogId} = req.query
        Blogs.findOneAndDelete({_id: blogId})
        .then( response => {
            res.redirect('/myblogs')
        })
        .catch(err => {
            res.redirect('/myblogs')

        }) 
         
    } catch(error) {
        console.log(error);
    }
};



module.exports = {home, addBlog, myBlogs, createBlog, deleteBlog, editBlog, updateBlog}