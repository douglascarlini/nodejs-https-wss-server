#!/bin/bash

openssl genrsa -out private_key.pem 1024
openssl req -new -key private_key.pem -out ssl_request.csr
openssl x509 -req -in ssl_request.csr -signkey private_key.pem -out certificate.pem

mv certificate.pem app/
mv private_key.pem app/