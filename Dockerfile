# etapa 1: imagem base para build (compilacao)
FROM node:20-alpine AS build

# define o diretorio de trabalho dentro do container para /app
WORKDIR /app

# copia todos os arquivos do projeto para dentro do container (/app)
COPY . .

# instala as dependencias e executa o build (compilacao do codigo typescript, etc)
RUN npm install && npm run build

# etapa 2: imagem final para producao (menor e otimizada)
FROM node:20-alpine

# define o diretorio de trabalho dentro do container para /app
WORKDIR /app

# copia todo o conteudo da pasta /app da etapa de build para essa etapa
COPY --from=build /app /app

# instala somente as dependencias necessarias para producao (sem devdependencies)
RUN npm install --production

# define a variavel de ambiente host com valor 0.0.0.0 (escuta em todas interfaces)
ENV HOST=0.0.0.0

# expoe a porta 3333 para acesso externo (porta que a aplicacao vai usar)
EXPOSE 3333

# comando padrao para rodar quando o container iniciar:
# executa o script "start" definido no package.json para iniciar o servidor
CMD ["npm", "start"]
