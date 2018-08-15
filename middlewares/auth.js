const jwt = require('jsonwebtoken')

//===============
// Verificar token
//==============

let verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (error, decoded) => {
        if (error) {
            return res.status(401).json({
                ok: false,
                error
            })
        }

        req.usuario = decoded.usuario;
        next();


    })

}

//===============
// Verificar admin
//==============

let verificaAdmin = (req, res, next) => {
    let role = req.usuario.role;

    if (role != "ADMIN_ROLE") {
        return res.status(401).json({
            ok: false,
            error: {
                message: "Solo un usuario con rol de ADMIN puede ejecutar esta operacion"
            }
        })
    }
    next();




}



module.exports = { verificaToken, verificaAdmin };