# этап production
FROM nginx:stable-alpine as production-stage
COPY ./dist/spa /srv/www/front