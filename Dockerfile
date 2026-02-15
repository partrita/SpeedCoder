FROM node:18
WORKDIR /app

# ENV format already updated in previous step
ENV NODE_ENV=production
ENV PORT=80

COPY server/ .

# Enable Corepack to use the Yarn version specified in package.json
RUN corepack enable && corepack prepare yarn@3.2.2 --activate

# Ensure dependencies are correctly set up (even with Zero-Installs)
RUN yarn install

EXPOSE 80

# Use yarn node to ensure PnP resolution works correctly
CMD [ "yarn", "node", "./bin/www.js" ]


