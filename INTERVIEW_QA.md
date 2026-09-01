# MERN Stack Interview Q&A - TaskPlanet Mini Project

## PART 1: General MERN Stack Questions

---

### Q1: What is the MERN stack?
**A:** MERN stands for MongoDB, Express.js, React, and Node.js. It's a full-stack JavaScript framework where:
- **MongoDB** - NoSQL document database for data storage
- **Express.js** - Backend web framework for Node.js
- **React** - Frontend library for building UI components
- **Node.js** - JavaScript runtime for the backend server

---

### Q2: How does the MERN stack work together?
**A:** 
1. React (frontend) sends HTTP requests via Axios to the Express backend
2. Express handles routing, authentication, and business logic
3. Express communicates with MongoDB using Mongoose ODM
4. Data flows back: MongoDB → Express → React → User sees it on screen

---

### Q3: What is REST API?
**A:** REST (Representational State Transfer) is an architectural style for APIs. It uses HTTP methods:
- **GET** - Retrieve data
- **POST** - Create new data
- **PUT/PATCH** - Update data
- **DELETE** - Remove data

In our project: `GET /api/posts` retrieves all posts, `POST /api/posts` creates a new post.

---

### Q4: What is middleware in Express.js?
**A:** Middleware functions have access to request, response, and next(). They execute in order and can:
- Execute code
- Modify request/response objects
- End the request-response cycle
- Call next() to pass to next middleware

Example from our project: `auth.js` middleware verifies JWT token before protected routes.

---

### Q5: What is the difference between SQL and NoSQL (MongoDB)?
**A:**
| SQL | NoSQL (MongoDB) |
|-----|-----------------|
| Tables with rows/columns | Collections with documents (JSON-like) |
| Fixed schema | Dynamic schema |
| Relationships via JOINs | Embedding or referencing |
| MySQL, PostgreSQL | MongoDB |
| Better for complex queries | Better for flexibility and scaling |

---

### Q6: What is JWT and how does authentication work?
**A:** JWT (JSON Web Token) is a stateless authentication mechanism:
1. User logs in with email/password
2. Server validates credentials, creates a JWT with user ID
3. Token is sent to client and stored in localStorage
4. Client sends token in `Authorization: Bearer <token>` header with each request
5. Server middleware verifies the token and attaches user to request

JWT has 3 parts: Header.Payload.Signature (base64 encoded).

---

### Q7: What is Mongoose and why use it?
**A:** Mongoose is an ODM (Object Document Modeling) library for MongoDB. It:
- Defines schemas with data types and validation
- Provides models (classes) to interact with MongoDB
- Supports middleware/hooks (pre-save, post-find, etc.)
- Enables population (joining references like SQL JOINs)
- Provides built-in methods like `findById`, `findOne`, `aggregate`

---

### Q8: What is bcrypt and why hash passwords?
**A:** bcrypt is a password hashing library. We hash passwords because:
- **Never store plain text passwords** in the database
- Even if DB is leaked, passwords are unreadable
- bcrypt adds a random "salt" to each password making rainbow table attacks impossible
- It's deliberately slow to prevent brute-force attacks

```js
const hash = await bcrypt.hash(password, 10); // 10 = salt rounds
const match = await bcrypt.compare(input, hash); // verify
```

---

### Q9: What is CORS and why do we need it?
**A:** CORS (Cross-Origin Resource Sharing) is a browser security mechanism. When frontend (localhost:3000) calls backend (localhost:5001), they're on different origins. The browser blocks cross-origin requests by default.

```js
app.use(cors()); // Enables CORS for all origins
```

Without this, the browser would reject all API calls from React to Express.

---

### Q10: What is the difference between `props` and `state` in React?
**A:**
- **Props** - Data passed from parent to child component (read-only)
- **State** - Internal data managed by the component (can be changed)

```js
// Parent passes props
<Feed posts={postsData} />

// Child receives props and manages state
function Feed({ posts }) {
  const [comment, setComment] = useState(''); // state
}
```

---

### Q11: What are React hooks? Name the ones used in this project.
**A:** Hooks are functions that let you use state and lifecycle in functional components:
- **useState** - State management (e.g., `const [user, setUser] = useState(null)`)
- **useEffect** - Side effects on mount/update (e.g., loading posts on page load)
- **useContext** - Consuming context (e.g., `useAuth()` for auth state)
- **useRef** - DOM references (e.g., `messagesEndRef` for chat scroll)
- **useParams** - URL parameters (e.g., `:id` in profile route)
- **useNavigate** - Programmatic navigation
- **useCallback** - Memoized callbacks (e.g., debounced search function)

---

