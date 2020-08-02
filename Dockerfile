FROM node:12-alpine

RUN mkdir -p /repo
WORKDIR /repo

ENV TZ UTC
EXPOSE 3000

# Copy package.json and lock files, and install modules
COPY ./ ./

RUN yarn install --frozen-lockfile
RUN yarn build

ENTRYPOINT [ "yarn" ]
CMD ["start"]
