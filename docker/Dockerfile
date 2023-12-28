# === Build Stage ===
FROM ubuntu:latest as builder

# Install any needed packages
RUN apt-get update && \
  apt-get install --no-install-recommends -y build-essential curl git gnupg ca-certificates

# install nodejs
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get install --no-install-recommends -y nodejs && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*
RUN npm install yarn -g

WORKDIR /polkamask
COPY . .

# Build the project
RUN yarn && yarn build

# === Runtime Stage ===
FROM node:20-alpine

# Set environment variable
ENV REACT_APP_MODE=production

WORKDIR /polkamask

# Copy the built files from the builder stage
COPY --from=builder /polkamask/ ./

EXPOSE 8000
EXPOSE 8080

# Command to run the application
CMD ["yarn", "start"]