### Q12: What is Context API and how is it used in this project?
**A:** Context API provides global state without prop drilling. In our project:
- `AuthContext` stores: `user`, `loading`, `login()`, `register()`, `logout()`
- `AuthProvider` wraps the entire app
- Any component calls `useAuth()` to access auth state
- Avoids passing auth props through every component

---

### Q13: What is the virtual DOM in React?
**A:** The virtual DOM is a lightweight JavaScript copy of the real DOM. When state changes:
1. React creates a new virtual DOM tree
2. Compares it with the previous one (diffing)
3. Only updates the changed parts in the real DOM (reconciliation)

This makes React fast because direct DOM manipulation is expensive.

---

### Q14: What is Multer in Node.js?
**A:** Multer is middleware for handling `multipart/form-data` (file uploads). In our project:
- Configured with `diskStorage` to save files to `backend/uploads/`
- File size limited to 10MB
- Accepts images and videos
- Attaches file info to `req.file`

```js
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
router.post('/', auth, upload.single('media'), createPost);
```

---

### Q15: What is the difference between `let`, `const`, and `var`?
**A:**
- **var** - Function scoped, hoisted, can be redeclared (avoid)
- **let** - Block scoped, can be reassigned, not redeclared
- **const** - Block scoped, cannot be reassigned or redeclared

```js
var x = 1;   // function scoped
let y = 2;   // block scoped, reassignable
const z = 3; // block scoped, NOT reassignable
```

---

### Q16: What is async/await?
**A:** Async/await is syntactic sugar over Promises for cleaner asynchronous code:
```js
// Promise style
user.save().then(result => console.log(result)).catch(err => console.log(err));

// Async/await style
try {
  const result = await user.save();
  console.log(result);
} catch (err) {
  console.log(err);
}
```
- `async` before function means it returns a Promise
- `await` pauses execution until the Promise resolves

---

### Q17: What is Express.js routing?
**A:** Routing defines how the app responds to client requests at specific URLs:
```js
router.get('/:id', getProfile);      // GET /api/users/123
router.post('/:id/follow', followUser); // POST /api/users/123/follow
router.get('/search', searchUsers);   // GET /api/users/search?q=john
```
Routes can use parameters (`:id`), query strings (`?q=`), and request body.

---

### Q18: What is the useEffect cleanup function?
**A:** The cleanup function runs when the component unmounts or before re-running the effect:
```js
useEffect(() => {
  const subscription = someAPI.subscribe();
  return () => subscription.unsubscribe(); // cleanup
}, []);
```
Prevents memory leaks, clears timers, cancels subscriptions, aborts fetch requests.

---

### Q19: How does MongoDB handle relationships?
**A:** Two approaches:
1. **Embedding** (denormalization) - Store related data inside the document:
   ```js
   comments: [{ user: ObjectId, text: String }]
   ```
2. **Referencing** (normalization) - Store ObjectId references:
   ```js
   user: ObjectId (ref: 'User')
   ```
   Then use `.populate()` to join:
   ```js
   Post.find().populate('user', 'username avatar')
   ```

In our project: Comments are embedded in posts, but post user and comment user are referenced.

---

### Q20: What is the difference between `==` and `===`?
**A:**
- **==** - Loose equality, compares values after type coercion
- **===** - Strict equality, compares value AND type

```js
1 == '1'   // true (type coerced)
1 === '1'  // false (different types: number vs string)
null == undefined  // true
null === undefined // false
```
Always use `===` to avoid unexpected behavior.

---

## PART 2: TaskPlanet Mini Project-Specific Questions

---

### Q21: Walk me through the architecture of your TaskPlanet project.
**A:** 
- **Frontend:** React + Vite + MUI, running on port 3000. Vite proxies API requests to the backend.
- **Backend:** Express.js server on port 5001 with JWT authentication middleware.
- **Database:** MongoDB Atlas with 3 collections: users, posts, messages.
- **Flow:** React → Axios (with JWT header) → Express routes → Controllers → Mongoose models → MongoDB Atlas.

---

### Q22: How did you handle authentication in this project?
**A:**
1. User registers/logs in, server validates credentials with bcrypt
2. Server generates JWT containing userId, valid for 7 days
3. Token stored in localStorage on the client
4. Axios interceptor attaches `Authorization: Bearer <token>` to every request
5. `auth.js` middleware on protected routes verifies the token and attaches `req.user`
6. If token is invalid/expired, returns 401 unauthorized

---

### Q23: How does the auto-login (auto-create user) feature work?
**A:** In the login controller, if `User.findOne({ email })` returns null:
1. Extract username from email prefix (e.g., `john@gmail.com` → `john`)
2. Hash the password with bcrypt
3. Create a new User document
4. Generate JWT and return user info
5. Next login attempt finds the existing user and works normally

