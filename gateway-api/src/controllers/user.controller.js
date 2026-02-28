const { User } = require ("../database/models");
const bcrypt = require("bcrypt");

async function getProfile(req, res) {
    const id = req.user.id;
    try {
        const user = await User.findByPk(id, {
            attributes: ["username", "created_at"]
        });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar perfil do usuário" });
    }
}

async function updateProfile(req, res) {
    try {
        const id = req.user.id;
        const { password } = req.body;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        hashedPassword = await bcrypt.hash(password, 10);
        await user.update({ password: hashedPassword });
        res.json({ message: "Perfil atualizado com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar perfil do usuário" });
    }
}

module.exports = { getProfile, updateProfile };