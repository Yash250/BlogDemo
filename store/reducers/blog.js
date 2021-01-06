import { CREATE_BLOG, SET_BLOG, UPDATE_BLOG, DELETE_BLOG } from '../actions/blog';
import Blog from '../../models/blog';

const initialState = {
    availableBlog : [],
    userBlog : []
}

export default (state = initialState, action) => {
    switch(action.type) {
        case CREATE_BLOG:
            const newBlog = new Blog(
                action.id,
                action.ownerId,
                action.title,
                action.description,
                action.post_by,
                action.post_date
            );
            return {
                ...state,
                availableBlog : state.availableBlog.concat(newBlog),
                userBlog : state.userBlog.concat(newBlog)
            }
        case SET_BLOG:
            return {
                availableBlog : action.blogs,
                userBlog : action.userBlogs
            }
        case UPDATE_BLOG:
            const blog = state.userBlog.findIndex(blog => blog.id === action.bid);
            const updateBlog = new Blog(
                action.bid,
                state.userBlog[blog].ownerId,
                action.blogData.title,
                action.blogData.description,
                state.userBlog[blog].post_by,
                state.userBlog[blog].post_date
            );
            const updatedUserBlog = [...state.userBlog];
            updatedUserBlog[blog] = updateBlog;
            const blog2 = state.availableBlog.findIndex(blog => blog.id === action.bid);
            updatedAvailableBlog = [...state.availableBlog];
            updatedAvailableBlog[blog2] = updateBlog;
            return {
                ...state,
                availableBlog : updatedAvailableBlog,
                userBlog : updatedUserBlog
            }
        case DELETE_BLOG:
            return {
                ...state,
                userBlog : state.userBlog.filter(blog => blog.id !== action.bid),
                availableBlog : state.availableBlog.filter(blog => blog.id !== action.bid)
            }
        default:
            return state;

    }
}