import { eliminarImageCloudinary, subirImageACloudinary } from "../helpers/cloudinaryActions";
import { response } from "../helpers/response"
import { postModel } from "../models/postModel"

const postCtrl = {}

postCtrl.listar = async (req, reply) => {
    try {
        const post = await postModel.find().populate({ path: "user", select: "-password" }).sort({ createdAt: -1 })
        response(reply, 200, true, post, "Lista de posts")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

postCtrl.listarPostLogin = async (req, reply) => {
    try {
        const post = await postModel.find({ user: req.userId }).populate("user", { password: 0 }).sort("-createdAt");
        response(reply, 200, true, post, "Lista de posts del usuario")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

postCtrl.listOne = async (req, reply) => {
    try {
        const { id } = req.params;
        const post = await postModel.findById(id);

        if (!post) {
            return response(reply, 404, false, "", "Registro no encontrado");
        };

        response(reply, 200, true, post, "Post encontrado");
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

postCtrl.add = async (req, reply) => {
    try {
        const { title, description } = req.body;

        const newPost = new postModel({
            title,
            description,
            user: req.userId
        })

        if (req.file) {
            const { secure_url, public_id } = await subirImageACloudinary(req.file);

            newPost.setImg({ secure_url, public_id });
        };

        await postModel.create(newPost);
        response(reply, 201, true, newPost, "post creado")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

postCtrl.update = async (req, reply) => {
    try {
        const { id } = req.params;
        const post = await postModel.findById(id);

        if (!post) {
            return response(reply, 404, false, "", "Registro no encontrado");
        }

        if (req.file) {
            if (post.public_id) {
                await eliminarImageCloudinary(post.public_id);
            }

            const { secure_url, public_id } = await subirImageACloudinary(req.file);

            post.setImg({ secure_url, public_id });

            await post.save();
        };

        await post.updateOne(req.body);
        response(reply, 200, true, "", "Post actualizado")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

postCtrl.delete = async (req, reply) => {
    try {
        const { id } = req.params;
        const post = await postModel.findById(id);

        if (!post) {
            return response(reply, 404, false, "", "Registro no encontrado");
        }
        if (post.public_id) {
            await eliminarImageCloudinary(post.public_id);
        }

        await post.deleteOne();

        response(reply, 200, true, "", "Post eliminado")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

export default postCtrl;