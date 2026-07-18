require ('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const { transporter } = require('./config/mail');
const { isAuthenticated, authorize } = require('./middlewares/authMiddlewares');

const adminRoutes = require ('./routes/adminRoutes');
const dosenRoutes = require ('./routes/dosenRoutes');
const mahasiswaRoutes = require ('./routes/mahasiswaRoutes');
const kelasRoutes = require('./routes/kelasRoutes');
const dosenPanelRoutes = require('./routes/dosenPanelRoutes');
const mahasiswaPanelRoutes = require('./routes/mahasiswaPanelRoutes');
const authRoutes = require ('./routes/authRoutes');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 60 * 60 * 1000 * 1
  }
}));

app.use((req, res, next) => {
  res.locals.user = req.session;
  next();
});

app.engine('hbs', engine({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  helpers: {
    inc: (value) => parseInt(value) + 1,
    isSelected: (a, b) => {
      // Inline helper to return "selected" attribute if values match
      return String(a) === String(b) ? 'selected' : '';
    },
    isChecked: (arr, val) => {
      // Inline helper to return "checked" attribute if value is in array
      if (!arr) return '';
      const arrValues = arr.map(v => String(v));
      return arrValues.includes(String(val)) ? 'checked' : '';
    },
    eq: function(a, b, options) {
      // Works as both block helper and inline helper
      const isEqual = String(a) === String(b);
      if (options && typeof options.fn === 'function') {
        // Block helper context: {{#eq a b}}...{{/eq}}
        return isEqual ? options.fn(this) : options.inverse(this);
      } else {
        // Inline helper context: {{#if (eq a b)}}...{{/if}}
        return isEqual;
      }
    },
    inArray: function(arr, val, options) {
      // Works as both block helper and inline helper
      if (!arr) {
        if (options && typeof options.fn === 'function') {
          return options.inverse(this);
        }
        return false;
      }
      const arrValues = arr.map(v => String(v));
      const isIncluded = arrValues.includes(String(val));
      if (options && typeof options.fn === 'function') {
        // Block helper context: {{#inArray arr val}}...{{/inArray}}
        return isIncluded ? options.fn(this) : options.inverse(this);
      } else {
        // Inline helper context: {{#if (inArray arr val)}}...{{/if}}
        return isIncluded;
      }
    },
    or: function(a, b) {
      return a || b;
    },
    json: function(context) {
      return JSON.stringify(context);
    }
  }
}))

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use('/bootstrap', 
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist'))
);

app.use(express.static(path.join(__dirname,'public')));

app.get('/', isAuthenticated, (req, res) => {
  res.render('pages/index');
});

app.use("/admin", isAuthenticated, authorize ('admin'), adminRoutes);
app.use("/dosen", isAuthenticated,authorize ('admin'), dosenRoutes);
app.use("/mahasiswa",isAuthenticated,authorize('admin'), mahasiswaRoutes);
app.use("/kelas", isAuthenticated, authorize('admin'), kelasRoutes);
app.use("/dosen-panel", isAuthenticated, authorize('dosen'), dosenPanelRoutes);
app.use("/mahasiswa-panel", isAuthenticated, authorize('mahasiswa'), mahasiswaPanelRoutes);
app.use("/auth", authRoutes);

//not found handler
app.use((req,res, next)=>{
  res.status(404).render('pages/error-code/not-found');
});

//server error handler
app.use((err, req,res,next)=>{
  console.log(err.stack);
  res.status(500).render('pages/error-code/server-error',{
    pesanError: process.env.NODE_ENV === 'development' ? err.message: 'Terjadi kesalahan pada server.'
  });
});

app.listen(3000, ()=>{
    console.log('server is running on http://localhost:3000');
});