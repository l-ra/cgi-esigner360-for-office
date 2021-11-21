REM ran web server from https://github.com/m3ng9i/ran/releases
REM generate cert with:
REM c:\progs\ran_windows_amd64.exe -make-cert-cert=dev-cert.pem -key=dev-key.pem

REM run it
c:\progs\ran_windows_amd64.exe -cert=dev-cert.pem -nc -key=dev-key.pem -tls-port=3000 -r .