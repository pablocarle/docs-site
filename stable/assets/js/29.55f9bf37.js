(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{449:function(e,t,i){e.exports=i.p+"assets/img/zowe-ssl.65da4767.png"},450:function(e,t,i){e.exports=i.p+"assets/img/zowe-directories-keys.859d60d8.png"},553:function(e,t,i){"use strict";i.r(t);var o=i(18),r=Object(o.a)({},(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[o("h1",{attrs:{id:"configuring-zowe-certificates"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#configuring-zowe-certificates"}},[e._v("#")]),e._v(" Configuring Zowe certificates")]),e._v(" "),o("p",[e._v("As a system administrator, review this article to learn about the key concepts of Zowe certificates.")]),e._v(" "),o("p",[e._v("Zowe uses a certificate to encrypt data for communication across secure sockets. An instance of Zowe references a USS directory referred to as a "),o("code",[e._v("KEYSTORE_DIRECTORY")]),e._v(" which contains information about where the certificate is located.")]),e._v(" "),o("h2",{attrs:{id:"northbound-certificate"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#northbound-certificate"}},[e._v("#")]),e._v(" Northbound Certificate")]),e._v(" "),o("p",[e._v("The Zowe certificate is used by the API Mediation Layer on its northbound edge when identifying itself and encrypting "),o("code",[e._v("https://")]),e._v(" traffic to web browsers or REST client applications.  If the Zowe Command Line Interface (CLI) is configured to use the Zowe API Mediation Layer, then the CLI is a client of the Zowe certificate. For more information, see "),o("RouterLink",{attrs:{to:"/user-guide/cli-usingcli.html#integrating-with-api-mediation-layer"}},[e._v("Using the Zowe Command Line Interface, Integrating with the API Mediation Layer")]),e._v(".")],1),e._v(" "),o("h2",{attrs:{id:"southbound-certificate"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#southbound-certificate"}},[e._v("#")]),e._v(" Southbound Certificate")]),e._v(" "),o("p",[e._v("As well as being a server, Zowe itself is a client to services on the southbound edge of its API Mediation Layer. Zowe communicates to these services over secure sockets.  These southbound services use certificates to encrypt their data, and Zowe uses a trust store to store its relationship to these certificates.  The southbound services that are started by Zowe itself and run as address spaces under its "),o("code",[e._v("ZWESVSTC")]),e._v(" started task (such as the API discovery service, the explorer JES REST API server) re-use the same Zowe certificate used by the API Mediation Layer on its northbound client edge.")]),e._v(" "),o("h2",{attrs:{id:"trust-store"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#trust-store"}},[e._v("#")]),e._v(" Trust store")]),e._v(" "),o("p",[e._v("In addition to Zowe using the intra-address space of certificates, Zowe uses external services on z/OS (such as z/OSMF or Zowe conformant extensions that have registered themselves with the API Mediation Layer) to encrypt messages between its servers.  These services present their own certificate to the API Mediation Layer, in which case the trust store is used to capture the relationship between Zowe's southbound edge and these external certificates.")]),e._v(" "),o("p",[e._v("To disable the trust store validation of southbound certificates, set the value "),o("code",[e._v("VERIFY_CERTIFICATES=true")]),e._v(" to "),o("code",[e._v("false")]),e._v(" in the "),o("code",[e._v("zowe-setup-certificates.env")]),e._v(" file in the "),o("code",[e._v("KEYSTORE_DIRECTORY")]),e._v(".  A scenario when this is recommended is if the certificate presented to the API Mediation Layer is self-signed, such as from an unknown certificate authority.  For example, the z/OSMF certificate may be self-signed. In this case, Zowe API Mediation Layer does not recognize the signing authority.")]),e._v(" "),o("p",[e._v("To enable certificate validation without hostname validation, set "),o("code",[e._v("NONSTRICT_VERIFY_CERTIFICATES=true")]),e._v(". Using this setting, the certificate Common Name or Subject Alternate Name (SAN) is not checked. This facilitates deployment to environments where certificates are valid but do not contain a valid hostname. This configuration is for development purposes only and should not be used for production.")]),e._v(" "),o("p",[e._v("The utility script "),o("code",[e._v("zowe-setup-certificates.sh")]),e._v(" or the "),o("code",[e._v("ZWEKRING")]),e._v(" JCL can help you import z/OSMF certificate authority into trust store. If you are not using Zowe to generate certificates or want to trust other external services, you can customize "),o("code",[e._v("zowe-setup-certificates.env")]),e._v(" or "),o("code",[e._v("ZWEKRING")]),e._v(" JCL to import them as external certificate authorities.")]),e._v(" "),o("p",[e._v("A proper setup of trust store is mandatory to successfully start Zowe with "),o("code",[e._v("VERIFY_CERTIFICATES")]),e._v(" or "),o("code",[e._v("NONSTRICT_VERIFY_CERTIFICATES")]),e._v(" enabled in "),o("code",[e._v("zowe-setup-certificates.env")]),e._v(" and used by "),o("code",[e._v("zowe-setup-certificates.sh")]),e._v(".")]),e._v(" "),o("h2",{attrs:{id:"certificates-in-the-zowe-architecture"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#certificates-in-the-zowe-architecture"}},[e._v("#")]),e._v(" Certificates in the Zowe architecture")]),e._v(" "),o("p",[e._v("The "),o("RouterLink",{attrs:{to:"/getting-started/zowe-architecture.html"}},[e._v("Zowe architecture diagram")]),e._v(" shows the Zowe API Mediation Layer positioned on the client-server boundary between applications such as web browsers or the Zowe CLI accessing z/OS services.  The following diagram is a section of the architecture annotated to describe the role of certificates and trust stores.")],1),e._v(" "),o("img",{attrs:{src:i(449),alt:"Zowe SSL",width:"700px"}}),e._v(" "),o("p",[e._v("The lines shown in bold red are communication over a TCP/IP connection that is encrypted with the Zowe certificate.")]),e._v(" "),o("ul",[o("li",[e._v("On the northbound edge of the API gateway, the certificate is used between client applications such as web browsers, Zowe CLI, or any other application wishing to access Zowe's REST APIs.")]),e._v(" "),o("li",[e._v("On the southbound edge of the API Gateway, there are a number of Zowe micro services providing HTML GUIs for the Zowe desktop or REST APIs for the API Catalog.  These also use the Zowe certificate for data encryption.")])]),e._v(" "),o("p",[e._v("The lines in bold green are external certificates for servers that are not managed by Zowe, such as z/OSMF itself or any Zowe conformant REST API or App Framework servers that are registered with the API Mediation Layer.  For the API Mediation Layer to be able to accept these certificates, they either need to be signed by a recognized certificate authority, or else the API Mediation Layer needs to be configured to accept unverified certificates.  Even if the API Mediation Layer is configured to accept certificates signed by unverified CAs on its southbound edge, client applications on the northbound edge of the API gateway will be presented with the Zowe certificate.")]),e._v(" "),o("h2",{attrs:{id:"keystore-versus-key-ring"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#keystore-versus-key-ring"}},[e._v("#")]),e._v(" Keystore versus key ring")]),e._v(" "),o("p",[e._v("Zowe supports certificates that are stored in a USS directory "),o("strong",[e._v("Java KeyStore")]),e._v(" format.")]),e._v(" "),o("p",[e._v("Beginning with release 1.15, Zowe is including the ability to work with certificates held in a "),o("strong",[e._v("z/OS Keyring")]),e._v(".  Support for Keyring certificates is currently incomplete and being provided as a beta technical preview for early preview by customers.  If you have any feedback using keyrings please create an issue in the "),o("a",{attrs:{href:"https://github.com/zowe/zowe-install-packaging/issues",target:"_blank",rel:"noopener noreferrer"}},[e._v("zowe-install-packaging repo"),o("OutboundLink")],1),e._v(".  It is expected that in a future release keyring support will be made available as a fully supported feature.")]),e._v(" "),o("h2",{attrs:{id:"keystore-directory-creation"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#keystore-directory-creation"}},[e._v("#")]),e._v(" Keystore directory creation")]),e._v(" "),o("p",[e._v("The "),o("code",[e._v("KEYSTORE_DIRECTORY")]),e._v(" is created by running the script "),o("code",[e._v("<RUNTIME_DIR>/bin/zowe-setup-certificates.sh")]),e._v(".  This script has a number of input parameters that are specified in a configuration file whose location is passed as an argument to the "),o("code",[e._v("-p")]),e._v(" parameter.")]),e._v(" "),o("p",[e._v("The configuration file "),o("code",[e._v("<RUNTIME_DIR>/bin/zowe-setup-certificates.env")]),e._v(" is provided for setting up a Keystore directory that contains the Zowe certificate in JavaKeystore format.  The configuration file "),o("code",[e._v("<RUNTIME_DIR>/bin/zowe-setup-certificates-keyring.env")]),e._v(" is provided for setting up a Keystore directory that references the Zowe certificate held in a z/OS keyring.")]),e._v(" "),o("p",[e._v("The "),o("code",[e._v(".env")]),e._v(" configuration file should be customized based on security rules and practices for the z/OS environment.  Once the script has been successfully executed and the "),o("code",[e._v("KEYSTORE_DIRECTORY")]),e._v(" is created successfully, it is referenced by a Zowe launch "),o("code",[e._v("instance.env")]),e._v(" file. A "),o("code",[e._v("KEYSTORE_DIRECTORY")]),e._v(" can be used by more than one instance of Zowe. See "),o("RouterLink",{attrs:{to:"/user-guide/configure-instance-directory.html#keystore-configuration"}},[e._v("Creating and configuring the Zowe instance directory")]),e._v(" for more information.")],1),e._v(" "),o("p",[e._v("The Zowe launch diagram shows the relationship between a Zowe instance directory, a Zowe runtime directory, the Zowe keystore directory, and (if used to store the Zowe certificate) the z/OS keyring.")]),e._v(" "),o("img",{attrs:{src:i(450),alt:"Zowe Directories",width:"700"}}),e._v(" "),o("p",[e._v("You create a "),o("code",[e._v("KEYSTORE_DIRECTORY")]),e._v(" in USS by using the script "),o("code",[e._v("zowe-setup-certificates.sh")]),e._v(" (1) with a "),o("code",[e._v("-p")]),e._v(" argument that specifies a "),o("code",[e._v(".env")]),e._v(" configuration file.")]),e._v(" "),o("ul",[o("li",[e._v("If the "),o("code",[e._v("-p")]),e._v(" argument file "),o("code",[e._v("zowe-setup-certificates.env")]),e._v(" (2) is used, the "),o("code",[e._v("KEYSTORE_DIRECTORY")]),e._v(" will contain the certificate, the certificate authority, the trust store, and the JWT Secret.")]),e._v(" "),o("li",[e._v("If the "),o("code",[e._v("-p")]),e._v(" argument file "),o("code",[e._v("zowe-setup-keyring-certificates.env")]),e._v(" (3) is used, the "),o("code",[e._v("KEYSTORE_DIRECTORY")]),e._v(" contains no certificates and is a pass-through to configure a Zowe instance to use a z/OS keyring.")])]),e._v(" "),o("p",[e._v("The JCL member "),o("code",[e._v("ZWEKRING")]),e._v(" (4) is used to create a z/OS Keyring to hold the Zowe certificate and its signing certificate authority.")]),e._v(" "),o("p",[e._v("At launch time, a Zowe instance is started using the script "),o("code",[e._v("<INSTANCE_DIR>/bin/zowe-start.sh")]),e._v(" which takes configuration arguments from "),o("code",[e._v("<INSTANCE_DIR>/instance.env")]),e._v(".  The argument (5)  "),o("code",[e._v("KEYSTORE_DIRECTORY=<KEYSTORE_DIRECTORY>")]),e._v(" specifies the path to the keystore directory that Zowe will use.")]),e._v(" "),o("p",[o("strong",[e._v("Note:")]),e._v(" If you generated your own server certificate, and you want to enable Client Authentication for it, your server certificate must contain the "),o("code",[e._v("TLS Web Client Authentication (1.3.6.1.5.5.7.3.2)")]),e._v(" value in the Extended Key Usage section.\nAdditionally, the "),o("code",[e._v("Digital signature and/or key agreement")]),e._v(" must also be set as extension value in the Key Usage section. For more information, see "),o("a",{attrs:{href:"https://help.hcltechsw.com/domino/10.0.1/admin/conf_keyusageextensionsandextendedkeyusage_r.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("key usage extensions and extended key usage"),o("OutboundLink")],1),e._v(".")]),e._v(" "),o("p",[e._v("For more information on the Zowe launch topology, see "),o("RouterLink",{attrs:{to:"/user-guide/installandconfig.html#topology-of-the-zowe-z-os-launch-process"}},[e._v("Topology of the Zowe z/OS launch process")]),e._v(".")],1)])}),[],!1,null,null,null);t.default=r.exports}}]);