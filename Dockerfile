# этап production
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage ./dist/spa /srv/www/front