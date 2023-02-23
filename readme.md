# NODE CORE

Install the packages as following:
```bash
pnpm install
```

## Environment variables
Setup the following variables in the .env folder:
* PostgreSQL link (example)
```bash
TYPEORM_URI = postgresql://postgres:password@127.0.0.1:5432/oauth2
```
* Refresh token lifetime (5 minute example)
```bash
REFRESH_TOKEN_LIFETIME = 300
```
To generate the crypto keys, following commands are required (best to execute this in CLI at project folder)

```bash
'Note: during private generation a passphrase is required, this is RSA_PASSPHRASE'
openssl genrsa -des3 -out private.pem 2048
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
cat private.pem | base64 '<-- Your RSA_PRIVATE'
cat public.pem | base64 '<-- Your RSA_PUBLIC'
```

RSA private key
```bash
RSA_PRIVATE = "your private key"
```
RSA public key
```bash
RSA_PUBLIC = "your public key"
```
RSA passphrase
```bash
RSA_PASSPHRASE = "your password"
```

## PostGis Database Setup
## Requirements
1. Docker Desktop
2. TablePlus
3. QGIS-LTR
### Docker setup
Download and install the requirements above. Once these are installed we can pull the `postgis/postgis`image from the docker website. Open a command tool and execute `docker pull postgis/postgis`. This will download the image which we will use later.

Open the Docker Desktop application and confirm the image has been installed. After the image is installed, we can create a docker container using following command:
`docker run --name [NAME] -e POSTGRES_PASSWORD=[PASSWORD] -p 5432:5432 -d postgis/postgis`
Confirm that in the Containers / Apps the postgis/postgis container with the name `[NAME]` is running. We can now setup different databases using following command which will open the psql CLI:
`docker exec -ti [NAME] psql -U postgres`
After we are in the CLI, we can configure the databases:
`CREATE DATABASE [database_name];` (notice the ; at the end)
To check if the database has been created, execute the `\l` command in the CLI, this will list all the databases available. To exit the CLI, type `quit`.

### Connecting with TablePlus
Open TablePlus, click on 'create new connection' and select PostgreSQL.
Name: <any>
Host/Socket : localhost
Port: 5432
User: postgres
Password: `[PASSWORD]`
Database: `[database_name]`

### Connecting with QGIS-LTR
Open QGIS, right click on PostGIS and select 'new connection'.
Host: localhost
Port: 5432
Database: `[database_name]`
Click on test connection, a prompt will ask for username and password:
username: postgres
password: `[PASSWORD]`
You can now view postgis data on a map. If you want to view it on OpenStreetMaps, you can drag this from the XYZ-tiles section. Make sure your database is one layer above the OpenStreetMap layer, so it renders properly.