---

### Q24: How are file uploads handled in this project?
**A:**
1. Frontend: `<input type="file">` inside a `<label>` wrapping an `<IconButton>`
2. File sent as `FormData` via Axios POST to `/api/posts`
3. Multer middleware on the backend saves file to `backend/uploads/` with timestamp filename
4. File path stored as `/uploads/filename.jpg` in the Post document
5. Express serves `uploads/` folder statically
6. Frontend displays via `<img src={post.media}>` or `<video src={post.media}>`

---

### Q25: How does the follow/unfollow system work?
**A:**
1. User clicks Follow on another user's profile
2. Frontend calls `POST /api/users/:id/follow`
3. Backend checks if current user is already following:
   - If NOT following: pushes userId to both `currentUser.following` and `targetUser.followers`
   - If already following: removes from both arrays (unfollow)
4. Saves both user documents
5. Frontend toggles button text between "Follow" / "Unfollow"

---

### Q26: How does the messaging system work?
**A:**
1. User clicks Message button on someone's profile → navigates to `/messages/:userId`
2. Frontend calls `GET /api/messages/:userId` to load chat history
3. Messages displayed in a scrollable chat UI with sender alignment (left/right)
4. User types message, clicks Send → `POST /api/messages` with `{ receiverId, text }`
5. Message saved to DB with `read: false`
6. Conversations page (`/messages`) shows all chats sorted by latest message

---

### Q27: How did you handle state management across the app?
**A:** Used React Context API via `AuthContext`:
```js
// AuthContext provides:
user          // current logged-in user object
loading       // true while checking auth on page load
login()       // login with email/password
register()    // register with username/email/password
logout()      // clear token and user state
```
Any component accesses it with `useAuth()` hook. No external state library needed for this scale.

---

### Q28: Why did you choose MUI over Bootstrap or plain CSS?
**A:**
1. **Pre-built components** - Cards, Tabs, Avatars, BottomNavigation, FAB, etc. ready to use
2. **sx prop** - Inline styling without writing CSS files
3. **Theme system** - Consistent colors, typography across the app
4. **Responsive** - Built-in Grid system and mobile-friendly components
5. **Speed** - Rapid prototyping with less custom CSS
6. **React integration** - First-class support for React
7. **Custom theming** - `createTheme()` with component overrides for consistent styling

---

### Q29: How does the Vite proxy configuration work?
**A:** In `vite.config.js`:
```js
proxy: {
  '/api': 'http://localhost:5001',
  '/uploads': 'http://localhost:5001'
}
```
When React makes a request to `/api/auth/login`, Vite intercepts it and forwards to `http://localhost:5001/api/auth/login`. This avoids CORS issues during development and keeps API URLs clean in the frontend code.

---

### Q30: What problems did you face during development and how did you solve them?
**A:**
1. **Port 5000 conflict** - Intel Graphics Command Center was using port 5000. Fixed by switching to port 5001.
2. **MongoDB DNS resolution failure** - Local DNS couldn't resolve Atlas SRV record. Fixed by adding `dns.setServers(['8.8.8.8', '8.8.4.4'])` in server.js to use Google DNS.
3. **Model import case sensitivity** - `require('../models/post')` vs `Post.js`. Fixed the casing.
4. **PowerShell compatibility** - `&&` not supported, `&` needs escaping. Used `;` and `Start-Process` instead.

---

### Q31: How would you scale this application for production?
**A:**
- **Security:** Use HTTP-only cookies instead of localStorage for JWT, add rate limiting, input sanitization
- **Performance:** Add Redis caching, implement pagination for posts/messages
- **File storage:** Move uploads to AWS S3 or Cloudinary
- **Real-time messaging:** Add Socket.io for live chat
- **Deployment:** Vercel (React), Railway/Render (Express), keep MongoDB Atlas
- **Environment:** Separate dev/staging/production configs
- **Testing:** Add Jest + React Testing Library

---

### Q32: How would you add real-time chat with Socket.io?
**A:**
1. Install `socket.io` (server) and `socket.io-client` (client)
2. On server: attach Socket.io to the HTTP server, listen for `connection`
3. On connection, join a room named after the user's ID
4. When sending a message, emit to the receiver's room
5. On client: connect to the Socket server, listen for incoming messages
6. Update messages state in real-time without page refresh

---

### Q33: What is the difference between `populate()` and embedding in MongoDB?
**A:**
- **Populate** (referencing): Store ID references, use `.populate()` to join at query time
  - Pro: Smaller documents, easier updates
  - Con: Extra query needed, slower reads
