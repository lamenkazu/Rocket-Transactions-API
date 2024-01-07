import { app } from "./app";
import { env } from "./env";

const port = env.PORT;
app.listen({ port: Number(port) }).then(() => {
  console.log(`Servidor rodando na porta ${port}`);
});
