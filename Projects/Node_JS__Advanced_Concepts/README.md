# AdvancedNodeStarter

Starting project for a course on Advanced Node @ Udemy

### Setup

- Run `npm install` in the root of the project to install server dependencies
- Change into the client directory and run `npm install --legacy-peer-deps`
- Change back into the root of the project and run `npm run dev` to start the server
- Access the application at `localhost:3000` in your browser

**Important:**
The credentials for the Mongo Atlas DB in `dev.js` are read only. If you attempt to log in without first adding your own connection string (covered later in the course) you will see an error: `[0] MongoError: user is not allowed to do action [insert] on [advnode.users]`

### Routes

| Authentication Route    | Description                                    |
|-------------------------|------------------------------------------------|
| `/auth/google`          | Start OAuth flow to log user in                |
| `/auth/google/callback` | Where users get sent to after OAuth flow       |
| `/auth/logout`          | Logout the current user                        |
| `/api/current_user`     | Get the current user                           |


| Blog Route        | Description                                    |
|-------------------|------------------------------------------------|
| `/api/blogs/:id`  | Get the blog with specified ID                 |
| `GET /api/blogs`  | Get all blogs that belong to the current user  |
| `POST /api/blogs` | Create a new blog                              |

 
# Resources
* [Node JS: Advanced Concepts](https://www.udemy.com/course/advanced-node-for-developers/)