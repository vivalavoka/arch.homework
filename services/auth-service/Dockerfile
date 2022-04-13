FROM node:14.17.4
WORKDIR /app
COPY ./ ./
RUN npm install --production
EXPOSE 8000/tcp
CMD ["node", "app.js"]