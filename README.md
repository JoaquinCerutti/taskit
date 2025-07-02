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
develop <------- merge de feature/x (funcionalidades nuevas)
  ^
  |
feature/x     (desarrollo de nuevas funciones)


--- Crear rama feature ---

git checkout -b feature/x
git push -u origin feature/x

---------- Subir feature a develop ----------

1. Hacés push de tu rama feature a remoto:
git push origin feature/tu-feature

2. Vas a GitHub y creás un Pull Request (PR):

Base: develop
Compare: tu rama feature/tu-feature

Revisás el código, hacés comentarios si hay que cambiar algo, y cuando esté aprobado, mergeás el PR.
Una vez mergeado, podés borrar la rama feature/tu-feature en GitHub y localmente.

---------------------------