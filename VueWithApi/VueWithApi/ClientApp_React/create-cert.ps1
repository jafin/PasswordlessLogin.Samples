# Requires choco
# Creates a new local developer cert

choco install openssl
openssl req -x509 -newkey rsa:4096 -sha256 -keyout certificate.key -out certificate.crt -days 365 -config certificate.conf -new -nodes

Import-Certificate -FilePath ".\certificate.crt" -CertStoreLocation Cert:\LocalMachine\Root
