# Build React Client
FROM node:18 AS client-build
WORKDIR /app/client

# Setup Corepack and Yarn
RUN corepack enable && corepack prepare yarn@3.2.2 --activate

# Copy client dependencies and install
COPY client/package.json client/yarn.lock client/.yarnrc.yml ./
COPY client/.yarn/ ./.yarn/
RUN yarn install

# Copy client source and build
COPY client/ ./
RUN GENERATE_SOURCEMAP='false' BUILD_PATH='../server/src/views' yarn build

# Build Final Image
FROM node:18
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80

# Setup Corepack and Yarn
RUN corepack enable && corepack prepare yarn@3.2.2 --activate

# Copy server dependencies and install
COPY server/package.json server/yarn.lock server/.yarnrc.yml ./
COPY server/.yarn/ ./.yarn/
RUN yarn install

# Copy server source
COPY server/ ./

# Copy built React files from client-build stage
COPY --from=client-build /app/server/src/views ./src/views

EXPOSE 80

# Use yarn node to ensure PnP resolution works correctly
CMD [ "yarn", "node", "./bin/www.js" ]


