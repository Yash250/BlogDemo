import Blog from '../../models/blog';

export const CREATE_BLOG = 'CREATE_BLOG';
export const SET_BLOG = 'SET_BLOG';
export const UPDATE_BLOG = 'UPDATE_BLOG';
export const DELETE_BLOG = 'DELETE_BLOG';


export const createBlog = (title, description, name, date) => {
    return async (dispatch, getState) =>  {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const response = await fetch(`https://blogapp-c7472-default-rtdb.firebaseio.com//blogs.json?auth=${token}`,{
            method : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                title,
                description,
                post_by : name,
                ownerId : userId,
                post_date : date
            })
        });
        const responseData = await response.json();
        dispatch({
            type : CREATE_BLOG,
            blogData : {
                id : responseData.name,
                title,  
                description,
                ownerId: userId,
                post_by : name,
                post_date : date
        }
        });
    }
}

export const fetchBlog = () => {
    return async (dispatch, getState) =>  {
        const userId = getState().auth.userId;
        try {
        const response = await fetch('https://blogapp-c7472-default-rtdb.firebaseio.com//blogs.json');
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error('Something went wrong!')
        }

        const loadedBlog = [];

        for (const key in responseData){
            loadedBlog.push(new Blog(
                key,
                responseData[key].ownerId,
                responseData[key].title,
                responseData[key].description,
                responseData[key].post_by,
                responseData[key].post_date
            ));
        };
      

        dispatch({
            type : SET_BLOG,
            blogs : loadedBlog,
            userBlogs : loadedBlog.filter(blog => blog.ownerId === userId)
        });} catch (err) {
            throw err;
        }
}
};

export const updateBlog = (id, title, description) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`https://blogapp-c7472-default-rtdb.firebaseio.com//blogs/${id}.json?auth=${token}`,{
            method : 'PATCH',
            headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                title,
                description
            })
        });
        if (!response.ok){
            throw new Error('Something went wrong!')
        }

        dispatch({
            type : UPDATE_BLOG,
            bid : id,
            blogData : {
                title,
                description
            }
        })
    }
}

export const deleteBlog = blogId => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`https://blogapp-c7472-default-rtdb.firebaseio.com//blogs//${blogId}.json?auth=${token}`,{
            method : 'DELETE'
        });
        if (!response.ok){
            throw new Error('Something went wrong!')
        }

        dispatch({
            type : DELETE_BLOG,
            bid : blogId
        });
    } 
};