# Zowe YAML Configuration File Reference

Zowe v2 uses a YAML configuration file during install, configure and runtime. This file is usually referred as `zowe.yaml`. YAML is a human-friendly data serialization language for all programming languages. To learn more about YAML specifications, please visit https://yaml.org/.

**Note:** In the following sections, we refer configuration keys with concatenation of key names and dots. For example, if you want to update the configuration key `zowe.internalCertificate.keystore.type` with value `PKCS12`, you should set value for this entry in the `zowe.yaml`:

```yaml
zowe:
  internalCertificate:
    keystore:
      type: PKCS12
```

**Contents in this section**

- [High level overview of YAML configuration file](#high-level-overview-of-yaml-configuration-file)
- [Extract sharable configuration out of zowe.yaml](#extract-sharable-configuration-out-of-zoweyaml)
- [Configuration override](#configuration-override)
- [YAML configurations - certificate](#yaml-configurations---certificate)
- [YAML configurations - zowe](#yaml-configurations---zowe)
- [YAML configurations - java](#yaml-configurations---java)
- [YAML configurations - node](#yaml-configurations---node)
- [YAML configurations - zOSMF](#yaml-configurations---zosmf)
- [YAML configurations - components](#yaml-configurations---components)
    - [Configure component gateway](#configure-component-gateway)
    - [Configure component discovery](#configure-component-discovery)
    - [Configure component api-catalog](#configure-component-api-catalog)
    - [Configure component caching-service](#configure-component-caching-service)
    - [Configure component app-server](#configure-component-app-server)
    - [Configure component zss](#configure-component-zss)
    - [Configure component jobs-api](#configure-component-jobs-api)
    - [Configure component files-api](#configure-component-files-api)
    - [Configure component explorer-jes](#configure-component-explorer-jes)
    - [Configure component explorer-mvs](#configure-component-explorer-mvs)
    - [Configure component explorer-uss](#configure-component-explorer-uss)
    - [Configure external extension](#configure-external-extension)
- [YAML configurations - haInstances](#yaml-configurations---hainstances)
- [Auto-generated environment variables](#auto-generated-environment-variables)

### High level overview of YAML configuration file

The YAML configuration file has few high level sections:

- **`zowe`**  
 Defines global configurations specific to Zowe, including default values.
- **`java`**  
 Defines Java configurations used by Zowe components.
- **`node`**  
 Defines node.js configurations used by Zowe components.
- **`zOSMF`**  
 Tells Zowe your z/OSMF configurations.
- **`components`**  
 Defines detailed configurations for each Zowe component or extension. Each component or extension may have a key entry under this section. For example, `components.gateway` is configuration for API Mediation Layer Gateway service.
- **`haInstances`**  
 Defines customized configurations for each High Availability (HA) instance. You should predefine all Zowe HA instances you want to start within your Sysplex.

### Extract sharable configuration out of zowe.yaml

The Zowe YAML configuration file supports a special `@include` annotation that can be used in any level of the configuration. This enables you to organize your YAML configuration files and extract sharable configurations to a separate YAML file.

For example, you can define a sharable certificate configuration file `<keystore-dir>/zowe-certificates.yaml` like this:

```yaml
keystore:
  type: PKCS12
  file: /global/zowe/keystore/localhost/localhost.keystore.p12
  password: password
  alias: localhost
truststore:
  type: PKCS12
  file: /global/zowe/keystore/localhost/localhost.truststore.p12
  password: password
pem:
  key: /global/zowe/keystore/localhost/localhost.key
  certificate: /global/zowe/keystore/localhost/localhost.cer
  certificateAuthorities: /global/zowe/keystore/local_ca/local_ca.cer
```

Then in your `zowe.yaml`, you can import this certification file like this:

```yaml
zowe:
  externalCertificate:
    @include: "<keystore-dir>/zowe-certificates.yaml"
  internalCertificate:
    @include: "<keystore-dir>/zowe-certificates.yaml"
```

### Configuration override

Inside `zowe.yaml`, you can define default values and they may be overridden in more granular level configurations. This can happen in several ways:

- The component can override the default certificate configuration. For the specific entry of certification configuration, if it's not overridden, it falls back to default configurations.  

**Example:**

  ```yaml
  zowe:
    certificate:
      keystore:
        type: PKCS12
        file: /global/zowe/keystore/localhost/localhost.keystore.p12
        password: password
        alias: localhost
      truststore:
        type: PKCS12
        file: /global/zowe/keystore/localhost/localhost.truststore.p12
        password: password
      pem:
        key: /global/zowe/keystore/localhost/localhost.key
        certificate: /global/zowe/keystore/localhost/localhost.cer
        certificateAuthorities: /global/zowe/keystore/local_ca/local_ca.cer
  components:
    app-server:
      certificate:
        keystore:
          alias: app-server
        pem:
          key: /global/zowe/keystore/localhost/app-server.key
          certificate: /global/zowe/keystore/localhost/app-server.cer
  ```
  
  App Server will use the certificate alias `app-server` instead of `localhost` from the same keystore defined in `zowe.certificate.keystore.file`. And it will use the exact same truststore defined in `zowe.certificate.truststore.file`.

- Zowe high availability (HA) instance component configuration `haInstances.<ha-instance>.components.<component>` can override global level component configurations `components.<component>`. Any configuration you can find in `components.<component>` level can be overridden in `haInstances.<ha-instance>.components.<component>` level. For example, in this configuration:

  ```yaml
  components:
    app-server:
      enabled: true
      port: 8544
  haInstances:
    lpar2a:
      components:
        app-server:
          enabled: false
    lpar2b:
      components:
        app-server:
          port: 28544
  ```
  
  App Server on `lpar2a` HA instance will not be started. On `lpar2b` HA instance, it will be started but on port 28544.

### YAML configurations - certificate

In Zowe YAML configuration, certificate definition shares the same format and this format can be used in several configuration entries. For example, `zowe.certificate`, `components.<component>.certificate`, and `haInstances.<ha-instance>.components.<component>.certificate`. The certificate definition may include the following entries:

- **`keystore.type`**  
 Defines the type of the keystore. If you are using keystore, this value usually should be `PKCS12`. If you are using keyring, this value should be `JCERACFKS`.
- **`keystore.file`**  
 Defines the path of the keystore file. If you are using keyring, this should look like `safkeyring:////<keyring-owner>/<keyring-name>`. For example, `safkeyring:////ZWESVUSR/ZoweKeyring`.
- **`keystore.password`**  
 Defines the password of the keystore.
- **`keystore.alias`**  
 Represents the alias name of the certificate stored in keystore. If you are using keyring, this is the certificate label connected to the keyring.
- **`truststore.type`**  
 Defines the type of the truststore file. If you are using keystore, this value usually should be `PKCS12`. If you are using keyring, this value should be `JCERACFKS`.
- **`truststore.file`**  
 Defines the path to the truststore file. If you are using keyring, this should look like `safkeyring:////<keyring-owner>/<keyring-name>`, usually will be the same value of `keystore.file`.
- **`truststore.password`**  
 Defines the password of the truststore.
- **`pem.key`**  
 Defines the private key file in PEM format. This can be used by applications that do not support either PKCS12 keystore format or z/OS keyring.
- **`pem.certificate`**  
 Defines the public key file in PEM format. This can be used by applications that do not support either PKCS12 keystore format or z/OS keyring.
- **`pem.certificateAuthorities`**  
 Defines certificate authorities in PEM format. This can be used by applications that do not support either PKCS12 keystore format or z/OS keyring.

### YAML configurations - zowe

The high-level configuration `zowe` supports these definitions:

#### Directories

- **`zowe.runtimeDirectory`**  
 Tells Zowe the runtime directory where it's installed.
- **`zowe.logDirectory`**  
 Some Zowe components write logs to file system. This tells Zowe which directory should be used to store log files.
- **`zowe.workspaceDirectory`**
 Tells Zowe components where they can write temporary runtime files.
- **`zowe.extensionDirectory`**  
 Tells Zowe where you put the runtime of all your extensions.

 #### Zowe Job

- **`zowe.job.name`**  
 Defines the Zowe job name for the ZWESLSTC started task.
- **`zowe.job.prefix`**  
 Defines the Zowe address space prefix for Zowe components.

#### Domain and port to access Zowe

- **`zowe.externalDomains`**  
 Defines a list of external domains that will be used by the Zowe instance. This configuration is an array of domain name strings.
 In Sysplex deployment, this is the DVIPA domain name defined in Sysplex Distributor. For example,
   
   ```yaml
   zowe:
    externalDomains:
    - external.my-company.com
    - additional-dvipa-domain.my-company.com
   ```
 In Kubernetes deployment, this is the domain name you will use to access your Zowe running in Kubernetes cluster.
- **`zowe.externalPort`**  
 Defines the port that will be exposed to external Zowe users. By default, this value is set based on Zowe APIML Gateway port.
 In Sysplex deployment, this is the DVIPA port defined in Sysplex Distributor. See [Configure Sysplex Distributor](configure-sysplex.md#configure-sysplex-distributor) for more information.
 In Kubernetes deployment, this is the gateway Service port will be exposed to external.

#### Extra environment variables

- **`zowe.environments`**  
 Defines extra environment variables to customize the Zowe runtime. This configuration is a list of key / value pairs.
 **Example:**

   ```yaml
   zowe:
    environments:
      MY_NEW_ENV: value-of-my-env
   ```
 Please be aware that variables defined here are global to all Zowe components, on all HA instances.

#### Certificate

- **`zowe.certificate`**  
 Defines the [northbound certificate](configure-certificates.md#northbound-certificate) facing Zowe users.
- **`zowe.verifyCertificates`**
  Defines how Zowe should validate the certificates used by components or external service(s) like z/OSMF. It can be a value of:
  * `STRICT`: This is the default value. Zowe will validate if the certificate is trusted in our trust store and if the certificate Command Name and Subject Alternative Name (SAN)is validate. This is recommended for the best security.
  * `NONSTRICT`: Zowe will validate if the certificate is trusted in our trust store. In this mode, Zowe does not validate certificate Common Name and Subject Alternative Name (SAN). This option does not have the best security but allows you to try out Zowe when you don't have permission to fix certificate used by external services like z/OSMF.
  * `DISABLED`: This will disable certificate validation completely. This is **NOT** recommended for security purpose.

#### Launcher and launch scripts

Launcher is the program behind `ZWESLSTC` started task.

- **`zowe.launcher`**  
 The launcher section defines defaults about how the Zowe launcher should act upon components.
- **`zowe.launcher.restartIntervals`**  
 An array of positive integers that defines how many times a component should be tried to be restarted if it fails, and how much time to wait in seconds for that restart to succeed before retrying.
- **`zowe.launcher.minUptime`**  
 The minimum amount of time a zowe component should be running in order to be declared as started successfully.
- **`zowe.launcher.shareAs`**  
 Whether or not the launcher should start components in the same address space as it. See documentation for [_BPX_SHAREAS](https://www.ibm.com/docs/en/zos/2.4.0?topic=shell-setting-bpx-shareas-bpx-spawn-script) for details.
- **`zowe.launchScript.logLevel`**
 You can set it to `debug` or `trace` to enable different level of debug messages from Zowe launch scripts. This may help to troubleshoot issues during Zowe start.

#### Setup

Zowe YAML configuration uses `zowe.setup` section to instruct how Zowe should be installed and configured. This section is optional for Zowe runtime but only be used for `zwe install` and `zwe init` commands.

FIXME: jack

### YAML configurations - java

The high-level configuration `java` supports these definitions:

- **`home`**  
 Defines the path to the Java runtime directory.

### YAML configurations - node

The high-level configuration `node` supports these definitions:

- **`home`**  
 Defines the path to the Node.js runtime directory.

### YAML configurations - zOSMF

The high-level configuration `zOSMF` supports these definitions:

- **`zOSMF.host`**  
 Defines the hostname of your z/OSMF instance.
- **`zOSMF.port`**  
 Defines the port of your z/OSMF instance.
- **`zOSMF.applId`**  
 Defines the application ID of your z/OSMF instance.

### YAML configurations - components

All Zowe components and extensions can have a dedicated section under the `components` high-level configuration.

In this section, `<component>` represents any Zowe components or extensions. For all components and extensions, these are the common definitions.

- **`components.<component>.enabled`**  
 Defines if you want to start this component in this Zowe instance. This allows you to control each component instead of a group.
- **`components.<component>.certificate`**  
 You can customize a component to use different certificate from default values. This section follows same format defined in [YAML configurations - certificate](#yaml-configurations-certificate). If this is not customized, the component will use certificates defined in `zowe.certificate`.
- **`components.<component>.launcher`**  
 Any component can have a launcher section which overrides the overall Zowe Launcher default defined in `zowe.launcher`.

#### Configure component gateway

These configurations can be used under the `components.gateway` section:

- **`port`**  
 Defines the port which the gateway should be started on. This is equivalent to the `GATEWAY_PORT` variable in `instance.env`. This must be a valid port number.
- **`debug`**  
 Defines whether to enable debug mode for gateway. This is equivalent to the `APIML_DEBUG_MODE_ENABLED` variable in `instance.env` but with better granular level.
- **`apiml.service.allowEncodedSlashes`**  
 When this parameter is set to `true`, the Gateway allows encoded characters to be part of URL requests redirected through the Gateway.  This is equivalent to the `APIML_ALLOW_ENCODED_SLASHES` variable in `instance.env`.
- **`apiml.service.corsEnabled`**  
 When this parameter is set to `true`, CORS are enabled in the API Gateway for Gateway routes `gateway/api/v1/**`. This is equivalent to the `APIML_CORS_ENABLED` variable in `instance.env`.
- **`apiml.service.preferIpAddress`**  
 Set this parameter to `true`  to advertise a service IP address instead of its hostname. **Note:** This configuration is deprecated. Zowe start script will ignore this value and always set it to `false`. This is equivalent to the `APIML_PREFER_IP_ADDRESS` variable in `instance.env`.
- **`apiml.gateway.timeoutMillis`**  
 Specifies the timeout for connection to the services in milliseconds. This is equivalent to the `APIML_GATEWAY_TIMEOUT_MILLIS` variable in `instance.env`.
- **`apiml.security.x509.enabled`**  
 Set this parameter to `true` to enable the client certificate authentication functionality through ZSS. This is equivalent to the `APIML_SECURITY_X509_ENABLED` variable in `instance.env`.
- **`apiml.security.x509.externalMapperUrl`**  
 Defines the URL where Gateway can query the mapping of client certificates. This is equivalent to the `APIML_GATEWAY_EXTERNAL_MAPPER` variable in `instance.env`.
- **`apiml.security.zosmf.applid`**  
 Defines the z/OSMF APPLID used for PassTicket. This is equivalent to the `APIML_SECURITY_ZOSMF_APPLID` variable in `instance.env`. This should have the same value of `zOSMF.applId`. This entry is kept for backward compatibility.
- **`apiml.security.auth.provider`**  
 Defines the authentication provider used by the API Gateway. This is equivalent to the  `APIML_SECURITY_AUTH_PROVIDER` variable in `instance.env`.
- **`apiml.security.authorization.endpoint.url`**  
 Defines the URL to the authorization endpoint. This endpoint tells Gateway if a user has a particular permission on SAF profile. For example, permission to the `APIML.SERVICES` profile of `ZOWE` class. This is equivalent to the `APIML_SECURITY_AUTHORIZATION_ENDPOINT_URL` variable in `instance.env`.
- **`apiml.security.ssl.verifySslCertificatesOfServices`**  
 Defines whether APIML should verify certificates of services in strict mode. Setting to `true` will enable the `strict` mode where APIML will validate if the certificate is trusted in turststore, and also if the certificate Common Name or Subject Alternate Name (SAN) matches the service hostname. This is equivalent to the `VERIFY_CERTIFICATES` variable defined in `<keystore-dir>/zowe-certificates.env`.
- **`apiml.security.ssl.nonStrictVerifySslCertificatesOfServices`**  
 Defines whether APIML should verify certificates of services in non-strict mode. Setting the value to `true` will enable the `non-strict` mode where APIML will validate if the certificate is trusted in turststore, but ignore the certificate Common Name or Subject Alternate Name (SAN) check. Zowe will ignore this configuration when strict mode is enabled with `apiml.security.ssl.verifySslCertificatesOfServices`. This is equivalent to the `NONSTRICT_VERIFY_CERTIFICATES` variable defined in `<keystore-dir>/zowe-certificates.env`.
- **`apiml.server.maxConnectionsPerRoute`**  
 Specifies the maximum connections for each service. This is equivalent to the  `APIML_MAX_CONNECTIONS_PER_ROUTE` variable in `instance.env`.
- **`apiml.server.maxTotalConnections`**  
 Specifies the total connections for all services registered under API Mediation Layer. This is equivalent to the `APIML_MAX_TOTAL_CONNECTIONS` variable in `instance.env`.

#### Configure component discovery

These configurations can be used under the `components.discovery` section:

- **`port`**  
 Defines the port which discovery should be started on. This is equivalent to the `DISCOVERY_PORT` variable in `instance.env`. This may be defined as a valid port number or as an offset from the Gateway component's port. To define an offset enter `"+{offset}"` or `"-{offset}"` as a string. The offset must start with `+` or `-`.
- **`debug`**  
 Defines whether to enable debug mode for gateway. This is equivalent to the `APIML_DEBUG_MODE_ENABLED` variable in `instance.env` but with better granular level.
- **`apiml.service.preferIpAddress`**  
 Set this parameter to `true`  to advertise a service IP address instead of its hostname. **Note:** This configuration is deprecated. The Zowe start script will ignore this value and always set it to `false`. This is equivalent to the  `APIML_PREFER_IP_ADDRESS` variable in `instance.env`.
- **`apiml.security.ssl.verifySslCertificatesOfServices`**  
 Defines whether APIML should verify certificates of services in strict mode. Setting to `true` will enable the `strict` mode where APIML will validate both if the certificate is trusted in turststore, and also if the certificate Common Name or Subject Alternate Name (SAN) matches the service hostname. This is equivalent to the `VERIFY_CERTIFICATES` variable defined in `<keystore-dir>/zowe-certificates.env`.
- **`apiml.security.ssl.nonStrictVerifySslCertificatesOfServices`**  
 Defines whether APIML should verify certificates of services in non-strict mode. Setting to `true` will enable the `non-strict` mode where APIML will validate if the certificate is trusted in turststore, but ignore the certificate Common Name or Subject Alternate Name (SAN) check. Zowe will ignore this configuration if strict mode is enabled with `apiml.security.ssl.verifySslCertificatesOfServices`. This is equivalent to the `NONSTRICT_VERIFY_CERTIFICATES` variable defined in `<keystore-dir>/zowe-certificates.env`.
- **`alternativeStaticApiDefinitionsDirectories`**  
 Specifies the alternative directories of static definitions. This is equivalent to the  `APIML_MAX_CONNECTIONS_PER_ROUTE` variable in `instance.env`.
- **`apiml.server.maxTotalConnections`**  
 Specifies the total connections for all services registered under API Mediation Layer. This is equivalent to the `ZWEAD_EXTERNAL_STATIC_DEF_DIRECTORIES` variable in `instance.env`.

#### Configure component api-catalog

These configurations can be used under the `components.api-catalog` section:

- **`port`**  
 Defines the port which API Catalog should be started on. This is equivalent to the `CATALOG_PORT` variable in `instance.env`.
- **`debug`**  
 Defines if we want to enable debug mode for gateway. This is equivalent to the `APIML_DEBUG_MODE_ENABLED` variable but with better granular level.
- **`environment.preferIpAddress`**  
 Set this parameter to `true`  to advertise a service IP address instead of its hostname.  
  **Note:** This configuration is deprecated. Zowe start script will ignore this value and always set it to `false`. This is equivalent to the  `APIML_PREFER_IP_ADDRESS` variable in `instance.env`.

#### Configure component caching-service

These configurations can be used under the `components.caching-service` section:

- **`port`**  
 Defines the port which Caching Service should be started on. This is equivalent to the `ZWE_CACHING_SERVICE_PORT` variable in `instance.env`. This may be defined as a valid port number or as an offset from the Gateway component's port. To define an offset enter `"+{offset}"` or `"-{offset}"` as a string. The offset must start with `+` or `-`.
- **`debug`**  
 Defines if we want to enable debug mode for gateway. This is equivalent to the `APIML_DEBUG_MODE_ENABLED` variable in `instance.env` but with better granular level.
- **`storage.mode`**  
 Sets the storage type used to persist data in the Caching Service. This is equivalent to the `ZWE_CACHING_SERVICE_PERSISTENT` variable in `instance.env`.
- **`storage.size`**  
 Specifies amount of records before eviction strategies start evicting. This is equivalent to the `ZWE_CACHING_STORAGE_SIZE` variable in `instance.env`.
- **`storage.evictionStrategy`**  
 Specifies eviction strategy to be used when the storage size is achieved. This is equivalent to the `ZWE_CACHING_EVICTION_STRATEGY` variable in `instance.env`.
- **`storage.vsam.name`**  
 Specifies the data set name of the caching service VSAM data set. This is equivalent to the `ZWE_CACHING_SERVICE_VSAM_DATASET` variable in `instance.env`.
- **`storage.redis.masterNodeUri`**  
 Specifies the URI used to connect to the Redis master instance in the form `username:password@host:port`. This is equivalent to the `CACHING_STORAGE_REDIS_MASTERNODEURI` variable in `instance.env`.
- **`storage.redis.timeout`**  
 Specifies the timeout second to Redis. Defaults to 60 seconds. This is equivalent to the `CACHING_STORAGE_REDIS_TIMEOUT` variable in `instance.env`.
- `storage.redis.sentinel.masterInstance`: Specifies the Redis master instance ID used by the Redis Sentinel instances. This is equivalent to the `CACHING_STORAGE_REDIS_SENTINEL_MASTERINSTANCE` variable in `instance.env`.
- **`storage.redis.sentinel.nodes`**  
 Specifies the array of URIs used to connect to a Redis Sentinel instances in the form `username:password@host:port`. This is equivalent to the `CACHING_STORAGE_REDIS_SENTINEL_NODES` variable in `instance.env`.
- **`storage.redis.ssl.enabled`**  
 Specifies the boolean flag indicating if Redis is being used with SSL/TLS support. Defaults to `true`. This is equivalent to the `CACHING_STORAGE_REDIS_SSL_ENABLED` variable in `instance.env`.
- **`storage.redis.ssl.keystore`**  
 Specifies the keystore file used to store the private key. This is equivalent to the `CACHING_STORAGE_REDIS_SSL_KEYSTORE` variable in `instance.env`.
- **`storage.redis.ssl.keystorePassword`**  
 Specifies the password used to unlock the keystore. This is equivalent to the `CACHING_STORAGE_REDIS_SSL_KEYSTOREPASSWORD` variable in `instance.env`.
- **`storage.redis.ssl.truststore`**  
 Specifies the truststore file used to keep other parties public keys and certificates. This is equivalent to the `CACHING_STORAGE_REDIS_SSL_TRUSTSTORE` variable in `instance.env`.
- **`storage.redis.ssl.truststorePassword`**  
 Specifies the password used to unlock the truststore. This is equivalent to the `CACHING_STORAGE_REDIS_SSL_TRUSTSTOREPASSWORD` variable in `instance.env`.
- **`environment.preferIpAddress`**  
 Set this parameter to `true`  to advertise a service IP address instead of its hostname. **Note:** this configuration is deprecated. Zowe start script will ignore this value and always set it to `false`. This is equivalent to the `APIML_PREFER_IP_ADDRESS` variable in `instance.env`.
- **`apiml.security.ssl.verifySslCertificatesOfServices`**  
 Specifies whether APIML should verify certificates of services in strict mode. Set to `true` will enable `strict` mode that APIML will validate both if the certificate is trusted in turststore, and also if the certificate Common Name or Subject Alternate Name (SAN) match the service hostname. This is equivalent to the `VERIFY_CERTIFICATES` variable defined in `<keystore-dir>/zowe-certificates.env`.
- **`apiml.security.ssl.nonStrictVerifySslCertificatesOfServices`**  
 Defines whether APIML should verify certificates of services in non-strict mode. Setting to `true` will enable `non-strict` mode where APIML will validate if the certificate is trusted in turststore, but ignore the certificate Common Name or Subject Alternate Name (SAN) check. Zowe will ignore this configuration if strict mode is enabled with `apiml.security.ssl.verifySslCertificatesOfServices`. This is equivalent to the `NONSTRICT_VERIFY_CERTIFICATES` variable defined in `<keystore-dir>/zowe-certificates.env`.

#### Configure component app-server

These configurations can be used under the `components.app-server` section:

- **`port`**  
 Defines the port which App Server should be started on. This is equivalent to the `ZOWE_ZLUX_SERVER_HTTPS_PORT` variable in `instance.env`. This may be defined as a valid port number or as an offset from the Gateway component's port. To define an offset enter `"+{offset}"` or `"-{offset}"` as a string. The offset must start with `+` or `-`.

#### Configure component zss

These configurations can be used under the `components.zss` section:

- **`port`**  
 Defines the port which ZSS should be started on. This is equivalent to the `ZOWE_ZSS_SERVER_PORT` variable in `instance.env`. This may be defined as a valid port number or as an offset from the Gateway component's port. To define an offset enter `"+{offset}"` or `"-{offset}"` as a string. The offset must start with `+` or `-`.
- **`crossMemoryServerName`**  
 Defines the procedure name of cross memory server. This is equivalent to the `ZOWE_ZSS_XMEM_SERVER_NAME` variable in `instance.env`.
- **`tls`**  
 Defines whether ZSS service has enabled TLS. This is equivalent to the `ZOWE_ZSS_SERVER_TLS` variable in `instance.env`.

#### Configure component jobs-api

These configurations can be used under the `components.jobs-api` section:

- **`port`**  
 Defines the port which Jobs API should be started on. This is equivalent to the `JOBS_API_PORT` variable in `instance.env`. This may be defined as a valid port number or as an offset from the Gateway component's port. To define an offset enter `"+{offset}"` or `"-{offset}"` as a string. The offset must start with `+` or `-`.

#### Configure component files-api

These configurations can be used under the `components.files-api` section:

- **`port`**  
 Defines the port which Files API should be started on. This is equivalent to the `FILES_API_PORT` variable in `instance.env`. This may be defined as a valid port number or as an offset from the Gateway component's port. To define an offset enter `"+{offset}"` or `"-{offset}"` as a string. The offset must start with `+` or `-`.

#### Configure external extension

You can define a `components.<extension-id>` section and use common component configuration entries.

For example, enable `my-extension`:

```yaml
components:
  # for extensions, you can add your definition like this
  my-extension:
    enabled: true
```

### YAML configurations - haInstances

All Zowe high availability instances should have a dedicated section under the `haInstances` high-level configuration.

In this section, `<ha-instance>` represents any Zowe high availability instance ID.

For all high availability instances, these are the common definitions.

- **`haInstances.<ha-instance>.hostname`**  
 Defines the host name where you want to start this instance. This could be the host name of one LPAR in your Sysplex.
- **`haInstances.<ha-instance>.sysname`**  
 Defines the system name of the LPAR where the instance is running. Zowe will use `ROUTE` command to send JES2 start or stop command to this HA instance.
- **`haInstances.<ha-instance>.components.<component>`**  
 Optional settings you can override component configurations for this high availability instance. See [Configuration override](#configuration-override) for more details.

### Auto-generated environment variables

Each line of Zowe YAML configuration will have a matching environment variable during runtime. This is converted based on pre-defined pattern:

- All configurations under `zowe`, `components`, `haInstances` will be converted to a variable with name:
  * prefixed with `ZWE_`,
  * any non-alphabetic-numeric characters will be converted to underscore `_`,
  * and no double underscores like `__`.
- Calculated configurations of `haInstance`, which is portion of `haInstances.<current-ha-instance>` will be converted same way.
- Calculated configurations of `configs`, which is portion of `haInstances.<current-ha-instance>.components.<current-component>` will be converted same way.
- All other configuration entries will be converted to a variable with name:
  * all upper cases,
  * any non-alphabetic-numeric characters will be converted to underscore `_`,
  * and no double underscores like `__`.

For examples:

- `ZWE_zowe_runtimeDirectory`, parent directory of where `zwe` server command is located.
- `ZWE_zowe_workspaceDirectory` is the path of user customized workspace directory.
- `ZWE_zowe_setup_mvs_hlq` is the high level qualifier where Zowe MVS data sets are installed.
- `ZWE_zowe_setup_mvs_parmlib` is the data set that end-user configured to store his customized version of parameter library members.
- `ZWE_zowe_setup_mvs_authPluginLib` is the data set that end-user configured to store his APF authorized ZIS plugins load library.
- `ZWE_zowe_setup_security_users_zowe` is the name of Zowe runtime user.
- `ZWE_configs_port` is your component port number you can use in your start script. It points to the value of `haInstances.<current-ha-instance>.components.<your-component>.port`, or fall back to `components.<my-component>.port`, or fall back to `configs.port` defined in your component manifest.