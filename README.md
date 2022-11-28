# Projeto Cloud 2022
---
Clique [aqui](https://cloud-docs.vercel.app/) para olhar a documentação do projeto!
---

## Este é um projeto que "dockerizado" por completo!
Para que seja possível que rode ele em sua propria máquina, basta ter docker e docker compose instalados!

Caso não tenha o nem o docker compose nem o docker instalados, basta seguir as informações contidas [aqui](https://docs.docker.com/engine/install/ubuntu/) e [aqui](https://docs.docker.com/compose/install/linux/)

---
### Com o docker instalado na sua máquina, é hora de baixar o repositório e executá-lo!

execute o comando a seguir no diretório onde deseja guardar este repositório:
```bash
$ git clone https://github.com/NicolasQueiroga/my-dashboard.git
```

Para rodar o docker siga os comandos abaixo (dentro do diretório raiz do projeto):

- executar o frontend:
  - `cd frontend`
  - `cp .env.local.sample .env.local`
  - `docker compose up`

Agora você terá a aplicação web rodando na seguinte url `http://localhost:3000/`

- executar o backend em outro terminal:
  - `cd backend`
  - `cd tf`
  - crie um arquivo `terraform.tfvars` e adicione as seguintes linhas:
    - aws_access_key = ""
    - aws_secret_key = ""
    - access_ip = "0.0.0.0/0"
  - `cd autoscale`
  - `mkdir keys`
  - `cd ../ec2`
  - `mkdir keys`
  - `cd ../..`
  - `docker compose up`

Agora consegue desfrutar da interface amigável para criar as seus usuários e instâncias!

---
<div align="center">
  <h1>Autor:</h1>
  <kbd>
  <img src="https://github.com/NicolasQueiroga.png" style="height:160px; width:auto;">
  </kbd>
    
   <br>
  
  [Nicolas Queiroga](https://github.com/NicolasQueiroga)
  


  <div align="right">
    <p>Insper</p>
  </div>
</div>
