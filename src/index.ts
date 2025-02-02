import { app } from "./express"

const port = 3000

app.get("/", (req: any, res: any) => {
  res.writeHead(200)
  res.write("teste xpto...")
  res.end()
})


app.get('/2', (req, res) => {
  res.writeHead(200)
  res.write('teste xpto /2');
  res.end();
});

app.post('/post',(req,res) => {
  res.writeHead(200)
  res.write('Data -> /post');
  res.end();
})

app.post('/post2', (req, res) => {
  res.writeHead(200)
  res.write('Data -> /post2');
  res.end();
})

app.listen(port, () => {
  console.log(`server rodando na porta ${3000}:\n-> http://localhost:${3000}`)
})