- **Embedding**: Store nested documents inside parent
  - Pro: Single query, faster reads
  - Con: Document size limit (16MB), harder to update nested data

Our project uses both: comments are embedded in posts, but user references are populated.

---

### Q34: How does the Axios interceptor work in this project?
**A:** 
```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```
Every outgoing request automatically gets the JWT token attached to the Authorization header. This avoids manually adding the header to every API call.

---

### Q35: How does the search functionality work in this project?
**A:** Search is implemented with a full-screen dialog component (`SearchDialog.jsx`):
1. User clicks search icon in AppBar → opens SearchDialog
2. User types in search input with debounced API calls (300ms delay)
3. Two parallel API requests fire: `GET /api/users/search?q=` and `GET /api/posts/search?q=`
4. Backend uses MongoDB regex: `User.find({ username: { $regex: query, $options: 'i' } })`
5. Post search: `Post.find({ content: { $regex: query, $options: 'i' } })` with user population
6. Results displayed in tabbed view (Users / Posts) with result count badges
7. Clicking a user navigates to their profile; clicking a post navigates to feed

---

### Q36: How did you implement debounced search to avoid excessive API calls?
**A:** Used `setTimeout`/`clearTimeout` pattern with React's `useEffect`:
```js
useEffect(() => {
  const timer = setTimeout(() => {
    if (query.trim()) doSearch(query);
    else { setUsers([]); setPosts([]); }
  }, 300); // 300ms debounce
  return () => clearTimeout(timer); // cleanup on each keystroke
}, [query, doSearch]);
```
Each keystroke resets the timer. Only fires the API call after the user stops typing for 300ms. The `doSearch` function is wrapped in `useCallback` to prevent unnecessary re-renders.

---

### Q37: How does the custom MUI theme work in this project?
**A:** Theme is created with `createTheme()` in `App.jsx`:
```js
const theme = createTheme({
  palette: {
    primary: { main: '#2196F3', light: '#64B5F6', dark: '#1565C0' },
    secondary: { main: '#FF9800' },
    background: { default: '#F0F2F5', paper: '#FFFFFF' }
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCard: { styleOverrides: { root: { borderRadius: 16, boxShadow: '...' } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 12, textTransform: 'none' } } },
    // ... more overrides
  }
});
```
`<ThemeProvider theme={theme}>` wraps the entire app. All MUI components automatically inherit these styles. Component overrides ensure consistent border radius, shadows, and colors without repeating styles in each component.

---

### Q38: How does the feed filter system work?
**A:** Feed posts can be filtered using horizontal scrollable chips:
1. `activeFilter` state tracks the selected filter (0-3)
2. `getFilteredPosts()` applies the filter logic:
   - **All Post (0):** Default order (newest first)
   - **For You (1):** Returns first half of posts (simulated personalized feed)
   - **Most Liked (2):** Sorts by `likes.length` descending
   - **Most Commented (3):** Sorts by `comments.length` descending
3. Filter chips use MUI `Chip` with `color="primary"` when active, outlined when inactive
4. Chips are in a horizontal scrollable container with hidden scrollbar

---

### Q39: How does the SearchDialog component handle both user and post results?
**A:** The SearchDialog uses parallel API calls and tabbed display:
1. `useEffect` watches the `query` state with a 300ms debounce
2. Fires `Promise.all([userAPI.search(q), postAPI.search(q)])` for concurrent requests
3. Results stored in separate `users` and `posts` state arrays
4. MUI `Tabs` component switches between Users and Posts views
5. Each tab shows a `Chip` with the result count
6. User results show avatar, username, follower count, and "View" chip
7. Post results show avatar, username, date, content snippet (2-line clamp), and like count chip
8. Clicking a user navigates to `/profile/:id`; clicking a post navigates to feed

---

### Q40: What are the key differences between the v1 and v2 UI?
**A:**
| Feature | v1 | v2 |
|---------|----|----|
| Theme | Default MUI blue/pink | Custom bright blue (#2196F3) with component overrides |
| Login/Register | Flat grey background | Gradient blue background, rounded cards |
| AppBar | Blue background, text title | White background, gradient text logo, search icon |
| Bottom Nav | Default white/grey | Blue gradient, raised center FAB button |
| Feed | Basic card layout | Create post with toggle tabs, filter chips, FAB |
| Posts | Plain cards | Hover effects, Follow badges, styled action bar |
| Profile | Basic centered card | Gradient header, avatar ring, stat badges |
| Messages | Basic chat bubbles | Rounded bubbles, online status, styled empty state |
| Search | Not available | Full-screen dialog with user + post results |
| Post interactions | Basic icons | Colored like (red), styled comment input, share |
