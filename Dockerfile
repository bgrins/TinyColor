FROM golang:1.26 AS build
WORKDIR /app/src
COPY src/go.mod ./
RUN go mod download
COPY src/ ./
RUN go build -o /tinycolor ./cmd/tinycolor-compat

FROM scratch
COPY --from=build /tinycolor /tinycolor
ENTRYPOINT ["/tinycolor"]
