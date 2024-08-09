import userCtrl from "../controllers/userController";

const userRoutes = (fastify, opts, done) => {
    fastify.post("/login", userCtrl.login);

    fastify.post("/register", userCtrl.register);

    done();
};

export default userRoutes;