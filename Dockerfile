# syntax=docker/dockerfile:1

FROM node:18.13-alpine AS base

# Create app directory
WORKDIR /app
COPY package*.json ./

# Install app dependecies
# COPY package*.json ./
# RUN npm install && npm cache clean --force

# Install the nest.js cli globally
# RUN npm install -g @nestjs/cli

# Copy app source code
# COPY . .

# Build the application
# RUN nest build

# Start the application
# CMD ["nest", "start:prod"]

FROM base AS dev
ENV NODE_ENV=development
RUN npm install && npm cache clean --force && npm install -g @nestjs/cli
COPY . .
CMD ["npm", "run", "start:dev"]

FROM base AS test
ENV NODE_ENV=test
CMD ["npm", "run", "test"]

FROM base AS test-cov
CMD ["npm", "run", "test:cov"]

FROM base AS test-watch
ENV GIT_WORK_TREE=/app GIT_DIR=/app/.git
# RUN apk add git
CMD ["npm", "run", "test:watch"]

FROM base AS prod
ENV NODE_ENV=production
RUN npm install && npm cache clean --force && npm install -g @nestjs/cli
COPY . .
RUN npm run build
CMD ["npm", "run", "start:prod"]
