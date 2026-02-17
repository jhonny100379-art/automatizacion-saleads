Feature: Acceso a la cuenta de Saleads (Keycloak)
  Como usuario registrado
  Quiero poder iniciar sesión en la plataforma Saleads
  Para acceder a mis datos y funcionalidades

  Background:
    Given que estoy en la página de login de Keycloak de Saleads

  @orden-123
  Scenario: Ver pantalla de acceso con opciones Google y Microsoft
    When abro la URL de autenticación de Saleads
    Then debo ver la pantalla "Acceder a tu cuenta" con las opciones de Google y Microsoft

  @orden-123
  Scenario: Seleccionar idioma en la pantalla de acceso
    When abro la URL de autenticación de Saleads
    And selecciono el idioma "English"
    Then la pantalla debe mostrarse en inglés
    When selecciono el idioma "Español"
    Then la pantalla debe mostrarse en español

  Scenario: Login con credenciales válidas
    When abro la URL de autenticación de Saleads
    And inicio sesión con usuario "<usuario>" y contraseña "<contraseña>"
    Then debo ser redirigido tras el login exitoso
    Examples:
      | usuario    | contraseña |
      | test_user | test_pass  |

  Scenario: Login con credenciales inválidas
    When abro la URL de autenticación de Saleads
    And inicio sesión con usuario "usuario_invalido" y contraseña "wrong_password"
    Then debo ver un mensaje de error en el formulario
