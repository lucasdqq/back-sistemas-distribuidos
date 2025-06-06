const express = require('express');
const bodyParser = require('body-parser');
const loteRoutes = require('./app/routes/loteRoutes');
const resultadoRoutes = require('./app/routes/resultadoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/lotes', loteRoutes);
app.use('/resultados', resultadoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor executando na porta ${PORT}`);
});