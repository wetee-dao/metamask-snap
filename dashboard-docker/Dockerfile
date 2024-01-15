FROM node:buster as BUILDER

WORKDIR /app

ARG CACHEBUST=1
RUN echo "CACHEBUST=${CACHEBUST}"

RUN git clone https://github.com/Nick-1979/staking-dashboard.git .

RUN apt update && apt install -y git
RUN yarn install && yarn build

# --------------------------------------------------
FROM nginx

COPY --from=BUILDER /app/build /usr/share/nginx/html

EXPOSE 80
