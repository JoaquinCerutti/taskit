# taskit
Aplicación de gestión hotelera TaskIT


--------- Commit ---------

Porfavor mensajes descriptivos!


--- Estructura de ramas ---

Rama        Función

• main	    Código estable, listo para producción. Acá se hace el deploy final.
• develop	Integración diaria de nuevas funcionalidades, base para hacer pruebas.
• feature	Ramas para desarrollar funcionalidades específicas. Ejemplo: feature/login.


Flujo que vamos a (intentar) utilizar:

main <----------- merge de develop (versión estable)
  ^
  |
develop <------- merge de feature/* (funcionalidades nuevas)
  ^
  |
feature/x     (desarrollo de nuevas funciones)

---------------------------