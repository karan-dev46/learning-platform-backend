Prereqs
Node.js (v16+ recommended)

MongoDB running locally (or change MONGO_URI)

Install
At project root:

npm install
# also install packages inside services if you maintain separate package.json per service
# but if you keep a single root package.json with all deps, npm install here is ok
Start services (recommended order)
Open terminals (or use tmux) and run:

# start each microservice (each in its own terminal)
npm run dev:auth
npm run dev:courses
npm run dev:categories
npm run dev:students
# optional: npm run dev:faculties
Then start gateway:

npm start
# or: nodemon gateway/server.js
If everything ok:

Gateway: http://localhost:5000/

Swagger UI: http://localhost:5000/api-docs

Quick health checks
Gateway: GET http://localhost:5000/

Service health (direct): GET http://localhost:5001/health (auth service), :5002/health (course), etc.
