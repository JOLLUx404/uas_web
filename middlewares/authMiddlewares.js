function isAuthenticated(req, res, next) {
    // Check if the user is authenticated by verifying the session
    if (req.session && req.session.email) {
        return next();
    } else {
        res.redirect('/auth/login');
    }
}

function isNotAuthenticated(req, res, next) {
    // Check if the user is not authenticated by verifying the session
    if (req.session && req.session.email) {
        res.redirect('/');
    } else {
        return next();
    }
}

//authorize ('admin')
//authorize ('admin', 'dosen')
//authorize ('admin', 'dosen', 'mahasiswa')
function authorize(...peran) {
    return (req,res,next) => {
        //check if the user has the required role(s) to access the route
        //if the user's role is not in the list of allowed roles, return a 403 Forbidden response
        if(!req.session || !req.session.peran || !peran.includes(req.session.peran)) {
            return res.status(403).send('access denied');
            //return res.status(403).send('akses ditolak');
            return res.render('pages/error',
                {pesanError:'access denied: anda tidak memiliki hak akses'});
        }
        next();
    }
}

module.exports = {
    isAuthenticated,
    isNotAuthenticated,
    authorize
}