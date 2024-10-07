# Usa la versión específica 18.16.1 de Node
FROM node:18.16.1

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de configuración del proyecto
COPY package.json yarn.lock ./

# Instala las dependencias
RUN yarn install

# Copia el resto de los archivos del proyecto
COPY . .

# Expone el puerto que Vite usa por defecto
EXPOSE 5173

# Comando para iniciar el servidor de desarrollo de Vite
CMD ["yarn", "dev", "--host"]